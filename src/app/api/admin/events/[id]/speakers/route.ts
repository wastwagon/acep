import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireCmsApiUser } from "@/lib/cms-api-auth";
import { prisma } from "@/lib/db";
import { hashToken, randomUrlToken } from "@/lib/event-crypto";
import { sendSpeakerInviteEmail } from "@/lib/event-mail";

export const dynamic = "force-dynamic";

const createSchema = z.object({
  displayName: z.string().min(1).max(200),
  email: z.string().email().max(200),
  title: z.string().max(200).optional().nullable(),
  bio: z.string().max(5000).optional().nullable(),
  sendInvite: z.boolean().optional(),
});

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { denied, user } = await requireCmsApiUser(req);
  if (denied) return denied;
  if (user.role !== "ADMIN" && user.role !== "EDITOR") {
    return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });
  }
  const { id: eventId } = await params;
  const event = await prisma.event.findUnique({ where: { id: eventId }, select: { id: true, slug: true, title: true } });
  if (!event) {
    return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });
  }

  const body = (await req.json().catch(() => null)) as unknown;
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }
  const email = parsed.data.email.toLowerCase().trim();
  const dup = await prisma.eventSpeaker.findFirst({ where: { eventId, email } });
  if (dup) {
    return NextResponse.json({ ok: false, error: "speaker_exists" }, { status: 409 });
  }

  const plain = randomUrlToken();
  const inviteTokenHash = hashToken(plain);
  const sendInvite = parsed.data.sendInvite !== false;

  const created = await prisma.eventSpeaker.create({
    data: {
      eventId,
      displayName: parsed.data.displayName.trim(),
      email,
      title: parsed.data.title?.trim() || null,
      bio: parsed.data.bio?.trim() || null,
      inviteTokenHash,
    },
  });

  const base = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "http://localhost:3100";
  const speakerPortalUrl = `${base}/e/${encodeURIComponent(event.slug)}/speaker?token=${encodeURIComponent(plain)}`;

  let mailMode: "resend" | "log" | "skipped" = "skipped";
  if (sendInvite) {
    const mail = await sendSpeakerInviteEmail(email, event.title, speakerPortalUrl);
    mailMode = mail.mode;
    await prisma.eventSpeaker.update({
      where: { id: created.id },
      data: { lastInviteSentAt: new Date() },
    });
  }

  const speaker = await prisma.eventSpeaker.findUniqueOrThrow({
    where: { id: created.id },
    select: {
      id: true,
      displayName: true,
      email: true,
      title: true,
      bio: true,
      lastInviteSentAt: true,
      firstOpenedAt: true,
    },
  });

  const payload: {
    ok: true;
    speaker: typeof speaker;
    mailMode: "resend" | "log" | "skipped";
    dev?: { speakerPortalUrl: string };
  } = { ok: true, speaker, mailMode };
  if (process.env.NODE_ENV === "development") {
    payload.dev = { speakerPortalUrl };
  }
  return NextResponse.json(payload);
}
