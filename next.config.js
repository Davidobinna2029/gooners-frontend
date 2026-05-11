/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname:
          "arsenaltalks.com",
      },
      {
        protocol: "https",
        hostname:
          "api.arsenaltalks.com",
      },
      {
        protocol: "https",
        hostname:
          "i0.wp.com",
      },
      {
        protocol: "https",
        hostname:
          "secure.gravatar.com",
      },
    ],
  },
};

module.exports = nextConfig;