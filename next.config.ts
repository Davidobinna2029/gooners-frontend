import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    /**
     * ALLOW WORDPRESS + CDN IMAGES
     */
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],

    /**
     * FIX:
     * Allow internal proxy route with query strings
     *
     * REQUIRED FOR:
     * /api/image?url=...&w=1200&q=85
     */
    localPatterns: [
      {
        pathname: "/api/image",
        search: "**",
      },
    ],

    /**
     * PERFORMANCE
     */
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],

    /**
     * SECURITY
     */
    dangerouslyAllowSVG: false,
  },
};

export default nextConfig;