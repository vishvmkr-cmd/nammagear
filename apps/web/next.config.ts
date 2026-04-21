import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

/** Monorepo root (pnpm workspace) — explicit root avoids Turbopack mis-detecting when extra config files exist under `apps/web`. */
const monorepoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

/** Dev: browser calls same-origin `/api/*`; Next proxies to Express so session cookies work. */
const API_PROXY_ORIGIN = process.env.API_PROXY_ORIGIN || "http://127.0.0.1:4000";

const nextConfig: NextConfig = {
  output: "standalone",
  outputFileTracingRoot: monorepoRoot,
  turbopack: {
    root: monorepoRoot,
  },
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
