import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Dream List - 夢リスト",
  description: "あなたの夢を記録しましょう",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        <Providers>{children}</Providers>
        <Footer />
      </body>
    </html>
  );
}
