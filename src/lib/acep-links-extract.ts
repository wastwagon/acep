import * as cheerio from "cheerio";

export type AcepLink = {
  href: string;
  text?: string;
};

const DOWNLOAD_EXTENSIONS = ["pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "zip"] as const;

function cleanText(s: string): string {
  return s.replace(/\s+/g, " ").trim();
}

function decodeHtmlEntities(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

export function normalizeAcepAssetHref(href: string): string {
  const h = href.trim();
  if (!h) return h;

  // root-relative WP assets
  if (h.startsWith("/wp-content/") || h.startsWith("/wp-includes/")) return `/acep-assets${h}`;

  // absolute WP assets on acep.africa (http/https)
  const m = h.match(/^https?:\/\/(www\.)?acep\.africa(\/wp-(content|includes)\/.+)$/i);
  if (m?.[2]) return `/acep-assets${m[2]}`;

  return h;
}

function looksLikeDownload(href: string): boolean {
  const h = href.toLowerCase();
  return DOWNLOAD_EXTENSIONS.some((ext) => h.includes(`.${ext}`));
}

export function extractDownloadLinks(html: string): AcepLink[] {
  const $ = cheerio.load(html);
  const main = $("#content").length ? $("#content") : $("main").length ? $("main") : $("body");

  const out: AcepLink[] = [];
  main.find("a").each((_i, el) => {
    const href = ($(el).attr("href") || "").trim();
    if (!href) return;
    if (!looksLikeDownload(href)) return;
    const text = cleanText($(el).text()) || undefined;
    out.push({ href: normalizeAcepAssetHref(href), text });
  });

  const seen = new Set<string>();
  return out.filter((l) => {
    if (!l.href) return false;
    if (seen.has(l.href)) return false;
    seen.add(l.href);
    return true;
  });
}

export function extractTextLinks(html: string, opts: { includeInternal?: boolean } = {}): AcepLink[] {
  const $ = cheerio.load(html);
  const main = $("#content").length ? $("#content") : $("main").length ? $("main") : $("body");
  const out: AcepLink[] = [];

  main.find("a").each((_i, el) => {
    const href = ($(el).attr("href") || "").trim();
    if (!href) return;

    // Skip download links here (use extractDownloadLinks)
    if (looksLikeDownload(href)) return;

    const text = cleanText($(el).text()) || undefined;
    if (!text) return;

    // Filter internal hash links unless explicitly allowed
    if (!opts.includeInternal && href.startsWith("#")) return;

    out.push({ href: normalizeAcepAssetHref(href), text });
  });

  const seen = new Set<string>();
  return out.filter((l) => {
    if (!l.href) return false;
    const key = `${l.text || ""}::${l.href}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function toYouTubeEmbed(url: string): string | undefined {
  const u = decodeHtmlEntities(url.trim())
    .replace(/\\\//g, "/");

  // youtu.be/<id>
  const short = u.match(/^https?:\/\/youtu\.be\/([A-Za-z0-9_-]{6,})/i);
  if (short) return `https://www.youtube.com/embed/${short[1]}`;

  // youtube.com/watch?v=<id>
  const watch = u.match(/^https?:\/\/(www\.)?youtube\.com\/watch\?(.+)$/i);
  if (watch) {
    try {
      const parsed = new URL(u);
      const id = parsed.searchParams.get("v");
      if (!id) return;
      return `https://www.youtube.com/embed/${id}`;
    } catch {
      return;
    }
  }

  // already embed
  const embed = u.match(/^https?:\/\/(www\.)?youtube\.com\/embed\/([A-Za-z0-9_-]{6,})/i);
  if (embed) return `https://www.youtube.com/embed/${embed[2]}`;

  return;
}

export function extractYouTubeEmbedsFromHtml(html: string): string[] {
  const embeds: string[] = [];

  // 1) iframe embeds
  const $ = cheerio.load(html);
  const main = $("#content").length ? $("#content") : $("main").length ? $("main") : $("body");
  main.find("iframe").each((_i, el) => {
    const src = ($(el).attr("src") || "").trim();
    if (!src) return;
    const embed = toYouTubeEmbed(src);
    if (embed) embeds.push(embed);
  });

  // 2) Elementor video widgets store youtube_url in data-settings (HTML-encoded JSON)
  const re = /youtube_url&quot;:&quot;([^"]+?)&quot;/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    const embed = toYouTubeEmbed(m[1]);
    if (embed) embeds.push(embed);
  }

  const seen = new Set<string>();
  return embeds.filter((e) => {
    if (seen.has(e)) return false;
    seen.add(e);
    return true;
  });
}

