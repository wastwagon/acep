"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

type Initial = {
  displayName: string;
  phone: string | null;
  organisation: string | null;
  bio: string | null;
};

export function PortalProfileForm({ initial }: { initial: Initial }) {
  const router = useRouter();
  const [displayName, setDisplayName] = useState(initial.displayName);
  const [phone, setPhone] = useState(initial.phone ?? "");
  const [organisation, setOrganisation] = useState(initial.organisation ?? "");
  const [bio, setBio] = useState(initial.bio ?? "");
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setErr(null);
    setOk(null);
    setBusy(true);
    try {
      const res = await fetch("/api/portal/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          displayName,
          phone: phone.trim() || null,
          organisation: organisation.trim() || null,
          bio: bio.trim() || null,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setErr("Could not save profile.");
        return;
      }
      setOk("Saved.");
      router.refresh();
    } catch {
      setErr("Network error.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="max-w-xl space-y-4 rounded-acepCard border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="font-display text-lg font-semibold text-slate-900">Your profile</h2>
      <p className="text-sm text-slate-600">
        This information is for you and the ACEP team in the portal—it is <strong>not</strong> an automatic public profile on the main
        website. Your display name is synced to speaker records in the admin system where you are linked as a speaker.
      </p>
      {err && <p className="text-sm text-red-700">{err}</p>}
      {ok && <p className="text-sm text-emerald-700">{ok}</p>}
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-800">Display name</label>
        <input
          required
          className="w-full rounded-acepBtn border border-slate-300 px-3 py-2 text-sm"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-800">Phone (optional)</label>
        <input
          className="w-full rounded-acepBtn border border-slate-300 px-3 py-2 text-sm"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-800">Organisation (optional)</label>
        <input
          className="w-full rounded-acepBtn border border-slate-300 px-3 py-2 text-sm"
          value={organisation}
          onChange={(e) => setOrganisation(e.target.value)}
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-800">Bio / notes (optional)</label>
        <textarea
          rows={5}
          className="w-full rounded-acepBtn border border-slate-300 px-3 py-2 text-sm"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Short bio or internal notes for organisers…"
        />
      </div>
      <Button type="submit" disabled={busy}>
        {busy ? "Saving…" : "Save profile"}
      </Button>
    </form>
  );
}
