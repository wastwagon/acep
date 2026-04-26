"use client";

import { useRouter } from "next/navigation";
import { useState, useRef, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { InsertFromMediaButton } from "@/components/admin/insert-from-media-button";

type PostStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export function PostForm({
  mode,
  postId,
  initial,
}: {
  mode: "create" | "edit";
  postId?: string;
  initial?: { title: string; slug: string; excerpt: string; content: string; status: PostStatus };
}) {
  const router = useRouter();
  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [excerpt, setExcerpt] = useState(initial?.excerpt ?? "");
  const [content, setContent] = useState(initial?.content ?? "");
  const [status, setStatus] = useState<PostStatus>(initial?.status ?? "DRAFT");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);

  function insertIntoContent(text: string) {
    const el = contentRef.current;
    const a = el?.selectionStart ?? content.length;
    const b = el?.selectionEnd ?? content.length;
    const before = content.slice(0, a);
    const after = content.slice(b);
    const sep = before && !before.endsWith("\n") && text ? "\n\n" : before ? "" : "";
    const next = before + sep + text + after;
    setContent(next);
    const pos = (before + sep + text).length;
    if (el) {
      requestAnimationFrame(() => {
        el.focus();
        el.setSelectionRange(pos, pos);
      });
    }
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const payload = { title, slug, excerpt, content, status };
      const url = mode === "create" ? "/api/admin/posts" : `/api/admin/posts/${postId}`;
      const method = mode === "create" ? "POST" : "PATCH";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string; postId?: string };
      if (!res.ok || !data.ok) {
        setError(data.error || "Save failed.");
        return;
      }
      const target = mode === "create" ? `/admin/posts/${data.postId}` : `/admin/posts/${postId}`;
      router.replace(target);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "request_failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-800">Title</label>
        <input
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-acepBtn border border-slate-300 px-3 py-2 text-sm outline-none focus:border-acep-primary focus:ring-2 focus:ring-acep-primary/30"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-800">Slug</label>
        <input
          required
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="your-post-slug"
          className="w-full rounded-acepBtn border border-slate-300 px-3 py-2 text-sm outline-none focus:border-acep-primary focus:ring-2 focus:ring-acep-primary/30"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-800">Excerpt</label>
        <textarea
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          rows={2}
          className="w-full rounded-acepBtn border border-slate-300 px-3 py-2 text-sm outline-none focus:border-acep-primary focus:ring-2 focus:ring-acep-primary/30"
        />
      </div>
      <div>
        <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
          <label className="text-sm font-medium text-slate-800">Content</label>
          <InsertFromMediaButton onInsert={insertIntoContent} />
        </div>
        <p className="mb-1 text-xs text-slate-500">Markdown is supported. Use the media list to drop files from the library.</p>
        <textarea
          ref={contentRef}
          required
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={12}
          className="w-full rounded-acepBtn border border-slate-300 px-3 py-2 text-sm font-mono outline-none focus:border-acep-primary focus:ring-2 focus:ring-acep-primary/30"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-800">Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as PostStatus)}
          className="w-full rounded-acepBtn border border-slate-300 px-3 py-2 text-sm outline-none focus:border-acep-primary focus:ring-2 focus:ring-acep-primary/30"
        >
          <option value="DRAFT">Draft</option>
          <option value="PUBLISHED">Published</option>
          <option value="ARCHIVED">Archived</option>
        </select>
      </div>

      {error && <p className="text-sm font-medium text-red-700">{error}</p>}
      <div className="flex gap-2">
        <Button type="submit" disabled={busy}>
          {busy ? "Saving..." : mode === "create" ? "Create post" : "Save changes"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
