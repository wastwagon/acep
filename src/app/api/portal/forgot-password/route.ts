import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { hashToken, randomUrlToken } from "@/lib/event-crypto";
import { sendPortalPasswordResetEmail } from "@/lib/event-mail";
import { checkEventPublicRateLimit } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/request-ip";

export const dynamic = "force-dynamic";

const bodySchema = z.object({
  email: z.string().email().max(200),
});

const RESET_MS = 2 * 60 * 60 * 1000;

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const rl = await checkEventPublicRateLimit(`portal-forgot:${ip}`);
  if (!rl.ok) {
    return NextResponse.json(
      { ok: false, error: "rate_limited" },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSec) } }
    );
  }

  const body = (await req.json().catch(() => null)) as unknown;
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: true });
  }

  const email = parsed.data.email.toLowerCase().trim();
  const user = await prisma.portalUser.findUnique({ where: { email } });

  const base = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "http://localhost:3100";

  if (user) {
    await prisma.portalPasswordReset.deleteMany({
      where: { portalUserId: user.id, usedAt: null },
    });

    const plain = randomUrlToken();
    const tokenHash = hashToken(plain);
    const expiresAt = new Date(Date.now() + RESET_MS);

    await prisma.portalPasswordReset.create({
      data: {
        portalUserId: user.id,
        tokenHash,
        expiresAt,
      },
    });

    const resetUrl = `${base}/portal/reset-password?token=${encodeURIComponent(plain)}`;
    const mail = await sendPortalPasswordResetEmail(email, resetUrl);

    if (process.env.NODE_ENV === "development") {
      return NextResponse.json({ ok: true, mailMode: mail.mode, dev: { resetUrl } });
    }
  }

  return NextResponse.json({ ok: true });
}
