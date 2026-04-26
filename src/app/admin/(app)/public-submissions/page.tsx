import Link from "next/link";
import { prisma } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardList } from "lucide-react";

export const dynamic = "force-dynamic";

function previewPayload(kind: string, payload: unknown): string {
  if (!payload || typeof payload !== "object") return "—";
  const p = payload as Record<string, unknown>;
  if (kind === "ELECTRICITY_COMPLAINT") {
    const bits = [p.name, p.category, p.region].filter(Boolean).join(" · ");
    return bits || "—";
  }
  if (kind === "TAX_WHISTLEBLOWER") {
    const bits = [p.category, p.entityName].filter(Boolean).join(" · ");
    return bits || "—";
  }
  return "—";
}

export default async function AdminPublicSubmissionsPage() {
  const rows = await prisma.publicFormSubmission.findMany({
    orderBy: { createdAt: "desc" },
    take: 300,
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-slate-900 sm:text-3xl">Public form submissions</h1>
          <p className="mt-1 max-w-2xl text-sm text-slate-600">
            Electricity complaints and OpenTax whistleblower reports submitted from the public site. Stored in the database for staff review (not the same
            flow as <Link href="/admin/portal-contributions" className="font-medium text-acep-primary hover:underline">participant organiser materials</Link>
            ). Optional email alerts: set <code className="text-xs">PUBLIC_FORM_NOTIFY_EMAIL</code> in environment (see <code className="text-xs">.env.example</code>
            ).
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/admin">Dashboard</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <ClipboardList className="h-4 w-4" />
            Inbox ({rows.length} shown)
          </CardTitle>
          <CardDescription>Newest first. Payload is JSON for export or follow-up tooling.</CardDescription>
        </CardHeader>
        <CardContent>
          {rows.length === 0 ? (
            <p className="text-sm text-slate-600">No submissions yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[42rem] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <th className="py-2 pr-3">Received</th>
                    <th className="py-2 pr-3">Kind</th>
                    <th className="py-2 pr-3">Summary</th>
                    <th className="py-2">Payload</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.id} className="border-b border-slate-100 align-top">
                      <td className="py-2 pr-3 whitespace-nowrap text-slate-600">{new Date(r.createdAt).toLocaleString()}</td>
                      <td className="py-2 pr-3 font-medium text-slate-800">{r.kind}</td>
                      <td className="py-2 pr-3 max-w-xs text-slate-700">{previewPayload(r.kind, r.payload)}</td>
                      <td className="py-2">
                        <pre className="max-h-40 max-w-xl overflow-auto rounded bg-slate-50 p-2 text-xs text-slate-800">
                          {JSON.stringify(r.payload, null, 2)}
                        </pre>
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
