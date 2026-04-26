/**
 * Public marketing pages read optional hero image URLs from CmsContentEntry.
 * Key pattern: mkt.hero.<path_slug> where path is the acep.africa pathname with / → _, - → _.
 * Example: https://acep.africa/the-organisation/ → mkt.hero.the_organisation
 * Paste a public path: /media/cms/… or /acep-assets/… (or full URL if needed).
 */
export function marketingHeroCmsKeyFromPageUrl(acepPageUrl: string): string {
  const u = new URL(acepPageUrl);
  const p = u.pathname.replace(/^\//, "").replace(/\/$/, "");
  const slug = p
    .split("/")
    .filter(Boolean)
    .join("_")
    .replace(/-/g, "_");
  return `mkt.hero.${slug || "home"}`;
}

export function cmsHeroOverride(
  map: Record<string, string> | null | undefined,
  acepPageUrl: string
): string | null {
  if (!map) return null;
  const key = marketingHeroCmsKeyFromPageUrl(acepPageUrl);
  const raw = map[key]?.trim();
  if (!raw) return null;
  return raw;
}

/**
 * Prefer CMS URL when set; else keep the resolved (snapshot or built-in) hero.
 */
export function pickHeroWithCms(
  baseHero: string,
  map: Record<string, string> | null | undefined,
  acepPageUrl: string
): string {
  return cmsHeroOverride(map, acepPageUrl) ?? baseHero;
}
