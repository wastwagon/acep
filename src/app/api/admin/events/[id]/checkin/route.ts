import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireCmsApiUser } from "@/lib/cms-api-auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

const bodySchema = z.object({
  checkInCode: z.string().min(3).max(20),
});

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { denied, user } = await requireCmsApiUser(req);
  if (denied) return denied;
  if (user.role !== "ADMIN" && user.role !== "EDITOR") {
    return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });
  }
  const { id: eventId } = await params;
  const event = await prisma.event.findUnique({ where: { id: eventId } });
  if (!event) {
    return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });
  }
  const body = (await req.json().catch(() => null)) as unknown;
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }
  const code = parsed.data.checkInCode.trim().toUpperCase();
  const reg = await prisma.eventRegistration.findFirst({
    where: { eventId, checkInCode: code, status: "CONFIRMED" },
  });
  if (reg) {
    if (reg.checkedInAt) {
      return NextResponse.json({
        ok: true,
        kind: "attendee",
        already: true,
        registration: reg,
        checkedInAt: reg.checkedInAt,
      });
    }
    const updated = await prisma.eventRegistration.update({
      where: { id: reg.id },
      data: { checkedInAt: new Date() },
    });
    return NextResponse.json({ ok: true, kind: "attendee", already: false, registration: updated });
  }

  const ex = await prisma.eventExhibitorRegistration.findFirst({
    where: { eventId, checkInCode: code, status: "CONFIRMED" },
  });
  if (ex) {
    if (ex.checkedInAt) {
      return NextResponse.json({
        ok: true,
        kind: "exhibitor",
        already: true,
        registration: ex,
        checkedInAt: ex.checkedInAt,
      });
    }
    const updated = await prisma.eventExhibitorRegistration.update({
      where: { id: ex.id },
      data: { checkedInAt: new Date() },
    });
    return NextResponse.json({ ok: true, kind: "exhibitor", already: false, registration: updated });
  }

  return NextResponse.json(
    { ok: false, error: "not_found", message: "No confirmed attendee or exhibitor matches this code." },
    { status: 404 }
  );
}
