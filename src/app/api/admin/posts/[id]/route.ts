import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireCmsApiUser } from "@/lib/cms-api-auth";
import { slugify } from "@/lib/cms-utils";

export const dynamic = "force-dynamic";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { denied } = await requireCmsApiUser(req);
  if (denied) return denied;

  const { id } = await params;
  const body = (await req.json().catch(() => null)) as
    | { title?: string; slug?: string; excerpt?: string; content?: string; status?: "DRAFT" | "PUBLISHED" | "ARCHIVED" }
    | null;

  const title = body?.title?.trim() ?? "";
  const content = body?.content?.trim() ?? "";
  const excerpt = body?.excerpt?.trim() || null;
  const status = body?.status ?? "DRAFT";
  const slug = slugify(body?.slug?.trim() || title);

  if (!title || !content || !slug) {
    return NextResponse.json({ ok: false, error: "Title, slug, and content are required." }, { status: 400 });
  }

  const duplicate = await prisma.cmsPost.findFirst({
    where: { slug, id: { not: id } },
    select: { id: true },
  });
  if (duplicate) {
    return NextResponse.json({ ok: false, error: "Slug already exists." }, { status: 409 });
  }

  const current = await prisma.cmsPost.findUnique({ where: { id } });
  if (!current) {
    return NextResponse.json({ ok: false, error: "Post not found." }, { status: 404 });
  }

  const publishNow = status === "PUBLISHED" && current.status !== "PUBLISHED";
  const clearPublishedAt = status !== "PUBLISHED";

  await prisma.cmsPost.update({
    where: { id },
    data: {
      title,
      slug,
      excerpt,
      content,
      status,
      publishedAt: publishNow ? new Date() : clearPublishedAt ? null : current.publishedAt,
    },
  });

  return NextResponse.json({ ok: true });
}
