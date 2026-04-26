import { buildEventIcs, buildGoogleCalendarEventUrl, eventDefaultEnd } from "./event-calendar";

const safeBase = () => process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "http://localhost:3100";

type EventForCalendar = {
  id: string;
  slug: string;
  title: string;
  description: string;
  location: string | null;
  startsAt: Date;
  endsAt: Date | null;
  streamUrl?: string | null;
};

/** Absolute URLs and copy for "Add to calendar" on public pages. */
export function getEventCalendarActionUrls(event: EventForCalendar) {
  const site = safeBase();
  const eventPage = `${site}/e/${encodeURIComponent(event.slug)}`;
  const icalHref = `${site}/api/public/events/${encodeURIComponent(event.slug)}/calendar`;
  const end = eventDefaultEnd(event.startsAt, event.endsAt);
  const detailsParts = [event.description?.trim(), event.streamUrl && `Stream: ${event.streamUrl}`].filter(Boolean) as string[];
  const detailsForGoogle = detailsParts.length > 0 ? detailsParts.join("\n\n") + "\n\n" : "";
  const googleHref = buildGoogleCalendarEventUrl({
    title: event.title,
    start: event.startsAt,
    end: end,
    details: `${detailsForGoogle}More info: ${eventPage}`,
    location: event.location ?? undefined,
  });
  return { icalHref, googleHref, eventPage };
}

export function buildIcsForPublishedEvent(event: EventForCalendar): string {
  const site = safeBase();
  const eventPage = `${site}/e/${encodeURIComponent(event.slug)}`;
  const lines: string[] = [];
  if (event.description?.trim()) lines.push(event.description.trim());
  if (event.streamUrl) lines.push(`Join online: ${event.streamUrl}`);

  return buildEventIcs({
    eventId: event.id,
    title: event.title,
    startsAt: event.startsAt,
    endsAt: event.endsAt,
    location: event.location,
    descriptionLines: lines,
    eventUrl: eventPage,
  });
}
