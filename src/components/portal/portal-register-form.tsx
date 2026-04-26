"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function PortalRegisterForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    try {
      const res = await fetch("/api/portal/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password, displayName }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
        message?: string;
      };
      if (!res.ok || !data.ok) {
        if (data.error === "not_eligible") {
          setErr(data.message || "This email is not eligible yet.");
        } else if (data.error === "account_exists") {
          setErr("An account already exists for this email. Sign in instead.");
        } else if (data.error === "invalid_data") {
          setErr("Check your details. Password must be at least 10 characters.");
        } else {
          setErr("Registration failed.");
        }
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

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-acepCard border border-slate-200 bg-white p-6 shadow-sm">
      <h1 className="font-display text-xl font-semibold text-slate-900">Create participant account</h1>
      <p className="text-sm text-slate-600">
        Use the <strong>same email</strong> you used for a <strong>confirmed</strong> attendee or exhibitor registration, or the email
        the organiser used for your speaker profile. Then choose a password (10+ characters).
      </p>
      {err && <p className="text-sm text-red-700">{err}</p>}
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-800">Display name</label>
        <input
          required
          className="w-full rounded-acepBtn border border-slate-300 px-3 py-2 text-sm"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="Your name"
        />
      </div>
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
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-800">Password</label>
        <input
          type="password"
          required
          autoComplete="new-password"
          minLength={10}
          className="w-full rounded-acepBtn border border-slate-300 px-3 py-2 text-sm"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <Button type="submit" className="w-full" disabled={busy}>
        {busy ? "Creating…" : "Create account & sign in"}
      </Button>
      <p className="text-center text-sm text-slate-600">
        Already have an account?{" "}
        <Link href="/login?from=portal" className="font-medium text-acep-primary hover:underline">
          Sign in
        </Link>
        {" · "}
        <Link href="/portal/forgot-password" className="font-medium text-acep-primary hover:underline">
          Forgot password
        </Link>
      </p>
      <p className="text-center text-xs text-slate-500">
        <Link href="/" className="text-acep-primary hover:underline">
          Back to site
        </Link>
      </p>
    </form>
  );
}
