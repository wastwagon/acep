import Link from "next/link";
import { prisma } from "@/lib/db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PortalContributionModerationActions } from "@/components/admin/portal-contribution-moderation-actions";
import { ExternalLink, Inbox } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminPortalContributionsPage() {
  const rows = await prisma.eventContribution.findMany({
    orderBy: { updatedAt: "desc" },
    take: 400,
    include: {
      portalUser: { select: { id: true, email: true, displayName: true } },
      event: { select: { id: true, title: true, slug: true } },
      reviewedBy: { select: { email: true, name: true } },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-slate-900 sm:text-3xl">Participant → organiser materials</h1>
          <p className="mt-1 max-w-2xl text-sm text-slate-600">
            When a participant <strong>submits</strong> text, you can <strong>approve</strong> it to show on that event&rsquo;s public page
            (<code className="text-xs">/e/…</code>) under &ldquo;Shared event materials&rdquo;, or <strong>reject / remove from public</strong>. General news
            and reports still use <Link href="/admin/posts" className="font-medium text-acep-primary hover:underline">News &amp; posts</Link>
            .
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/admin">Dashboard</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Inbox className="h-4 w-4" />
            All materials
          </CardTitle>
          <CardDescription>
            Approve only after reviewing the text. Submitted items start as <strong>PENDING</strong> until you decide.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {rows.length === 0 ? (
            <p className="text-sm text-slate-600">No participant materials yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[56rem] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-600">
                    <th className="py-2 pr-3 font-medium">Updated</th>
                    <th className="py-2 pr-3 font-medium">Event</th>
                    <th className="py-2 pr-3 font-medium">Participant</th>
                    <th className="py-2 pr-3 font-medium">Title</th>
                    <th className="py-2 pr-3 font-medium">Draft / sent</th>
                    <th className="py-2 pr-3 font-medium">Public</th>
                    <th className="py-2 pr-3 font-medium">Actions</th>
                    <th className="py-2 font-medium">Preview</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.id} className="border-b border-slate-100 align-top">
                      <td className="py-2 pr-3 whitespace-nowrap text-xs text-slate-500">
                        {new Date(r.updatedAt).toLocaleString()}
                      </td>
                      <td className="py-2 pr-3">
                        <span className="font-medium text-slate-900">{r.event.title}</span>
                        <div className="mt-1 flex flex-wrap gap-1.5">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/admin/events/${r.event.id}`}>Event admin</Link>
                          </Button>
                          <Button variant="outline" size="sm" asChild>
                            <Link
                              href={`/e/${encodeURIComponent(r.event.slug)}/`}
                              className="inline-flex items-center gap-1"
                              target="_blank"
                              rel="noreferrer"
                            >
                              Public
                              <ExternalLink className="h-3 w-3" />
                            </Link>
                          </Button>
                        </div>
                      </td>
                      <td className="py-2 pr-3 text-xs">
                        <div className="font-medium text-slate-800">{r.portalUser.displayName}</div>
                        <div className="text-slate-500">{r.portalUser.email}</div>
                      </td>
                      <td className="py-2 pr-3 text-slate-800">{r.title || "—"}</td>
                      <td className="py-2 pr-3">
                        <span
                          className={
                            r.status === "SUBMITTED"
                              ? "rounded bg-sky-50 px-2 py-0.5 text-xs font-medium text-sky-900"
                              : "rounded bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700"
                          }
                        >
                          {r.status}
                        </span>
                      </td>
                      <td className="py-2 pr-3">
                        <div className="space-y-0.5 text-xs">
                          <span
                            className={
                              r.moderationStatus === "APPROVED"
                                ? "font-medium text-emerald-800"
                                : r.moderationStatus === "PENDING"
                                  ? "font-medium text-amber-800"
                                  : r.moderationStatus === "REJECTED"
                                    ? "text-slate-600"
                                    : "text-slate-400"
                            }
                          >
                            {r.moderationStatus}
                          </span>
                          {r.reviewedAt && (
                            <p className="text-[11px] text-slate-500">
                              {r.moderationStatus === "APPROVED" || r.moderationStatus === "REJECTED" ? "Review" : "Updated"}{" "}
                              {new Date(r.reviewedAt).toLocaleString()}
                              {r.reviewedBy && ` · ${r.reviewedBy.name || r.reviewedBy.email}`}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="py-2 pr-3">
                        <PortalContributionModerationActions
                          id={r.id}
                          status={r.status}
                          moderation={r.moderationStatus}
                        />
                      </td>
                      <td className="py-2 max-w-xs text-xs text-slate-600">
                        <span className="line-clamp-4 whitespace-pre-wrap">{r.body || "—"}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
