import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  // Note: headers() is not supported with static export
  // FHEVM COOP/COEP headers need to be set at server level for static export
};

export default nextConfig;

