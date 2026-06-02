import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  output: 'export',
  images: { unoptimized: true },
  trailingSlash: true,
  basePath: isProd ? '/sip-formulate-app' : '',
  assetPrefix: isProd ? '/sip-formulate-app' : '',
};

export default nextConfig;
