import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],

    /**
     * CRITICAL FIX:
     * Allow ONLY your internal image proxy route safely
     */
    localPatterns: [
      {
        pathname: "/api/image",
      },
    ],
  },
};

export default nextConfig;