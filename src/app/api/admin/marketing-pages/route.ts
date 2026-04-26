import { NextRequest, NextResponse } from "next/server";
import { requireCmsApiUser } from "@/lib/cms-api-auth";
import { prisma } from "@/lib/db";
import { MARKETING_PROSE_SLUGS } from "@/lib/marketing-page-slugs";

export const dynamic = "force-dynamic";

/**
 * List known marketing page slugs + DB row when present.
 */
export async function GET(req: NextRequest) {
  const { denied } = await requireCmsApiUser(req);
  if (denied) return denied;

  const rows = await prisma.cmsMarketingPage.findMany({ orderBy: { slug: "asc" } });
  const bySlug = Object.fromEntries(rows.map((r) => [r.slug, r]));

  const items = [...MARKETING_PROSE_SLUGS].map((slug) => {
    const r = bySlug[slug];
    return {
      slug,
      inDatabase: Boolean(r),
      title: r?.title ?? null,
      updatedAt: r?.updatedAt.toISOString() ?? null,
      hasBody: Boolean(r?.bodyHtml?.trim()),
    };
  });

  return NextResponse.json({ ok: true, items });
}
