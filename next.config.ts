import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "arsenaltalks.com",
        pathname: "/wp-content/**",
      },
      {
        protocol: "https",
        hostname: "www.arsenaltalks.com",
        pathname: "/wp-content/**",
      },
      {
        protocol: "https",
        hostname: "api.arsenaltalks.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "i0.wp.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "i1.wp.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "i2.wp.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;