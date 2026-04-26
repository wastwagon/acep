"use client";

import { useCallback, useEffect, useState, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, RefreshCw, Trash2, Upload } from "lucide-react";

type MediaRow = {
  id: string;
  originalName: string;
  publicPath: string;
  absoluteUrl: string;
  mimeType: string;
  sizeBytes: number;
  kind: string;
  createdAt: string;
};

const KIND_FILTERS = ["IMAGE", "VIDEO", "AUDIO", "DOCUMENT", "ARCHIVE", "OTHER"] as const;

function formatSize(n: number) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 / 1024).toFixed(1)} MB`;
}

export function MediaLibrary() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState<MediaRow[]>([]);
  const [total, setTotal] = useState(0);
  const [kind, setKind] = useState<string>("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    setBusy(true);
    try {
      const q = kind ? `?kind=${encodeURIComponent(kind)}` : "";
      const res = await fetch(`/api/admin/media${q}`);
      const data = (await res.json()) as { ok?: boolean; items?: MediaRow[]; total?: number; error?: string };
      if (!res.ok || !data.ok) {
        setError(data.error || "load_failed");
        return;
      }
      setItems(data.items || []);
      setTotal(data.total ?? 0);
    } catch (e) {
      setError(e instanceof Error ? e.message : "load_failed");
    } finally {
      setBusy(false);
    }
  }, [kind]);

  useEffect(() => {
    void load();
  }, [load]);

  async function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f) return;
    setUploading(true);
    setError(null);
    try {
      const form = new FormData();
      form.set("file", f);
      const res = await fetch("/api/admin/media", { method: "POST", body: form });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setError(data.error || "upload_failed");
        return;
      }
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "upload_failed");
    } finally {
      setUploading(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this file from the library?")) return;
    const res = await fetch(`/api/admin/media/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const d = (await res.json().catch(() => ({}))) as { error?: string };
      setError(d.error || "delete_failed");
      return;
    }
    await load();
  }

  async function copyText(url: string) {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(url);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      setError("Copy failed. Copy the URL from the list manually.");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-slate-900 sm:text-3xl">Media library</h1>
          <p className="mt-1 max-w-2xl text-sm text-slate-600">
            Upload images, PDFs, video, and other files. Copy the URL for <strong>posts</strong>,{" "}
            <Link href="/admin/marketing-pages" className="font-medium text-acep-primary hover:underline">
              marketing HTML
            </Link>
            , or <Link href="/admin/website" className="font-medium text-acep-primary hover:underline">hero / hub keys</Link> on the
            public website screen.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 shrink-0">
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin">Dashboard</Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/website">Site keys</Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <CardTitle>Upload</CardTitle>
            <p className="text-sm text-slate-500">Up to 50MB per file. Most common image, document, and media types are allowed.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              className="sr-only"
              onChange={onFileChange}
              accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.zip"
              disabled={uploading}
            />
            <Button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
              <Upload className="mr-2 h-4 w-4" />
              {uploading ? "Uploading…" : "Add file"}
            </Button>
            <Button type="button" variant="outline" onClick={() => void load()} disabled={busy || uploading}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-slate-600">Filter:</span>
            <select
              value={kind}
              onChange={(e) => setKind(e.target.value)}
              className="rounded-acepBtn border border-slate-300 bg-white px-2 py-1.5 text-sm"
            >
              <option value="">All types</option>
              {KIND_FILTERS.map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </select>
            <span className="text-sm text-slate-500">{items.length} shown / {total} total</span>
          </div>
          {error && <p className="text-sm text-red-700">{error}</p>}

          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((m) => (
              <li key={m.id} className="overflow-hidden rounded-acepCard border border-slate-200 bg-white shadow-sm">
                <div className="relative flex aspect-video items-center justify-center bg-slate-100">
                  {m.kind === "IMAGE" ? (
                    <img
                      src={m.publicPath}
                      alt={m.originalName}
                      className="max-h-full max-w-full object-contain"
                    />
                  ) : (
                    <div className="p-4 text-center text-sm font-medium text-slate-600">
                      {m.kind}
                      <br />
                      <span className="text-xs text-slate-500">{m.mimeType}</span>
                    </div>
                  )}
                </div>
                <div className="space-y-2 p-3">
                  <p className="line-clamp-2 text-sm font-medium text-slate-900" title={m.originalName}>
                    {m.originalName}
                  </p>
                  <p className="text-xs text-slate-500">
                    {formatSize(m.sizeBytes)} · {new Date(m.createdAt).toLocaleString()}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    <Button type="button" size="sm" variant="secondary" onClick={() => void copyText(m.absoluteUrl)}>
                      <Copy className="mr-1 h-3.5 w-3.5" />
                      {copied === m.absoluteUrl ? "Copied" : "Copy URL"}
                    </Button>
                    <Button type="button" size="sm" variant="outline" onClick={() => void remove(m.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                  <p className="break-all text-xs text-slate-500 line-clamp-2">{m.absoluteUrl}</p>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
