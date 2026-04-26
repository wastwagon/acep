"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { InsertFromMediaButton } from "@/components/admin/insert-from-media-button";
import { ExternalLink } from "lucide-react";

type PageDto = {
  id: string | null;
  slug: string;
  title: string;
  intro: string;
  bodyHtml: string;
  metaTitle: string | null;
  metaDescription: string | null;
  updatedAt: string | null;
};

const fieldClass =
  "w-full rounded-acepBtn border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-acep-primary/30";

export function MarketingPageEditorForm({ slug, publicPath }: { slug: string; publicPath: string }) {
  const router = useRouter();
  const [p, setP] = useState<PageDto | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setErr(null);
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/marketing-pages/${encodeURIComponent(slug)}`);
      const data = (await res.json()) as { ok?: boolean; page?: PageDto; error?: string };
      if (!res.ok || !data.ok || !data.page) {
        setErr(data.error || "load_failed");
        return;
      }
      setP(data.page);
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
    if (!p) return;
    setErr(null);
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/marketing-pages/${encodeURIComponent(slug)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: p.title,
          intro: p.intro,
          bodyHtml: p.bodyHtml,
          metaTitle: p.metaTitle || null,
          metaDescription: p.metaDescription || null,
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
  if (!p) {
    return <p className="text-sm text-red-700">{err || "Not found."}</p>;
  }

  return (
    <div className="space-y-6">
      {err && <p className="text-sm text-red-700">{err}</p>}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-slate-500">
          {p.updatedAt ? `Last saved ${new Date(p.updatedAt).toLocaleString()}` : "Not saved yet in the database (built-in or snapshot copy is shown)."}
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
          <CardTitle>Page</CardTitle>
          <CardDescription>When the main body is empty, the public site uses the on-disk template or a scraped snapshot. Fill fields below to override from the database.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-800">Page title (H1)</label>
            <input
              className={fieldClass + " mt-1"}
              value={p.title}
              onChange={(e) => setP({ ...p, title: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-800">Intro (lead paragraph)</label>
            <textarea
              rows={3}
              className={fieldClass + " mt-1 min-h-[72px]"}
              value={p.intro}
              onChange={(e) => setP({ ...p, intro: e.target.value })}
            />
          </div>
          <div>
            <div className="flex items-center justify-between gap-2">
              <label className="text-sm font-medium text-slate-800">Body (HTML)</label>
              <InsertFromMediaButton mode="markdown" onInsert={(m) => setP({ ...p, bodyHtml: p.bodyHtml + m })} />
            </div>
            <textarea
              rows={18}
              className={`${fieldClass} mt-1 min-h-[320px] font-mono text-sm`}
              value={p.bodyHtml}
              onChange={(e) => setP({ ...p, bodyHtml: e.target.value })}
              placeholder="<h2>…</h2><p>…</p>"
            />
            <p className="mt-1 text-xs text-slate-500">Safe HTML only; paste from a trusted source.</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">SEO (optional)</CardTitle>
          <CardDescription>Override browser title and meta description. Leave empty to use automatic text from the intro and body.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-800">Meta title</label>
            <input
              className={fieldClass + " mt-1"}
              value={p.metaTitle ?? ""}
              onChange={(e) => setP({ ...p, metaTitle: e.target.value || null })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-800">Meta description</label>
            <textarea
              rows={3}
              className={fieldClass + " mt-1"}
              value={p.metaDescription ?? ""}
              onChange={(e) => setP({ ...p, metaDescription: e.target.value || null })}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-wrap items-center gap-3">
        <Button onClick={() => void save()} disabled={saving}>
          {saving ? "Saving…" : "Save page"}
        </Button>
        <Button type="button" variant="outline" asChild>
          <Link href="/admin/marketing-pages">Back to list</Link>
        </Button>
      </div>
    </div>
  );
}
