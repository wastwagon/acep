/**
 * Download assets (images, CSS, JS) from ouroilmoney.org
 * 
 * Usage:
 *   node scripts/scrape-oil-revenue-assets.mjs --contentDir content/oil-revenue --concurrency 6
 */

import { readFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const DEFAULT_CONCURRENCY = 6;
const DEFAULT_TIMEOUT_MS = 30_000;

function parseArgs(argv) {
  const args = {
    contentDir: "content/oil-revenue",
    concurrency: DEFAULT_CONCURRENCY,
    timeoutMs: DEFAULT_TIMEOUT_MS,
    userAgent: "ACEP-Oil-Revenue-Asset-Scraper/1.0 (+https://acep.africa) - internal migration",
    allowedHosts: new Set(["ouroilmoney.org", "www.ouroilmoney.org"]),
  };

  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    const next = argv[i + 1];
    if (a === "--contentDir" && next) args.contentDir = next, i++;
    else if (a === "--concurrency" && next) args.concurrency = Number(next), i++;
    else if (a === "--timeoutMs" && next) args.timeoutMs = Number(next), i++;
    else if (a === "--userAgent" && next) args.userAgent = next, i++;
    else if (a === "--help") {
      console.log(`\nOil Revenue Asset Scraper\n\nOptions:\n  --contentDir <dir>\n  --concurrency <n>\n  --timeoutMs <ms>\n  --userAgent <ua>\n`);
      process.exit(0);
    }
  }

  if (!Number.isFinite(args.concurrency) || args.concurrency < 1) args.concurrency = DEFAULT_CONCURRENCY;
  if (!Number.isFinite(args.timeoutMs) || args.timeoutMs < 1_000) args.timeoutMs = DEFAULT_TIMEOUT_MS;
  return args;
}

function extractUrlsFromHtml(html) {
  const urls = new Set();
  const attrRe = /\b(?:href|src|data-src|data-lazy-src|poster|background-image)\s*[:=]\s*["']([^"']+)["']/gi;
  let m;
  while ((m = attrRe.exec(html))) {
    const raw = m[1].trim();
    if (!raw) continue;
    if (raw.includes("url(")) {
      const urlMatch = raw.match(/url\(["']?([^"')]+)["']?\)/);
      if (urlMatch) urls.add(urlMatch[1]);
    } else {
      urls.add(raw);
    }
  }
  
  const srcsetRe = /\bsrcset\s*=\s*["']([^"']+)["']/gi;
  while ((m = srcsetRe.exec(html))) {
    const raw = m[1].trim();
    for (const part of raw.split(",")) {
      const u = part.trim().split(/\s+/)[0];
      if (u) urls.add(u);
    }
  }
  
  return urls;
}

function normalizeUrl(u) {
  try {
    const url = new URL(u);
    url.protocol = "https:";
    return url.toString();
  } catch {
    return u;
  }
}

function isLikelyAsset(url) {
  const u = new URL(url);
  const pathname = u.pathname.toLowerCase();
  return /\.(jpg|jpeg|png|gif|webp|svg|ico|css|js|woff|woff2|ttf|eot|pdf)$/i.test(pathname) ||
         pathname.includes("/wp-content/") ||
         pathname.includes("/assets/") ||
         pathname.includes("/template/");
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

async function urlToPath(urlString) {
  const u = new URL(urlString);
  const pathname = u.pathname;
  const safePath = pathname
    .split("/")
    .filter(Boolean)
    .map(s => s.replace(/[^a-zA-Z0-9._-]/g, "_"))
    .join("/");
  return safePath || "index";
}

async function main() {
  const args = parseArgs(process.argv);
  const contentDirAbs = path.resolve(process.cwd(), args.contentDir);
  const indexPath = path.join(contentDirAbs, "index.json");
  const assetsDir = path.join(contentDirAbs, "assets");

  const indexJson = JSON.parse(await readFile(indexPath, "utf8"));
  const pages = Array.isArray(indexJson.pages) ? indexJson.pages : [];

  // Collect all candidate asset URLs
  const candidates = new Set();
  for (const p of pages) {
    if (!p || p.status !== 200) continue;
    if (!p.savedAs || typeof p.savedAs !== "string") continue;
    
    const htmlPath = path.join(contentDirAbs, p.savedAs);
    let html;
    try {
      html = await readFile(htmlPath, "utf8");
    } catch {
      continue;
    }

    for (const raw of extractUrlsFromHtml(html)) {
      if (raw.startsWith("#")) continue;
      if (/^(mailto:|tel:|javascript:)/i.test(raw)) continue;

      let resolved;
      try {
        resolved = new URL(raw, p.url).toString();
      } catch {
        continue;
      }
      const norm = normalizeUrl(resolved);
      if (!norm) continue;
      const u = new URL(norm);
      if (!args.allowedHosts.has(u.host)) continue;
      if (!isLikelyAsset(u)) continue;
      candidates.add(u.toString());
    }
  }

  let assetUrls = Array.from(candidates);
  assetUrls.sort((a, b) => a.localeCompare(b));

  console.log(`[oil-revenue-assets] Candidate assets: ${assetUrls.length}`);
  await mkdir(assetsDir, { recursive: true });

  const manifest = {
    source: {
      contentDir: args.contentDir,
      scrapedAt: new Date().toISOString(),
      userAgent: args.userAgent,
    },
    totals: { assets: 0, successful: 0, errors: 0 },
    assets: [],
  };

  let i = 0;
  async function worker() {
    while (true) {
      const n = i++;
      if (n >= assetUrls.length) return;
      const url = assetUrls[n];

      try {
        const { res, buf } = await fetchWithTimeout(url, {
          timeoutMs: args.timeoutMs,
          headers: { "user-agent": args.userAgent },
        });

        if (res.status !== 200) {
          manifest.assets.push({ url, status: res.status, error: `HTTP ${res.status}` });
          manifest.totals.errors++;
          continue;
        }

        const u = new URL(url);
        const assetPath = await urlToPath(url);
        const filePath = path.join(assetsDir, u.host, assetPath);
        await mkdir(path.dirname(filePath), { recursive: true });
        await writeFile(filePath, buf);

        manifest.assets.push({
          url,
          status: 200,
          bytes: buf.length,
          savedAs: path.relative(contentDirAbs, filePath),
        });
        manifest.totals.successful++;
        manifest.totals.assets++;

        if ((n + 1) % 25 === 0) {
          console.log(`[oil-revenue-assets] ${n + 1}/${assetUrls.length} downloaded`);
        }
      } catch (err) {
        manifest.assets.push({
          url,
          status: "error",
          error: String(err?.message || err),
        });
        manifest.totals.errors++;
        console.error(`[oil-revenue-assets] ERROR ${url}: ${String(err?.message || err)}`);
      }
    }
  }

  await Promise.all(Array.from({ length: args.concurrency }, () => worker()));

  manifest.assets.sort((a, b) => (a.url || "").localeCompare(b.url || ""));

  const manifestPath = path.join(contentDirAbs, "assets-index.json");
  await writeFile(manifestPath, JSON.stringify(manifest, null, 2));

  console.log(`\n[oil-revenue-assets] Done!`);
  console.log(`[oil-revenue-assets] Saved manifest: ${manifestPath}`);
  console.log(`[oil-revenue-assets] Success: ${manifest.totals.successful}/${manifest.totals.assets}`);
  console.log(`[oil-revenue-assets] Errors: ${manifest.totals.errors}/${manifest.totals.assets}`);
}

main().catch((e) => {
  console.error(`[oil-revenue-assets] Fatal: ${e?.stack || e}`);
  process.exit(1);
});
