import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { EventCalendarLinks } from "@/components/events/event-calendar-links";
import { EventTicketQr } from "@/components/events/event-ticket-qr";
import { prisma } from "@/lib/db";
import { getEventCalendarActionUrls } from "@/lib/event-calendar-urls";

export const dynamic = "force-dynamic";

export default async function ExhibitorRegisteredPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ c?: string }>;
}) {
  const { slug: rawSlug } = await params;
  const slug = rawSlug.toLowerCase();
  const { c: code } = await searchParams;
  if (!code) {
    redirect(`/e/${encodeURIComponent(rawSlug)}/exhibitors/register`);
  }
  const reg = await prisma.eventExhibitorRegistration.findFirst({
    where: {
      checkInCode: code.trim().toUpperCase(),
      event: { slug },
      status: "CONFIRMED",
    },
    include: {
      event: {
        select: {
          id: true,
          title: true,
          description: true,
          startsAt: true,
          endsAt: true,
          location: true,
          slug: true,
          streamUrl: true,
        },
      },
    },
  });
  if (!reg) {
    notFound();
  }

  const ev = reg.event;
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
    <div className="container mx-auto max-w-md px-4 py-10 sm:px-6">
      <h1 className="font-display text-2xl font-semibold text-slate-900">Exhibitor confirmed</h1>
      <p className="mt-1 text-sm text-slate-600">{ev.title}</p>
      <p className="text-xs text-slate-500">
        {reg.companyName} · {reg.contactName} · {reg.email}
      </p>
      <div className="mt-6 flex justify-center rounded-acepCard border border-slate-200 bg-white p-4">
        <EventTicketQr value={reg.checkInCode} label="Exhibitor check-in code" />
      </div>
      <p className="mt-3 text-center text-xs text-slate-500">Show this code at exhibitor check-in.</p>
      <EventCalendarLinks icalHref={cal.icalHref} googleHref={cal.googleHref} className="mt-5 text-center" />

      {ev.streamUrl && (
        <div className="mt-8 rounded-acepCard border border-slate-200 bg-slate-50 p-4 text-sm">
          <p className="font-medium text-slate-900">Join online</p>
          <a href={ev.streamUrl} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-acep-primary hover:underline">
            Open stream / meeting
          </a>
        </div>
      )}

      <p className="mt-6 text-center text-xs text-slate-600">
        <Link href="/portal/register" className="font-medium text-acep-primary hover:underline">
          Participant portal
        </Link>{" "}
        — profile &amp; organiser materials (same email; not public site content).
      </p>

      <Link href="/" className="mt-6 block text-center text-sm text-acep-primary hover:underline">
        Back to site
      </Link>
    </div>
  );
}
