"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";

export type SpeakerRow = {
  id: string;
  displayName: string;
  email: string;
  title: string | null;
  lastInviteSentAt: string | null;
  firstOpenedAt: string | null;
};

export function EventSpeakersAdmin({ eventId, initialSpeakers }: { eventId: string; initialSpeakers: SpeakerRow[] }) {
  const router = useRouter();
  const [speakers, setSpeakers] = useState(initialSpeakers);
  useEffect(() => {
    setSpeakers(initialSpeakers);
  }, [initialSpeakers]);
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [title, setTitle] = useState("");
  const [bio, setBio] = useState("");
  const [sendInvite, setSendInvite] = useState(true);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [lastDevLink, setLastDevLink] = useState<string | null>(null);

  async function onAdd(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    setLastDevLink(null);
    try {
      const res = await fetch(`/api/admin/events/${eventId}/speakers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          displayName: displayName.trim(),
          email: email.trim(),
          title: title.trim() || null,
          bio: bio.trim() || null,
          sendInvite,
        }),
        credentials: "include",
      });
      const d = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
        speaker?: SpeakerRow;
        dev?: { speakerPortalUrl: string };
      };
      if (!res.ok || !d.ok) {
        setErr(d.error === "speaker_exists" ? "A speaker with this email already exists for this event." : "Could not add speaker.");
        return;
      }
      if (d.dev?.speakerPortalUrl) setLastDevLink(d.dev.speakerPortalUrl);
      setDisplayName("");
      setEmail("");
      setTitle("");
      setBio("");
      router.refresh();
    } catch (x) {
      setErr(x instanceof Error ? x.message : "failed");
    } finally {
      setBusy(false);
    }
  }

  async function resendInvite(speakerId: string) {
    setErr(null);
    setLastDevLink(null);
    try {
      const res = await fetch(`/api/admin/events/${eventId}/speakers/${speakerId}/invite`, {
        method: "POST",
        credentials: "include",
      });
      const d = (await res.json().catch(() => ({}))) as { ok?: boolean; dev?: { speakerPortalUrl: string } };
      if (!res.ok || !d.ok) {
        setErr("Could not resend invite.");
        return;
      }
      if (d.dev?.speakerPortalUrl) setLastDevLink(d.dev.speakerPortalUrl);
      router.refresh();
    } catch (x) {
      setErr(x instanceof Error ? x.message : "failed");
    }
  }

  async function removeSpeaker(speakerId: string) {
    if (!confirm("Remove this speaker? Their old links will stop working.")) return;
    setErr(null);
    try {
      const res = await fetch(`/api/admin/events/${eventId}/speakers/${speakerId}`, { method: "DELETE", credentials: "include" });
      const d = (await res.json().catch(() => ({}))) as { ok?: boolean };
      if (!res.ok || !d.ok) {
        setErr("Could not remove speaker.");
        return;
      }
      router.refresh();
    } catch (x) {
      setErr(x instanceof Error ? x.message : "failed");
    }
  }

  return (
    <div className="space-y-6">
      {err && <p className="text-sm text-red-700">{err}</p>}
      {lastDevLink && (
        <p className="break-all rounded-acepBtn border border-amber-200 bg-amber-50 p-2 text-xs text-slate-800">
          <span className="font-semibold">Dev speaker link:</span> {lastDevLink}
          <button
            type="button"
            className="ml-2 rounded border border-amber-300 bg-white px-2 py-0.5 text-xs font-medium text-slate-800 hover:bg-amber-100"
            onClick={() => {
              void navigator.clipboard.writeText(lastDevLink);
            }}
          >
            Copy
          </button>
        </p>
      )}

      <form onSubmit={onAdd} className="max-w-xl space-y-3 rounded-acepCard border border-slate-200 bg-slate-50/50 p-4">
        <p className="text-sm font-medium text-slate-900">Add speaker</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">Display name</label>
            <input
              required
              className="w-full rounded border border-slate-300 px-2 py-1.5 text-sm"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">Email</label>
            <input
              type="email"
              required
              className="w-full rounded border border-slate-300 px-2 py-1.5 text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600">Session title (optional)</label>
          <input className="w-full rounded border border-slate-300 px-2 py-1.5 text-sm" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600">Bio (optional)</label>
          <textarea rows={2} className="w-full rounded border border-slate-300 px-2 py-1.5 text-sm" value={bio} onChange={(e) => setBio(e.target.value)} />
        </div>
        <div className="flex items-center gap-2">
          <input id="si" type="checkbox" checked={sendInvite} onChange={(e) => setSendInvite(e.target.checked)} />
          <label htmlFor="si" className="text-sm">
            Send invite email now
          </label>
        </div>
        <Button type="submit" disabled={busy}>
          {busy ? "Adding…" : "Add speaker"}
        </Button>
      </form>

      {speakers.length === 0 ? (
        <p className="text-sm text-slate-500">No speakers yet.</p>
      ) : (
        <ul className="divide-y divide-slate-100 text-sm">
          {speakers.map((s) => (
            <li key={s.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
              <div>
                <span className="font-medium">{s.displayName}</span>
                <span className="text-slate-500"> ({s.email})</span>
                {s.title && <p className="text-xs text-slate-600">{s.title}</p>}
                <p className="text-xs text-slate-500">
                  {s.lastInviteSentAt ? `Last invite: ${new Date(s.lastInviteSentAt).toLocaleString()}` : "No invite sent yet"}
                  {s.firstOpenedAt && ` · Opened link: ${new Date(s.firstOpenedAt).toLocaleString()}`}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button type="button" size="sm" variant="secondary" onClick={() => void resendInvite(s.id)}>
                  Resend / new link
                </Button>
                <Button type="button" size="sm" variant="outline" onClick={() => void removeSpeaker(s.id)}>
                  Remove
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
