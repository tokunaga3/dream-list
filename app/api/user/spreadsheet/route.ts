import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

// ユーザーのスプレッドシートIDを取得
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const result = await db.execute({
      sql: "SELECT spreadsheet_id FROM users WHERE email = ?",
      args: [session.user.email],
    });

    if (result.rows.length === 0) {
      return NextResponse.json({ spreadsheetId: null });
    }

    return NextResponse.json({
      spreadsheetId: result.rows[0].spreadsheet_id,
    });
  } catch (error) {
    console.error("Error fetching spreadsheet ID:", error);
    return NextResponse.json(
      { error: "Failed to fetch spreadsheet ID" },
      { status: 500 }
    );
  }
}

// ユーザーのスプレッドシートIDを保存・更新
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { spreadsheetId } = await request.json();

    // spreadsheetIdがnullまたは空の場合は削除
    if (!spreadsheetId) {
      await db.execute({
        sql: "UPDATE users SET spreadsheet_id = NULL, updated_at = unixepoch() WHERE email = ?",
        args: [session.user.email],
      });

      return NextResponse.json({
        success: true,
        message: "Spreadsheet ID cleared",
      });
    }

    // ユーザーが存在するか確認
    const userResult = await db.execute({
      sql: "SELECT id FROM users WHERE email = ?",
      args: [session.user.email],
    });

    if (userResult.rows.length === 0) {
      // ユーザーが存在しない場合は新規作成
      await db.execute({
        sql: `
          INSERT INTO users (id, email, name, spreadsheet_id)
          VALUES (?, ?, ?, ?)
        `,
        args: [
          session.user.email, // IDとしてemailを使用
          session.user.email,
          session.user.name || null,
          spreadsheetId,
        ],
      });
    } else {
      // ユーザーが存在する場合は更新
      await db.execute({
        sql: "UPDATE users SET spreadsheet_id = ?, updated_at = unixepoch() WHERE email = ?",
        args: [spreadsheetId, session.user.email],
      });
    }

    return NextResponse.json({
      success: true,
      message: "Spreadsheet ID saved",
      spreadsheetId,
    });
  } catch (error) {
    console.error("Error saving spreadsheet ID:", error);
    return NextResponse.json(
      { error: "Failed to save spreadsheet ID" },
      { status: 500 }
    );
  }
}
