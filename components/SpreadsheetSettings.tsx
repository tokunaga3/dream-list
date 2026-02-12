"use client";

import { useState, useEffect } from "react";

interface SpreadsheetSettingsProps {
  onSpreadsheetIdChange: (id: string | null) => void;
}

export default function SpreadsheetSettings({ onSpreadsheetIdChange }: SpreadsheetSettingsProps) {
  const [spreadsheetId, setSpreadsheetId] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // データベースから保存されたIDを読み込む
    const fetchSpreadsheetId = async () => {
      try {
        const response = await fetch("/api/user/spreadsheet");
        if (response.ok) {
          const data = await response.json();
          if (data.spreadsheetId) {
            setSavedId(data.spreadsheetId);
            onSpreadsheetIdChange(data.spreadsheetId);
          }
        }
      } catch (error) {
        console.error("スプレッドシートIDの取得に失敗:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSpreadsheetId();
  }, [onSpreadsheetIdChange]);

  const handleSave = async () => {
    if (!spreadsheetId.trim()) return;

    setIsSaving(true);
    try {
      const response = await fetch("/api/user/spreadsheet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ spreadsheetId: spreadsheetId.trim() }),
      });

      if (response.ok) {
        const data = await response.json();
        setSavedId(data.spreadsheetId);
        onSpreadsheetIdChange(data.spreadsheetId);
        setIsEditing(false);
        setSpreadsheetId("");
      } else {
        alert("スプレッドシートIDの保存に失敗しました");
      }
    } catch (error) {
      console.error("保存エラー:", error);
      alert("保存中にエラーが発生しました");
    } finally {
      setIsSaving(false);
    }
  };

  const handleClear = async () => {
    setIsSaving(true);
    try {
      const response = await fetch("/api/user/spreadsheet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ spreadsheetId: null }),
      });

      if (response.ok) {
        setSavedId(null);
        onSpreadsheetIdChange(null);
        setSpreadsheetId("");
      } else {
        alert("スプレッドシートIDのクリアに失敗しました");
      }
    } catch (error) {
      console.error("クリアエラー:", error);
      alert("クリア中にエラーが発生しました");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-4">
        <div className="flex items-center justify-center">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            読み込み中...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-2">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          📊 スプレッドシート設定
        </h3>
        {!isEditing && !savedId && (
          <button
            onClick={() => setIsEditing(true)}
            className="text-xs text-purple-600 dark:text-purple-400 hover:underline"
          >
            設定する
          </button>
        )}
      </div>

      {savedId && !isEditing ? (
        <div className="space-y-2">
          <div className="bg-white dark:bg-gray-800 rounded p-3 border border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              使用中のスプレッドシートID:
            </p>
            <p className="text-sm text-gray-900 dark:text-gray-100 font-mono break-all">
              {savedId}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setIsEditing(true)}
              disabled={isSaving}
              className="flex-1 text-xs px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              変更
            </button>
            <button
              onClick={handleClear}
              disabled={isSaving}
              className="flex-1 text-xs px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              {isSaving ? "処理中..." : "クリア"}
            </button>
          </div>
        </div>
      ) : isEditing ? (
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-gray-600 dark:text-gray-400 mb-2">
              Google SheetsのスプレッドシートID:
            </label>
            <input
              type="text"
              value={spreadsheetId}
              onChange={(e) => setSpreadsheetId(e.target.value)}
              placeholder="例: 1gnUEz7QFR1Cgp33-MZHOt..."
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
              disabled={isSaving}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              スプレッドシートのURLから取得できます
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={!spreadsheetId.trim() || isSaving}
              className="flex-1 text-xs px-3 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? "保存中..." : "保存"}
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setSpreadsheetId("");
              }}
              disabled={isSaving}
              className="flex-1 text-xs px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              キャンセル
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-200 mb-2">
              💡 スプレッドシート設定について
            </h4>
            <p className="text-sm text-blue-800 dark:text-blue-300 mb-2">
              既存のGoogle Sheetsスプレッドシートを指定すると、そのシートに夢を記録できます。
            </p>
            <p className="text-sm text-blue-800 dark:text-blue-300">
              設定しない場合は、自動的に新しいスプレッドシートが作成されます。
            </p>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
              📝 スプレッドシートIDの取得方法
            </h4>
            <ol className="text-sm text-gray-700 dark:text-gray-300 space-y-2 list-decimal list-inside">
              <li>Google Sheetsでスプレッドシートを開く</li>
              <li>URLから長いIDをコピー
                <div className="mt-1 text-xs font-mono bg-white dark:bg-gray-900 p-2 rounded border border-gray-200 dark:border-gray-700 break-all">
                  https://docs.google.com/spreadsheets/d/<span className="text-purple-600 dark:text-purple-400 font-bold">1gnUEz7QFR...</span>/edit
                </div>
              </li>
              <li>上の「設定する」ボタンからIDを登録</li>
            </ol>
          </div>
        </div>
      )}
    </div>
  );
}
