"use client";

import { useState } from "react";

interface DreamFormProps {
  spreadsheetId: string | null;
}

export default function DreamForm({ spreadsheetId: userSpreadsheetId }: DreamFormProps) {
  const [dream, setDream] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [resultSpreadsheetId, setResultSpreadsheetId] = useState<string | null>(null);
  const [submittedDream, setSubmittedDream] = useState<string | null>(null);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!dream.trim()) {
      setMessage({ type: "error", text: "夢を入力してください" });
      return;
    }

    // 確認ダイアログを表示
    setShowConfirmation(true);
  };

  const handleConfirm = async () => {
    setShowConfirmation(false);
    setIsSubmitting(true);
    setMessage(null);

    const dreamToSubmit = dream.trim();

    try {
      const response = await fetch("/api/dreams", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          dream: dreamToSubmit,
          spreadsheetId: userSpreadsheetId 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmittedDream(dreamToSubmit);
        setMessage({
          type: "success",
          text: "夢を記録しました！ ✨",
        });
        setDream("");
        
        // スプレッドシートIDを保存
        if (data.spreadsheetId) {
          setResultSpreadsheetId(data.spreadsheetId);
        }
      } else {
        setMessage({
          type: "error",
          text: data.details || data.error || "エラーが発生しました",
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "通信エラーが発生しました",
      });
      console.error("Error submitting dream:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setShowConfirmation(false);
  };

  return (
    <>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          ✨ あなたの夢を記録しよう
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          叶えたい夢や目標をGoogle Sheetsに記録できます
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="dream"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          夢・目標の内容
        </label>
        <textarea
          id="dream"
          value={dream}
          onChange={(e) => setDream(e.target.value)}
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
          placeholder="例: 世界一周旅行をする、プログラミングをマスターする..."
          disabled={isSubmitting}
        />
      </div>

      {message && (
        <div
          className={`p-4 rounded-lg ${
            message.type === "success"
              ? "bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200"
              : "bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200"
          }`}
        >
          <p className="font-semibold mb-2">{message.text}</p>
          {message.type === "success" && submittedDream && (
            <div className="mt-3 pt-3 border-t border-green-200 dark:border-green-700">
              <p className="text-sm font-medium mb-2">記録した内容：</p>
              <p className="text-sm whitespace-pre-wrap break-words bg-white dark:bg-green-950/30 p-3 rounded">
                {submittedDream}
              </p>
            </div>
          )}
        </div>
      )}

      {resultSpreadsheetId && (
        <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200">
          <p className="text-sm mb-2">📊 スプレッドシートで確認：</p>
          <a
            href={`https://docs.google.com/spreadsheets/d/${resultSpreadsheetId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm underline hover:text-blue-600 dark:hover:text-blue-300 break-all"
          >
            スプレッドシートを開く
          </a>
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "記録中..." : "夢を記録する 🚀"}
      </button>
    </form>

    {/* 確認ダイアログ */}
    {showConfirmation && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            この内容で記録しますか？
          </h3>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-words">
              {dream}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleCancel}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              キャンセル
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-lg transition-colors"
            >
              記録する
            </button>
          </div>
        </div>
      </div>
    )}
  </>
  );
}
