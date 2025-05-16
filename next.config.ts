import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@resvg/resvg-js", "svgo", "svg-sprite"], // 添加 svgo 和/或 svg-sprite
  /* config options here */
  webpack: (config, { isServer }) => {
    // Ensure this rule only applies to server-side builds
    if (isServer) {
      // Exclude problematic modules from bundling
      config.externals = [...config.externals, '@resvg/resvg-js'];
    }
    return config;
  },
};

export default nextConfig;
