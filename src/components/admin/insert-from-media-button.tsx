"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ImageIcon } from "lucide-react";

type M = { id: string; originalName: string; absoluteUrl: string; kind: string; publicPath: string };

type Props = {
  onInsert: (text: string) => void;
  /** "markdown" (default) for posts; "publicPath" inserts /media/... for CMS URL fields. */
  mode?: "markdown" | "publicPath";
};

export function InsertFromMediaButton({ onInsert, mode = "markdown" }: Props) {
  const [open, setOpen] = useState(false);
  const [list, setList] = useState<M[] | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function toggle() {
    if (!open) {
      setErr(null);
      try {
        const res = await fetch("/api/admin/media?take=40");
        const d = (await res.json()) as { ok?: boolean; items?: M[]; error?: string };
        if (!res.ok || !d.ok) {
          setErr(d.error || "load_failed");
          return;
        }
        setList(d.items || []);
      } catch (e) {
        setErr(e instanceof Error ? e.message : "load_failed");
      }
    }
    setOpen((o) => !o);
  }

  return (
    <div className="space-y-2">
      <Button type="button" variant="outline" size="sm" onClick={() => void toggle()}>
        <ImageIcon className="mr-1.5 h-4 w-4" />
        {open ? "Hide" : mode === "publicPath" ? "Pick from" : "Insert from"} media
      </Button>
      {open && (
        <div className="max-h-56 space-y-1.5 overflow-y-auto rounded-acepCard border border-slate-200 bg-white p-2 text-sm shadow-sm">
          {err && <p className="text-red-600">{err}</p>}
          {!err && (list || []).map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => {
                if (mode === "publicPath") {
                  if (m.kind === "IMAGE") onInsert(m.publicPath);
                  else onInsert(m.absoluteUrl);
                } else {
                  const safe = m.originalName.replace(/[[\]]/g, " ");
                  const md =
                    m.kind === "IMAGE"
                      ? `![${safe}](${m.absoluteUrl})`
                      : `[${safe}](${m.absoluteUrl})`;
                  onInsert(md);
                }
                setOpen(false);
              }}
              className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-xs text-slate-800 hover:bg-slate-100"
            >
              <span className="h-8 w-10 shrink-0 overflow-hidden rounded border bg-slate-50 text-center text-[10px] text-slate-500">
                {m.kind === "IMAGE" ? <img src={m.publicPath} alt="" className="h-full w-full object-cover" /> : m.kind.slice(0, 4)}
              </span>
              <span className="line-clamp-2 min-w-0 flex-1">{m.originalName}</span>
            </button>
          ))}
          {!err && (list || []).length === 0 && <p className="px-1 text-slate-500">No files yet. Upload in Media library.</p>}
        </div>
      )}
    </div>
  );
}
