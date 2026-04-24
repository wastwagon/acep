import * as cheerio from "cheerio";

export type AcepPhotoGalleryItem = {
  imageSrc: string;
  href?: string;
};

export type AcepVideoEmbedItem = {
  key: string;
  src: string;
  title?: string;
};

function cleanText(s: string): string {
  return s.replace(/\s+/g, " ").trim();
}

function normalizeAssetSrc(raw: string): string | undefined {
  const s = raw.trim();
  if (!s) return;

  // Normalize protocol-relative
  const withProto = s.startsWith("//") ? `https:${s}` : s;

  // Root-relative WP paths
  if (withProto.startsWith("/wp-content/") || withProto.startsWith("/wp-includes/")) {
    return `/acep-assets${withProto}`;
  }

  // Absolute ACEP WP paths
  const patterns = [
    "https://acep.africa/wp-content/",
    "http://acep.africa/wp-content/",
    "https://www.acep.africa/wp-content/",
    "http://www.acep.africa/wp-content/",
    "https://acep.africa/wp-includes/",
    "http://acep.africa/wp-includes/",
    "https://www.acep.africa/wp-includes/",
    "http://www.acep.africa/wp-includes/",
  ];

  for (const p of patterns) {
    if (withProto.startsWith(p)) {
      const rest = withProto.slice(withProto.indexOf("/wp-"));
      return `/acep-assets${rest}`;
    }
  }

  return withProto;
}

export function extractPrimaryHeading(html: string): string | undefined {
  const $ = cheerio.load(html);

  const main =
    $("#content").length ? $("#content") :
    $("main").length ? $("main") :
    $("body");

  const candidates = [
    main.find("h1").first().text(),
    main.find(".section_title .title").first().text(),
    main.find("h2").first().text(),
    main.find("h3").first().text(),
    $("title").first().text(),
  ].map(cleanText).filter(Boolean);

  if (candidates.length === 0) return;

  // The <title> snapshots sometimes end with " -"
  return candidates[0].replace(/\s+-\s*$/, "").trim();
}

export function extractPhotoGalleryItems(html: string): AcepPhotoGalleryItem[] {
  const $ = cheerio.load(html);

  const main =
    $("#content").length ? $("#content") :
    $("main").length ? $("main") :
    $("body");

  const items: AcepPhotoGalleryItem[] = [];

  // The ACEP photo gallery page contains a small set of preview images linking to Flickr albums.
  main.find(".g_box a img, .g_box img").each((_i, el) => {
    const rawSrc = $(el).attr("src") || $(el).attr("data-src") || $(el).attr("data-lazyload") || "";
    const imageSrc = normalizeAssetSrc(rawSrc);
    if (!imageSrc) return;

    // Skip known placeholders/icons
    if (imageSrc.includes("dummy.png")) return;

    const a = $(el).closest("a");
    const href = a.attr("href")?.trim() || undefined;
    items.push({ imageSrc, href });
  });

  // De-dup by image src
  const seen = new Set<string>();
  return items.filter((it) => {
    if (!it.imageSrc) return false;
    if (seen.has(it.imageSrc)) return false;
    seen.add(it.imageSrc);
    return true;
  });
}

function extractYouTubeKey(src: string): string | undefined {
  try {
    const u = new URL(src);
    if (u.hostname !== "www.youtube.com" && u.hostname !== "youtube.com") return;
    const parts = u.pathname.split("/").filter(Boolean);
    const idx = parts.indexOf("embed");
    const id = idx >= 0 ? parts[idx + 1] : undefined;
    return id || src;
  } catch {
    return;
  }
}

export function extractVideoEmbeds(html: string): AcepVideoEmbedItem[] {
  const $ = cheerio.load(html);

  const main =
    $("#content").length ? $("#content") :
    $("main").length ? $("main") :
    $("body");

  const items: AcepVideoEmbedItem[] = [];

  main.find("iframe").each((_i, el) => {
    const src = ($(el).attr("src") || "").trim();
    if (!src) return;
    if (!src.includes("youtube.com/embed/")) return;

    const key = extractYouTubeKey(src) || src;
    const title = cleanText($(el).attr("title") || "") || undefined;
    items.push({ key, src, title });
  });

  // De-dup by key
  const seen = new Set<string>();
  return items.filter((it) => {
    if (seen.has(it.key)) return false;
    seen.add(it.key);
    return true;
  });
}

