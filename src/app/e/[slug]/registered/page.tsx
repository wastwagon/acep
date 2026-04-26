import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { EventCalendarLinks } from "@/components/events/event-calendar-links";
import { EventTicketQr } from "@/components/events/event-ticket-qr";
import { prisma } from "@/lib/db";
import { getEventCalendarActionUrls } from "@/lib/event-calendar-urls";

export const dynamic = "force-dynamic";

export default async function RegisteredPage({
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
    redirect(`/e/${encodeURIComponent(rawSlug)}`);
  }
  const reg = await prisma.eventRegistration.findFirst({
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

  const cal = getEventCalendarActionUrls({
    id: reg.event.id,
    slug: reg.event.slug,
    title: reg.event.title,
    description: reg.event.description,
    location: reg.event.location,
    startsAt: reg.event.startsAt,
    endsAt: reg.event.endsAt,
    streamUrl: reg.event.streamUrl,
  });

  return (
    <div className="container mx-auto max-w-md px-4 py-10 sm:px-6">
      <h1 className="font-display text-2xl font-semibold text-slate-900">You&apos;re registered</h1>
      <p className="mt-1 text-sm text-slate-600">{reg.event.title}</p>
      <p className="text-xs text-slate-500">{reg.fullName} · {reg.email}</p>
      <div className="mt-6 flex justify-center rounded-acepCard border border-slate-200 bg-white p-4">
        <EventTicketQr value={reg.checkInCode} label="Check-in code" />
      </div>
      <p className="mt-3 text-center text-xs text-slate-500">Show this code at the door, or in the check-in app.</p>
      <EventCalendarLinks icalHref={cal.icalHref} googleHref={cal.googleHref} className="mt-5 text-center" />

      {reg.event.streamUrl && (
        <div className="mt-8 rounded-acepCard border border-slate-200 bg-slate-50 p-4 text-sm">
          <p className="font-medium text-slate-900">Join online</p>
          <a
            href={reg.event.streamUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block text-acep-primary hover:underline"
          >
            Open stream / meeting
          </a>
        </div>
      )}

      <p className="mt-6 text-center text-xs text-slate-600">
        <Link href="/portal/register" className="font-medium text-acep-primary hover:underline">
          Participant portal
        </Link>{" "}
        — profile &amp; organiser materials (same email after you confirm; not public site content).
      </p>

      <Link href="/" className="mt-6 block text-center text-sm text-acep-primary hover:underline">
        Back to site
      </Link>
    </div>
  );
}
