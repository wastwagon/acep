import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import {
  verifyPassword,
  createCmsSession,
  CMS_SESSION_COOKIE,
  revokeCmsSessionCookie,
} from "@/lib/cms-auth";
import {
  createPortalSession,
  PORTAL_SESSION_COOKIE,
  linkPortalParticipations,
  revokePortalSessionCookie,
} from "@/lib/portal-auth";
import { resolveUnifiedLogin } from "@/lib/unified-login";

export const dynamic = "force-dynamic";

const cookieBase = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
};

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => null)) as { email?: string; password?: string } | null;
  const email = body?.email?.trim().toLowerCase();
  const password = body?.password ?? "";

  if (!email || !password) {
    return NextResponse.json({ ok: false, error: "Email and password are required." }, { status: 400 });
  }

  const [cmsUser, portalUser] = await Promise.all([
    prisma.cmsUser.findUnique({
      where: { email },
      select: { id: true, isActive: true, passwordHash: true, role: true },
    }),
    prisma.portalUser.findUnique({
      where: { email },
      select: { id: true, passwordHash: true },
    }),
  ]);

  const resolved = resolveUnifiedLogin({
    password,
    cmsUser,
    portalUser,
    verify: verifyPassword,
  });

  if (!resolved) {
    return NextResponse.json({ ok: false, error: "Invalid email or password." }, { status: 401 });
  }

  if (resolved.target === "cms") {
    const { token, expiresAt } = await createCmsSession(resolved.cmsUserId);
    const res = NextResponse.json({
      ok: true,
      redirect: "/admin",
      role: cmsUser?.role === "ADMIN" ? "cms_admin" : "cms_editor",
    });
    res.cookies.set(revokePortalSessionCookie());
    res.cookies.set({
      name: CMS_SESSION_COOKIE,
      value: token,
      ...cookieBase,
      expires: expiresAt,
    });
    return res;
  }

  await linkPortalParticipations(resolved.portalUserId, email);
  const { token, expiresAt } = await createPortalSession(resolved.portalUserId);
  const res = NextResponse.json({
    ok: true,
    redirect: "/portal",
    role: "portal",
  });
  res.cookies.set(revokeCmsSessionCookie());
  res.cookies.set({
    name: PORTAL_SESSION_COOKIE,
    value: token,
    ...cookieBase,
    expires: expiresAt,
  });
  return res;
}
