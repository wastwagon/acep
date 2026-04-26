import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/cms-auth";
import {
  countEligiblePortalEmail,
  createPortalSession,
  linkPortalParticipations,
  PORTAL_SESSION_COOKIE,
} from "@/lib/portal-auth";

export const dynamic = "force-dynamic";

const bodySchema = z.object({
  email: z.string().email().max(200),
  password: z.string().min(10).max(200),
  displayName: z.string().min(1).max(200),
});

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => null)) as unknown;
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "invalid_data" }, { status: 400 });
  }

  const email = parsed.data.email.toLowerCase().trim();
  const eligible = await countEligiblePortalEmail(email);
  if (eligible === 0) {
    return NextResponse.json(
      {
        ok: false,
        error: "not_eligible",
        message:
          "No confirmed attendee or exhibitor registration, and no speaker profile, was found for this email. Confirm your event email first, or ask the organiser to add you as a speaker.",
      },
      { status: 403 }
    );
  }

  const existing = await prisma.portalUser.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ ok: false, error: "account_exists" }, { status: 409 });
  }

  const passwordHash = hashPassword(parsed.data.password);
  const displayName = parsed.data.displayName.trim();

  const user = await prisma.portalUser.create({
    data: {
      email,
      passwordHash,
      displayName,
    },
  });

  await linkPortalParticipations(user.id, email);

  const { token, expiresAt } = await createPortalSession(user.id);
  const res = NextResponse.json({ ok: true, id: user.id });
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
