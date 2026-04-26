import { afterEach, describe, expect, it, vi } from "vitest";

const saved = { max: process.env.EVENT_PUBLIC_API_RATE_MAX, w: process.env.EVENT_PUBLIC_API_RATE_WINDOW_SEC };

describe("checkEventPublicRateLimit", () => {
  afterEach(() => {
    if (saved.max === undefined) delete process.env.EVENT_PUBLIC_API_RATE_MAX;
    else process.env.EVENT_PUBLIC_API_RATE_MAX = saved.max;
    if (saved.w === undefined) delete process.env.EVENT_PUBLIC_API_RATE_WINDOW_SEC;
    else process.env.EVENT_PUBLIC_API_RATE_WINDOW_SEC = saved.w;
    vi.resetModules();
  });

  it("allows up to N requests in window, then blocks (in-memory when no Upstash env)", async () => {
    delete process.env.UPSTASH_REDIS_REST_URL;
    delete process.env.UPSTASH_REDIS_REST_TOKEN;
    process.env.EVENT_PUBLIC_API_RATE_MAX = "3";
    process.env.EVENT_PUBLIC_API_RATE_WINDOW_SEC = "60";
    vi.resetModules();
    const { checkEventPublicRateLimit, getEventRateLimitConfig } = await import("./rate-limit");
    const cfg = getEventRateLimitConfig();
    expect(cfg.max).toBe(3);
    expect(cfg.backend).toBe("memory");

    const key = `test:rl:${Date.now()}`;
    expect((await checkEventPublicRateLimit(key)).ok).toBe(true);
    expect((await checkEventPublicRateLimit(key)).ok).toBe(true);
    expect((await checkEventPublicRateLimit(key)).ok).toBe(true);
    const fourth = await checkEventPublicRateLimit(key);
    expect(fourth.ok).toBe(false);
    if (fourth.ok) throw new Error("expected not ok");
    expect(fourth.retryAfterSec).toBeGreaterThan(0);
  });
});
