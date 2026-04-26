import type { MarketingHubLink } from "@/lib/marketing-builtin";

/**
 * Hub id matches route segment: about-us -> about_us, resource-centre -> resource_centre
 */
export function marketingHubCmsId(shortPath: string) {
  return shortPath.replace(/\//g, "").replace(/-/g, "_");
}

/** mkt.hub.<hubId>.<index> — same order as `links` in marketing-builtin. */
export function marketingHubCardKey(hubId: string, index: number) {
  return `mkt.hub.${hubId}.${index}`;
}

export function mergeHubCardImages(
  links: readonly MarketingHubLink[],
  hubId: string,
  map: Record<string, string> | null | undefined
): MarketingHubLink[] {
  if (!map) return [...links];
  return links.map((l, i) => {
    const v = map[marketingHubCardKey(hubId, i)]?.trim();
    if (!v) return { ...l };
    return { ...l, image: v };
  });
}
