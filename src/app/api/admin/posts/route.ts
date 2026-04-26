import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireCmsApiUser } from "@/lib/cms-api-auth";
import { slugify } from "@/lib/cms-utils";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const { denied, user } = await requireCmsApiUser(req);
  if (denied || !user) return denied!;

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

  const exists = await prisma.cmsPost.findUnique({ where: { slug } });
  if (exists) {
    return NextResponse.json({ ok: false, error: "Slug already exists." }, { status: 409 });
  }

  const post = await prisma.cmsPost.create({
    data: {
      title,
      slug,
      excerpt,
      content,
      status,
      publishedAt: status === "PUBLISHED" ? new Date() : null,
      authorId: user.id,
    },
  });

  return NextResponse.json({ ok: true, postId: post.id });
}
