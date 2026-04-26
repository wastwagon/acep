import { prisma } from "@/lib/db";
import { acepHubUrlToSlug } from "@/lib/marketing-hub-slugs";
import { cache } from "react";

export const getMarketingHubBySlug = cache((slug: string) =>
  prisma.cmsMarketingHub.findUnique({ where: { slug } })
);

export function getMarketingHubByAcepUrl(acepUrl: string) {
  const slug = acepHubUrlToSlug(acepUrl);
  if (!slug) return Promise.resolve(null);
  return getMarketingHubBySlug(slug);
}
