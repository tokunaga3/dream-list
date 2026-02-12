"use client";

import { useState, useCallback } from "react";
import DreamForm from "./DreamForm";
import SpreadsheetSettings from "./SpreadsheetSettings";

type TabType = "record" | "settings";

export default function DreamManager() {
  const [activeTab, setActiveTab] = useState<TabType>("record");
  const [spreadsheetIdKey, setSpreadsheetIdKey] = useState(0);

  const handleSpreadsheetCreated = useCallback((spreadsheetId: string) => {
    // スプレッドシートが新規作成されたら、設定画面を更新
    setSpreadsheetIdKey(prev => prev + 1);
  }, []);

  const handleSpreadsheetIdChange = useCallback((id: string | null) => {
    // ユーザーが設定を変更したら、フォームを更新
    setSpreadsheetIdKey(prev => prev + 1);
  }, []);

  return (
    <div>
      {/* タブナビゲーション */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
        <button
          onClick={() => setActiveTab("record")}
          className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
            activeTab === "record"
              ? "text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400"
              : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          }`}
        >
          🚀 夢を記録
        </button>
        <button
          onClick={() => setActiveTab("settings")}
          className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
            activeTab === "settings"
              ? "text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400"
              : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          }`}
        >
          ⚙️ 設定
        </button>
      </div>

      {/* タブコンテンツ */}
      <div>
        {activeTab === "record" && (
          <DreamForm onSpreadsheetCreated={handleSpreadsheetCreated} />
        )}
        {activeTab === "settings" && (
          <SpreadsheetSettings 
            key={spreadsheetIdKey}
            onSpreadsheetIdChange={handleSpreadsheetIdChange} 
          />
        )}
      </div>
    </div>
  );
}
