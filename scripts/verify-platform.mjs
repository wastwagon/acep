/**
 * Verify platform coverage and key download assets.
 *
 * - Extracts main menu links from a scraped ACEP page snapshot
 * - Checks each menu pathname is either:
 *   (a) a template route (explicit page.tsx), OR
 *   (b) a snapshot-fallback route (exists in src/lib/acep-route-map.ts)
 * - Verifies key download assets referenced by a few important pages exist locally
 *
 * Output:
 *   - content/acep/platform-verify.json
 *   - content/acep/platform-verify.md
 */

import { readFile, writeFile, access } from "node:fs/promises";
import path from "node:path";
import * as cheerio from "cheerio";

const ROOT = process.cwd();

const MENU_SNAPSHOT = path.resolve(ROOT, "content", "acep", "snapshots", "acep.africa", "photo-gallery", "index.html");
const ROUTE_MAP = path.resolve(ROOT, "src", "lib", "acep-route-map.ts");
const MIDDLEWARE = path.resolve(ROOT, "src", "middleware.ts");
const APP_DIR = path.resolve(ROOT, "src", "app");
const ASSET_ROOT = path.resolve(ROOT, "content", "acep", "assets", "acep.africa");

function normalizeRoutePath(p) {
  if (!p) return "/";
  if (!p.startsWith("/")) p = `/${p}`;
  if (p.length > 1 && p.endsWith("/")) p = p.slice(0, -1);
  return p;
}

function toAcepPathsKey(routePath) {
  // ACEP_PATHS is stored with trailing slash (except root excluded)
  if (routePath === "/") return "/";
  return routePath.endsWith("/") ? routePath : `${routePath}/`;
}

function extractReservedPrefixes(tsSource) {
  const m = tsSource.match(/const\s+RESERVED_PREFIXES\s*=\s*\[([\s\S]*?)\];/m);
  if (!m) return [];
  const body = m[1];
  const out = [];
  const re = /"([^"]+)"/g;
  let mm;
  while ((mm = re.exec(body)) !== null) out.push(mm[1]);
  return out;
}

function hasReservedPrefix(pathname, reserved) {
  return reserved.some((p) => (p.endsWith("/") ? pathname.startsWith(p) : pathname === p || pathname.startsWith(`${p}/`)));
}

function extractAcepPaths(tsSource) {
  const out = new Set();
  const re = /"\/[^"]+\/"/g;
  let m;
  while ((m = re.exec(tsSource)) !== null) out.add(m[0].slice(1, -1)); // remove quotes
  return out;
}

async function fileExists(p) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

async function hasTemplatePage(routePath) {
  const rel = routePath === "/" ? "" : routePath.slice(1);
  const p = path.join(APP_DIR, rel, "page.tsx");
  return await fileExists(p);
}

function extractMenuLinks(html) {
  const $ = cheerio.load(html);
  const anchors = $("#menu-website-menu a").toArray();
  const items = [];

  for (const a of anchors) {
    const hrefRaw = ($(a).attr("href") || "").trim();
    const text = ($(a).text() || "").replace(/\s+/g, " ").trim();
    if (!hrefRaw || !text) continue;

    let pathname;
    if (hrefRaw.startsWith("/")) pathname = hrefRaw;
    else {
      try {
        const u = new URL(hrefRaw);
        if (u.hostname === "acep.africa" || u.hostname === "www.acep.africa") pathname = u.pathname;
      } catch {
        // ignore
      }
    }
    if (!pathname) continue;
    const routePath = normalizeRoutePath(pathname);
    items.push({ text, routePath, href: hrefRaw });
  }

  // de-dup by routePath
  const seen = new Set();
  return items.filter((it) => {
    if (seen.has(it.routePath)) return false;
    seen.add(it.routePath);
    return true;
  });
}

function extractDownloadHrefsFromHtml(html) {
  const $ = cheerio.load(html);
  const exts = [".pdf", ".docx", ".xlsx", ".doc", ".xls", ".ppt", ".pptx", ".zip"];
  const hrefs = [];

  $("a").each((_i, el) => {
    const href = ($(el).attr("href") || "").trim();
    if (!href) return;
    const h = href.toLowerCase();
    if (!exts.some((e) => h.includes(e))) return;
    hrefs.push(href);
  });

  const seen = new Set();
  return hrefs.filter((h) => {
    if (seen.has(h)) return false;
    seen.add(h);
    return true;
  });
}

function mapToLocalAssetPath(href) {
  // Supports:
  // - /acep-assets/wp-content/...
  // - /wp-content/... (should be served by middleware)
  // - https?://acep.africa/wp-content/...
  const h = href.trim();
  if (!h) return;

  if (h.startsWith("/acep-assets/")) {
    return path.join(ASSET_ROOT, h.replace("/acep-assets/", ""));
  }

  if (h.startsWith("/wp-content/") || h.startsWith("/wp-includes/")) {
    return path.join(ASSET_ROOT, h.slice(1));
  }

  const m = h.match(/^https?:\/\/(www\.)?acep\.africa\/(wp-(content|includes)\/.+)$/i);
  if (m?.[2]) return path.join(ASSET_ROOT, m[2]);

  return;
}

async function main() {
  const [menuHtml, routeMapTs, middlewareTs] = await Promise.all([
    readFile(MENU_SNAPSHOT, "utf8"),
    readFile(ROUTE_MAP, "utf8"),
    readFile(MIDDLEWARE, "utf8"),
  ]);

  const menu = extractMenuLinks(menuHtml);
  const reserved = extractReservedPrefixes(middlewareTs);
  const acepPaths = extractAcepPaths(routeMapTs);

  const coverage = [];
  for (const it of menu) {
    const isReserved = hasReservedPrefix(it.routePath, reserved);
    const template = (await hasTemplatePage(it.routePath)) || isReserved;
    const fallback = acepPaths.has(toAcepPathsKey(it.routePath));
    const status = template ? "template" : (fallback ? "snapshot-fallback" : "missing");
    coverage.push({ ...it, status });
  }

  const missingMenuRoutes = coverage.filter((c) => c.status === "missing");

  // Verify key downloadable assets exist locally for important pages
  const keyPages = [
    "fec-2025",
    "fec-brochure",
    "fec-resource-centre",
    "eiccg-fund",
    "annual-reports",
  ];

  const assetChecks = [];
  for (const slug of keyPages) {
    const snap = path.resolve(ROOT, "content", "acep", "snapshots", "acep.africa", slug, "index.html");
    let html = "";
    try {
      html = await readFile(snap, "utf8");
    } catch {
      assetChecks.push({ page: `/${slug}`, snapshot: snap, error: "snapshot_missing" });
      continue;
    }

    const hrefs = extractDownloadHrefsFromHtml(html);
    const mapped = hrefs
      .map((h) => ({ href: h, localPath: mapToLocalAssetPath(h) }))
      .filter((x) => !!x.localPath);

    const results = [];
    for (const m of mapped) {
      const exists = await fileExists(m.localPath);
      results.push({ ...m, exists });
    }

    assetChecks.push({
      page: `/${slug}`,
      downloadsFound: hrefs.length,
      mappedDownloads: results.length,
      missingDownloads: results.filter((r) => !r.exists).length,
      missing: results.filter((r) => !r.exists).slice(0, 50),
    });
  }

  const out = {
    verifiedAt: new Date().toISOString(),
    menu: {
      sourceSnapshot: path.relative(ROOT, MENU_SNAPSHOT),
      total: coverage.length,
      missing: missingMenuRoutes.length,
      missingRoutes: missingMenuRoutes,
    },
    templates: {
      reservedPrefixes: reserved,
    },
    downloads: assetChecks,
  };

  const outJson = path.resolve(ROOT, "content", "acep", "platform-verify.json");
  await writeFile(outJson, JSON.stringify(out, null, 2));

  const mdLines = [];
  mdLines.push(`# Platform verification`);
  mdLines.push(``);
  mdLines.push(`- Verified at: ${out.verifiedAt}`);
  mdLines.push(`- Menu links checked: **${out.menu.total}**`);
  mdLines.push(`- Missing menu routes: **${out.menu.missing}**`);
  mdLines.push(``);

  if (out.menu.missingRoutes.length) {
    mdLines.push(`## Missing menu routes`);
    mdLines.push(``);
    for (const r of out.menu.missingRoutes) {
      mdLines.push(`- ${r.text}: \`${r.routePath}\` (from \`${r.href}\`)`);
    }
    mdLines.push(``);
  } else {
    mdLines.push(`## Missing menu routes`);
    mdLines.push(``);
    mdLines.push(`None.`);
    mdLines.push(``);
  }

  mdLines.push(`## Download asset checks (local files)`);
  mdLines.push(``);
  for (const c of out.downloads) {
    if (c.error) {
      mdLines.push(`- **${c.page}**: snapshot missing (\`${path.relative(ROOT, c.snapshot)}\`)`);
      continue;
    }
    mdLines.push(
      `- **${c.page}**: downloadsFound=${c.downloadsFound}, mapped=${c.mappedDownloads}, missing=${c.missingDownloads}`
    );
    if (c.missingDownloads) {
      for (const m of c.missing.slice(0, 10)) {
        mdLines.push(`  - missing \`${m.localPath}\` (from \`${m.href}\`)`);
      }
    }
  }
  mdLines.push(``);

  const outMd = path.resolve(ROOT, "content", "acep", "platform-verify.md");
  await writeFile(outMd, mdLines.join("\n"));

  console.log(`[platform-verify] wrote ${path.relative(ROOT, outJson)} and ${path.relative(ROOT, outMd)}`);
}

main().catch((e) => {
  console.error(e?.stack || e);
  process.exit(1);
});

