import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { google } from "googleapis";
import { db } from "@/lib/db";
import { encrypt, decrypt } from "@/lib/crypto";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.accessToken) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (!session.user?.email) {
      return NextResponse.json(
        { error: "User email not found" },
        { status: 401 }
      );
    }

    const { dream } = await request.json();

    if (!dream || typeof dream !== "string") {
      return NextResponse.json(
        { error: "Dream text is required" },
        { status: 400 }
      );
    }

    // 入力の長さを制限（10,000文字まで）
    if (dream.trim().length === 0) {
      return NextResponse.json(
        { error: "Dream text cannot be empty" },
        { status: 400 }
      );
    }

    if (dream.length > 10000) {
      return NextResponse.json(
        { error: "Dream text is too long (max 10,000 characters)" },
        { status: 400 }
      );
    }

    // Google認証情報を設定
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({
      access_token: session.accessToken,
    });

    const sheets = google.sheets({ version: "v4", auth: oauth2Client });

    // DBからスプレッドシートIDを取得
    const userResult = await db.execute({
      sql: "SELECT spreadsheet_id FROM users WHERE email = ?",
      args: [session.user.email],
    });

    let spreadsheetId: string | null = null;

    if (userResult.rows.length > 0 && userResult.rows[0].spreadsheet_id) {
      // DBに保存されている暗号化されたIDを復号化
      const encryptedId = userResult.rows[0].spreadsheet_id as string;
      try {
        spreadsheetId = decrypt(encryptedId);
      } catch (decryptError) {
        console.error("Failed to decrypt spreadsheet ID:", decryptError);
        // 復号化に失敗した場合は新規作成する
        spreadsheetId = null;
      }
    }

    const sheetName = "Dreams";
    let isNewSpreadsheet = false;

    if (!spreadsheetId) {
      // スプレッドシートが登録されていない場合は新規作成
      const createResponse = await sheets.spreadsheets.create({
        requestBody: {
          properties: {
            title: "Dream List - 夢リスト",
          },
          sheets: [
            {
              properties: {
                title: sheetName,
              },
            },
          ],
        },
      });

      spreadsheetId = createResponse.data.spreadsheetId!;
      isNewSpreadsheet = true;

      // ヘッダー行を追加
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `${sheetName}!A1:B1`,
        valueInputOption: "RAW",
        requestBody: {
          values: [["日時", "夢"]],
        },
      });
      
      if (process.env.NODE_ENV === "development") {
        console.log(`新しいスプレッドシートを作成しました: https://docs.google.com/spreadsheets/d/${spreadsheetId}`);
      }

      // 新規作成したスプレッドシートIDをDBに保存
      const encryptedId = encrypt(spreadsheetId);
      
      if (userResult.rows.length === 0) {
        // ユーザーレコードが存在しない場合は作成
        await db.execute({
          sql: "INSERT INTO users (email, spreadsheet_id) VALUES (?, ?)",
          args: [session.user.email, encryptedId],
        });
      } else {
        // ユーザーレコードが存在する場合は更新
        await db.execute({
          sql: "UPDATE users SET spreadsheet_id = ?, updated_at = unixepoch() WHERE email = ?",
          args: [encryptedId, session.user.email],
        });
      }

      if (process.env.NODE_ENV === "development") {
        console.log(`スプレッドシートIDをDBに保存しました (暗号化済み)`);
      }
    } else {
      // 既存のスプレッドシートを使用する場合、Dreamsシートの存在を確認
      try {
        const spreadsheet = await sheets.spreadsheets.get({
          spreadsheetId,
        });

        const dreamsSheet = spreadsheet.data.sheets?.find(
          (sheet) => sheet.properties?.title === sheetName
        );

        if (!dreamsSheet) {
          // Dreamsシートが存在しない場合は作成
          await sheets.spreadsheets.batchUpdate({
            spreadsheetId,
            requestBody: {
              requests: [
                {
                  addSheet: {
                    properties: {
                      title: sheetName,
                    },
                  },
                },
              ],
            },
          });

          // ヘッダー行を追加
          await sheets.spreadsheets.values.update({
            spreadsheetId,
            range: `${sheetName}!A1:B1`,
            valueInputOption: "RAW",
            requestBody: {
              values: [["日時", "夢"]],
            },
          });
        }
      } catch (error) {
        console.error("スプレッドシートの確認中にエラー:", error);
        throw new Error("指定されたスプレッドシートにアクセスできません");
      }
    }

    // 現在の日時と共に夢を追加
    const timestamp = new Date().toLocaleString("ja-JP", {
      timeZone: "Asia/Tokyo",
    });

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${sheetName}!A:B`,
      valueInputOption: "RAW",
      requestBody: {
        values: [[timestamp, dream]],
      },
    });

    return NextResponse.json({
      success: true,
      message: "Dream added successfully",
      spreadsheetId,
      isNewSpreadsheet,
    });
  } catch (error) {
    console.error("Error adding dream:", error);
    return NextResponse.json(
      {
        error: "Failed to add dream",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
