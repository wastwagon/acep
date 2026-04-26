import { notFound } from "next/navigation";
import Link from "next/link";
import { EventCalendarLinks } from "@/components/events/event-calendar-links";
import { prisma } from "@/lib/db";
import { getEventCalendarActionUrls } from "@/lib/event-calendar-urls";
import { EventRegisterForm } from "@/components/events/event-register-form";
import { EventPublicSharedMaterials } from "@/components/events/event-public-shared-materials";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function PublicEventPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = await prisma.event.findUnique({ where: { slug: slug.toLowerCase() } });
  if (!event || event.status !== "PUBLISHED") {
    notFound();
  }

  const sharedMaterials = await prisma.eventContribution.findMany({
    where: { eventId: event.id, status: "SUBMITTED", moderationStatus: "APPROVED" },
    orderBy: { updatedAt: "asc" },
    include: { portalUser: { select: { displayName: true, organisation: true } } },
  });

  const attendeeOpen = event.publicRegistration;
  const exhibitorOpen = event.publicExhibitorRegistration;
  const cal = getEventCalendarActionUrls({
    id: event.id,
    slug: event.slug,
    title: event.title,
    description: event.description,
    location: event.location,
    startsAt: event.startsAt,
    endsAt: event.endsAt,
    streamUrl: event.streamUrl,
  });

  if (!attendeeOpen && !exhibitorOpen) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-12">
        <h1 className="font-display text-2xl font-semibold text-slate-900">{event.title}</h1>
        {event.location && <p className="mt-1 text-sm text-slate-600">{event.location}</p>}
        <p className="mt-1 text-sm text-slate-500">
          {new Date(event.startsAt).toLocaleString()}
          {event.endsAt && ` – ${new Date(event.endsAt).toLocaleString()}`}
        </p>
        <p className="mt-2 text-sm text-slate-600">Public registration is not open for this event (attendees and exhibitors).</p>
        <EventCalendarLinks icalHref={cal.icalHref} googleHref={cal.googleHref} className="mt-4" />
        <EventPublicSharedMaterials items={sharedMaterials} eventTitle={event.title} />
        <Link href="/" className="mt-4 inline-block text-acep-primary hover:underline">
          Back to site
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-semibold text-slate-900">{event.title}</h1>
      {event.location && <p className="mt-1 text-slate-600">{event.location}</p>}
      <p className="mt-2 text-sm text-slate-500">
        {new Date(event.startsAt).toLocaleString()}
        {event.endsAt && ` – ${new Date(event.endsAt).toLocaleString()}`}
      </p>
      {event.description && <p className="mt-4 whitespace-pre-wrap text-sm text-slate-700">{event.description}</p>}
      <EventCalendarLinks icalHref={cal.icalHref} googleHref={cal.googleHref} className="mt-4" />

      {event.streamUrl && (
        <p className="mt-4 text-sm text-slate-600">
          This event includes an online session. After you register and confirm your email, your ticket page will include the join link.
        </p>
      )}

      {attendeeOpen && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Register as attendee</CardTitle>
          </CardHeader>
          <CardContent>
            <EventRegisterForm eventSlug={event.slug} eventTitle={event.title} />
          </CardContent>
        </Card>
      )}

      {!attendeeOpen && (
        <p className="mt-8 text-sm text-slate-600">Attendee registration is not open online for this event.</p>
      )}

      {exhibitorOpen && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Exhibitors</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-700">
            <p>Register your organisation for a booth or exhibitor presence—same email confirmation flow as attendees.</p>
            <Link
              href={`/e/${encodeURIComponent(event.slug)}/exhibitors/register`}
              className="inline-block font-medium text-acep-primary hover:underline"
            >
              Go to exhibitor registration →
            </Link>
          </CardContent>
        </Card>
      )}

      {!exhibitorOpen && attendeeOpen && (
        <p className="mt-6 text-sm text-slate-500">Exhibitor registration is not open for this event.</p>
      )}

      <EventPublicSharedMaterials items={sharedMaterials} eventTitle={event.title} />
    </div>
  );
}
