"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { EventContributionModeration, EventContributionStatus } from "@prisma/client";

type Props = {
  id: string;
  status: EventContributionStatus;
  moderation: EventContributionModeration;
};

export function PortalContributionModerationActions({ id, status, moderation }: Props) {
  const router = useRouter();
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function run(action: "approve" | "reject" | "unpublish") {
    setErr(null);
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/portal-contributions/${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ action }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setErr(data.error || "update_failed");
        return;
      }
      router.refresh();
    } catch {
      setErr("request_failed");
    } finally {
      setBusy(false);
    }
  }

  if (status !== "SUBMITTED") {
    return <span className="text-xs text-slate-400">—</span>;
  }

  return (
    <div className="flex min-w-0 max-w-xs flex-col gap-1">
      {err && <p className="text-xs text-red-600">{err}</p>}
      {moderation === "PENDING" && (
        <div className="flex flex-wrap gap-1.5">
          <Button type="button" size="sm" className="h-8" disabled={busy} onClick={() => void run("approve")}>
            Approve (public)
          </Button>
          <Button type="button" size="sm" variant="outline" className="h-8" disabled={busy} onClick={() => void run("reject")}>
            Reject
          </Button>
        </div>
      )}
      {moderation === "APPROVED" && (
        <Button type="button" size="sm" variant="secondary" className="h-8 w-full sm:w-auto" disabled={busy} onClick={() => void run("unpublish")}>
          Remove from public
        </Button>
      )}
      {moderation === "REJECTED" && (
        <div className="flex flex-wrap gap-1.5">
          <Button type="button" size="sm" className="h-8" disabled={busy} onClick={() => void run("approve")}>
            Approve (public)
          </Button>
        </div>
      )}
    </div>
  );
}
