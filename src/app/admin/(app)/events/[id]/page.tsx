import Link from "next/link";
import { notFound } from "next/navigation";
import { getEventCalendarActionUrls } from "@/lib/event-calendar-urls";
import { prisma } from "@/lib/db";
import { EventAdminForm } from "@/components/events/event-admin-form";
import { EventCheckinPanel } from "@/components/events/event-checkin-panel";
import { EventCsvDownload } from "@/components/events/event-csv-export";
import { EventSpeakersAdmin } from "@/components/events/event-speakers-admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AdminEventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      registrations: { orderBy: { createdAt: "desc" } },
      exhibitorRegistrations: { orderBy: { createdAt: "desc" } },
      speakers: { orderBy: { createdAt: "desc" } },
    },
  });
  if (!event) notFound();

  const initial = {
    id: event.id,
    slug: event.slug,
    title: event.title,
    description: event.description,
    location: event.location ?? "",
    startsAt: event.startsAt.toISOString(),
    endsAt: event.endsAt?.toISOString() ?? "",
    status: event.status,
    publicRegistration: event.publicRegistration,
    publicExhibitorRegistration: event.publicExhibitorRegistration,
    maxRegistrations: event.maxRegistrations == null ? "" : String(event.maxRegistrations),
    maxExhibitorRegistrations: event.maxExhibitorRegistrations == null ? "" : String(event.maxExhibitorRegistrations),
    streamUrl: event.streamUrl ?? "",
  };

  const publicCal = getEventCalendarActionUrls({
    id: event.id,
    slug: event.slug,
    title: event.title,
    description: event.description,
    location: event.location,
    startsAt: event.startsAt,
    endsAt: event.endsAt,
    streamUrl: event.streamUrl,
  });

  const speakerRows = event.speakers.map((s) => ({
    id: s.id,
    displayName: s.displayName,
    email: s.email,
    title: s.title,
    lastInviteSentAt: s.lastInviteSentAt?.toISOString() ?? null,
    firstOpenedAt: s.firstOpenedAt?.toISOString() ?? null,
  }));

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <p className="text-sm text-slate-600">
          <Link href="/admin" className="font-medium text-acep-primary hover:underline">
            Dashboard
          </Link>
          <span className="mx-1.5 text-slate-300">·</span>
          <Link href="/admin/events" className="font-medium text-acep-primary hover:underline">
            All events
          </Link>
        </p>
        <h1 className="mt-2 font-display text-2xl font-semibold text-slate-900 sm:text-3xl">{event.title}</h1>
        {event.status === "PUBLISHED" && (
          <p className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm">
            <a href={`/e/${event.slug}`} className="text-acep-primary hover:underline" target="_blank" rel="noreferrer">
              Public event & attendee registration
            </a>
            {event.publicExhibitorRegistration && (
              <a
                href={`/e/${event.slug}/exhibitors/register`}
                className="text-acep-primary hover:underline"
                target="_blank"
                rel="noreferrer"
              >
                Exhibitor registration
              </a>
            )}
            <a
              href={publicCal.icalHref}
              className="text-acep-primary hover:underline"
              target="_blank"
              rel="noreferrer"
            >
              Public .ics
            </a>
            <a
              href={publicCal.googleHref}
              className="text-acep-primary hover:underline"
              target="_blank"
              rel="noreferrer"
            >
              Google Calendar
            </a>
          </p>
        )}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Details</CardTitle>
        </CardHeader>
        <CardContent>
          <EventAdminForm mode="edit" initial={initial} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <CardTitle className="text-xl">Speakers</CardTitle>
          <EventCsvDownload eventId={event.id} scope="speakers" />
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-slate-600">
            Add speakers here; we email each one a personal link to the speaker page (stream URL and schedule), similar to a private Zoom join URL.
            Resending generates a new link and invalidates the previous one.
          </p>
          <EventSpeakersAdmin eventId={event.id} initialSpeakers={speakerRows} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>On-site check-in</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-2 text-sm text-slate-500">
            Use the camera scanner for QR or many barcode formats, or type the check-in code manually.
          </p>
          <EventCheckinPanel eventId={event.id} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <CardTitle className="text-xl">Registrations</CardTitle>
          <EventCsvDownload eventId={event.id} scope="registrations" />
        </CardHeader>
        <CardContent>
          {event.registrations.length === 0 && <p className="text-sm text-slate-500">No registrations yet.</p>}
          <ul className="text-sm">
            {event.registrations.map((r) => (
              <li key={r.id} className="border-b border-slate-100 py-2 last:border-0">
                <span className="font-medium">{r.fullName}</span> <span className="text-slate-500">({r.email})</span>
                <span className="ml-2 rounded bg-slate-100 px-1.5 text-xs text-slate-600">{r.status}</span>
                {r.status === "CONFIRMED" && <span className="ml-2 text-xs">code {r.checkInCode}</span>}
                {r.checkedInAt && <span className="ml-2 text-xs text-emerald-700">checked in {r.checkedInAt.toLocaleString()}</span>}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Exhibitor registrations</CardTitle>
        </CardHeader>
        <CardContent>
          {event.exhibitorRegistrations.length === 0 && <p className="text-sm text-slate-500">No exhibitor registrations yet.</p>}
          <ul className="text-sm">
            {event.exhibitorRegistrations.map((r) => (
              <li key={r.id} className="border-b border-slate-100 py-2 last:border-0">
                <span className="font-medium">{r.companyName}</span>{" "}
                <span className="text-slate-500">
                  ({r.contactName} · {r.email})
                </span>
                <span className="ml-2 rounded bg-slate-100 px-1.5 text-xs text-slate-600">{r.status}</span>
                {r.status === "CONFIRMED" && <span className="ml-2 text-xs">code {r.checkInCode}</span>}
                {r.checkedInAt && <span className="ml-2 text-xs text-emerald-700">checked in {r.checkedInAt.toLocaleString()}</span>}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
