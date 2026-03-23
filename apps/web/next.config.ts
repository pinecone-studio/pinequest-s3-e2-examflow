import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@pinequest/ui"],
  experimental: {
    appDir: true,
  },
};

export default nextConfig;
