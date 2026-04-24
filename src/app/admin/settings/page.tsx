"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminDatabaseSettingsPage() {
  const [secret, setSecret] = useState("");
  const [log, setLog] = useState<string | null>(null);
  const [busy, setBusy] = useState<null | "migrate" | "seed">(null);
  const [error, setError] = useState<string | null>(null);

  async function run(action: "migrate" | "seed") {
    setError(null);
    setLog(null);
    setBusy(action);
    try {
      const res = await fetch(`/api/admin/${action}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secret }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string; log?: string };
      if (!res.ok) {
        setError(data.error || `HTTP ${res.status}`);
        setLog(data.log || null);
        return;
      }
      setLog(data.log || "OK");
    } catch (e) {
      setError(e instanceof Error ? e.message : "request_failed");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="min-h-[70vh] bg-[#fafaf9] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl space-y-8">
        <div>
          <Link href="/" className="text-sm font-medium text-acep-primary hover:underline">
            ← Back to home
          </Link>
          <h1 className="mt-4 font-display text-3xl font-semibold text-slate-900">Database admin</h1>
          <p className="mt-2 text-sm text-slate-600">
            Run Prisma migrations and seeding manually if the automatic step on container start did not succeed.
            Requires <code className="rounded bg-slate-100 px-1">ADMIN_SECRET</code> to match the server environment.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Credentials</CardTitle>
            <CardDescription>
              Secret is only sent to your server over HTTPS in production. It is not stored in the browser after
              refresh.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <label className="block text-sm font-medium text-slate-800" htmlFor="admin-secret">
              Admin secret
            </label>
            <input
              id="admin-secret"
              type="password"
              autoComplete="off"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-acep-primary focus:ring-2 focus:ring-acep-primary/30"
              placeholder="Same value as ADMIN_SECRET on the server"
            />
            <div className="flex flex-wrap gap-3">
              <Button type="button" disabled={!secret.trim() || busy !== null} onClick={() => run("migrate")}>
                {busy === "migrate" ? "Running migrations…" : "Run migrations"}
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={!secret.trim() || busy !== null}
                onClick={() => run("seed")}
              >
                {busy === "seed" ? "Running seed…" : "Run seed"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {(error || log) && (
          <Card>
            <CardHeader>
              <CardTitle className={error ? "text-red-700" : "text-slate-900"}>
                {error ? "Error" : "Output"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {error && <p className="mb-2 text-sm font-medium text-red-700">{error}</p>}
              {log && (
                <pre className="max-h-96 overflow-auto rounded-lg bg-slate-900 p-4 text-xs text-slate-100 whitespace-pre-wrap">
                  {log}
                </pre>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
