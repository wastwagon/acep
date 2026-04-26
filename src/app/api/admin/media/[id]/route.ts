import { NextRequest, NextResponse } from "next/server";
import { requireCmsApiUser } from "@/lib/cms-api-auth";
import { prisma } from "@/lib/db";
import { removeCmsFileOnDisk } from "@/lib/media-storage";

export const dynamic = "force-dynamic";

type RouteCtx = { params: Promise<{ id: string }> };

export async function DELETE(_req: NextRequest, context: RouteCtx) {
  const { denied, user } = await requireCmsApiUser(_req);
  if (denied) return denied;

  const { id } = await context.params;
  const media = await prisma.cmsMedia.findUnique({ where: { id } });
  if (!media) {
    return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });
  }
  if (user.role === "EDITOR" && media.uploaderId !== user.id) {
    return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });
  }

  await prisma.cmsMedia.delete({ where: { id } });
  await removeCmsFileOnDisk(media.storageFile);

  return NextResponse.json({ ok: true });
}
