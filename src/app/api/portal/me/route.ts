import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requirePortalApiUser } from "@/lib/portal-api-auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { denied, user } = await requirePortalApiUser(req);
  if (denied || !user) return denied!;

  const [attendee, exhibitor, speaker, contributions] = await Promise.all([
    prisma.eventRegistration.findMany({
      where: { portalUserId: user.id },
      include: { event: { select: { id: true, title: true, slug: true, startsAt: true, status: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.eventExhibitorRegistration.findMany({
      where: { portalUserId: user.id },
      include: { event: { select: { id: true, title: true, slug: true, startsAt: true, status: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.eventSpeaker.findMany({
      where: { portalUserId: user.id },
      include: { event: { select: { id: true, title: true, slug: true, startsAt: true, status: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.eventContribution.findMany({
      where: { portalUserId: user.id },
      include: { event: { select: { id: true, title: true, slug: true } } },
      orderBy: { updatedAt: "desc" },
      take: 50,
    }),
  ]);

  const eventOptionsMap = new Map<string, { id: string; title: string; slug: string }>();
  for (const r of attendee) {
    eventOptionsMap.set(r.eventId, { id: r.event.id, title: r.event.title, slug: r.event.slug });
  }
  for (const r of exhibitor) {
    eventOptionsMap.set(r.eventId, { id: r.event.id, title: r.event.title, slug: r.event.slug });
  }
  for (const s of speaker) {
    eventOptionsMap.set(s.eventId, { id: s.event.id, title: s.event.title, slug: s.event.slug });
  }
  const linkedEvents = [...eventOptionsMap.values()].sort((a, b) => a.title.localeCompare(b.title));

  return NextResponse.json({
    ok: true,
    user: {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      phone: user.phone,
      organisation: user.organisation,
      bio: user.bio,
    },
    roles: {
      attendeeCount: attendee.length,
      exhibitorCount: exhibitor.length,
      speakerCount: speaker.length,
    },
    attendee,
    exhibitor,
    speaker,
    contributions,
    linkedEvents,
  });
}
