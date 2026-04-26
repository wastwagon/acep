import { NextRequest, NextResponse } from "next/server";
import { requireCmsApiUser } from "@/lib/cms-api-auth";
import { prisma } from "@/lib/db";
import { hashToken, randomUrlToken } from "@/lib/event-crypto";
import { sendSpeakerInviteEmail } from "@/lib/event-mail";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string; speakerId: string }> }) {
  const { denied, user } = await requireCmsApiUser(req);
  if (denied) return denied;
  if (user.role !== "ADMIN" && user.role !== "EDITOR") {
    return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });
  }
  const { id: eventId, speakerId } = await params;
  const sp = await prisma.eventSpeaker.findFirst({
    where: { id: speakerId, eventId },
    include: { event: { select: { slug: true, title: true } } },
  });
  if (!sp) {
    return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });
  }

  const plain = randomUrlToken();
  const inviteTokenHash = hashToken(plain);
  await prisma.eventSpeaker.update({
    where: { id: speakerId },
    data: { inviteTokenHash, lastInviteSentAt: new Date() },
  });

  const base = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "http://localhost:3100";
  const speakerPortalUrl = `${base}/e/${encodeURIComponent(sp.event.slug)}/speaker?token=${encodeURIComponent(plain)}`;
  const mail = await sendSpeakerInviteEmail(sp.email, sp.event.title, speakerPortalUrl);

  const payload: { ok: true; mailMode: "resend" | "log"; dev?: { speakerPortalUrl: string } } = {
    ok: true,
    mailMode: mail.mode,
  };
  if (process.env.NODE_ENV === "development") {
    payload.dev = { speakerPortalUrl };
  }
  return NextResponse.json(payload);
}
