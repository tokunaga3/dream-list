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

    // フェーズ1: 既存スプレッドシートのアクセス確認（IDがある場合）
    if (spreadsheetId) {
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

          await sheets.spreadsheets.values.update({
            spreadsheetId,
            range: `${sheetName}!A1:B1`,
            valueInputOption: "RAW",
            requestBody: {
              values: [["日時", "夢"]],
            },
          });
        }
      } catch {
        // アクセス失敗（スコープ変更・ファイル削除など）→ 新規作成へフォールバック
        spreadsheetId = null;
      }
    }

    // フェーズ2: IDが未設定または既存スプレッドシートへのアクセス失敗時に新規作成
    if (!spreadsheetId) {
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

      // 新規作成したスプレッドシートIDをDBに保存
      const encryptedId = encrypt(spreadsheetId);

      if (userResult.rows.length === 0) {
        await db.execute({
          sql: "INSERT INTO users (email, spreadsheet_id) VALUES (?, ?)",
          args: [session.user.email, encryptedId],
        });
      } else {
        await db.execute({
          sql: "UPDATE users SET spreadsheet_id = ?, updated_at = unixepoch() WHERE email = ?",
          args: [encryptedId, session.user.email],
        });
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
