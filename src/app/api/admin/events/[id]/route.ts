import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireCmsApiUser } from "@/lib/cms-api-auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

const patchSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(20_000).optional(),
  location: z.string().max(500).optional().nullable(),
  startsAt: z.string().datetime().optional(),
  endsAt: z.union([z.string().datetime(), z.null()]).optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "CLOSED"]).optional(),
  publicRegistration: z.boolean().optional(),
  publicExhibitorRegistration: z.boolean().optional(),
  maxRegistrations: z.number().int().positive().optional().nullable(),
  maxExhibitorRegistrations: z.number().int().positive().optional().nullable(),
  streamUrl: z.union([z.string().url().max(2000), z.literal(""), z.null()]).optional(),
});

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { denied, user } = await requireCmsApiUser(req);
  if (denied) return denied;
  if (user.role !== "ADMIN" && user.role !== "EDITOR") {
    return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });
  }
  const { id } = await params;
  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      _count: { select: { registrations: true, exhibitorRegistrations: true, speakers: true } },
    },
  });
  if (!event) {
    return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true, event });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { denied, user } = await requireCmsApiUser(req);
  if (denied) return denied;
  if (user.role !== "ADMIN" && user.role !== "EDITOR") {
    return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });
  }
  const { id } = await params;
  const body = (await req.json().catch(() => null)) as unknown;
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }
  const d = parsed.data;
  const data: {
    title?: string;
    description?: string;
    location?: string | null;
    startsAt?: Date;
    endsAt?: Date | null;
    status?: "DRAFT" | "PUBLISHED" | "CLOSED";
    publicRegistration?: boolean;
    publicExhibitorRegistration?: boolean;
    maxRegistrations?: number | null;
    maxExhibitorRegistrations?: number | null;
    streamUrl?: string | null;
  } = {};
  if (d.title !== undefined) data.title = d.title;
  if (d.description !== undefined) data.description = d.description;
  if (d.location !== undefined) data.location = d.location;
  if (d.startsAt !== undefined) data.startsAt = new Date(d.startsAt);
  if (d.endsAt !== undefined) data.endsAt = d.endsAt == null ? null : new Date(d.endsAt);
  if (d.status !== undefined) data.status = d.status;
  if (d.publicRegistration !== undefined) data.publicRegistration = d.publicRegistration;
  if (d.publicExhibitorRegistration !== undefined) data.publicExhibitorRegistration = d.publicExhibitorRegistration;
  if (d.maxRegistrations !== undefined) data.maxRegistrations = d.maxRegistrations;
  if (d.maxExhibitorRegistrations !== undefined) data.maxExhibitorRegistrations = d.maxExhibitorRegistrations;
  if (d.streamUrl !== undefined) data.streamUrl = d.streamUrl === "" || d.streamUrl == null ? null : d.streamUrl;
  const event = await prisma.event.update({ where: { id }, data });
  return NextResponse.json({ ok: true, event });
}
