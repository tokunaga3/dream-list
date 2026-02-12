import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // ローカルネットワークからの開発サーバーへのアクセスを許可
  allowedDevOrigins: ['192.168.10.107'],
};

export default nextConfig;
