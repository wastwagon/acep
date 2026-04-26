import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashSessionToken } from "@/lib/cms-auth";
import { PORTAL_SESSION_COOKIE, revokePortalSessionCookie } from "@/lib/portal-auth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const token = req.cookies.get(PORTAL_SESSION_COOKIE)?.value;
  if (token) {
    const tokenHash = hashSessionToken(token);
    await prisma.portalSession.deleteMany({ where: { tokenHash } });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(revokePortalSessionCookie());
  return res;
}
