import { cache } from "react";
import { prisma } from "@/lib/db";

/**
 * Read all CMS text blocks (key → value) for the current request. Cached for deduped reads in RSC.
 */
export async function getCmsContentMap() {
  const rows = await prisma.cmsContentEntry.findMany();
  return Object.fromEntries(rows.map((r) => [r.key, r.value]));
}

export const getCmsContentMapCached = cache(getCmsContentMap);
