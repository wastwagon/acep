import { prisma } from "@/lib/db";
import { acepPageUrlToSlug, MARKETING_PROSE_SLUGS, type MarketingProseSlug } from "@/lib/marketing-page-slugs";
import { cache } from "react";

export const getMarketingPageBySlug = cache((slug: string) =>
  prisma.cmsMarketingPage.findUnique({ where: { slug } })
);

export function getMarketingPageByAcepUrl(acepUrl: string) {
  const slug = acepPageUrlToSlug(acepUrl);
  if (!slug) return Promise.resolve(null);
  return getMarketingPageBySlug(slug);
}

export async function listMarketingPageRows() {
  return prisma.cmsMarketingPage.findMany({ orderBy: { slug: "asc" } });
}

export const marketingProseSlugs: readonly MarketingProseSlug[] = MARKETING_PROSE_SLUGS;
