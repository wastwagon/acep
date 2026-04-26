"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";

type HubDto = {
  id: string | null;
  slug: string;
  title: string;
  intro: string;
  metaTitle: string | null;
  metaDescription: string | null;
  updatedAt: string | null;
};

const fieldClass =
  "w-full rounded-acepBtn border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-acep-primary/30";

export function MarketingHubEditorForm({ slug, publicPath }: { slug: string; publicPath: string }) {
  const router = useRouter();
  const [h, setH] = useState<HubDto | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setErr(null);
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/marketing-hubs/${encodeURIComponent(slug)}`);
      const data = (await res.json()) as { ok?: boolean; hub?: HubDto; error?: string };
      if (!res.ok || !data.ok || !data.hub) {
        setErr(data.error || "load_failed");
        return;
      }
      setH(data.hub);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "load_failed");
    } finally {
      setBusy(false);
    }
  }, [slug]);

  useEffect(() => {
    void load();
  }, [load]);

  async function save() {
    if (!h) return;
    setErr(null);
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/marketing-hubs/${encodeURIComponent(slug)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: h.title,
          intro: h.intro,
          metaTitle: h.metaTitle || null,
          metaDescription: h.metaDescription || null,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setErr(data.error || "save_failed");
        return;
      }
      router.refresh();
      await load();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "save_failed");
    } finally {
      setSaving(false);
    }
  }

  if (busy) return <p className="text-sm text-slate-600">Loading…</p>;
  if (!h) {
    return <p className="text-sm text-red-700">{err || "Not found."}</p>;
  }

  return (
    <div className="space-y-6">
      {err && <p className="text-sm text-red-700">{err}</p>}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-slate-500">
          {h.updatedAt
            ? `Last saved ${new Date(h.updatedAt).toLocaleString()}`
            : "Not saved yet in the database (built-in or snapshot copy is shown)."}
        </p>
        <a
          href={publicPath}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-acep-primary hover:underline"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          View public page
        </a>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Hub index</CardTitle>
          <CardDescription>
            These fields override the page heading and lead text for this hub only. Card grids and thumbnails stay under{" "}
            <Link href="/admin/website" className="font-medium text-acep-primary hover:underline">
              Public website
            </Link>
            .
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-800">Page title (H1)</label>
            <input
              className={fieldClass + " mt-1"}
              value={h.title}
              onChange={(e) => setH({ ...h, title: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-800">Intro (lead paragraph)</label>
            <textarea
              rows={4}
              className={fieldClass + " mt-1 min-h-[88px]"}
              value={h.intro}
              onChange={(e) => setH({ ...h, intro: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">SEO (optional)</CardTitle>
          <CardDescription>Override browser title and meta description. Leave empty to derive from the intro and built-in defaults.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-800">Meta title</label>
            <input
              className={fieldClass + " mt-1"}
              value={h.metaTitle ?? ""}
              onChange={(e) => setH({ ...h, metaTitle: e.target.value || null })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-800">Meta description</label>
            <textarea
              rows={3}
              className={fieldClass + " mt-1"}
              value={h.metaDescription ?? ""}
              onChange={(e) => setH({ ...h, metaDescription: e.target.value || null })}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-wrap items-center gap-3">
        <Button onClick={() => void save()} disabled={saving}>
          {saving ? "Saving…" : "Save hub"}
        </Button>
        <Button type="button" variant="outline" asChild>
          <Link href="/admin/marketing-hubs">Back to list</Link>
        </Button>
      </div>
    </div>
  );
}
