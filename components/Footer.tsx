import Link from "next/link";

export default function Footer() {
  return (
    <footer className="py-6 px-4 text-center text-sm text-gray-500 dark:text-gray-400">
      <div className="flex items-center justify-center gap-4">
        <Link
          href="/privacy"
          className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
        >
          プライバシーポリシー
        </Link>
        <span>·</span>
        <Link
          href="/terms"
          className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
        >
          利用規約
        </Link>
      </div>
    </footer>
  );
}
