"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminDatabaseSettingsPage() {
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
        body: JSON.stringify({}),
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
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <Link href="/admin" className="text-sm font-medium text-acep-primary hover:underline">
          ← Dashboard
        </Link>
        <h1 className="mt-3 font-display text-2xl font-semibold text-slate-900 sm:text-3xl">System / database</h1>
        <p className="mt-2 text-sm text-slate-600">
          Prisma migrations and seed. Requires the <span className="font-medium">ADMIN</span> role.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Maintenance</CardTitle>
          <CardDescription>Use if automatic deploy migration/seed failed.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <Button type="button" disabled={busy !== null} onClick={() => run("migrate")}>
              {busy === "migrate" ? "Running…" : "Run migrations"}
            </Button>
            <Button type="button" variant="outline" disabled={busy !== null} onClick={() => run("seed")}>
              {busy === "seed" ? "Running…" : "Run seed"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {(error || log) && (
        <Card>
          <CardHeader>
            <CardTitle className={error ? "text-red-700" : "text-slate-900"}>{error ? "Error" : "Output"}</CardTitle>
          </CardHeader>
          <CardContent>
            {error && <p className="mb-2 text-sm font-medium text-red-700">{error}</p>}
            {log && (
              <pre className="max-h-96 overflow-auto rounded-acepCard bg-slate-900 p-4 text-xs text-slate-100 whitespace-pre-wrap">
                {log}
              </pre>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
