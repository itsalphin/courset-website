/**
 * Return the best-effort client IP used for rate-limit keys and the IP
 * blocklist — so its source must resist spoofing.
 *
 * `x-real-ip` is set by the Vercel/Cloudflare edge to the true client IP and
 * overwrites any inbound value, so it is NOT client-spoofable in those
 * environments. Prefer it. The FIRST entry of `x-forwarded-for` is
 * client-controlled (an attacker sends `X-Forwarded-For: 1.2.3.4` and the
 * proxy appends the real IP after it), so it is only a fallback for
 * non-edge/local deployments, where the whole header is untrusted anyway.
 *
 * If you later add `@vercel/functions`, prefer its `ipAddress(req)` helper.
 * See https://adam-p.ca/blog/2022/03/x-forwarded-for/.
 */
export function getClientIp(req: Request): string {
  const real = req.headers.get('x-real-ip');
  if (real) {
    const trimmed = real.trim();
    if (trimmed) return trimmed;
  }
  const xff = req.headers.get('x-forwarded-for');
  if (xff) {
    const first = xff.split(',')[0]?.trim();
    if (first) return first;
  }
  return 'unknown';
}
