import { redirect } from "next/navigation";
import { auth } from "@/auth";
import Link from "next/link";
import Image from "next/image";

export default async function LandingPage() {
  const session = await auth();

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* ヒーローセクション */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <Image
              src="/logo.svg"
              alt="夢リストのロゴ"
              width={80}
              height={80}
              className="rounded-2xl"
            />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
            夢リスト 🌟
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            あなたの夢・目標を Google Sheets に記録して、一歩一歩着実に前進しよう
          </p>
          <Link
            href="/login"
            className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-8 rounded-lg shadow-md transition-colors text-lg"
          >
            ログインして始める
          </Link>
        </div>

        {/* アプリ説明 */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            このアプリについて
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-center mb-8 leading-relaxed">
            「夢リスト」は、あなたが思い描く夢や達成したい目標を
            <br className="hidden sm:block" />
            Google Sheets に自動的に記録・管理するWebアプリです。
            <br className="hidden sm:block" />
            データはあなた自身の Google ドライブに保存されるため、安心してご利用いただけます。
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                icon: "🔐",
                title: "Googleアカウントでかんたんログイン",
                desc: "新規登録不要。お持ちのGoogleアカウントですぐに始められます。",
              },
              {
                icon: "📝",
                title: "夢を入力するだけで自動記録",
                desc: "テキストを入力して送信するだけで、日時とともにスプレッドシートに追記されます。",
              },
              {
                icon: "📊",
                title: "スプレッドシートを自動作成",
                desc: "初回利用時に「Dream List - 夢リスト」というスプレッドシートを自動で作成します。",
              },
              {
                icon: "🔒",
                title: "データはあなたのGoogle Sheetsに保存",
                desc: "記録したデータはすべてあなた自身のGoogleドライブに安全に保存されます。",
              },
            ].map(({ icon, title, desc }) => (
              <div
                key={title}
                className="flex gap-4 p-4 rounded-xl bg-purple-50 dark:bg-gray-700"
              >
                <span className="text-2xl flex-shrink-0">{icon}</span>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    {title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* フッターリンク */}
        <div className="text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            <Link href="/privacy" className="hover:underline text-purple-600 dark:text-purple-400">
              プライバシーポリシー
            </Link>
            {" "}・{" "}
            <Link href="/terms" className="hover:underline text-purple-600 dark:text-purple-400">
              利用規約
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
