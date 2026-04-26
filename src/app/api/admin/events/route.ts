import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireCmsApiUser } from "@/lib/cms-api-auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { denied, user } = await requireCmsApiUser(req);
  if (denied) return denied;
  if (user.role !== "ADMIN" && user.role !== "EDITOR") {
    return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });
  }
  const events = await prisma.event.findMany({
    orderBy: { startsAt: "desc" },
    take: 100,
    include: { _count: { select: { registrations: true, exhibitorRegistrations: true, speakers: true } } },
  });
  return NextResponse.json({ ok: true, events });
}

const createSchema = z.object({
  slug: z.string().min(2).max(80).regex(/^[a-z0-9][a-z0-9-]*$/, "slug: lowercase, numbers, hyphens only"),
  title: z.string().min(1).max(200),
  description: z.string().max(20_000).optional(),
  location: z.string().max(500).optional().nullable(),
  startsAt: z.string().datetime(),
  endsAt: z.string().datetime().optional().nullable(),
  status: z.enum(["DRAFT", "PUBLISHED", "CLOSED"]),
  publicRegistration: z.boolean().optional(),
  publicExhibitorRegistration: z.boolean().optional(),
  maxRegistrations: z.number().int().positive().optional().nullable(),
  maxExhibitorRegistrations: z.number().int().positive().optional().nullable(),
  streamUrl: z.union([z.string().url().max(2000), z.literal(""), z.null()]).optional(),
});

export async function POST(req: NextRequest) {
  const { denied, user } = await requireCmsApiUser(req);
  if (denied) return denied;
  if (user.role !== "ADMIN" && user.role !== "EDITOR") {
    return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });
  }
  const body = (await req.json().catch(() => null)) as unknown;
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "invalid", issues: parsed.error.flatten() }, { status: 400 });
  }
  const s = parsed.data;
  const slug = s.slug.toLowerCase();
  const exists = await prisma.event.findUnique({ where: { slug } });
  if (exists) {
    return NextResponse.json({ ok: false, error: "slug_taken" }, { status: 409 });
  }
  const ev = await prisma.event.create({
    data: {
      slug,
      title: s.title,
      description: s.description?.trim() ?? "",
      location: s.location || null,
      startsAt: new Date(s.startsAt),
      endsAt: s.endsAt ? new Date(s.endsAt) : null,
      status: s.status,
      publicRegistration: s.publicRegistration ?? true,
      publicExhibitorRegistration: s.publicExhibitorRegistration ?? true,
      maxRegistrations: s.maxRegistrations ?? null,
      maxExhibitorRegistrations: s.maxExhibitorRegistrations ?? null,
      streamUrl: s.streamUrl === "" || s.streamUrl == null ? null : s.streamUrl,
    },
  });
  return NextResponse.json({ ok: true, id: ev.id, slug: ev.slug });
}
