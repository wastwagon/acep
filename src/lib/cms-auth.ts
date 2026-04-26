import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { randomBytes, scryptSync, timingSafeEqual, createHash } from "crypto";
import type { CmsUser } from "@prisma/client";
import { prisma } from "@/lib/db";

export const CMS_SESSION_COOKIE = "acep_cms_session";

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `scrypt$${salt}$${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [algo, salt, hash] = stored.split("$");
  if (algo !== "scrypt" || !salt || !hash) return false;
  const derived = scryptSync(password, salt, 64);
  const original = Buffer.from(hash, "hex");
  if (derived.length !== original.length) return false;
  return timingSafeEqual(derived, original);
}

export function createSessionToken(): string {
  return randomBytes(32).toString("hex");
}

export function hashSessionToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

function sessionDurationMs() {
  const daysRaw = Number(process.env.CMS_SESSION_DAYS || "14");
  const days = Number.isFinite(daysRaw) && daysRaw > 0 ? daysRaw : 14;
  return days * 24 * 60 * 60 * 1000;
}

export async function createCmsSession(userId: string) {
  const token = createSessionToken();
  const tokenHash = hashSessionToken(token);
  const expiresAt = new Date(Date.now() + sessionDurationMs());

  await prisma.cmsSession.create({
    data: { userId, tokenHash, expiresAt },
  });

  return { token, expiresAt };
}

export async function getCmsUserFromToken(token: string | undefined | null) {
  if (!token) return null;
  const tokenHash = hashSessionToken(token);
  const now = new Date();

  const session = await prisma.cmsSession.findFirst({
    where: {
      tokenHash,
      expiresAt: { gt: now },
      user: { isActive: true },
    },
    include: { user: true },
  });

  if (!session) return null;
  await prisma.cmsSession.update({
    where: { id: session.id },
    data: { lastSeenAt: now },
  });
  return session.user;
}

export async function getCurrentCmsUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(CMS_SESSION_COOKIE)?.value;
  return getCmsUserFromToken(token);
}

export function revokeCmsSessionCookie() {
  return {
    name: CMS_SESSION_COOKIE,
    value: "",
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  };
}

export async function requireCmsUser(): Promise<CmsUser> {
  const user = await getCurrentCmsUser();
  if (!user) redirect("/login?from=admin");
  return user;
}
