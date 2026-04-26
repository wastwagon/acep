import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireCmsApiUser } from "@/lib/cms-api-auth";
import { prisma } from "@/lib/db";
import { isMarketingProseSlug } from "@/lib/marketing-page-slugs";

export const dynamic = "force-dynamic";

const patchSchema = z.object({
  title: z.string(),
  intro: z.string(),
  bodyHtml: z.string(),
  metaTitle: z.string().nullable().optional(),
  metaDescription: z.string().nullable().optional(),
});

export async function GET(_req: NextRequest, ctx: { params: Promise<{ slug: string }> }) {
  const { denied } = await requireCmsApiUser(_req);
  if (denied) return denied;

  const { slug } = await ctx.params;
  if (!isMarketingProseSlug(slug)) {
    return NextResponse.json({ ok: false, error: "unknown_slug" }, { status: 404 });
  }

  const row = await prisma.cmsMarketingPage.findUnique({ where: { slug } });
  return NextResponse.json({
    ok: true,
    page: row
      ? {
          id: row.id,
          slug: row.slug,
          title: row.title,
          intro: row.intro,
          bodyHtml: row.bodyHtml,
          metaTitle: row.metaTitle,
          metaDescription: row.metaDescription,
          updatedAt: row.updatedAt.toISOString(),
        }
      : {
          id: null,
          slug,
          title: "",
          intro: "",
          bodyHtml: "",
          metaTitle: null as string | null,
          metaDescription: null as string | null,
          updatedAt: null as string | null,
        },
  });
}

export async function PUT(req: NextRequest, ctx: { params: Promise<{ slug: string }> }) {
  const { denied, user } = await requireCmsApiUser(req);
  if (denied || !user) return denied!;

  const { slug } = await ctx.params;
  if (!isMarketingProseSlug(slug)) {
    return NextResponse.json({ ok: false, error: "unknown_slug" }, { status: 404 });
  }

  const body = (await req.json().catch(() => null)) as unknown;
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "invalid_body" }, { status: 400 });
  }

  const d = parsed.data;
  const row = await prisma.cmsMarketingPage.upsert({
    where: { slug },
    create: {
      slug,
      title: d.title,
      intro: d.intro,
      bodyHtml: d.bodyHtml,
      metaTitle: d.metaTitle ?? null,
      metaDescription: d.metaDescription ?? null,
      updatedById: user.id,
    },
    update: {
      title: d.title,
      intro: d.intro,
      bodyHtml: d.bodyHtml,
      metaTitle: d.metaTitle ?? null,
      metaDescription: d.metaDescription ?? null,
      updatedById: user.id,
    },
  });

  return NextResponse.json({
    ok: true,
    page: {
      id: row.id,
      slug: row.slug,
      title: row.title,
      intro: row.intro,
      bodyHtml: row.bodyHtml,
      metaTitle: row.metaTitle,
      metaDescription: row.metaDescription,
      updatedAt: row.updatedAt.toISOString(),
    },
  });
}
