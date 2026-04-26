"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export type EventExportScope = "registrations" | "speakers";

const copy: Record<EventExportScope, { busy: string; defaultLabel: string }> = {
  registrations: { busy: "Preparing…", defaultLabel: "Download CSV (attendees + exhibitors)" },
  speakers: { busy: "Preparing…", defaultLabel: "Download CSV (speakers)" },
};

type Props = {
  eventId: string;
  scope: EventExportScope;
  label?: string;
  variant?: "default" | "secondary" | "outline";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  disabled?: boolean;
};

export function EventCsvDownload({ eventId, scope, label, variant = "secondary", size = "sm", className, disabled }: Props) {
  const [busy, setBusy] = useState(false);
  const text = copy[scope];

  async function download() {
    setBusy(true);
    try {
      const res = await fetch(
        `/api/admin/events/${eventId}/export?scope=${encodeURIComponent(scope)}`,
        { credentials: "include" }
      );
      if (!res.ok) {
        alert("Could not download export.");
        return;
      }
      const blob = await res.blob();
      const cd = res.headers.get("Content-Disposition");
      const m = /filename="?([^";]+)"?/i.exec(cd ?? "");
      const name = m?.[1]?.replace(/[\\/]/g, "-") || `event-${eventId}.csv`;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = name;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      className={className}
      onClick={() => void download()}
      disabled={busy || disabled}
    >
      {busy ? text.busy : label ?? text.defaultLabel}
    </Button>
  );
}
