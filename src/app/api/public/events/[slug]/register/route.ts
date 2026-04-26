import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { generateCheckInCode, hashToken, randomUrlToken } from "@/lib/event-crypto";
import { sendEventConfirmationEmail } from "@/lib/event-mail";
import { checkEventPublicRateLimit } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/request-ip";

export const dynamic = "force-dynamic";

const bodySchema = z.object({
  fullName: z.string().min(1).max(200),
  email: z.string().email().max(200),
  organisation: z.string().max(200).optional(),
  phone: z.string().max(40).optional(),
});

export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug: raw } = await params;
  const slug = raw.toLowerCase();
  const ip = getClientIp(req);
  const rl = await checkEventPublicRateLimit(`att:${ip}:${slug}`);
  if (!rl.ok) {
    return NextResponse.json(
      { ok: false, error: "rate_limited" },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSec) } }
    );
  }
  const event = await prisma.event.findUnique({ where: { slug } });
  if (!event || event.status !== "PUBLISHED" || !event.publicRegistration) {
    return NextResponse.json({ ok: false, error: "event_unavailable" }, { status: 400 });
  }

  const now = new Date();
  if (event.endsAt && now > event.endsAt) {
    return NextResponse.json({ ok: false, error: "event_ended" }, { status: 400 });
  }

  const body = (await req.json().catch(() => null)) as unknown;
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "invalid_data" }, { status: 400 });
  }
  const email = parsed.data.email.toLowerCase().trim();

  const used = await prisma.eventRegistration.count({
    where: { eventId: event.id, status: { in: ["PENDING_EMAIL", "CONFIRMED"] } },
  });
  if (event.maxRegistrations != null && used >= event.maxRegistrations) {
    return NextResponse.json({ ok: false, error: "event_full" }, { status: 400 });
  }

  const existing = await prisma.eventRegistration.findUnique({
    where: { eventId_email: { eventId: event.id, email } },
  });
  if (existing?.status === "CONFIRMED" || existing?.status === "PENDING_EMAIL") {
    return NextResponse.json({ ok: false, error: "already_registered" }, { status: 409 });
  }
  if (existing?.status === "CANCELLED") {
    await prisma.eventRegistration.delete({ where: { id: existing.id } });
  }

  const plain = randomUrlToken();
  const tokenHash = hashToken(plain);
  let checkIn = generateCheckInCode();
  for (let t = 0; t < 8; t += 1) {
    const c = t === 0 ? checkIn : generateCheckInCode();
    const [a, b] = await Promise.all([
      prisma.eventRegistration.findUnique({ where: { checkInCode: c } }),
      prisma.eventExhibitorRegistration.findUnique({ where: { checkInCode: c } }),
    ]);
    if (!a && !b) {
      checkIn = c;
      break;
    }
  }

  const reg = await prisma.eventRegistration.create({
    data: {
      eventId: event.id,
      fullName: parsed.data.fullName.trim(),
      email,
      organisation: parsed.data.organisation?.trim() || null,
      phone: parsed.data.phone?.trim() || null,
      checkInCode: checkIn,
      confirmationTokenHash: tokenHash,
      status: "PENDING_EMAIL",
    },
  });

  const base = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "http://localhost:3100";
  const confirmUrl = `${base}/api/public/events/confirm?token=${encodeURIComponent(plain)}`;
  const mail = await sendEventConfirmationEmail(email, event.title, confirmUrl);

  const payload: {
    ok: true;
    registrationId: string;
    mailMode: "resend" | "log";
    dev?: { confirmUrl: string };
  } = { ok: true, registrationId: reg.id, mailMode: mail.mode };
  if (process.env.NODE_ENV === "development") {
    payload.dev = { confirmUrl };
  }
  return NextResponse.json(payload);
}
