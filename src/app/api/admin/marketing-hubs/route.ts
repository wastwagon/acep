import { NextRequest, NextResponse } from "next/server";
import { requireCmsApiUser } from "@/lib/cms-api-auth";
import { prisma } from "@/lib/db";
import { marketingHubSlugs } from "@/lib/marketing-hub-slugs";

export const dynamic = "force-dynamic";

/**
 * List hub index slugs + DB row when present.
 */
export async function GET(req: NextRequest) {
  const { denied } = await requireCmsApiUser(req);
  if (denied) return denied;

  const rows = await prisma.cmsMarketingHub.findMany({ orderBy: { slug: "asc" } });
  const bySlug = Object.fromEntries(rows.map((r) => [r.slug, r]));

  const items = [...marketingHubSlugs].map((slug) => {
    const r = bySlug[slug];
    const hasCopy = Boolean(
      r && (r.title?.trim() || r.intro?.trim() || r.metaTitle?.trim() || r.metaDescription?.trim())
    );
    return {
      slug,
      inDatabase: Boolean(r),
      hasCopyOverride: hasCopy,
      title: r?.title ?? null,
      updatedAt: r?.updatedAt.toISOString() ?? null,
    };
  });

  return NextResponse.json({ ok: true, items });
}
