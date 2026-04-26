import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/cms-auth";
import { hashToken } from "@/lib/event-crypto";
import { createPortalSession, PORTAL_SESSION_COOKIE } from "@/lib/portal-auth";

export const dynamic = "force-dynamic";

const bodySchema = z.object({
  token: z.string().min(8),
  password: z.string().min(10).max(200),
});

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => null)) as unknown;
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "invalid_data" }, { status: 400 });
  }

  const tokenHash = hashToken(parsed.data.token);
  const now = new Date();

  const row = await prisma.portalPasswordReset.findFirst({
    where: {
      tokenHash,
      usedAt: null,
      expiresAt: { gt: now },
    },
    include: { portalUser: true },
  });

  if (!row) {
    return NextResponse.json({ ok: false, error: "invalid_or_expired_token" }, { status: 400 });
  }

  const passwordHash = hashPassword(parsed.data.password);

  await prisma.$transaction([
    prisma.portalPasswordReset.deleteMany({
      where: { portalUserId: row.portalUserId, usedAt: null, NOT: { id: row.id } },
    }),
    prisma.portalUser.update({
      where: { id: row.portalUserId },
      data: { passwordHash },
    }),
    prisma.portalPasswordReset.update({
      where: { id: row.id },
      data: { usedAt: now },
    }),
    prisma.portalSession.deleteMany({ where: { portalUserId: row.portalUserId } }),
  ]);

  const { token, expiresAt } = await createPortalSession(row.portalUserId);
  const res = NextResponse.json({ ok: true });
  res.cookies.set({
    name: PORTAL_SESSION_COOKIE,
    value: token,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });
  return res;
}
