import { normalizeAcepUrl } from "@/lib/acep-snapshots";

export const MARKETING_HUB_SLUGS = ["about-us", "programs", "resource-centre"] as const;

export type MarketingHubSlug = (typeof MARKETING_HUB_SLUGS)[number];

/** Spreadable list for Prisma/API (same order as `MARKETING_HUB_SLUGS`). */
export const marketingHubSlugs: readonly MarketingHubSlug[] = MARKETING_HUB_SLUGS;

export function acepHubUrlToSlug(acepUrl: string): string {
  const u = new URL(normalizeAcepUrl(acepUrl));
  return u.pathname.replace(/^\//, "").replace(/\/$/, "");
}

export function isMarketingHubSlug(s: string): s is MarketingHubSlug {
  return (MARKETING_HUB_SLUGS as readonly string[]).includes(s);
}
