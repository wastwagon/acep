import Link from "next/link";
import { prisma } from "@/lib/db";
import { requirePortalUser } from "@/lib/portal-auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function PortalHomePage() {
  const user = await requirePortalUser();

  const [attendee, exhibitor, speaker, contributions] = await Promise.all([
    prisma.eventRegistration.findMany({
      where: { portalUserId: user.id },
      include: { event: { select: { title: true, slug: true, startsAt: true, streamUrl: true, status: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.eventExhibitorRegistration.findMany({
      where: { portalUserId: user.id },
      include: { event: { select: { title: true, slug: true, startsAt: true, status: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.eventSpeaker.findMany({
      where: { portalUserId: user.id },
      include: { event: { select: { title: true, slug: true, startsAt: true, status: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.eventContribution.findMany({
      where: { portalUserId: user.id },
      orderBy: { updatedAt: "desc" },
      take: 8,
      include: { event: { select: { title: true, slug: true } } },
    }),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-semibold text-slate-900 sm:text-3xl">Welcome, {user.displayName}</h1>
        <p className="mt-1 text-sm text-slate-600">
          You are signed in as <span className="font-mono text-xs">{user.email}</span>. Manage your{" "}
          <Link href="/portal/profile" className="font-medium text-acep-primary hover:underline">
            profile
          </Link>{" "}
          and{" "}
          <Link href="/portal/contributions" className="font-medium text-acep-primary hover:underline">
            organiser materials
          </Link>{" "}
          (private notes for the event team—not the public website).
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Attendee</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold text-slate-900">{attendee.length}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Exhibitor</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold text-slate-900">{exhibitor.length}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Speaker</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold text-slate-900">{speaker.length}</CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Your events</CardTitle>
            <CardDescription>From confirmed registrations, exhibitor passes, or speaker assignments.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            {attendee.length + exhibitor.length + speaker.length === 0 && (
              <p className="text-slate-600">
                No linked events yet. Confirm your email after registering, or ask the organiser to link your speaker email.
              </p>
            )}
            <ul className="space-y-3">
              {attendee.map((r) => (
                <li key={r.id} className="rounded-acepBtn border border-slate-100 bg-slate-50/80 p-3">
                  <p className="font-medium text-slate-900">{r.event.title}</p>
                  <p className="text-xs text-slate-500">Attendee · {new Date(r.event.startsAt).toLocaleString()}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/e/${encodeURIComponent(r.event.slug)}/registered?c=${encodeURIComponent(r.checkInCode)}`}>
                        Ticket &amp; QR
                      </Link>
                    </Button>
                  </div>
                </li>
              ))}
              {exhibitor.map((r) => (
                <li key={r.id} className="rounded-acepBtn border border-slate-100 bg-slate-50/80 p-3">
                  <p className="font-medium text-slate-900">{r.event.title}</p>
                  <p className="text-xs text-slate-500">Exhibitor · {r.companyName}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/e/${encodeURIComponent(r.event.slug)}/exhibitors/registered?c=${encodeURIComponent(r.checkInCode)}`}>
                        Exhibitor pass
                      </Link>
                    </Button>
                  </div>
                </li>
              ))}
              {speaker.map((s) => (
                <li key={s.id} className="rounded-acepBtn border border-slate-100 bg-slate-50/80 p-3">
                  <p className="font-medium text-slate-900">{s.event.title}</p>
                  <p className="text-xs text-slate-500">Speaker{s.title ? ` · ${s.title}` : ""}</p>
                  <p className="mt-2 text-xs text-slate-500">
                    Use the personal invite link from your email to open the stream page. This portal also holds your profile and any
                    private materials you send to organisers.
                  </p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-base">Recent organiser materials</CardTitle>
              <CardDescription>Private drafts and submissions—nothing here is published on acep.africa.</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/portal/contributions">Manage</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {contributions.length === 0 ? (
              <p className="text-sm text-slate-600">None yet.</p>
            ) : (
              <ul className="divide-y divide-slate-100 text-sm">
                {contributions.map((c) => (
                  <li key={c.id} className="flex flex-wrap items-center justify-between gap-2 py-2 first:pt-0">
                    <span className="font-medium text-slate-800">{c.title || "(no title)"}</span>
                    <span className="text-xs text-slate-500">
                      {c.status}
                      {c.status === "SUBMITTED" && c.moderationStatus === "APPROVED" && (
                        <span className="ml-1 rounded bg-emerald-100 px-1.5 text-emerald-900">public</span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
