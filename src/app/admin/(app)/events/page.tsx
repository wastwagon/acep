import Link from "next/link";
import { prisma } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AdminEventsListPage() {
  const events = await prisma.event.findMany({
    orderBy: { startsAt: "desc" },
    include: { _count: { select: { registrations: true, exhibitorRegistrations: true, speakers: true } } },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-display text-2xl font-semibold text-slate-900 sm:text-3xl">Events</h1>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" asChild>
            <Link href="/admin">Dashboard</Link>
          </Button>
          <Button asChild>
            <Link href="/admin/events/new">New event</Link>
          </Button>
        </div>
      </div>
      <p className="text-sm text-slate-600">
        Attendees, exhibitors (email confirm + check-in), and admin-managed speakers (personal links). When published, the public
        registration page is <code className="text-xs">/e/your-slug</code>.         Visitors can browse all open events on the{" "}
        <a href="/e" className="font-medium text-acep-primary hover:underline" target="_blank" rel="noreferrer">
          event registration hub
        </a>
        . Speakers, exhibitors, and attendees can sign in to the{" "}
        <a href="/login?from=portal" className="font-medium text-acep-primary hover:underline" target="_blank" rel="noreferrer">
          participant portal
        </a>{" "}
        after they confirm email (or are added as speakers). Submitted text can be <strong>approved for the public /e/… page</strong> in{" "}
        <Link href="/admin/portal-contributions" className="font-medium text-acep-primary hover:underline">
          Organiser materials (portal)
        </Link>
        .
      </p>
      <Card>
        <CardHeader>
          <CardTitle>All events</CardTitle>
        </CardHeader>
        <CardContent>
          {events.length === 0 && <p className="text-sm text-slate-500">No events yet.</p>}
          <ul className="divide-y divide-slate-200">
            {events.map((e) => (
              <li key={e.id} className="flex flex-wrap items-center justify-between gap-2 py-3 first:pt-0">
                <div>
                  <Link href={`/admin/events/${e.id}`} className="font-medium text-slate-900 hover:text-acep-primary">
                    {e.title}
                  </Link>
                  <p className="text-xs text-slate-500">
                    /{e.slug} · {e.status} · {new Date(e.startsAt).toLocaleDateString()} · {e._count.registrations} attendees,{" "}
                    {e._count.exhibitorRegistrations} exhibitors, {e._count.speakers} speakers
                  </p>
                </div>
                {e.status === "PUBLISHED" && (
                  <Link href={`/e/${e.slug}`} className="text-sm text-acep-primary hover:underline" target="_blank" rel="noreferrer">
                    Public page
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
