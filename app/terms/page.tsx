import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "利用規約 - 夢リスト",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          利用規約
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
          最終更新日: 2025年1月
        </p>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">
            1. サービスの概要
          </h2>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            夢リスト（Dream List）は、ユーザーが自分の夢・目標を Google Sheets に記録・管理できる個人向けウェブアプリケーションです。
            本規約は、本サービスの利用条件を定めるものです。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">
            2. 利用条件
          </h2>
          <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 ml-2">
            <li>本サービスの利用には Google アカウントが必要です。</li>
            <li>Google の利用規約および Google API サービス利用規約に同意した上でご利用ください。</li>
            <li>本サービスは個人利用を目的としています。</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">
            3. 禁止事項
          </h2>
          <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 ml-2">
            <li>本サービスを違法な目的で使用すること</li>
            <li>他のユーザーや第三者の権利を侵害する行為</li>
            <li>本サービスのシステムに不正にアクセスする行為</li>
            <li>本サービスの運営を妨害する行為</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">
            4. 免責事項
          </h2>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-3">
            本サービスは現状有姿で提供されます。以下の事項について一切の責任を負いません。
          </p>
          <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 ml-2">
            <li>本サービスの利用によって生じた損害</li>
            <li>Google サービスの障害・仕様変更による影響</li>
            <li>データの消失・損壊</li>
            <li>サービスの中断・停止</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">
            5. サービスの変更・終了
          </h2>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            本サービスは予告なく機能の変更・終了を行う場合があります。
            重要な変更がある場合はアプリ上でお知らせします。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">
            6. 準拠法
          </h2>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            本規約は日本法に準拠します。
          </p>
        </section>

        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <Link
            href="/login"
            className="text-purple-600 dark:text-purple-400 hover:underline text-sm"
          >
            ← トップページに戻る
          </Link>
        </div>
      </div>
    </main>
  );
}
