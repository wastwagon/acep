"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

type EventOpt = { id: string; title: string; slug: string };

export function PortalContributionForm({ events }: { events: EventOpt[] }) {
  const router = useRouter();
  const [eventId, setEventId] = useState(events[0]?.id ?? "");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(submit: boolean) {
    if (!eventId) {
      setErr("Choose an event.");
      return;
    }
    setErr(null);
    setBusy(true);
    try {
      const res = await fetch("/api/portal/contributions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ eventId, title, body, submit }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setErr(data.error === "forbidden_event" ? "You are not linked to that event." : "Could not save.");
        return;
      }
      setTitle("");
      setBody("");
      router.refresh();
    } catch {
      setErr("Network error.");
    } finally {
      setBusy(false);
    }
  }

  if (events.length === 0) {
    return (
      <p className="text-sm text-slate-600">
        Once you are linked to an event (confirmed registration, exhibitor, or speaker), you can send private notes to organisers here.
      </p>
    );
  }

  return (
    <div className="rounded-acepCard border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="font-display text-lg font-semibold text-slate-900">New material</h2>
      <p className="mt-1 text-sm text-slate-600">
        <strong>Save draft</strong> is private. <strong>Submit</strong> sends it for staff review; if they approve, it can appear on this
        event&rsquo;s public <code className="text-xs">/e/…</code> page.
      </p>
      {err && <p className="mt-2 text-sm text-red-700">{err}</p>}
      <form
        className="mt-4 space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          void submit(false);
        }}
      >
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-800">Event</label>
          <select
            className="w-full rounded-acepBtn border border-slate-300 px-3 py-2 text-sm"
            value={eventId}
            onChange={(e) => setEventId(e.target.value)}
          >
            {events.map((ev) => (
              <option key={ev.id} value={ev.id}>
                {ev.title}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-800">Title (optional)</label>
          <input
            className="w-full rounded-acepBtn border border-slate-300 px-3 py-2 text-sm"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Session outline"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-800">Content</label>
          <textarea
            rows={8}
            className="w-full rounded-acepBtn border border-slate-300 px-3 py-2 text-sm"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Materials, talking points, or other text for this event…"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="submit" variant="outline" disabled={busy}>
            Save draft
          </Button>
          <Button type="button" disabled={busy || !body.trim()} onClick={() => void submit(true)}>
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
}
