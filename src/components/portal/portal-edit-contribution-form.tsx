"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type Initial = {
  id: string;
  title: string;
  body: string;
  eventTitle: string;
  editMode?: "draft" | "rejected";
};

export function PortalEditContributionForm({ initial }: { initial: Initial }) {
  const editMode = initial.editMode ?? "draft";
  const router = useRouter();
  const [title, setTitle] = useState(initial.title);
  const [body, setBody] = useState(initial.body);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function saveDraft(e: FormEvent) {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    try {
      const res = await fetch(`/api/portal/contributions/${encodeURIComponent(initial.id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ title, body }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setErr(data.error === "locked" ? "This version is in review or live; it cannot be edited here." : "Could not save.");
        return;
      }
      router.push("/portal/contributions");
      router.refresh();
    } catch {
      setErr("Network error.");
    } finally {
      setBusy(false);
    }
  }

  async function submitFinal() {
    if (!body.trim()) {
      setErr("Add content before submitting.");
      return;
    }
    setErr(null);
    setBusy(true);
    try {
      const res = await fetch(`/api/portal/contributions/${encodeURIComponent(initial.id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ title, body, submit: true }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setErr("Could not submit.");
        return;
      }
      router.push("/portal/contributions");
      router.refresh();
    } catch {
      setErr("Network error.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={saveDraft} className="max-w-xl space-y-4 rounded-acepCard border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm text-slate-500">
        <Link href="/portal/contributions" className="text-acep-primary hover:underline">
          ← Organiser materials
        </Link>
      </p>
      <h1 className="font-display text-xl font-semibold text-slate-900">
        {editMode === "rejected" ? "Revise rejected material" : "Edit draft material"}
      </h1>
      <p className="text-sm text-slate-600">Event: {initial.eventTitle}</p>
      {editMode === "rejected" && (
        <p className="text-sm text-slate-600">
          Save changes while you work, then use <strong>Submit</strong> to send an updated version for staff review.
        </p>
      )}
      {err && <p className="text-sm text-red-700">{err}</p>}
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-800">Title (optional)</label>
        <input className="w-full rounded-acepBtn border border-slate-300 px-3 py-2 text-sm" value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-800">Content</label>
        <textarea rows={10} className="w-full rounded-acepBtn border border-slate-300 px-3 py-2 text-sm" value={body} onChange={(e) => setBody(e.target.value)} />
      </div>
      <div className="flex flex-wrap gap-2">
        <Button type="submit" variant="outline" disabled={busy}>
          {editMode === "rejected" ? "Save changes" : "Save draft"}
        </Button>
        <Button type="button" disabled={busy || !body.trim()} onClick={() => void submitFinal()}>
          {editMode === "rejected" ? "Submit for review" : "Submit"}
        </Button>
      </div>
    </form>
  );
}
