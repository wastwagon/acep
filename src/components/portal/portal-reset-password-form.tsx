"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function PortalResetPasswordForm({ token }: { token: string }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setErr(null);
    if (password.length < 10) {
      setErr("Password must be at least 10 characters.");
      return;
    }
    if (!token || token.length < 8) {
      setErr("Invalid or missing reset link.");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/portal/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ token, password }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setErr(
          data.error === "invalid_or_expired_token"
            ? "This link is invalid or has expired. Request a new reset from the sign-in page."
            : "Could not reset password."
        );
        return;
      }
      router.push("/portal");
      router.refresh();
    } catch {
      setErr("Network error.");
    } finally {
      setBusy(false);
    }
  }

  if (!token || token.length < 8) {
    return (
      <div className="rounded-acepCard border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-red-700">Missing or invalid reset token. Open the link from your email, or request a new reset.</p>
        <p className="mt-4 text-center text-sm">
          <Link href="/portal/forgot-password" className="font-medium text-acep-primary hover:underline">
            Forgot password
          </Link>
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-acepCard border border-slate-200 bg-white p-6 shadow-sm">
      <h1 className="font-display text-xl font-semibold text-slate-900">Choose a new password</h1>
      <p className="text-sm text-slate-600">Enter a new password for your participant portal account (10+ characters).</p>
      {err && <p className="text-sm text-red-700">{err}</p>}
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-800">New password</label>
        <input
          type="password"
          required
          minLength={10}
          autoComplete="new-password"
          className="w-full rounded-acepBtn border border-slate-300 px-3 py-2 text-sm"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <Button type="submit" className="w-full" disabled={busy}>
        {busy ? "Saving…" : "Update password & sign in"}
      </Button>
      <p className="text-center text-sm text-slate-600">
        <Link href="/login?from=portal" className="font-medium text-acep-primary hover:underline">
          Cancel
        </Link>
      </p>
    </form>
  );
}
