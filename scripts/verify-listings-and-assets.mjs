/**
 * Verify listing pages and their linked detail pages + downloads.
 *
 * - Reads snapshots for listing pages (from content/acep/index.json mapping)
 * - Extracts internal ACEP detail links
 * - HEAD checks local routes for those details (http://localhost:<port>/<path>/)
 * - For each detail page, checks that downloadable assets referenced in the snapshot
 *   exist locally in content/acep/assets/acep.africa/
 *
 * Usage:
 *   node scripts/verify-listings-and-assets.mjs --port 3100 --maxPerList 25 --out content/acep/listings-verify.json
 */

import path from "node:path";
import { readFile, writeFile, access } from "node:fs/promises";
import * as cheerio from "cheerio";

const ROOT = process.cwd();
const DEFAULT_PORT = 3100;
const DEFAULT_MAX_PER_LIST = 25;
const DEFAULT_CONCURRENCY = 12;

const ASSET_ROOT = path.resolve(ROOT, "content", "acep", "assets", "acep.africa");

function parseArgs(argv) {
  const args = {
    port: DEFAULT_PORT,
    maxPerList: DEFAULT_MAX_PER_LIST,
    concurrency: DEFAULT_CONCURRENCY,
    out: "content/acep/listings-verify.json",
  };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    const next = argv[i + 1];
    if (a === "--port" && next) args.port = Number(next), i++;
    else if (a === "--maxPerList" && next) args.maxPerList = Number(next), i++;
    else if (a === "--concurrency" && next) args.concurrency = Number(next), i++;
    else if (a === "--out" && next) args.out = next, i++;
  }
  if (!Number.isFinite(args.port)) args.port = DEFAULT_PORT;
  if (!Number.isFinite(args.maxPerList) || args.maxPerList < 1) args.maxPerList = DEFAULT_MAX_PER_LIST;
  if (!Number.isFinite(args.concurrency) || args.concurrency < 1) args.concurrency = DEFAULT_CONCURRENCY;
  return args;
}

function normalizeAcepUrl(url) {
  try {
    const u = new URL(url);
    u.protocol = "https:";
    if (!u.pathname.endsWith("/")) u.pathname = `${u.pathname}/`;
    return u.toString();
  } catch {
    return url;
  }
}

function toLocalPath(href) {
  try {
    const u = new URL(href);
    if (!u.pathname.endsWith("/")) u.pathname = `${u.pathname}/`;
    return u.pathname;
  } catch {
    // already a pathname?
    if (!href.startsWith("/")) return null;
    return href.endsWith("/") ? href : `${href}/`;
  }
}

async function fileExists(p) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

async function head(url) {
  try {
    const res = await fetch(url, { method: "HEAD", redirect: "follow" });
    return { status: res.status };
  } catch (e) {
    return { status: "error", error: String(e?.message || e) };
  }
}

function extractInternalLinksFromListing(html) {
  const $ = cheerio.load(html);
  const main = $("#content").length ? $("#content") : $("main").length ? $("main") : $("body");

  const hrefs = [];

  // Common WP patterns: article titles
  main.find("article").each((_i, el) => {
    const a = $(el).find("h2 a, h3 a, .entry-title a").first();
    const href = (a.attr("href") || "").trim();
    if (href) hrefs.push(href);
  });

  // Elementor posts cards
  main.find(".elementor-post, .elementor-post__card, .elementor-posts-container .elementor-post").each((_i, el) => {
    const a = $(el).find("a").first();
    const href = (a.attr("href") || "").trim();
    if (href) hrefs.push(href);
  });

  // Fallback: any anchor in main that looks like an internal page
  if (hrefs.length === 0) {
    main.find("a[href]").each((_i, el) => {
      const href = ($(el).attr("href") || "").trim();
      if (href) hrefs.push(href);
    });
  }

  const out = [];
  for (const h of hrefs) {
    try {
      const u = new URL(h, "https://acep.africa/");
      if (u.hostname !== "acep.africa" && u.hostname !== "www.acep.africa") continue;
      // Ignore obvious non-content/internal utilities
      if (u.pathname.startsWith("/tag/") || u.pathname.startsWith("/category/") || u.pathname.startsWith("/author/")) continue;
      // Ignore archive pagination links like /press-statements/page/2/ (often not in sitemap)
      if (/\/page\/\d+\/?$/.test(u.pathname)) continue;
      out.push(u.toString());
    } catch {
      // ignore
    }
  }

  // de-dup
  const seen = new Set();
  return out.filter((u) => {
    const n = normalizeAcepUrl(u);
    if (seen.has(n)) return false;
    seen.add(n);
    return true;
  });
}

function extractDownloadHrefs(html) {
  const $ = cheerio.load(html);
  const exts = [".pdf", ".docx", ".xlsx", ".doc", ".xls", ".ppt", ".pptx", ".zip"];
  const hrefs = [];

  $("a[href]").each((_i, el) => {
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
  const h = href.trim();
  if (!h) return;

  if (h.startsWith("/acep-assets/")) return path.join(ASSET_ROOT, h.replace("/acep-assets/", ""));
  if (h.startsWith("/wp-content/") || h.startsWith("/wp-includes/")) return path.join(ASSET_ROOT, h.slice(1));

  const m = h.match(/^https?:\/\/(www\.)?acep\.africa\/(wp-(content|includes)\/.+)$/i);
  if (m?.[2]) return path.join(ASSET_ROOT, m[2]);

  return;
}

async function main() {
  const args = parseArgs(process.argv);
  const idxPath = path.resolve(ROOT, "content", "acep", "index.json");
  const idx = JSON.parse(await readFile(idxPath, "utf8"));
  const pages = Array.isArray(idx.pages) ? idx.pages : [];

  const pageByUrl = new Map();
  for (const p of pages) {
    if (!p?.url || typeof p.url !== "string") continue;
    pageByUrl.set(normalizeAcepUrl(p.url), p);
  }

  const lists = [
    { key: "research-and-policy-papers", url: "https://acep.africa/research-and-policy-papers/" },
    { key: "press-statements", url: "https://acep.africa/press-statements/" },
    { key: "news-blog-posts", url: "https://acep.africa/news-blog-posts/" },
    { key: "radar", url: "https://acep.africa/radar/" },
    { key: "annual-reports", url: "https://acep.africa/annual-reports/" },
  ];

  const base = `http://localhost:${args.port}`;
  const report = {
    verifiedAt: new Date().toISOString(),
    base,
    lists: [],
  };

  for (const list of lists) {
    const entry = pageByUrl.get(normalizeAcepUrl(list.url));
    if (!entry?.savedAs || entry.status !== 200) {
      report.lists.push({ key: list.key, url: list.url, error: "listing_snapshot_missing" });
      continue;
    }

    const snapPath = path.resolve(ROOT, "content", "acep", entry.savedAs);
    const html = await readFile(snapPath, "utf8");
    const links = extractInternalLinksFromListing(html).slice(0, args.maxPerList);

    const tasks = links.map((href) => async () => {
      const localPath = toLocalPath(href);
      const localUrl = localPath ? `${base}${localPath}` : null;
      const r = localUrl ? await head(localUrl) : { status: "error", error: "bad_local_path" };

      // asset checks from snapshot (not from live HTML)
      const detailEntry = pageByUrl.get(normalizeAcepUrl(href));
      let downloads = [];
      let missingAssets = [];
      if (detailEntry?.savedAs && detailEntry.status === 200) {
        const detailSnap = path.resolve(ROOT, "content", "acep", detailEntry.savedAs);
        const detailHtml = await readFile(detailSnap, "utf8");
        downloads = extractDownloadHrefs(detailHtml);

        for (const d of downloads) {
          const lp = mapToLocalAssetPath(d);
          if (!lp) continue;
          const exists = await fileExists(lp);
          if (!exists) missingAssets.push({ href: d, localPath: lp });
        }
      }

      return {
        href,
        localUrl,
        localStatus: r.status,
        localError: r.error,
        downloadsFound: downloads.length,
        missingAssets: missingAssets.slice(0, 25),
        missingAssetsCount: missingAssets.length,
      };
    });

    let i = 0;
    async function worker() {
      const results = [];
      while (true) {
        const n = i++;
        if (n >= tasks.length) return results;
        results.push(await tasks[n]());
      }
    }
    const chunks = await Promise.all(Array.from({ length: Math.min(args.concurrency, tasks.length) }, () => worker()));
    const results = chunks.flat();

    const ok = results.filter((r) => r.localStatus === 200).length;
    const notOk = results.length - ok;
    const assetMissing = results.reduce((sum, r) => sum + (r.missingAssetsCount || 0), 0);

    report.lists.push({
      key: list.key,
      url: list.url,
      snapshot: path.relative(ROOT, snapPath),
      sampled: results.length,
      ok,
      notOk,
      totalMissingAssets: assetMissing,
      failures: results.filter((r) => r.localStatus !== 200).slice(0, 50),
      missingAssetsSamples: results.filter((r) => r.missingAssetsCount > 0).slice(0, 25),
    });
  }

  const outPath = path.resolve(ROOT, args.out);
  await writeFile(outPath, JSON.stringify(report, null, 2));

  const mdPath = outPath.replace(/\.json$/i, ".md");
  const lines = [];
  lines.push(`# Listing + asset verification`);
  lines.push(``);
  lines.push(`- Verified at: ${report.verifiedAt}`);
  lines.push(`- Base: ${report.base}`);
  lines.push(``);

  for (const l of report.lists) {
    lines.push(`## ${l.key}`);
    lines.push(``);
    if (l.error) {
      lines.push(`- Error: ${l.error}`);
      lines.push(``);
      continue;
    }
    lines.push(`- Listing: \`${l.url}\``);
    lines.push(`- Snapshot: \`${l.snapshot}\``);
    lines.push(`- Sampled detail pages: **${l.sampled}**`);
    lines.push(`- OK: **${l.ok}**`);
    lines.push(`- Not OK: **${l.notOk}**`);
    lines.push(`- Missing linked assets (total): **${l.totalMissingAssets}**`);
    lines.push(``);
    if (l.notOk) {
      lines.push(`### Not OK samples`);
      for (const f of l.failures.slice(0, 10)) {
        lines.push(`- \`${f.localUrl}\` status=${f.localStatus}`);
      }
      lines.push(``);
    }
    if (l.totalMissingAssets) {
      lines.push(`### Missing asset samples`);
      for (const f of l.missingAssetsSamples.slice(0, 10)) {
        lines.push(`- page: \`${f.href}\` missing=${f.missingAssetsCount}`);
        for (const m of f.missingAssets.slice(0, 3)) lines.push(`  - \`${m.localPath}\` (from \`${m.href}\`)`);
      }
      lines.push(``);
    }
  }

  await writeFile(mdPath, lines.join("\n"));
  console.log(`[verify-listings] wrote ${path.relative(ROOT, outPath)} and ${path.relative(ROOT, mdPath)}`);
}

main().catch((e) => {
  console.error(e?.stack || e);
  process.exit(1);
});

