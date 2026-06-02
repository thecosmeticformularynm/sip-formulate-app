import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: { unoptimized: true },
  trailingSlash: true,
  basePath: '/sip-formulate-app',
  assetPrefix: '/sip-formulate-app',
};

export default nextConfig;
