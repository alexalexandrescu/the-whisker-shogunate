import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/the-whisker-shogunate',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
