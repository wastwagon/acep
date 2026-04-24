/**
 * Verify Events and key form pages.
 *
 * - Events: checks /events listing snapshot → internal detail links (sampled) return 200 locally,
 *   and verifies any download assets referenced by those detail snapshots exist locally.
 * - Forms: checks a shortlist of important form pages return 200 locally; verifies any downloads exist locally.
 *
 * Usage:
 *   node scripts/verify-events-and-forms.mjs --port 3100 --maxEvents 25 --out content/acep/events-forms-verify.json
 */

import path from "node:path";
import { readFile, writeFile, access } from "node:fs/promises";
import * as cheerio from "cheerio";

const ROOT = process.cwd();
const DEFAULT_PORT = 3100;
const DEFAULT_MAX_EVENTS = 25;
const DEFAULT_CONCURRENCY = 12;

const ASSET_ROOT = path.resolve(ROOT, "content", "acep", "assets", "acep.africa");

function parseArgs(argv) {
  const args = {
    port: DEFAULT_PORT,
    maxEvents: DEFAULT_MAX_EVENTS,
    concurrency: DEFAULT_CONCURRENCY,
    out: "content/acep/events-forms-verify.json",
  };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    const next = argv[i + 1];
    if (a === "--port" && next) args.port = Number(next), i++;
    else if (a === "--maxEvents" && next) args.maxEvents = Number(next), i++;
    else if (a === "--concurrency" && next) args.concurrency = Number(next), i++;
    else if (a === "--out" && next) args.out = next, i++;
  }
  if (!Number.isFinite(args.port)) args.port = DEFAULT_PORT;
  if (!Number.isFinite(args.maxEvents) || args.maxEvents < 1) args.maxEvents = DEFAULT_MAX_EVENTS;
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
  main.find("article").each((_i, el) => {
    const a = $(el).find("h2 a, h3 a, .entry-title a").first();
    const href = (a.attr("href") || "").trim();
    if (href) hrefs.push(href);
  });

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
      if (/\/page\/\d+\/?$/.test(u.pathname)) continue;
      out.push(u.toString());
    } catch {
      // ignore
    }
  }

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
  const base = `http://localhost:${args.port}`;

  const idxPath = path.resolve(ROOT, "content", "acep", "index.json");
  const idx = JSON.parse(await readFile(idxPath, "utf8"));
  const pages = Array.isArray(idx.pages) ? idx.pages : [];
  const pageByUrl = new Map();
  for (const p of pages) {
    if (!p?.url || typeof p.url !== "string") continue;
    pageByUrl.set(normalizeAcepUrl(p.url), p);
  }

  // ---- Events ----
  const eventsUrl = "https://acep.africa/events/";
  const eventsEntry = pageByUrl.get(normalizeAcepUrl(eventsUrl));
  let events = null;
  if (!eventsEntry?.savedAs || eventsEntry.status !== 200) {
    events = { url: eventsUrl, error: "events_listing_snapshot_missing" };
  } else {
    const snapPath = path.resolve(ROOT, "content", "acep", eventsEntry.savedAs);
    const html = await readFile(snapPath, "utf8");
    const links = extractInternalLinksFromListing(html).slice(0, args.maxEvents);

    const tasks = links.map((href) => async () => {
      const localPath = toLocalPath(href);
      const localUrl = localPath ? `${base}${localPath}` : null;
      const r = localUrl ? await head(localUrl) : { status: "error", error: "bad_local_path" };

      const detailEntry = pageByUrl.get(normalizeAcepUrl(href));
      let missingAssets = [];
      let downloadsFound = 0;
      if (detailEntry?.savedAs && detailEntry.status === 200) {
        const detailSnap = path.resolve(ROOT, "content", "acep", detailEntry.savedAs);
        const detailHtml = await readFile(detailSnap, "utf8");
        const downloads = extractDownloadHrefs(detailHtml);
        downloadsFound = downloads.length;
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
        downloadsFound,
        missingAssetsCount: missingAssets.length,
        missingAssets: missingAssets.slice(0, 25),
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
    const chunks = await Promise.all(Array.from({ length: Math.min(args.concurrency, tasks.length || 1) }, () => worker()));
    const results = chunks.flat();

    const ok = results.filter((r) => r.localStatus === 200).length;
    const notOk = results.length - ok;
    const totalMissingAssets = results.reduce((sum, r) => sum + (r.missingAssetsCount || 0), 0);
    events = {
      url: eventsUrl,
      snapshot: path.relative(ROOT, snapPath),
      sampled: results.length,
      ok,
      notOk,
      totalMissingAssets,
      failures: results.filter((r) => r.localStatus !== 200).slice(0, 50),
      missingAssetsSamples: results.filter((r) => r.missingAssetsCount > 0).slice(0, 25),
    };
  }

  // ---- Forms ----
  const formPages = [
    { key: "contact", url: "https://acep.africa/contact/" },
    // Quick link on ACEP homepage points to this legacy path
    { key: "work-with-us", url: "https://acep.africa/nextgen5/" },
    { key: "grant-application", url: "https://acep.africa/grant-application/" },
  ];

  const forms = [];
  for (const p of formPages) {
    const localPath = toLocalPath(p.url);
    const localUrl = localPath ? `${base}${localPath}` : null;
    const r = localUrl ? await head(localUrl) : { status: "error", error: "bad_local_path" };

    const entry = pageByUrl.get(normalizeAcepUrl(p.url));
    let downloadsFound = 0;
    let missingAssets = [];
    let snapshot;
    if (entry?.savedAs && entry.status === 200) {
      snapshot = entry.savedAs;
      const snapPath = path.resolve(ROOT, "content", "acep", entry.savedAs);
      const html = await readFile(snapPath, "utf8");
      const downloads = extractDownloadHrefs(html);
      downloadsFound = downloads.length;
      for (const d of downloads) {
        const lp = mapToLocalAssetPath(d);
        if (!lp) continue;
        const exists = await fileExists(lp);
        if (!exists) missingAssets.push({ href: d, localPath: lp });
      }
    }

    forms.push({
      key: p.key,
      url: p.url,
      localUrl,
      localStatus: r.status,
      localError: r.error,
      snapshot,
      downloadsFound,
      missingAssetsCount: missingAssets.length,
      missingAssets: missingAssets.slice(0, 25),
    });
  }

  const out = {
    verifiedAt: new Date().toISOString(),
    base,
    events,
    forms,
  };

  const outPath = path.resolve(ROOT, args.out);
  await writeFile(outPath, JSON.stringify(out, null, 2));

  const mdPath = outPath.replace(/\.json$/i, ".md");
  const lines = [];
  lines.push(`# Events + forms verification`);
  lines.push(``);
  lines.push(`- Verified at: ${out.verifiedAt}`);
  lines.push(`- Base: ${out.base}`);
  lines.push(``);

  lines.push(`## Events`);
  lines.push(``);
  if (out.events?.error) {
    lines.push(`- Error: ${out.events.error}`);
  } else {
    lines.push(`- Listing: \`${out.events.url}\``);
    lines.push(`- Snapshot: \`${out.events.snapshot}\``);
    lines.push(`- Sampled detail pages: **${out.events.sampled}**`);
    lines.push(`- OK: **${out.events.ok}**`);
    lines.push(`- Not OK: **${out.events.notOk}**`);
    lines.push(`- Missing linked assets (total): **${out.events.totalMissingAssets}**`);
    if (out.events.notOk) {
      lines.push(``);
      lines.push(`### Not OK samples`);
      for (const f of out.events.failures.slice(0, 10)) lines.push(`- \`${f.localUrl}\` status=${f.localStatus}`);
    }
    if (out.events.totalMissingAssets) {
      lines.push(``);
      lines.push(`### Missing asset samples`);
      for (const f of out.events.missingAssetsSamples.slice(0, 10)) {
        lines.push(`- page: \`${f.href}\` missing=${f.missingAssetsCount}`);
        for (const m of f.missingAssets.slice(0, 3)) lines.push(`  - \`${m.localPath}\` (from \`${m.href}\`)`);
      }
    }
  }
  lines.push(``);

  lines.push(`## Forms`);
  lines.push(``);
  for (const f of out.forms) {
    lines.push(`- **${f.key}**: \`${f.localUrl}\` status=${f.localStatus} downloadsFound=${f.downloadsFound} missingAssets=${f.missingAssetsCount}`);
  }
  lines.push(``);

  await writeFile(mdPath, lines.join("\n"));
  console.log(`[verify-events-forms] wrote ${path.relative(ROOT, outPath)} and ${path.relative(ROOT, mdPath)}`);
}

main().catch((e) => {
  console.error(e?.stack || e);
  process.exit(1);
});

