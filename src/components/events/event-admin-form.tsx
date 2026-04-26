"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

type EventStatus = "DRAFT" | "PUBLISHED" | "CLOSED";

type Initial = {
  id: string;
  slug: string;
  title: string;
  description: string;
  location: string;
  startsAt: string;
  endsAt: string;
  status: EventStatus;
  publicRegistration: boolean;
  publicExhibitorRegistration: boolean;
  maxRegistrations: string;
  maxExhibitorRegistrations: string;
  streamUrl: string;
};

function toLocalInput(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function fromLocalInput(s: string) {
  if (!s) return null;
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

export function EventAdminForm({ mode, initial }: { mode: "create" | "edit"; initial?: Initial }) {
  const router = useRouter();
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [location, setLocation] = useState(initial?.location ?? "");
  const [startsAt, setStartsAt] = useState(initial ? toLocalInput(initial.startsAt) : "");
  const [endsAt, setEndsAt] = useState(initial && initial.endsAt ? toLocalInput(initial.endsAt) : "");
  const [status, setStatus] = useState<EventStatus>(initial?.status ?? "DRAFT");
  const [publicRegistration, setPublicRegistration] = useState(initial?.publicRegistration ?? true);
  const [publicExhibitorRegistration, setPublicExhibitorRegistration] = useState(
    initial?.publicExhibitorRegistration ?? true
  );
  const [maxRegistrations, setMaxRegistrations] = useState(initial?.maxRegistrations ?? "");
  const [maxExhibitorRegistrations, setMaxExhibitorRegistrations] = useState(initial?.maxExhibitorRegistrations ?? "");
  const [streamUrl, setStreamUrl] = useState(initial?.streamUrl ?? "");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    const st = fromLocalInput(startsAt);
    if (!st) {
      setErr("Start date/time is required.");
      setBusy(false);
      return;
    }
    const en = endsAt.trim() ? fromLocalInput(endsAt) : null;
    const body: Record<string, unknown> = {
      title: title.trim(),
      description: description,
      location: location.trim() || null,
      startsAt: st,
      endsAt: en,
      status,
      publicRegistration,
      publicExhibitorRegistration,
      maxRegistrations: maxRegistrations === "" ? null : parseInt(maxRegistrations, 10) || null,
      maxExhibitorRegistrations:
        maxExhibitorRegistrations === "" ? null : parseInt(maxExhibitorRegistrations, 10) || null,
      streamUrl: streamUrl.trim() === "" ? null : streamUrl.trim(),
    };
    try {
      if (mode === "create") {
        body.slug = slug.trim().toLowerCase();
        const res = await fetch("/api/admin/events", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body), credentials: "include" });
        const d = (await res.json().catch(() => ({}))) as { ok?: boolean; id?: string; error?: string };
        if (!res.ok || !d.ok) {
          setErr(d.error === "slug_taken" ? "That URL slug is already in use." : "Could not create.");
          return;
        }
        if (d.id) router.push(`/admin/events/${d.id}`);
        return;
      }
      const res = await fetch(`/api/admin/events/${initial?.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        credentials: "include",
      });
      const d = (await res.json().catch(() => ({}))) as { ok?: boolean };
      if (!res.ok || !d.ok) {
        setErr("Could not save.");
        return;
      }
      router.refresh();
    } catch (x) {
      setErr(x instanceof Error ? x.message : "failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="max-w-2xl space-y-4">
      {err && <p className="text-sm text-red-700">{err}</p>}
      {mode === "create" && (
        <div>
          <label className="mb-1 block text-sm font-medium">URL slug</label>
          <input
            required
            className="w-full rounded border border-slate-300 px-2 py-1.5 text-sm"
            value={slug}
            onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
            placeholder="e.g. fec-2026"
          />
        </div>
      )}
      {mode === "edit" && <p className="text-sm text-slate-500">Public link: <code> /e/{initial?.slug} </code></p>}
      <div>
        <label className="mb-1 block text-sm font-medium">Title</label>
        <input required className="w-full rounded border border-slate-300 px-2 py-1.5 text-sm" value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Description</label>
        <textarea rows={5} className="w-full rounded border border-slate-300 px-2 py-1.5 text-sm" value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Location (optional)</label>
        <input className="w-full rounded border border-slate-300 px-2 py-1.5 text-sm" value={location} onChange={(e) => setLocation(e.target.value)} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">Starts</label>
          <input type="datetime-local" required className="w-full rounded border border-slate-300 px-2 py-1.5 text-sm" value={startsAt} onChange={(e) => setStartsAt(e.target.value)} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Ends (optional)</label>
          <input type="datetime-local" className="w-full rounded border border-slate-300 px-2 py-1.5 text-sm" value={endsAt} onChange={(e) => setEndsAt(e.target.value)} />
        </div>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Status</label>
        <select className="w-full rounded border border-slate-300 px-2 py-1.5 text-sm" value={status} onChange={(e) => setStatus(e.target.value as EventStatus)}>
          <option value="DRAFT">Draft</option>
          <option value="PUBLISHED">Published (visible + register if enabled)</option>
          <option value="CLOSED">Closed</option>
        </select>
      </div>
      <div className="flex items-center gap-2">
        <input id="pr" type="checkbox" checked={publicRegistration} onChange={(e) => setPublicRegistration(e.target.checked)} />
        <label htmlFor="pr" className="text-sm">Allow public attendee registration</label>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Max registrations (empty = no limit)</label>
        <input
          className="w-40 rounded border border-slate-300 px-2 py-1.5 text-sm"
          type="number"
          min={1}
          value={maxRegistrations}
          onChange={(e) => setMaxRegistrations(e.target.value)}
        />
      </div>
      <div className="flex items-center gap-2">
        <input
          id="pex"
          type="checkbox"
          checked={publicExhibitorRegistration}
          onChange={(e) => setPublicExhibitorRegistration(e.target.checked)}
        />
        <label htmlFor="pex" className="text-sm">Allow public exhibitor registration</label>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Max exhibitor registrations (empty = no limit)</label>
        <input
          className="w-40 rounded border border-slate-300 px-2 py-1.5 text-sm"
          type="number"
          min={1}
          value={maxExhibitorRegistrations}
          onChange={(e) => setMaxExhibitorRegistrations(e.target.value)}
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Stream / meeting URL (Zoom, Meet, etc.)</label>
        <input
          type="url"
          placeholder="https://"
          className="w-full rounded border border-slate-300 px-2 py-1.5 text-sm"
          value={streamUrl}
          onChange={(e) => setStreamUrl(e.target.value)}
        />
        <p className="mt-1 text-xs text-slate-500">Shown to confirmed attendees, exhibitors, and speakers with a valid link.</p>
      </div>
      <div className="flex gap-2">
        <Button type="submit" disabled={busy}>
          {busy ? "Saving…" : mode === "create" ? "Create event" : "Save changes"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
