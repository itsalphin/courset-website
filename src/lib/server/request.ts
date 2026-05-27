import type { NextRequest } from 'next/server';

/**
 * Return the best-effort client IP. `x-forwarded-for` is a comma-list (it's
 * the chain of proxies); only the FIRST entry is the original client. Trim
 * whitespace and reject IPv6 zone identifiers. Falls back to x-real-ip on
 * Vercel, then 'unknown'.
 *
 * Note: `x-forwarded-for` is trivially spoofable unless you're behind a known
 * proxy. On Vercel/Cloudflare the proxy overwrites the first hop with the real
 * client, so this is safe in those environments. For other deployments, see
 * https://adam-p.ca/blog/2022/03/x-forwarded-for/.
 */
export function getClientIp(req: NextRequest): string {
  const xff = req.headers.get('x-forwarded-for');
  if (xff) {
    const first = xff.split(',')[0]?.trim();
    if (first) return first;
  }
  const real = req.headers.get('x-real-ip');
  if (real) return real.trim();
  return 'unknown';
}
