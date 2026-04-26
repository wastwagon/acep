import {
  getAcepSnapshotByUrl,
  readAcepSnapshotHtml,
  normalizeAcepUrl,
} from "@/lib/acep-snapshots";
import type { AcepSnapshotEntry } from "@/lib/acep-snapshots";
import { extractPageIntro } from "@/lib/acep-page-extract";
import { extractAcepMainContentHtml } from "@/lib/acep-content";
import { getCmsContentMapCached } from "@/lib/cms-content-public";
import { pickHeroWithCms } from "@/lib/marketing-cms-hero";
import { getMarketingPageByAcepUrl } from "@/lib/marketing-page-db";
import { getMarketingHubByAcepUrl } from "@/lib/marketing-hub-db";
import {
  getProseBuiltin,
  getHubBuiltin,
  PH,
  BUILTIN_EVENT_ITEMS,
  BUILTIN_RADAR_POSTS,
  BUILTIN_ANNUAL_POSTS,
  type MarketingProse,
  type MarketingHub,
} from "@/lib/marketing-builtin";
import { extractListingItems } from "@/lib/acep-extract";
import { convertAcepListItemsToPosts } from "@/lib/data/post-converters";
import { extractYouTubeEmbedsFromHtml } from "@/lib/acep-links-extract";
import { extractDownloadLinks } from "@/lib/acep-links-extract";
import { extractTextLinks } from "@/lib/acep-links-extract";
import {
  extractPhotoGalleryItems,
  extractPrimaryHeading,
  extractVideoEmbeds,
  type AcepPhotoGalleryItem,
} from "@/lib/acep-media-extract";
import type { AcepListItem } from "@/lib/acep-extract";
import type { Post } from "@/lib/data/post-types";

function snapshotOk(e: AcepSnapshotEntry | null | undefined): e is AcepSnapshotEntry & { savedAs: string } {
  return Boolean(e && e.status === 200 && e.savedAs);
}

export function localWpImage(src?: string | null): string | undefined {
  if (!src) return undefined;
  if (src.startsWith("/placeholders/")) return src;
  return src
    .replace("https://acep.africa/wp-content/", "/acep-assets/wp-content/")
    .replace("http://acep.africa/wp-content/", "/acep-assets/wp-content/");
}

function pickSeoDescription(intro: string, contentHtml: string, built: MarketingProse | null) {
  const text = (intro || "").trim() || contentHtml.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  if (text.length >= 40) return text.slice(0, 160);
  return (built?.meta.description ?? text).slice(0, 160);
}

export type ResolvedProsePage = {
  source: "database" | "snapshot" | "builtin";
  /** True when `bodyHtml` in CmsMarketingPage is non-empty and used for the main body. */
  contentFromDatabase: boolean;
  title: string;
  intro: string;
  heroImage: string;
  contentHtml: string;
  seoTitle: string;
  seoDescription: string;
};

function mergeProseToResolved(
  key: string,
  built: MarketingProse | null,
  db: { title: string; intro: string; bodyHtml: string; metaTitle: string | null; metaDescription: string | null } | null,
  snap: { title?: string; intro?: string; contentHtml?: string; heroImage?: string } | null,
  cms: Record<string, string>
): ResolvedProsePage | null {
  const hasDb = Boolean(
    db &&
      (db.bodyHtml?.trim() || db.title?.trim() || db.intro?.trim() || db.metaTitle?.trim() || db.metaDescription?.trim())
  );
  if (!built && !snap && !hasDb) {
    return null;
  }
  const hasDbBody = Boolean(db?.bodyHtml?.trim());
  const t = (db?.title?.trim() || snap?.title || built?.title || "ACEP").trim();
  const i = (db?.intro?.trim() || snap?.intro || built?.intro || "").trim();
  const c = hasDbBody
    ? (db?.bodyHtml || "")
    : (snap?.contentHtml?.trim() || built?.contentHtml || "");
  const h = pickHeroWithCms(
    localWpImage(snap?.heroImage) || built?.heroImage || PH.hero,
    cms,
    key
  );
  const seoTitle = db?.metaTitle?.trim() || built?.meta.title || `${t} | ACEP`;
  const seoDescription = db?.metaDescription?.trim() || pickSeoDescription(i, c, built);
  const source: ResolvedProsePage["source"] = hasDbBody ? "database" : snap ? "snapshot" : "builtin";
  return {
    source,
    contentFromDatabase: hasDbBody,
    title: t,
    intro: i,
    heroImage: h,
    contentHtml: c,
    seoTitle,
    seoDescription,
  };
}

/**
 * Prose + hero + body: CmsMarketingPage (when set) overrides text; then snapshot; then built-in.
 */
export async function resolveProsePage(url: string): Promise<ResolvedProsePage | null> {
  const key = normalizeAcepUrl(url);
  const built = getProseBuiltin(key);
  const [cms, db, entry] = await Promise.all([
    getCmsContentMapCached(),
    getMarketingPageByAcepUrl(key),
    getAcepSnapshotByUrl(url),
  ]);

  let snap: { title?: string; intro?: string; contentHtml?: string; heroImage?: string } | null = null;
  if (snapshotOk(entry)) {
    const html = await readAcepSnapshotHtml(entry.savedAs);
    const { title, intro, heroImage } = extractPageIntro(html);
    let contentHtml = extractAcepMainContentHtml(html);
    if (!contentHtml?.trim() && built) {
      contentHtml = built.contentHtml;
    }
    snap = { title, intro, heroImage, contentHtml: contentHtml || "" };
  }

  return mergeProseToResolved(key, built, db, snap, cms);
}

export type ResolvedHubPage = {
  source: "database" | "snapshot" | "builtin";
  title: string;
  intro: string;
  seoTitle: string;
  seoDescription: string;
};

function pickHubSeoDescription(intro: string, built: MarketingHub | null) {
  const i = intro.trim();
  if (i.length >= 40) return i.slice(0, 160);
  return (built?.meta.description ?? i).slice(0, 160);
}

function mergeHubResolved(
  built: MarketingHub | null,
  db: { title: string; intro: string; metaTitle: string | null; metaDescription: string | null } | null,
  snap: { title?: string; intro?: string } | null,
  fromSnapshot: boolean
): ResolvedHubPage | null {
  const hasDb = Boolean(
    db &&
      (db.title?.trim() || db.intro?.trim() || db.metaTitle?.trim() || db.metaDescription?.trim())
  );
  if (!built && !fromSnapshot && !hasDb) {
    return null;
  }
  const t = (db?.title?.trim() || snap?.title || built?.title || "ACEP").trim();
  const i = (db?.intro?.trim() || snap?.intro || built?.intro || "").trim();
  const seoTitle = db?.metaTitle?.trim() || built?.meta.title || `${t} | ACEP`;
  const seoDescription = db?.metaDescription?.trim() || pickHubSeoDescription(i, built);

  let source: ResolvedHubPage["source"];
  if (hasDb) source = "database";
  else if (fromSnapshot) source = "snapshot";
  else source = "builtin";

  return { source, title: t, intro: i, seoTitle, seoDescription };
}

/**
 * Hub index title/intro/SEO: CmsMarketingHub overrides snapshot, then built-in.
 */
export async function resolveHubPage(url: string): Promise<ResolvedHubPage | null> {
  const key = normalizeAcepUrl(url);
  const built = getHubBuiltin(key);
  const [db, entry] = await Promise.all([getMarketingHubByAcepUrl(key), getAcepSnapshotByUrl(url)]);

  let snap: { title?: string; intro?: string } | null = null;
  let fromSnapshot = false;
  if (snapshotOk(entry)) {
    fromSnapshot = true;
    const html = await readAcepSnapshotHtml(entry.savedAs);
    const { title, intro } = extractPageIntro(html);
    snap = { title, intro };
  }

  return mergeHubResolved(built, db, snap, fromSnapshot);
}

export type ResolvedEventListing = {
  items: AcepListItem[];
  pageTitle: string;
  source: "snapshot" | "builtin" | "mixed";
};

export async function resolveEventListingPage(): Promise<ResolvedEventListing> {
  const entry = await getAcepSnapshotByUrl("https://acep.africa/events/");
  if (snapshotOk(entry)) {
    const html = await readAcepSnapshotHtml(entry.savedAs);
    const items = extractListingItems(html);
    const tMatch = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
    const pageTitle = tMatch?.[1]?.replace(/<[^>]+>/g, "").trim() || "Events";
    if (items.length > 0) return { items, pageTitle, source: "snapshot" };
    return { items: BUILTIN_EVENT_ITEMS, pageTitle, source: "mixed" };
  }
  return { items: BUILTIN_EVENT_ITEMS, pageTitle: "Events", source: "builtin" };
}

export type ResolvedLibraryListing = {
  items: Post[];
  source: "snapshot" | "builtin" | "mixed";
};

export async function resolveAnnualReportsListing(): Promise<ResolvedLibraryListing> {
  const entry = await getAcepSnapshotByUrl("https://acep.africa/annual-reports/");
  if (snapshotOk(entry)) {
    const html = await readAcepSnapshotHtml(entry.savedAs);
    const raw = extractListingItems(html);
    const items = convertAcepListItemsToPosts(raw, "Annual Reports");
    if (items.length > 0) return { items, source: "snapshot" };
    return { items: BUILTIN_ANNUAL_POSTS, source: "mixed" };
  }
  return { items: BUILTIN_ANNUAL_POSTS, source: "builtin" };
}

export async function resolveRadarListing(): Promise<ResolvedLibraryListing> {
  const entry = await getAcepSnapshotByUrl("https://acep.africa/radar/");
  if (snapshotOk(entry)) {
    const html = await readAcepSnapshotHtml(entry.savedAs);
    const raw = extractListingItems(html);
    const items = convertAcepListItemsToPosts(raw, "ACEP Radar");
    if (items.length > 0) return { items, source: "snapshot" };
    return { items: BUILTIN_RADAR_POSTS, source: "mixed" };
  }
  return { items: BUILTIN_RADAR_POSTS, source: "builtin" };
}

export type Fec2025Resolved = ResolvedProsePage & {
  downloads: ReturnType<typeof extractDownloadLinks>;
  videos: string[];
};

export async function resolveFec2025Page(): Promise<Fec2025Resolved | null> {
  const base = await resolveProsePage("https://acep.africa/fec-2025/");
  if (!base) return null;
  const entry = await getAcepSnapshotByUrl("https://acep.africa/fec-2025/");
  let downloads: ReturnType<typeof extractDownloadLinks> = [];
  let videos: string[] = [];
  if (snapshotOk(entry)) {
    const html = await readAcepSnapshotHtml(entry.savedAs);
    downloads = extractDownloadLinks(html);
    videos = extractYouTubeEmbedsFromHtml(html).slice(0, 12);
  }
  return { ...base, downloads, videos };
}

export type EiccgResolved = ResolvedProsePage & {
  downloads: ReturnType<typeof extractDownloadLinks>;
  applyLink?: { text: string; href: string };
};

export async function resolveEiccgPage(): Promise<EiccgResolved | null> {
  const base = await resolveProsePage("https://acep.africa/eiccg-fund/");
  if (!base) return null;
  const entry = await getAcepSnapshotByUrl("https://acep.africa/eiccg-fund/");
  if (!snapshotOk(entry)) {
    return {
      ...base,
      downloads: [],
      applyLink: { text: "Enquire about the fund", href: "/programs" },
    };
  }
  const html = await readAcepSnapshotHtml(entry.savedAs);
  const downloads = extractDownloadLinks(html);
  const links = extractTextLinks(html);
  const apply = links.find((l) => (l.text || "").toLowerCase().includes("apply")) || links[0];
  return {
    ...base,
    downloads,
    applyLink: apply
      ? { text: apply.text || "More information", href: apply.href }
      : { text: "View programmes", href: "/programs" },
  };
}

export type FecDownloadPageResolved = {
  title: string;
  heroImage: string;
  firstDownload: { text: string; href: string } | null;
  source: "snapshot" | "builtin";
  seoTitle: string;
  seoDescription: string;
};

export async function resolveFecBrochurePage(): Promise<FecDownloadPageResolved | null> {
  const u = "https://acep.africa/fec-brochure/";
  const cms = await getCmsContentMapCached();
  const entry = await getAcepSnapshotByUrl(u);
  if (snapshotOk(entry)) {
    const html = await readAcepSnapshotHtml(entry.savedAs);
    const { title, heroImage } = extractPageIntro(html);
    const downloads = extractDownloadLinks(html);
    const first = downloads[0];
    return {
      title: (title || "Brochure").trim(),
      heroImage: pickHeroWithCms(localWpImage(heroImage) || PH.hero, cms, u),
      firstDownload: first ? { text: first.text || "Download", href: first.href } : null,
      source: "snapshot",
      seoTitle: "FEC Brochure | ACEP",
      seoDescription: "Future of Energy Conference brochure and key downloads.",
    };
  }
  return {
    title: "Future of Energy Conference — Brochure",
    heroImage: pickHeroWithCms(PH.hero, cms, u),
    firstDownload: { text: "Browse FEC materials", href: "/fec-resource-centre" },
    source: "builtin",
    seoTitle: "FEC Brochure | ACEP",
    seoDescription: "Download the FEC brochure when the file is available in the CMS, or open the FEC Resource Centre.",
  };
}

export async function resolveFecResourceCentrePage(): Promise<{
  title: string;
  intro: string;
  heroImage: string;
  downloads: ReturnType<typeof extractDownloadLinks>;
  source: "snapshot" | "builtin";
  seoTitle: string;
  seoDescription: string;
} | null> {
  const u = "https://acep.africa/fec-resource-centre/";
  const cms = await getCmsContentMapCached();
  const entry = await getAcepSnapshotByUrl(u);
  if (snapshotOk(entry)) {
    const html = await readAcepSnapshotHtml(entry.savedAs);
    const { title, intro, heroImage } = extractPageIntro(html);
    return {
      title: (title || "FEC Resource Centre").trim(),
      intro: (intro || "").trim(),
      heroImage: pickHeroWithCms(localWpImage(heroImage) || PH.hero, cms, u),
      downloads: extractDownloadLinks(html).slice(0, 20),
      source: "snapshot",
      seoTitle: "FEC Resource Centre | ACEP",
      seoDescription: "Reports, downloads, and resources from the Future of Energy Conference.",
    };
  }
  return {
    title: "FEC Resource Centre",
    intro: "Curated reports and downloads from the Future of Energy Conference. Add PDFs and links via Admin when ready.",
    heroImage: pickHeroWithCms(PH.hero, cms, u),
    downloads: [],
    source: "builtin",
    seoTitle: "FEC Resource Centre | ACEP",
    seoDescription: "Future of Energy Conference — publications and downloads (placeholder layout).",
  };
}

export type PhotoGalleryResolved = {
  title: string;
  items: AcepPhotoGalleryItem[];
  source: "snapshot" | "builtin" | "mixed";
};

const PLACEHOLDER_PHOTOS: AcepPhotoGalleryItem[] = Array.from({ length: 8 }, (_, i) => ({
  imageSrc: PH.square,
  href: i % 2 === 0 ? "/resource-centre" : "/events",
}));

export async function resolvePhotoGalleryPage(): Promise<PhotoGalleryResolved> {
  const entry = await getAcepSnapshotByUrl("https://acep.africa/photo-gallery/");
  if (snapshotOk(entry)) {
    const html = await readAcepSnapshotHtml(entry.savedAs);
    const title = extractPrimaryHeading(html) || "Photo Gallery";
    const items = extractPhotoGalleryItems(html);
    if (items.length > 0) return { title, items, source: "snapshot" };
    return { title, items: PLACEHOLDER_PHOTOS, source: "mixed" };
  }
  return { title: "Photo Gallery", items: PLACEHOLDER_PHOTOS, source: "builtin" };
}

export async function resolveVideoGalleryPage() {
  const entry = await getAcepSnapshotByUrl("https://acep.africa/video-gallery/");
  if (snapshotOk(entry)) {
    const html = await readAcepSnapshotHtml(entry.savedAs);
    const title = extractPrimaryHeading(html) || "Video Gallery";
    const items = extractVideoEmbeds(html);
    if (items.length > 0) return { title, items, source: "snapshot" as const };
  }
  return { title: "Video Gallery", items: [] as ReturnType<typeof extractVideoEmbeds>, source: "builtin" as const };
}

export async function resolveResourceCentrePreviews() {
  const a = await getAcepSnapshotByUrl("https://acep.africa/research-and-policy-papers/");
  const b = await getAcepSnapshotByUrl("https://acep.africa/news-blog-posts/");
  const out: Array<{ heading: string; items: AcepListItem[] }> = [];
  for (const [e, defHeading] of [
    [a, "Research and Policy Papers"],
    [b, "News & Blog Posts"],
  ] as const) {
    if (snapshotOk(e)) {
      const h = await readAcepSnapshotHtml(e.savedAs);
      const items = extractListingItems(h).slice(0, 5);
      const headingMatch = h.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
      const heading = headingMatch?.[1]?.replace(/<[^>]+>/g, "").trim() || defHeading;
      out.push({ heading, items });
    } else {
      out.push({ heading: defHeading, items: [] });
    }
  }
  return out;
}
