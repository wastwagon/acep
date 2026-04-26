"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";

export function EventRegisterForm({ eventSlug, eventTitle }: { eventSlug: string; eventTitle: string }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [organisation, setOrganisation] = useState("");
  const [phone, setPhone] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [done, setDone] = useState<null | { devConfirmUrl?: string }>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    try {
      const res = await fetch(`/api/public/events/${encodeURIComponent(eventSlug)}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email, organisation: organisation || undefined, phone: phone || undefined }),
      });
      const d = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string; dev?: { confirmUrl: string } };
      if (!res.ok || !d.ok) {
        if (d.error === "rate_limited" || res.status === 429) {
          setErr("Too many attempts. Please wait a minute and try again.");
        } else if (d.error === "already_registered") {
          setErr("This email is already registered for this event (pending or confirmed).");
        } else if (d.error === "event_full") {
          setErr("Registration is full.");
        } else if (d.error === "event_ended") {
          setErr("This event has ended.");
        } else {
          setErr("Registration failed. Check your details and try again.");
        }
        return;
      }
      setDone(d.dev ? { devConfirmUrl: d.dev.confirmUrl } : {});
      if (!d.dev) {
        setFullName("");
        setEmail("");
        setOrganisation("");
        setPhone("");
      }
    } catch (x) {
      setErr(x instanceof Error ? x.message : "failed");
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <div className="rounded-acepCard border border-emerald-200 bg-emerald-50/80 p-4 text-sm text-slate-800">
        <p className="font-medium text-emerald-900">Thanks! Check your email to confirm {eventTitle}.</p>
        {done.devConfirmUrl && (
          <p className="mt-2 break-all text-xs text-slate-600">
            <span className="font-semibold">Local dev only:</span> {done.devConfirmUrl}
          </p>
        )}
        {!done.devConfirmUrl && (
          <p className="mt-1 text-slate-600">You will not have a valid ticket until you open the link we sent (spam folder too).</p>
        )}
        <Button type="button" variant="outline" className="mt-3" onClick={() => setDone(null)}>
          Register another person
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      {err && <p className="text-sm text-red-700">{err}</p>}
      <div>
        <label className="mb-1 block text-sm font-medium">Full name</label>
        <input
          required
          className="w-full rounded-acepBtn border border-slate-300 px-3 py-2 text-sm"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Email</label>
        <input
          type="email"
          required
          className="w-full rounded-acepBtn border border-slate-300 px-3 py-2 text-sm"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Organisation (optional)</label>
        <input className="w-full rounded-acepBtn border border-slate-300 px-3 py-2 text-sm" value={organisation} onChange={(e) => setOrganisation(e.target.value)} />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Phone (optional)</label>
        <input className="w-full rounded-acepBtn border border-slate-300 px-3 py-2 text-sm" value={phone} onChange={(e) => setPhone(e.target.value)} />
      </div>
      <Button type="submit" disabled={busy}>
        {busy ? "Submitting…" : "Register — verify by email"}
      </Button>
    </form>
  );
}
