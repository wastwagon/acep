"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function PortalForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [devUrl, setDevUrl] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setErr(null);
    setMsg(null);
    setDevUrl(null);
    setBusy(true);
    try {
      const res = await fetch("/api/portal/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
        dev?: { resetUrl?: string };
      };
      if (res.status === 429) {
        setErr("Too many attempts. Please wait a minute and try again.");
        return;
      }
      if (!res.ok) {
        setErr("Request failed.");
        return;
      }
      setMsg("If an account exists for that address, we have sent a reset link. Check your inbox and spam folder.");
      if (data.dev?.resetUrl) {
        setDevUrl(data.dev.resetUrl);
      }
    } catch {
      setErr("Network error.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-acepCard border border-slate-200 bg-white p-6 shadow-sm">
      <h1 className="font-display text-xl font-semibold text-slate-900">Forgot password</h1>
      <p className="text-sm text-slate-600">
        Enter the email you use for the participant portal. We will email a one-time link (valid for two hours) if an account exists.
      </p>
      {err && <p className="text-sm text-red-700">{err}</p>}
      {msg && <p className="text-sm text-emerald-800">{msg}</p>}
      {devUrl && (
        <p className="break-all rounded bg-amber-50 p-2 text-xs text-amber-950">
          <strong>Dev only:</strong> {devUrl}
        </p>
      )}
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-800">Email</label>
        <input
          type="email"
          required
          autoComplete="email"
          className="w-full rounded-acepBtn border border-slate-300 px-3 py-2 text-sm"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <Button type="submit" className="w-full" disabled={busy}>
        {busy ? "Sending…" : "Send reset link"}
      </Button>
      <p className="text-center text-sm text-slate-600">
        <Link href="/login?from=portal" className="font-medium text-acep-primary hover:underline">
          Back to sign in
        </Link>
      </p>
    </form>
  );
}
