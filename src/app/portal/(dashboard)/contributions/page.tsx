import Link from "next/link";
import { prisma } from "@/lib/db";
import { requirePortalUser } from "@/lib/portal-auth";
import { PortalContributionForm } from "@/components/portal/portal-contribution-form";

export const dynamic = "force-dynamic";

export default async function PortalContributionsPage() {
  const user = await requirePortalUser();

  const [items, attendee, exhibitor, speaker] = await Promise.all([
    prisma.eventContribution.findMany({
      where: { portalUserId: user.id },
      include: { event: { select: { id: true, title: true, slug: true } } },
      orderBy: { updatedAt: "desc" },
      take: 100,
    }),
    prisma.eventRegistration.findMany({
      where: { portalUserId: user.id },
      include: { event: { select: { id: true, title: true, slug: true } } },
    }),
    prisma.eventExhibitorRegistration.findMany({
      where: { portalUserId: user.id },
      include: { event: { select: { id: true, title: true, slug: true } } },
    }),
    prisma.eventSpeaker.findMany({
      where: { portalUserId: user.id },
      include: { event: { select: { id: true, title: true, slug: true } } },
    }),
  ]);

  const eventMap = new Map<string, { id: string; title: string; slug: string }>();
  for (const r of attendee) {
    eventMap.set(r.eventId, { id: r.event.id, title: r.event.title, slug: r.event.slug });
  }
  for (const r of exhibitor) {
    eventMap.set(r.eventId, { id: r.event.id, title: r.event.title, slug: r.event.slug });
  }
  for (const s of speaker) {
    eventMap.set(s.eventId, { id: s.event.id, title: s.event.title, slug: s.event.slug });
  }
  const linkedEvents = [...eventMap.values()].sort((a, b) => a.title.localeCompare(b.title));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-semibold text-slate-900 sm:text-3xl">Materials for organisers</h1>
        <p className="mt-1 max-w-2xl text-sm text-slate-600">
          After you <strong>submit</strong>, staff can <strong>approve</strong> your text to show on the public event page, or
          reject it. That is separate from the main <strong>News &amp; posts</strong> CMS.
        </p>
      </div>

      <PortalContributionForm events={linkedEvents} />

      <div className="rounded-acepCard border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-display text-lg font-semibold text-slate-900">Your submissions</h2>
        {items.length === 0 ? (
          <p className="mt-2 text-sm text-slate-600">No materials yet.</p>
        ) : (
          <ul className="mt-4 divide-y divide-slate-100 text-sm">
            {items.map((c) => (
              <li key={c.id} className="flex flex-wrap items-start justify-between gap-3 py-3 first:pt-0">
                <div>
                  <p className="font-medium text-slate-900">{c.title || "(no title)"}</p>
                  <p className="text-xs text-slate-500">
                    {c.event.title} · {c.status}
                    {c.status === "SUBMITTED" && c.moderationStatus
                      ? ` · public: ${c.moderationStatus === "APPROVED" ? "live" : c.moderationStatus === "PENDING" ? "review" : "not public"}`
                      : ""}
                    {` · updated ${new Date(c.updatedAt).toLocaleString()}`}
                  </p>
                </div>
                {(c.status === "DRAFT" || (c.status === "SUBMITTED" && c.moderationStatus === "REJECTED")) && (
                  <Link href={`/portal/contributions/${c.id}`} className="text-sm font-medium text-acep-primary hover:underline">
                    {c.moderationStatus === "REJECTED" ? "Revise" : "Edit"}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
