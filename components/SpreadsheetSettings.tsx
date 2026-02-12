"use client";

import { useState, useEffect } from "react";

interface SpreadsheetSettingsProps {
  onSpreadsheetIdChange: (id: string | null) => void;
}

export default function SpreadsheetSettings({ onSpreadsheetIdChange }: SpreadsheetSettingsProps) {
  const [spreadsheetId, setSpreadsheetId] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [savedId, setSavedId] = useState<string | null>(null);

  useEffect(() => {
    // ローカルストレージから保存されたIDを読み込む
    const saved = localStorage.getItem("spreadsheetId");
    if (saved) {
      setSavedId(saved);
      onSpreadsheetIdChange(saved);
    }
  }, [onSpreadsheetIdChange]);

  const handleSave = () => {
    if (spreadsheetId.trim()) {
      localStorage.setItem("spreadsheetId", spreadsheetId.trim());
      setSavedId(spreadsheetId.trim());
      onSpreadsheetIdChange(spreadsheetId.trim());
      setIsEditing(false);
      setSpreadsheetId("");
    }
  };

  const handleClear = () => {
    localStorage.removeItem("spreadsheetId");
    setSavedId(null);
    onSpreadsheetIdChange(null);
    setSpreadsheetId("");
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
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
              className="flex-1 text-xs px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              変更
            </button>
            <button
              onClick={handleClear}
              className="flex-1 text-xs px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              クリア
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
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              スプレッドシートのURLから取得できます
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={!spreadsheetId.trim()}
              className="flex-1 text-xs px-3 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              保存
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setSpreadsheetId("");
              }}
              className="flex-1 text-xs px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              キャンセル
            </button>
          </div>
        </div>
      ) : (
        <p className="text-xs text-gray-600 dark:text-gray-400">
          スプレッドシートIDを設定すると、そのシートに夢が記録されます。
          <br />
          設定しない場合は自動的に新しいシートが作成されます。
        </p>
      )}
    </div>
  );
}
