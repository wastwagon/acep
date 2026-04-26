import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { PortalUser } from "@prisma/client";
import { prisma } from "@/lib/db";
import { createSessionToken, hashSessionToken } from "@/lib/cms-auth";

export const PORTAL_SESSION_COOKIE = "acep_portal_session";

function portalSessionDurationMs() {
  const daysRaw = Number(process.env.PORTAL_SESSION_DAYS || "30");
  const days = Number.isFinite(daysRaw) && daysRaw > 0 ? daysRaw : 30;
  return days * 24 * 60 * 60 * 1000;
}

export async function createPortalSession(portalUserId: string) {
  const token = createSessionToken();
  const tokenHash = hashSessionToken(token);
  const expiresAt = new Date(Date.now() + portalSessionDurationMs());

  await prisma.portalSession.create({
    data: { portalUserId, tokenHash, expiresAt },
  });

  return { token, expiresAt };
}

export async function getPortalUserFromToken(token: string | undefined | null): Promise<PortalUser | null> {
  if (!token) return null;
  const tokenHash = hashSessionToken(token);
  const now = new Date();

  const session = await prisma.portalSession.findFirst({
    where: {
      tokenHash,
      expiresAt: { gt: now },
    },
    include: { portalUser: true },
  });

  if (!session) return null;
  await prisma.portalSession.update({
    where: { id: session.id },
    data: { lastSeenAt: now },
  });
  return session.portalUser;
}

export async function getCurrentPortalUser(): Promise<PortalUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(PORTAL_SESSION_COOKIE)?.value;
  return getPortalUserFromToken(token);
}

export async function requirePortalUser(): Promise<PortalUser> {
  const user = await getCurrentPortalUser();
  if (!user) redirect("/login?from=portal");
  return user;
}

/** Attach confirmed registrations / exhibitors / speaker rows that match this email. */
export async function linkPortalParticipations(portalUserId: string, emailNorm: string) {
  await prisma.$transaction([
    prisma.eventRegistration.updateMany({
      where: { email: emailNorm, status: "CONFIRMED", portalUserId: null },
      data: { portalUserId },
    }),
    prisma.eventExhibitorRegistration.updateMany({
      where: { email: emailNorm, status: "CONFIRMED", portalUserId: null },
      data: { portalUserId },
    }),
    prisma.eventSpeaker.updateMany({
      where: { email: emailNorm, portalUserId: null },
      data: { portalUserId },
    }),
  ]);
}

export async function countEligiblePortalEmail(emailNorm: string): Promise<number> {
  const [att, exh, spk] = await Promise.all([
    prisma.eventRegistration.count({ where: { email: emailNorm, status: "CONFIRMED" } }),
    prisma.eventExhibitorRegistration.count({ where: { email: emailNorm, status: "CONFIRMED" } }),
    prisma.eventSpeaker.count({ where: { email: emailNorm } }),
  ]);
  return att + exh + spk;
}

export async function portalUserHasEventAccess(portalUserId: string, eventId: string): Promise<boolean> {
  const n = await prisma.event.count({
    where: {
      id: eventId,
      OR: [
        { registrations: { some: { portalUserId } } },
        { exhibitorRegistrations: { some: { portalUserId } } },
        { speakers: { some: { portalUserId } } },
      ],
    },
  });
  return n > 0;
}

export function revokePortalSessionCookie() {
  return {
    name: PORTAL_SESSION_COOKIE,
    value: "",
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  };
}
