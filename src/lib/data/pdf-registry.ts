/**
 * PDF registry: resolved local paths, slug generation, and assignment to publications.
 * Uses content/acep/extracted/pdf-resolved.json and publication sources.
 */

import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { getAllPublications } from "./posts";
import type { Post } from "./post-types";
import { slugToTitle } from "../utils/url-helpers";

const RESOLVED_PATH = join(process.cwd(), "content", "acep", "extracted", "pdf-resolved.json");

export interface ResolvedPdf {
  ref: string;
  localPath: string;
  appUrl: string;
  slug: string;
  filename: string;
  publications: Array<{
    url: string;
    title: string;
    excerpt?: string;
    linkText: string;
  }>;
}

export interface PdfRegistry {
  byRef: Map<string, ResolvedPdf>;
  bySlug: Map<string, ResolvedPdf>;
  all: ResolvedPdf[];
}

let cached: PdfRegistry | null = null;

function normalizeRef(href: string | undefined): string | null {
  if (!href || typeof href !== "string") return null;
  let p = href.trim();
  if (p.startsWith("/acep-assets/wp-content/")) p = p.slice("/acep-assets".length);
  const m = p.match(/(?:https?:\/\/(?:www\.)?acep\.africa)?(\/wp-content\/[^#?]+)/i);
  if (m) p = m[1];
  else if (!p.startsWith("/wp-content/")) return null;
  return p.slice(1);
}

function encodingVariants(relPath: string): string[] {
  const out = [relPath];
  if (relPath.includes("–")) out.push(relPath.replace(/–/g, "_E2_80_93"));
  if (relPath.includes("_E2_80_93")) out.push(relPath.replace(/_E2_80_93/g, "–"));
  return [...new Set(out)];
}

function refToSlug(ref: string): string {
  return ref
    .replace(/\//g, "--")
    .replace(/\.pdf$/i, "")
    .replace(/[^a-zA-Z0-9_\-.]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function filenameFromPath(localPath: string): string {
  const parts = localPath.split("/");
  return parts[parts.length - 1] || "document.pdf";
}

export async function loadPdfRegistry(): Promise<PdfRegistry> {
  if (cached) return cached;

  const raw = await readFile(RESOLVED_PATH, "utf-8");
  const data = JSON.parse(raw) as {
    matched?: Array<{ ref: string; localPath: string }>;
    missing?: Array<{ ref: string }>;
  };
  const matched = data.matched ?? [];

  const byRef = new Map<string, ResolvedPdf>();
  const bySlug = new Map<string, ResolvedPdf>();

  for (const { ref, localPath } of matched) {
    const slug = refToSlug(localPath);
    const appUrl = `/acep-assets/${localPath}`;
    const pdf: ResolvedPdf = {
      ref,
      localPath,
      appUrl,
      slug,
      filename: filenameFromPath(localPath),
      publications: [],
    };
    byRef.set(ref, pdf);
    for (const v of encodingVariants(ref)) {
      if (!byRef.has(v)) byRef.set(v, pdf);
    }
    bySlug.set(slug, pdf);
  }

  const publications = await getAllPublications();

  for (const pub of publications) {
    const links = pub.pdfLinks ?? [];
    for (const l of links) {
      const ref = normalizeRef(l?.url);
      if (!ref) continue;
      const pdf = byRef.get(ref);
      if (!pdf) continue;
      const existing = pdf.publications.find((p) => p.url === pub.url);
      if (existing) continue;
      pdf.publications.push({
        url: pub.url,
        title: pub.title ?? "Untitled",
        excerpt: pub.excerpt,
        linkText: (l?.text ?? "Download PDF").trim() || "Download PDF",
      });
    }
  }

  const all = [...bySlug.values()];
  cached = { byRef, bySlug, all };
  return cached;
}

export function resolvePdfRef(
  registry: PdfRegistry,
  href: string | undefined
): { localPath: string; appUrl: string; slug: string; filename: string; linkText?: string } | null {
  const ref = normalizeRef(href);
  if (!ref) return null;
  const pdf = registry.byRef.get(ref);
  if (!pdf) return null;
  return {
    localPath: pdf.localPath,
    appUrl: pdf.appUrl,
    slug: pdf.slug,
    filename: pdf.filename,
  };
}

export function getPdfBySlug(registry: PdfRegistry, slug: string): ResolvedPdf | null {
  return registry.bySlug.get(slug) ?? null;
}

export function getAllPdfs(registry: PdfRegistry): ResolvedPdf[] {
  return registry.all;
}

export interface DocumentSearchItem {
  slug: string;
  title: string;
  description: string;
  publicationTitles: string[];
}

export function getDocumentSearchItems(registry: PdfRegistry): DocumentSearchItem[] {
  return registry.all.map((p) => {
    const primary = p.publications[0];
    const known = primary?.title && primary.title.trim() && primary.title !== "Untitled";
    const title = known
      ? primary!.title
      : slugToTitle(p.slug) || p.filename.replace(/\.pdf$/i, "").replace(/[-_]/g, " ");
    const description = primary?.excerpt ?? `PDF document: ${p.filename}`;
    return {
      slug: p.slug,
      title,
      description,
      publicationTitles: p.publications.map((pub) => pub.title),
    };
  });
}

function findByRefOrVariants(registry: PdfRegistry, ref: string): ResolvedPdf | null {
  let pdf = registry.byRef.get(ref);
  if (pdf) return pdf;
  for (const v of encodingVariants(ref)) {
    pdf = registry.byRef.get(v);
    if (pdf) return pdf;
  }
  return null;
}

export function getResolvedPdfsForPublication(
  registry: PdfRegistry,
  pub: Post
): Array<{ appUrl: string; slug: string; filename: string; linkText: string }> {
  const out: Array<{ appUrl: string; slug: string; filename: string; linkText: string }> = [];
  const seen = new Set<string>();
  for (const l of pub.pdfLinks ?? []) {
    const ref = normalizeRef(l?.url);
    if (!ref || seen.has(ref)) continue;
    const pdf = findByRefOrVariants(registry, ref);
    if (!pdf) continue;
    seen.add(ref);
    const linkText = (l?.text ?? "Download PDF").trim() || "Download PDF";
    out.push({
      appUrl: pdf.appUrl,
      slug: pdf.slug,
      filename: pdf.filename,
      linkText,
    });
  }
  return out;
}
