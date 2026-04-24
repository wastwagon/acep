/**
 * Scrape additional ACEP URLs not present in the Yoast sitemap.
 *
 * This merges new snapshots into existing content/acep/index.json.
 *
 * Usage:
 *   node scripts/scrape-acep-extra.mjs --out content/acep --url https://acep.africa/our-reports/ --url https://acep.africa/nextgen5/
 */

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const DEFAULT_OUT_DIR = "content/acep";
const DEFAULT_TIMEOUT_MS = 45_000;

function parseArgs(argv) {
  const args = {
    out: DEFAULT_OUT_DIR,
    timeoutMs: DEFAULT_TIMEOUT_MS,
    userAgent: "ACEP-Extra-Snapshot/1.0 (+https://acep.africa) - internal migration",
    urls: [],
  };

  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    const next = argv[i + 1];
    if (a === "--out" && next) args.out = next, i++;
    else if (a === "--timeoutMs" && next) args.timeoutMs = Number(next), i++;
    else if (a === "--userAgent" && next) args.userAgent = next, i++;
    else if (a === "--url" && next) args.urls.push(next), i++;
    else if (a === "--help") {
      console.log(`\nACEP extra scraper\n\nOptions:\n  --out <dir>\n  --url <url>   (repeatable)\n  --timeoutMs <ms>\n  --userAgent <ua>\n`);
      process.exit(0);
    }
  }

  if (!Number.isFinite(args.timeoutMs) || args.timeoutMs < 1_000) args.timeoutMs = DEFAULT_TIMEOUT_MS;
  args.urls = args.urls.map((u) => normalizeUrl(u)).filter(Boolean);
  return args;
}

function normalizeUrl(u) {
  try {
    const url = new URL(u);
    url.protocol = "https:";
    return url.toString();
  } catch {
    return null;
  }
}

function urlToPathParts(urlString) {
  const u = new URL(urlString);
  const pathname = u.pathname.endsWith("/") ? u.pathname : `${u.pathname}/`;
  const querySuffix = u.search ? `__q_${Buffer.from(u.search).toString("base64url")}` : "";
  const safeSegments = pathname
    .split("/")
    .filter(Boolean)
    .map((s) => s.replace(/[^a-zA-Z0-9._-]/g, "_"));
  const dir = safeSegments.length ? safeSegments.join("/") : "home";
  return { host: u.host.replace(/[^a-zA-Z0-9._-]/g, "_"), dir, querySuffix };
}

async function fetchWithTimeout(url, { timeoutMs, headers }) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { redirect: "follow", headers, signal: controller.signal });
    const buf = Buffer.from(await res.arrayBuffer());
    return { res, buf };
  } finally {
    clearTimeout(id);
  }
}

async function ensureDir(p) {
  await mkdir(p, { recursive: true });
}

async function main() {
  const args = parseArgs(process.argv);
  if (!args.urls.length) {
    console.error("[acep-extra] No --url provided.");
    process.exit(1);
  }

  const outRoot = path.resolve(process.cwd(), args.out);
  const snapshotsDir = path.join(outRoot, "snapshots");
  await ensureDir(snapshotsDir);

  const idxPath = path.join(outRoot, "index.json");
  const idx = JSON.parse(await readFile(idxPath, "utf8"));
  const pages = Array.isArray(idx.pages) ? idx.pages : [];

  const byUrl = new Map();
  for (const p of pages) {
    if (p?.url) byUrl.set(normalizeUrl(p.url) || p.url, p);
  }

  for (const url of args.urls) {
    console.log(`[acep-extra] Fetching: ${url}`);
    const { res, buf } = await fetchWithTimeout(url, {
      timeoutMs: args.timeoutMs,
      headers: { "user-agent": args.userAgent },
    });

    const contentType = res.headers.get("content-type") || "";
    const { host, dir, querySuffix } = urlToPathParts(url);
    const baseDir = path.join(snapshotsDir, host, dir);
    await ensureDir(baseDir);

    const ext = contentType.includes("text/html") ? "html" : "bin";
    const fileBase = `index${querySuffix}.${ext}`;
    const filePath = path.join(baseDir, fileBase);
    await writeFile(filePath, buf);

    const entry = {
      url,
      status: res.status,
      contentType,
      bytes: buf.length,
      savedAs: path.relative(outRoot, filePath),
    };

    if (byUrl.has(url)) {
      // replace existing
      const prev = byUrl.get(url);
      const idxPos = pages.indexOf(prev);
      if (idxPos >= 0) pages[idxPos] = entry;
      byUrl.set(url, entry);
    } else {
      pages.push(entry);
      byUrl.set(url, entry);
    }
  }

  // Keep deterministic ordering
  pages.sort((a, b) => (a.url || "").localeCompare(b.url || ""));
  idx.pages = pages;
  idx.totals = { urls: pages.length };

  // Record extra scrape metadata
  idx.source = idx.source || {};
  idx.source.extraFetchedAt = new Date().toISOString();
  idx.source.extraUserAgent = args.userAgent;

  await writeFile(idxPath, JSON.stringify(idx, null, 2));
  console.log(`[acep-extra] Updated index.json. total pages=${pages.length}`);
}

main().catch((e) => {
  console.error(e?.stack || e);
  process.exit(1);
});

