import path from "node:path";
import { readFile } from "node:fs/promises";

export type AcepSnapshotEntry = {
  url: string;
  status: number | "error";
  contentType?: string;
  savedAs?: string;
};

export type AcepSnapshotIndex = {
  pages: AcepSnapshotEntry[];
};

let cachedIndex: AcepSnapshotIndex | null = null;

function contentRoot(): string {
  // repo root in dev/prod server runtimes
  return path.resolve(process.cwd(), "content", "acep");
}

export async function loadAcepIndex(): Promise<AcepSnapshotIndex> {
  if (cachedIndex) return cachedIndex;
  const idxPath = path.join(contentRoot(), "index.json");
  const raw = await readFile(idxPath, "utf8");
  cachedIndex = JSON.parse(raw) as AcepSnapshotIndex;
  return cachedIndex;
}

export function acepUrlFromSlug(slug: string[]): string {
  const p = slug.length ? `${slug.join("/")}/` : "";
  return `https://acep.africa/${p}`;
}

export async function getAcepSnapshotByUrl(url: string): Promise<AcepSnapshotEntry | null> {
  const idx = await loadAcepIndex();
  const normalized = normalizeAcepUrl(url);
  return idx.pages.find((p) => normalizeAcepUrl(p.url) === normalized) ?? null;
}

export async function readAcepSnapshotHtml(savedAs: string): Promise<string> {
  const abs = path.join(contentRoot(), savedAs);
  return await readFile(abs, "utf8");
}

export function normalizeAcepUrl(url: string): string {
  try {
    const u = new URL(url);
    u.protocol = "https:";
    // normalize trailing slash on pathname
    if (!u.pathname.endsWith("/")) u.pathname = `${u.pathname}/`;
    // drop default ports etc
    return u.toString();
  } catch {
    return url;
  }
}

export function transformAcepHtmlForLocalAssets(
  html: string,
  opts?: { extractBody?: boolean; baseTargetTop?: boolean; hideAcepChrome?: boolean }
): string {
  // 1) Prefer local asset route for WordPress asset paths.
  //    This fixes missing images/PDFs that are not only in uploads (themes/plugins/etc).
  const wpAssetPrefixes = [
    "https://acep.africa/wp-content/",
    "http://acep.africa/wp-content/",
    "https://acep.africa/wp-includes/",
    "http://acep.africa/wp-includes/",
  ];
  let out = html;
  for (const p of wpAssetPrefixes) {
    out = out.replaceAll(p, "/acep-assets/" + p.split("/").slice(3).join("/"));
    // Example:
    //  https://acep.africa/wp-content/… -> /acep-assets/wp-content/…
    //  https://acep.africa/wp-includes/… -> /acep-assets/wp-includes/…
  }

  // 2) Keep internal page links inside this platform.
  //    Turn absolute ACEP links into root-relative links. Our middleware will route
  //    unknown paths to the ACEP snapshot renderer automatically.
  out = out.replaceAll("https://acep.africa/", "/");
  out = out.replaceAll("http://acep.africa/", "/");

  // 3) Strip scripts to avoid WordPress JS interfering with React
  out = out.replace(/<script[\s\S]*?<\/script>/gi, "");

  // 4) For iframe rendering, ensure links open in the top window (not inside the iframe)
  if (opts?.baseTargetTop) {
    if (/<head[^>]*>/i.test(out)) {
      out = out.replace(/<head([^>]*)>/i, "<head$1><base target=\"_top\" />");
    }
  }

  // 4b) Hide ACEP theme chrome (header/menu/footer) when embedding inside our app.
  // This keeps the page content identical, but avoids double headers and conflicting layout.
  if (opts?.hideAcepChrome) {
    const css = `
      <style>
        /* Hide WordPress theme navigation + loaders when embedded */
        header.gm-navbar,
        header.default_header,
        aside.gm-navigation-drawer,
        .gm-padding,
        .loader-wrap,
        footer,
        .site-footer,
        .elementor-location-footer {
          display: none !important;
        }
        /* Remove extra top spacing when headers are hidden */
        body { margin: 0 !important; padding: 0 !important; }
        #page, .site, .page_wapper { padding-top: 0 !important; margin-top: 0 !important; }
      </style>
    `.trim();

    if (/<head[^>]*>/i.test(out)) {
      out = out.replace(/<\/head>/i, `${css}</head>`);
    }
  }

  // 5) Extract <body> content (default true for inline rendering)
  const extractBody = opts?.extractBody ?? true;
  if (extractBody) {
    const bodyMatch = out.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    if (bodyMatch?.[1]) {
      out = bodyMatch[1];
    }
  }

  return out;
}

