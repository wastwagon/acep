"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type FromHint = "admin" | "portal" | undefined;

export function UnifiedLoginForm({ fromHint }: { fromHint?: FromHint }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string; redirect?: string };
      if (!res.ok || !data.ok || !data.redirect) {
        setError(data.error || "Sign-in failed.");
        return;
      }
      router.replace(data.redirect);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "request_failed");
    } finally {
      setBusy(false);
    }
  }

  const hint =
    fromHint === "admin"
      ? "Use your CMS staff account. You will be redirected to the admin dashboard."
      : fromHint === "portal"
        ? "Use your participant portal account. You will be redirected to your portal."
        : "Staff accounts open the CMS dashboard; event participants open the participant portal.";

  return (
    <div className="min-h-[70vh] bg-[#fafaf9] px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>Sign in</CardTitle>
            <CardDescription>{hint}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label htmlFor="unified-email" className="mb-1 block text-sm font-medium text-slate-800">
                  Email
                </label>
                <input
                  id="unified-email"
                  type="email"
                  autoComplete="username"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-acepBtn border border-slate-300 px-3 py-2 text-sm outline-none focus:border-acep-primary focus:ring-2 focus:ring-acep-primary/30"
                />
              </div>
              <div>
                <label htmlFor="unified-password" className="mb-1 block text-sm font-medium text-slate-800">
                  Password
                </label>
                <input
                  id="unified-password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-acepBtn border border-slate-300 px-3 py-2 text-sm outline-none focus:border-acep-primary focus:ring-2 focus:ring-acep-primary/30"
                />
              </div>
              {error ? <p className="text-sm font-medium text-red-700">{error}</p> : null}
              <Button type="submit" disabled={busy} className="w-full">
                {busy ? "Signing in..." : "Sign in"}
              </Button>
            </form>
            <div className="mt-6 space-y-2 border-t border-slate-200 pt-4 text-center text-sm text-slate-600">
              <p>
                <span className="font-medium text-slate-800">Participant?</span>{" "}
                <Link href="/portal/register" className="font-medium text-acep-primary hover:underline">
                  Create a portal account
                </Link>{" "}
                or{" "}
                <Link href="/portal/forgot-password" className="font-medium text-acep-primary hover:underline">
                  reset password
                </Link>
                .
              </p>
              <Link href="/" className="inline-block text-acep-primary hover:underline">
                Back to site
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
