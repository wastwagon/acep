import { NextRequest, NextResponse } from "next/server";
import { requireCmsApiUser } from "@/lib/cms-api-auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string; speakerId: string }> }) {
  const { denied, user } = await requireCmsApiUser(req);
  if (denied) return denied;
  if (user.role !== "ADMIN" && user.role !== "EDITOR") {
    return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });
  }
  const { id: eventId, speakerId } = await params;
  const sp = await prisma.eventSpeaker.findFirst({ where: { id: speakerId, eventId } });
  if (!sp) {
    return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });
  }
  await prisma.eventSpeaker.delete({ where: { id: speakerId } });
  return NextResponse.json({ ok: true });
}
