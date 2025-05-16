import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
