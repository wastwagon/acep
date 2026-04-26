import Link from "next/link";
import { redirect } from "next/navigation";
import { EventCalendarLinks } from "@/components/events/event-calendar-links";
import { prisma } from "@/lib/db";
import { hashToken } from "@/lib/event-crypto";
import { getEventCalendarActionUrls } from "@/lib/event-calendar-urls";

export const dynamic = "force-dynamic";

export default async function SpeakerPortalPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ token?: string }>;
}) {
  const { slug: rawSlug } = await params;
  const slug = rawSlug.toLowerCase();
  const { token } = await searchParams;
  if (!token || token.length < 8) {
    redirect("/e/invalid?reason=speaker");
  }
  const h = hashToken(token);
  const speaker = await prisma.eventSpeaker.findFirst({
    where: { inviteTokenHash: h, event: { slug } },
    include: {
      event: {
        select: {
          id: true,
          title: true,
          description: true,
          startsAt: true,
          endsAt: true,
          location: true,
          streamUrl: true,
          slug: true,
        },
      },
    },
  });
  if (!speaker) {
    redirect("/e/invalid?reason=speaker");
  }

  if (!speaker.firstOpenedAt) {
    await prisma.eventSpeaker.update({
      where: { id: speaker.id },
      data: { firstOpenedAt: new Date() },
    });
  }

  const ev = speaker.event;
  const cal = getEventCalendarActionUrls({
    id: ev.id,
    slug: ev.slug,
    title: ev.title,
    description: ev.description,
    location: ev.location,
    startsAt: ev.startsAt,
    endsAt: ev.endsAt,
    streamUrl: ev.streamUrl,
  });

  return (
    <div className="container mx-auto max-w-lg px-4 py-10 sm:px-6">
      <h1 className="font-display text-2xl font-semibold text-slate-900">Speaker access</h1>
      <p className="mt-1 text-sm text-slate-600">{ev.title}</p>
      <p className="mt-2 text-sm text-slate-700">
        <span className="font-medium">{speaker.displayName}</span>
        {speaker.title && <span className="text-slate-500"> · {speaker.title}</span>}
      </p>
      <p className="mt-3 text-xs text-slate-500">
        This link is personal to you—do not share it publicly (similar to a private Zoom join URL).
      </p>
      <EventCalendarLinks icalHref={cal.icalHref} googleHref={cal.googleHref} className="mt-3" />

      <div className="mt-6 rounded-acepCard border border-slate-200 bg-slate-50/80 p-4 text-sm text-slate-800">
        <p className="font-medium text-slate-900">Schedule</p>
        <p className="mt-1 text-slate-600">{new Date(ev.startsAt).toLocaleString()}</p>
        {ev.endsAt && <p className="text-slate-600">Ends {new Date(ev.endsAt).toLocaleString()}</p>}
        {ev.location && <p className="mt-2 text-slate-600">{ev.location}</p>}
      </div>

      {ev.streamUrl ? (
        <div className="mt-6">
          <p className="text-sm font-medium text-slate-900">Join online</p>
          <a
            href={ev.streamUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex rounded-acepBtn bg-acep-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90"
          >
            Open stream / meeting
          </a>
          <p className="mt-2 break-all text-xs text-slate-500">{ev.streamUrl}</p>
        </div>
      ) : (
        <p className="mt-6 text-sm text-slate-600">The organiser has not set a stream link for this event yet.</p>
      )}

      <p className="mt-6 text-center text-xs text-slate-600">
        Want a password login, profile, and a channel to message organisers (not public posts)?{" "}
        <Link href="/portal/register" className="font-medium text-acep-primary hover:underline">
          Participant portal
        </Link>
      </p>

      <Link href="/" className="mt-8 block text-center text-sm text-acep-primary hover:underline">
        Back to site
      </Link>
    </div>
  );
}
