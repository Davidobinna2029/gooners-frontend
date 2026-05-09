import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname:
          "api.arsenaltalks.com",
      },
      {
        protocol: "https",
        hostname:
          "arsenaltalks.com",
      },
    ],
  },
};

export default nextConfig;