import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

type Ok = { ok: true } | { ok: false; retryAfterSec: number };

type Bucket = { count: number; reset: number };

const memStore = new Map<string, Bucket>();

function windowMs(): number {
  const s = process.env.EVENT_PUBLIC_API_RATE_WINDOW_SEC;
  const n = s ? parseInt(s, 10) : 60;
  return (Number.isFinite(n) && n > 0 ? n : 60) * 1000;
}

function windowSec(): number {
  return windowMs() / 1000;
}

function maxHits(): number {
  const s = process.env.EVENT_PUBLIC_API_RATE_MAX;
  const n = s ? parseInt(s, 10) : 30;
  return Number.isFinite(n) && n > 0 ? n : 30;
}

const MAX_MEM_KEYS = 10_000;

let upstashInstance: Ratelimit | null | undefined;

function getUpstashRatelimit(): Ratelimit | null {
  if (upstashInstance !== undefined) return upstashInstance;
  const hasUrl = Boolean(process.env.UPSTASH_REDIS_REST_URL?.trim());
  const hasToken = Boolean(process.env.UPSTASH_REDIS_REST_TOKEN?.trim());
  if (!hasUrl || !hasToken) {
    upstashInstance = null;
    return null;
  }
  const redis = Redis.fromEnv();
  const max = maxHits();
  const w = Math.max(1, Math.floor(windowSec()));
  upstashInstance = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(max, `${w} s`),
    prefix: "acep:event-reg",
  });
  return upstashInstance;
}

function checkInMemory(key: string): Ok {
  const w = windowMs();
  const max = maxHits();
  const now = Date.now();

  if (memStore.size > MAX_MEM_KEYS) {
    for (const [k, b] of memStore) {
      if (b.reset < now) memStore.delete(k);
    }
  }

  let b = memStore.get(key);
  if (!b || b.reset < now) {
    b = { count: 0, reset: now + w };
    memStore.set(key, b);
  }
  b.count += 1;
  if (b.count <= max) {
    return { ok: true };
  }
  const retryAfterSec = Math.max(1, Math.ceil((b.reset - now) / 1000));
  return { ok: false, retryAfterSec };
}

/**
 * When `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` are set, uses
 * Upstash (HTTP Redis + sliding window) so limits are shared across all instances.
 * Otherwise: fixed in-memory window per process (launch default / dev).
 */
export async function checkEventPublicRateLimit(key: string): Promise<Ok> {
  const u = getUpstashRatelimit();
  if (u) {
    try {
      const res = await u.limit(key);
      if (res.success) {
        return { ok: true };
      }
      const now = Date.now();
      const resetMs = typeof res.reset === "number" ? res.reset : 0;
      const retryAfterSec = resetMs > now ? Math.max(1, Math.ceil((resetMs - now) / 1000)) : 1;
      return { ok: false, retryAfterSec };
    } catch (e) {
      console.error("[rate-limit:upstash]", e);
      return checkInMemory(key);
    }
  }
  return checkInMemory(key);
}

export function getEventRateLimitConfig(): {
  windowSec: number;
  max: number;
  backend: "memory" | "upstash";
} {
  const hasUpstashEnv = Boolean(
    process.env.UPSTASH_REDIS_REST_URL?.trim() && process.env.UPSTASH_REDIS_REST_TOKEN?.trim()
  );
  return {
    windowSec: windowMs() / 1000,
    max: maxHits(),
    backend: hasUpstashEnv ? "upstash" : "memory",
  };
}
