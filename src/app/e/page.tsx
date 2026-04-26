import type { ReactNode } from "react";
import Link from "next/link";
import { EventCalendarLinks } from "@/components/events/event-calendar-links";
import { getEventCalendarActionUrls } from "@/lib/event-calendar-urls";
import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Event registration | ACEP",
  description: "Register online for Africa Centre for Energy Policy managed events—attendees, exhibitors, and speaker access.",
};

function segment(
  e: { startsAt: Date; endsAt: Date | null },
  now: Date
): "upcoming" | "current" | "past" {
  const started = e.startsAt <= now;
  const ended = e.endsAt != null && e.endsAt < now;
  if (ended) return "past";
  if (!started) return "upcoming";
  return "current";
}

export default async function ManagedEventsHubPage() {
  const events = await prisma.event.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { startsAt: "asc" },
    take: 100,
  });
  const now = new Date();
  const withSeg = events.map((e) => ({ e, s: segment(e, now) }));
  const upcoming = withSeg
    .filter((x) => x.s === "upcoming" || x.s === "current")
    .sort((a, b) => a.e.startsAt.getTime() - b.e.startsAt.getTime());
  const past = withSeg
    .filter((x) => x.s === "past")
    .sort((a, b) => b.e.startsAt.getTime() - a.e.startsAt.getTime());

  return (
    <div className="container mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-semibold text-slate-900">Managed event registration</h1>
      <p className="mt-2 text-sm text-slate-600">
        Register as an attendee, register an exhibitor table, and join online sessions. For our news archive and programme pages, see the{" "}
        <Link href="/events" className="text-acep-primary hover:underline">
          main Events
        </Link>{" "}
        section of the site. After you confirm your email, you can use the{" "}
        <Link href="/login?from=portal" className="text-acep-primary hover:underline">
          participant portal
        </Link>{" "}
        for your profile and private materials to organisers.
      </p>

      {upcoming.length === 0 && past.length === 0 && (
        <p className="mt-8 text-sm text-slate-500">There are no published open registrations right now. Check back soon.</p>
      )}

      {upcoming.length > 0 && (
        <section className="mt-8 space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Upcoming &amp; current</h2>
          {upcoming.map(({ e, s }) => {
            const cal = getEventCalendarActionUrls(e);
            return (
              <Card key={e.id} className="border-slate-200">
                <CardHeader className="space-y-1">
                  <CardTitle className="text-lg">{e.title}</CardTitle>
                  <p className="text-sm font-normal text-slate-500">
                    {e.location && <span>{e.location} · </span>}
                    {new Date(e.startsAt).toLocaleString()}
                    {e.endsAt && ` – ${new Date(e.endsAt).toLocaleString()}`}
                    {s === "current" && <span className="ml-2 text-emerald-700">(under way)</span>}
                  </p>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-slate-700">
                  {e.description && <p className="line-clamp-4 whitespace-pre-wrap">{e.description}</p>}
                  <div className="flex flex-wrap gap-2 text-sm">
                    <ButtonLink href={`/e/${e.slug}`}>View &amp; register</ButtonLink>
                    {e.streamUrl && <span className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-600">Online / stream</span>}
                    {e.publicRegistration && <span className="rounded bg-emerald-50 px-2 py-0.5 text-xs text-emerald-900">Attendees</span>}
                    {e.publicExhibitorRegistration && (
                      <span className="rounded bg-indigo-50 px-2 py-0.5 text-xs text-indigo-900">Exhibitors</span>
                    )}
                  </div>
                  <EventCalendarLinks icalHref={cal.icalHref} googleHref={cal.googleHref} />
                </CardContent>
              </Card>
            );
          })}
        </section>
      )}

      {past.length > 0 && (
        <section className="mt-10 space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Earlier</h2>
          <ul className="divide-y divide-slate-100 border border-slate-200 rounded-acepCard bg-slate-50/50 text-sm text-slate-800">
            {past.map(({ e }) => (
              <li key={e.id} className="flex flex-wrap items-center justify-between gap-2 px-3 py-2">
                <span>{e.title}</span>
                <time className="text-xs text-slate-500">{new Date(e.startsAt).toLocaleDateString()}</time>
                <Link href={`/e/${e.slug}`} className="text-acep-primary hover:underline">
                  Open page
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

function ButtonLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center rounded-acepBtn bg-acep-primary px-3 py-1.5 text-sm font-medium text-white hover:opacity-90"
    >
      {children}
    </Link>
  );
}
