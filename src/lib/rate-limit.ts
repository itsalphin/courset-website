import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

/**
 * Rate limiting with a shared store.
 *
 * The in-memory Map below only bounds requests within a SINGLE serverless
 * instance. On Vercel, many instances run concurrently and cold-start freely,
 * so an in-memory limit of N is really N × (instance count) globally — weak
 * protection against distributed brute force / abuse.
 *
 * When UPSTASH_REDIS_REST_URL/TOKEN are set, we use a Redis-backed sliding
 * window that is correct across every instance. When they're absent (local dev
 * or an un-provisioned deploy), we fall back to the in-memory limiter so the
 * app still works — and if Redis is momentarily unreachable we fail over to
 * memory rather than locking users out.
 *
 * Account-level brute force is separately capped by the DB-backed login
 * lockout, which is global regardless of this limiter.
 */

// ── In-memory fallback (per-instance) ──
const rateMap = new Map<string, { count: number; resetAt: number }>();

function memoryLimit(key: string, maxRequests: number, windowMs: number): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const entry = rateMap.get(key);

  if (!entry || now > entry.resetAt) {
    rateMap.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: maxRequests - 1 };
  }
  if (entry.count >= maxRequests) {
    return { allowed: false, remaining: 0 };
  }
  entry.count++;
  return { allowed: true, remaining: maxRequests - entry.count };
}

// Clean up expired in-memory entries periodically.
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of rateMap) {
      if (now > entry.resetAt) rateMap.delete(key);
    }
  }, 60_000);
}

// ── Redis-backed limiter (shared across instances) ──
let _redis: Redis | null = null;
let _redisChecked = false;

function getRedis(): Redis | null {
  if (_redisChecked) return _redis;
  _redisChecked = true;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (url && token) {
    _redis = new Redis({ url, token });
  }
  return _redis;
}

// One Ratelimit instance per (max, window) pair — the limiter config is fixed
// per instance, so we cache by the combination and namespace the prefix.
const limiters = new Map<string, Ratelimit>();

function getLimiter(maxRequests: number, windowMs: number): Ratelimit | null {
  const redis = getRedis();
  if (!redis) return null;
  const id = `${maxRequests}:${windowMs}`;
  let limiter = limiters.get(id);
  if (!limiter) {
    limiter = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(maxRequests, `${windowMs} ms`),
      prefix: `rl:${id}`,
      analytics: false,
    });
    limiters.set(id, limiter);
  }
  return limiter;
}

export async function rateLimit(
  key: string,
  maxRequests: number,
  windowMs: number,
): Promise<{ allowed: boolean; remaining: number }> {
  const limiter = getLimiter(maxRequests, windowMs);
  if (!limiter) return memoryLimit(key, maxRequests, windowMs);

  try {
    const { success, remaining } = await limiter.limit(key);
    return { allowed: success, remaining };
  } catch {
    // Redis unreachable — degrade to the in-memory limiter rather than
    // failing the request outright.
    return memoryLimit(key, maxRequests, windowMs);
  }
}
