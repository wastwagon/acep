import { normalizeAcepUrl } from "@/lib/acep-snapshots";

/** Prose marketing routes (must match getProseBuiltin in marketing-builtin and public paths). */
export const MARKETING_PROSE_SLUGS = [
  "the-organisation",
  "governing-board",
  "team",
  "our-partners",
  "nextgen10",
  "climate-academy",
  "2025-afreikh-summer-school",
  "rgchub",
  "eiccg-fund",
  "fec-2025",
  "future-of-energy-conference",
] as const;

export type MarketingProseSlug = (typeof MARKETING_PROSE_SLUGS)[number];

/** e.g. https://acep.africa/the-organisation/ → the-organisation */
export function acepPageUrlToSlug(acepUrl: string): string {
  const u = new URL(normalizeAcepUrl(acepUrl));
  return u.pathname.replace(/^\//, "").replace(/\/$/, "");
}

export function isMarketingProseSlug(s: string): s is MarketingProseSlug {
  return (MARKETING_PROSE_SLUGS as readonly string[]).includes(s);
}
