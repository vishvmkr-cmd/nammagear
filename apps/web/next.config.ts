import type { NextConfig } from "next";

/** Dev: browser calls same-origin `/api/*`; Next proxies to Express so session cookies work. */
const API_PROXY_ORIGIN = process.env.API_PROXY_ORIGIN || "http://127.0.0.1:4000";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${API_PROXY_ORIGIN}/api/:path*`,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
};

export default nextConfig;
