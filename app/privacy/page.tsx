import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "プライバシーポリシー - 夢リスト",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          プライバシーポリシー
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
          最終更新日: 2025年1月
        </p>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">
            1. サービスの概要
          </h2>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            夢リスト（Dream List）は、ユーザーが自分の夢・目標を Google Sheets に記録するための個人向けウェブアプリケーションです。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">
            2. 収集する情報
          </h2>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-3">
            本サービスは、Google アカウントでのログイン時に以下の情報を取得します。
          </p>
          <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1 ml-2">
            <li>メールアドレス</li>
            <li>表示名</li>
            <li>プロフィール画像のURL</li>
          </ul>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed mt-3">
            また、Google Sheets API を通じてユーザーのスプレッドシートへのアクセストークンを一時的に使用します。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">
            3. 情報の使用目的
          </h2>
          <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 ml-2">
            <li>ユーザー認証およびセッション管理</li>
            <li>ユーザーが入力した夢のテキストを、ユーザー自身の Google Sheets に記録するため</li>
            <li>ユーザーが使用するスプレッドシートを識別するため（スプレッドシートIDの保存）</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">
            4. Google API の使用について
          </h2>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-3">
            本サービスは以下の Google API スコープを使用します。
          </p>
          <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 ml-2">
            <li>
              <span className="font-medium">Google Sheets API</span>（<code className="text-sm bg-gray-100 dark:bg-gray-700 px-1 rounded">spreadsheets</code>）:
              ユーザーのスプレッドシートへの読み取り・書き込み、および新規スプレッドシートの作成に使用します。
            </li>
          </ul>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed mt-3">
            これらのスコープから取得したデータは、ユーザー自身の Google Sheets に夢を記録する目的のみに使用し、第三者との共有や広告目的への使用は一切行いません。
          </p>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed mt-3">
            本サービスによる Google API から取得した情報の使用は、
            <a
              href="https://developers.google.com/terms/api-services-user-data-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-600 dark:text-purple-400 hover:underline"
            >
              Google API Services User Data Policy
            </a>
            に準拠します（Limited Use の要件を含む）。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">
            5. データの保存について
          </h2>
          <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 ml-2">
            <li>
              <span className="font-medium">夢のデータ</span>: ユーザー自身の Google Sheets にのみ保存されます。本サービスのサーバーには保存しません。
            </li>
            <li>
              <span className="font-medium">スプレッドシートID</span>: AES-256-GCM で暗号化した上で、Turso データベースに保存します。
            </li>
            <li>
              <span className="font-medium">セッション情報</span>: JWT 形式でブラウザのクッキーに保存されます（有効期限 30 日）。
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">
            6. データの第三者提供
          </h2>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            本サービスは、ユーザーの個人情報を第三者に販売・共有・提供することは一切ありません。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">
            7. データの削除方法
          </h2>
          <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 ml-2">
            <li>設定画面からスプレッドシートIDを削除することで、本サービスに保存された情報を削除できます。</li>
            <li>
              <a
                href="https://myaccount.google.com/permissions"
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-600 dark:text-purple-400 hover:underline"
              >
                Google アカウントの設定
              </a>
              から、本サービスへのアクセス権を取り消すことができます。
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">
            8. Cookie の使用
          </h2>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            本サービスはセッション管理のみを目的として Cookie を使用します。広告や分析目的での Cookie は使用しません。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">
            9. プライバシーポリシーの変更
          </h2>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            本ポリシーは必要に応じて更新することがあります。重要な変更がある場合はアプリ上でお知らせします。
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
