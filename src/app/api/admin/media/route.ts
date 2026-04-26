import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { requireCmsApiUser } from "@/lib/cms-api-auth";
import { prisma } from "@/lib/db";
import { getAbsoluteFileUrl, saveCmsFile, validateFileMeta, classifyMediaKind } from "@/lib/media-storage";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

const MAX_LIST = 200;

export async function GET(req: NextRequest) {
  const { denied, user } = await requireCmsApiUser(req);
  if (denied) return denied;

  const kind = req.nextUrl.searchParams.get("kind");
  const take = Math.min(MAX_LIST, parseInt(req.nextUrl.searchParams.get("take") || "100", 10) || 100);
  const skip = Math.max(0, parseInt(req.nextUrl.searchParams.get("skip") || "0", 10) || 0);

  const where = kind
    ? { kind: kind as "IMAGE" | "VIDEO" | "AUDIO" | "DOCUMENT" | "ARCHIVE" | "OTHER" }
    : {};

  const [items, total] = await Promise.all([
    prisma.cmsMedia.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take,
      skip,
      include: { uploader: { select: { email: true, name: true } } },
    }),
    prisma.cmsMedia.count({ where }),
  ]);

  return NextResponse.json({
    ok: true,
    total,
    items: items.map((m) => ({
      id: m.id,
      originalName: m.originalName,
      publicPath: m.publicPath,
      absoluteUrl: getAbsoluteFileUrl(m.publicPath),
      mimeType: m.mimeType,
      sizeBytes: m.sizeBytes,
      kind: m.kind,
      width: m.width,
      height: m.height,
      createdAt: m.createdAt.toISOString(),
      uploader: m.uploader,
    })),
  });
}

export async function POST(req: NextRequest) {
  const { denied, user } = await requireCmsApiUser(req);
  if (denied) return denied;

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid form data." }, { status: 400 });
  }
  const file = form.get("file");
  if (!file || !(file instanceof File)) {
    return NextResponse.json({ ok: false, error: "file field required" }, { status: 400 });
  }

  const name = file.name || "upload";
  const mime = file.type || "application/octet-stream";
  const v = validateFileMeta(name, file.size, mime);
  if (!v.ok) {
    return NextResponse.json({ ok: false, error: v.error }, { status: 400 });
  }

  const id = randomUUID();
  const buf = Buffer.from(await file.arrayBuffer());
  const { storageFile, publicPath } = await saveCmsFile({ id, originalName: name, mime, buffer: buf });
  const kind = classifyMediaKind(mime, name);

  const row = await prisma.cmsMedia.create({
    data: {
      id,
      originalName: name,
      storageFile,
      publicPath,
      mimeType: mime,
      sizeBytes: file.size,
      kind,
      uploaderId: user.id,
    },
  });

  return NextResponse.json({
    ok: true,
    id: row.id,
    publicPath: row.publicPath,
    absoluteUrl: getAbsoluteFileUrl(row.publicPath),
    kind: row.kind,
    mimeType: row.mimeType,
  });
}
