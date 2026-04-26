"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { InsertFromMediaButton } from "@/components/admin/insert-from-media-button";
import { cn } from "@/lib/utils";
import { ExternalLink, Info, ImageIcon, LayoutGrid, AlignLeft, type LucideIcon } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import Link from "next/link";

type Item = {
  id: string;
  key: string;
  label: string;
  groupKey: string;
  description: string | null;
  value: string;
  valueType: string;
  sortOrder: number;
  updatedAt: string;
};

type TabId = "overview" | "heroes" | "hubs" | "general";

const TABS: { id: TabId; label: string; description: string; icon: LucideIcon }[] = [
  { id: "overview", label: "Overview", description: "How the public site connects to this CMS", icon: Info },
  { id: "heroes", label: "Page hero images", description: "Main banner image per marketing page (mkt.hero.*)", icon: ImageIcon },
  { id: "hubs", label: "Hub card images", description: "Thumbnails on About, Programs, Resource centre grids (mkt.hub.*)", icon: LayoutGrid },
  { id: "general", label: "Text & brand", description: "Organisation name, footer, and internal editor notes", icon: AlignLeft },
];

function filterByTab(tab: TabId, items: Item[]) {
  if (tab === "overview") return [];
  if (tab === "heroes") return items.filter((i) => i.key.startsWith("mkt.hero")).sort((a, b) => a.sortOrder - b.sortOrder);
  if (tab === "hubs") return items.filter((i) => i.key.startsWith("mkt.hub")).sort((a, b) => a.sortOrder - b.sortOrder);
  return items
    .filter((i) => !i.key.startsWith("mkt."))
    .sort((a, b) => a.groupKey.localeCompare(b.groupKey) || a.sortOrder - b.sortOrder);
}

function FieldRow({
  i,
  draft,
  setDraft,
}: {
  i: Item;
  draft: Record<string, string>;
  setDraft: Dispatch<SetStateAction<Record<string, string>>>;
}) {
  return (
    <div className="space-y-1 rounded-acepCard border border-slate-200/80 bg-slate-50/50 p-4">
      <label className="block text-sm font-medium text-slate-800">{i.label}</label>
      {i.description && <p className="text-xs text-slate-500 leading-relaxed">{i.description}</p>}
      <p className="text-[11px] text-slate-400 font-mono">key: {i.key}</p>
      {i.valueType === "html" ? (
        <textarea
          className="min-h-[100px] w-full rounded-acepBtn border border-slate-300 bg-white px-3 py-2 font-mono text-sm"
          value={draft[i.id] ?? ""}
          onChange={(e) => setDraft((d) => ({ ...d, [i.id]: e.target.value }))}
        />
      ) : i.valueType === "url" ? (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start">
          <input
            type="url"
            className="min-w-0 flex-1 rounded-acepBtn border border-slate-300 bg-white px-3 py-2 text-sm"
            value={draft[i.id] ?? ""}
            onChange={(e) => setDraft((d) => ({ ...d, [i.id]: e.target.value }))}
            placeholder="/media/cms/…"
          />
          <InsertFromMediaButton mode="publicPath" onInsert={(p) => setDraft((d) => ({ ...d, [i.id]: p }))} />
        </div>
      ) : (
        <textarea
          rows={4}
          className="w-full rounded-acepBtn border border-slate-300 bg-white px-3 py-2 text-sm"
          value={draft[i.id] ?? ""}
          onChange={(e) => setDraft((d) => ({ ...d, [i.id]: e.target.value }))}
        />
      )}
    </div>
  );
}

export function WebsiteContentForm() {
  const [items, setItems] = useState<Item[]>([]);
  const [draft, setDraft] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>("overview");

  const load = useCallback(async () => {
    setError(null);
    setBusy(true);
    try {
      const res = await fetch("/api/admin/content");
      const data = (await res.json()) as { ok?: boolean; items?: Item[]; error?: string };
      if (!res.ok || !data.ok) {
        setError(data.error || "load_failed");
        return;
      }
      const list = data.items || [];
      setItems(list);
      setDraft(
        list.reduce<Record<string, string>>((acc, i) => {
          acc[i.id] = i.value;
          return acc;
        }, {})
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "load_failed");
    } finally {
      setBusy(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const rows = useMemo(() => filterByTab(activeTab, items), [activeTab, items]);
  const heroCount = useMemo(() => items.filter((i) => i.key.startsWith("mkt.hero")).length, [items]);
  const hubCount = useMemo(() => items.filter((i) => i.key.startsWith("mkt.hub")).length, [items]);
  const generalCount = useMemo(() => items.filter((i) => !i.key.startsWith("mkt.")).length, [items]);

  async function save() {
    setError(null);
    setSaving(true);
    try {
      const payload = {
        items: items.map((i) => ({ id: i.id, value: draft[i.id] ?? i.value })),
      };
      const res = await fetch("/api/admin/content", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setError(data.error || "save_failed");
        return;
      }
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "save_failed");
    } finally {
      setSaving(false);
    }
  }

  if (busy && items.length === 0) {
    return <p className="text-sm text-slate-600">Loading site configuration…</p>;
  }

  if (items.length === 0) {
    return (
      <p className="text-sm text-slate-600">
        No content blocks in the database yet. Run <code className="rounded bg-slate-200 px-1">npx prisma db seed</code> after
        migrations.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 border-b border-slate-200 pb-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="font-display text-2xl font-semibold text-slate-900 sm:text-3xl">Public website</h1>
          <p className="mt-1.5 text-sm text-slate-600 max-w-2xl">
            <strong>Images and short global text</strong> (hero/hub keys, branding) live here. <strong>Long page copy</strong> (HTML
            for About, programmes, FEC, etc.) is in{" "}
            <Link href="/admin/marketing-pages" className="font-medium text-acep-primary hover:underline">
              Marketing page copy
            </Link>
            . <strong>Hub index titles</strong> (About, Programs, Resource centre) are in{" "}
            <Link href="/admin/marketing-hubs" className="font-medium text-acep-primary hover:underline">
              Marketing hub pages
            </Link>
            . <strong>News & reports</strong> use{" "}
            <Link href="/admin/posts" className="font-medium text-acep-primary hover:underline">Posts</Link>
            . <strong>Events</strong> use <Link href="/admin/events" className="font-medium text-acep-primary hover:underline">Events</Link>
            . Upload files in <Link href="/admin/media" className="font-medium text-acep-primary hover:underline">Media</Link>, then pick
            them below.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 shrink-0">
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin">Dashboard</Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/media">Media library</Link>
          </Button>
        </div>
      </div>

      {error && <p className="text-sm text-red-700">{error}</p>}

      <div className="flex flex-col gap-4 lg:flex-row">
        <nav
          className="flex flex-shrink-0 flex-col gap-1 rounded-acepCard border border-slate-200 bg-white p-2 shadow-sm lg:w-56"
          aria-label="Website sections"
        >
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id)}
              className={cn(
                "flex w-full items-start gap-2 rounded-acepBtn px-3 py-2.5 text-left text-sm transition",
                activeTab === t.id
                  ? "bg-acep-primary/10 text-slate-900 ring-1 ring-acep-primary/25"
                  : "text-slate-600 hover:bg-slate-50"
              )}
            >
              <t.icon className="mt-0.5 h-4 w-4 shrink-0" />
              <span>
                <span className="font-medium">{t.label}</span>
                {t.id === "overview" && (
                  <span className="mt-0.5 block text-xs font-normal text-slate-500">{t.description}</span>
                )}
                {t.id === "heroes" && (
                  <span className="mt-0.5 block text-xs font-normal text-slate-500">
                    {heroCount} field{heroCount === 1 ? "" : "s"}
                  </span>
                )}
                {t.id === "hubs" && (
                  <span className="mt-0.5 block text-xs font-normal text-slate-500">
                    {hubCount} field{hubCount === 1 ? "" : "s"}
                  </span>
                )}
                {t.id === "general" && (
                  <span className="mt-0.5 block text-xs font-normal text-slate-500">
                    {generalCount} block{generalCount === 1 ? "" : "s"}
                  </span>
                )}
              </span>
            </button>
          ))}
        </nav>

        <div className="min-w-0 flex-1 space-y-4">
          {activeTab === "overview" && (
            <Card>
              <CardHeader>
                <CardTitle>How the pieces fit together</CardTitle>
                <CardDescription>Same database as posts and events — this screen only edits site-wide and marketing defaults.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-slate-700">
                <ul className="list-inside list-disc space-y-2 text-slate-600">
                  <li>
                    <strong>Page hero images</strong> apply to the big image at the top of programme and About subpages. Leave a field empty
                    to keep the on-site placeholder or snapshot.
                  </li>
                  <li>
                    <strong>Hub card images</strong> are the 4/3 tiles on the About, Programs, and Resource centre index pages, in visual order
                    (first card = index 0).
                  </li>
                  <li>
                    <strong>Text &amp; brand</strong> holds the short name, optional footer line, and editor notes.
                  </li>
                </ul>
                <p className="text-xs text-slate-500">
                  Keys are stable IDs used by the live site — do not rename keys; change values only. Use{" "}
                  <em>Save all</em> after editing any tab; all tabs share one draft.
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5">
                      <ExternalLink className="h-3.5 w-3.5" />
                      Open public home
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab !== "overview" && (
            <div className="space-y-4">
              {rows.length === 0 ? (
                <p className="rounded-acepCard border border-dashed border-slate-200 p-6 text-sm text-slate-600">No fields in this section. Run the database seed to add marketing keys.</p>
              ) : (
                rows.map((i) => <FieldRow key={i.id} i={i} draft={draft} setDraft={setDraft} />)
              )}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3 border-t border-slate-200 pt-4">
            <Button onClick={() => void save()} disabled={saving}>
              {saving ? "Saving…" : "Save all changes"}
            </Button>
            <span className="text-xs text-slate-500">Saves the entire site configuration, including other tabs you did not open this session.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
