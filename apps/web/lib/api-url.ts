/**
 * API base path. Default `/api` is proxied by Next (see `rewrites` in next.config.ts) so cookies are same-origin.
 * Set `NEXT_PUBLIC_API_URL=http://localhost:4000/api` only if you intentionally bypass the proxy.
 */
export const API_URL = (process.env.NEXT_PUBLIC_API_URL || "/api").replace(/\/$/, "");
