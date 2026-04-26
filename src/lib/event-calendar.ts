import { foldIcsLine } from "./ical-fold";

const DEFAULT_DURATION_MS = 2 * 60 * 60 * 1000;
const DESCRIPTION_MAX = 8_000;

/** UTC format for iCalendar DTSTART/DTEND/DTSTAMP. */
function formatIcsUTC(d: Date): string {
  return d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
}

function escapeIcsText(s: string): string {
  return s
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,");
}

type IcsEventInput = {
  eventId: string;
  title: string;
  startsAt: Date;
  endsAt: Date | null;
  location: string | null;
  descriptionLines: string[];
  eventUrl: string;
};

/**
 * PUBLISH-style iCalendar (Apple Calendar, Outlook, etc.).
 */
export function buildEventIcs(input: IcsEventInput): string {
  const dtStart = input.startsAt;
  const dtEnd = input.endsAt ?? new Date(input.startsAt.getTime() + DEFAULT_DURATION_MS);
  const now = new Date();
  const desc = [...input.descriptionLines, input.eventUrl && `Event page: ${input.eventUrl}`]
    .filter(Boolean)
    .join("\n");
  const descCapped = desc.length > DESCRIPTION_MAX ? `${desc.slice(0, DESCRIPTION_MAX - 3)}...` : desc;

  function pushFolded(lines: string[], propertyLine: string) {
    for (const part of foldIcsLine(propertyLine).split("\r\n")) {
      lines.push(part);
    }
  }

  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//ACEP//Event//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
  ];
  pushFolded(lines, `UID:${input.eventId}@acep`);
  lines.push(
    `DTSTAMP:${formatIcsUTC(now)}`,
    `DTSTART:${formatIcsUTC(dtStart)}`,
    `DTEND:${formatIcsUTC(dtEnd)}`
  );
  pushFolded(lines, `SUMMARY:${escapeIcsText(input.title)}`);
  if (input.location) {
    pushFolded(lines, `LOCATION:${escapeIcsText(input.location)}`);
  }
  pushFolded(lines, `DESCRIPTION:${escapeIcsText(descCapped)}`);
  pushFolded(lines, `URL:${input.eventUrl.replace(/(\r\n|\n|\r)/g, " ")}`);
  lines.push("END:VEVENT", "END:VCALENDAR");
  return lines.join("\r\n") + "\r\n";
}

export function buildGoogleCalendarEventUrl(p: {
  title: string;
  start: Date;
  end: Date;
  details?: string;
  location?: string;
}): string {
  const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
  const sp = new URLSearchParams();
  sp.set("action", "TEMPLATE");
  sp.set("text", p.title);
  sp.set("dates", `${fmt(p.start)}/${fmt(p.end)}`);
  if (p.details) sp.set("details", p.details);
  if (p.location) sp.set("location", p.location);
  return `https://www.google.com/calendar/render?${sp.toString()}`;
}

export function eventDefaultEnd(startsAt: Date, endsAt: Date | null): Date {
  if (endsAt) return endsAt;
  return new Date(startsAt.getTime() + DEFAULT_DURATION_MS);
}
