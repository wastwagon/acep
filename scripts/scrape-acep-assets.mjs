/**
 * Download assets referenced by already-snapshotted ACEP HTML pages.
 *
 * Inputs:
 *  - content/acep/index.json (produced by scrape-acep.mjs)
 *  - content/acep/snapshots/<host>/<path>/index.html
 *
 * Outputs:
 *  - content/acep/assets/<host>/<path> (downloaded binaries, preserving URL paths)
 *  - content/acep/assets-index.json (manifest)
 *
 * This does NOT rewrite content; it only fetches referenced files (PDFs, images, etc.)
 *
 * Usage:
 *   node scripts/scrape-acep-assets.mjs --contentDir content/acep --concurrency 6
 *   node scripts/scrape-acep-assets.mjs --contentDir content/acep --maxAssets 500
 */

import { readFile, mkdir, writeFile, stat, unlink } from "node:fs/promises";
import path from "node:path";

const DEFAULT_CONCURRENCY = 6;
const DEFAULT_TIMEOUT_MS = 45_000;

function parseArgs(argv) {
  const args = {
    contentDir: "content/acep",
    concurrency: DEFAULT_CONCURRENCY,
    timeoutMs: DEFAULT_TIMEOUT_MS,
    maxAssets: undefined,
    verifyExisting: false,
    userAgent: "ACEP-Asset-Snapshot/1.0 (+https://acep.africa) - internal migration",
    // Only download assets hosted on these domains (avoid third-party tracking, etc.)
    allowedHosts: new Set(["acep.africa", "www.acep.africa"]),
  };

  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    const next = argv[i + 1];
    if (a === "--contentDir" && next) args.contentDir = next, i++;
    else if (a === "--concurrency" && next) args.concurrency = Number(next), i++;
    else if (a === "--timeoutMs" && next) args.timeoutMs = Number(next), i++;
    else if (a === "--maxAssets" && next) args.maxAssets = Number(next), i++;
    else if (a === "--userAgent" && next) args.userAgent = next, i++;
    else if (a === "--verifyExisting") args.verifyExisting = true;
    else if (a === "--help") {
      console.log(`\nACEP asset scraper\n\nOptions:\n  --contentDir <dir>   (default: content/acep)\n  --concurrency <n>\n  --timeoutMs <ms>\n  --maxAssets <n>\n  --verifyExisting\n  --userAgent <ua>\n`);
      process.exit(0);
    }
  }

  if (!Number.isFinite(args.concurrency) || args.concurrency < 1) args.concurrency = DEFAULT_CONCURRENCY;
  if (!Number.isFinite(args.timeoutMs) || args.timeoutMs < 1_000) args.timeoutMs = DEFAULT_TIMEOUT_MS;
  if (args.maxAssets !== undefined && (!Number.isFinite(args.maxAssets) || args.maxAssets < 1)) args.maxAssets = undefined;
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

function isLikelyAsset(url) {
  const p = url.pathname.toLowerCase();
  // Common WP uploads + file types we care about
  return (
    p.includes("/wp-content/uploads/") ||
    /\.(pdf|doc|docx|xls|xlsx|ppt|pptx|csv|zip|png|jpe?g|webp|gif|svg|mp4|webm|mp3|wav)$/i.test(p)
  );
}

function extractUrlsFromHtml(html) {
  const urls = new Set();

  // href="..." or src="..."
  const attrRe = /\b(?:href|src|data-src|data-lazy-src|poster)\s*=\s*["']([^"']+)["']/gi;
  let m;
  while ((m = attrRe.exec(html))) {
    const raw = m[1].trim();
    if (!raw) continue;
    urls.add(raw);
  }

  // srcset="a 1x, b 2x" (take the URL part)
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

async function headWithTimeout(url, { timeoutMs, headers }) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { method: "HEAD", redirect: "follow", headers, signal: controller.signal });
    return { res };
  } finally {
    clearTimeout(id);
  }
}

function safePathSegment(s) {
  return s.replace(/[^a-zA-Z0-9._-]/g, "_");
}

function assetOutPath(rootAssetsDir, urlString) {
  const u = new URL(urlString);
  const host = safePathSegment(u.host);
  const pathname = u.pathname; // keep slashes
  const parts = pathname.split("/").filter(Boolean).map(safePathSegment);
  const dir = path.join(rootAssetsDir, host, ...parts.slice(0, -1));
  const filenameRaw = parts[parts.length - 1] || "index";
  // prevent collisions when query string exists
  const querySuffix = u.search ? `__q_${Buffer.from(u.search).toString("base64url")}` : "";
  const filename = `${filenameRaw}${querySuffix}`;
  return { dir, file: path.join(dir, filename) };
}

async function fileExists(p) {
  try {
    await stat(p);
    return true;
  } catch {
    return false;
  }
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
    // Only parse HTML snapshots
    if (!String(p.contentType || "").includes("text/html")) continue;
    const htmlPath = path.join(contentDirAbs, p.savedAs);
    let html;
    try {
      html = await readFile(htmlPath, "utf8");
    } catch {
      continue;
    }

    for (const raw of extractUrlsFromHtml(html)) {
      // Ignore anchors and mailto/tel/javascript
      if (raw.startsWith("#")) continue;
      if (/^(mailto:|tel:|javascript:)/i.test(raw)) continue;

      // Resolve relative URLs against the page URL
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
  if (args.maxAssets) assetUrls = assetUrls.slice(0, args.maxAssets);

  console.log(`[acep-assets] Candidate assets: ${assetUrls.length}`);
  await mkdir(assetsDir, { recursive: true });

  const manifest = {
    source: {
      contentDir: args.contentDir,
      fetchedAt: new Date().toISOString(),
      userAgent: args.userAgent,
      allowedHosts: Array.from(args.allowedHosts),
    },
    totals: { candidateAssets: assetUrls.length },
    assets: [],
  };

  let idx = 0;
  async function worker() {
    while (true) {
      const n = idx++;
      if (n >= assetUrls.length) return;
      const url = assetUrls[n];
      const { dir, file } = assetOutPath(assetsDir, url);

      try {
        if (await fileExists(file)) {
          if (args.verifyExisting) {
            let status = "unknown";
            let contentType = "";
            try {
              const { res } = await headWithTimeout(url, {
                timeoutMs: args.timeoutMs,
                headers: { "user-agent": args.userAgent },
              });
              status = res.status;
              contentType = res.headers.get("content-type") || "";
            } catch {
              // Some servers don't support HEAD well; fall back to GET
              const { res } = await fetchWithTimeout(url, {
                timeoutMs: args.timeoutMs,
                headers: { "user-agent": args.userAgent },
              });
              status = res.status;
              contentType = res.headers.get("content-type") || "";
            }

            if (status !== 200) {
              await unlink(file).catch(() => {});
              manifest.assets.push({
                url,
                status,
                contentType,
                note: "existing_file_removed_due_to_non_200",
              });
              continue;
            }
          }

          manifest.assets.push({
            url,
            status: "skipped_exists",
            savedAs: path.relative(contentDirAbs, file),
          });
          continue;
        }

        const { res, buf } = await fetchWithTimeout(url, {
          timeoutMs: args.timeoutMs,
          headers: { "user-agent": args.userAgent },
        });

        if (res.status !== 200) {
          manifest.assets.push({
            url,
            status: res.status,
            contentType: res.headers.get("content-type") || "",
            bytes: buf.length,
            note: "not_saved_non_200",
          });
          continue;
        }

        await mkdir(dir, { recursive: true });
        await writeFile(file, buf);

        manifest.assets.push({
          url,
          status: res.status,
          contentType: res.headers.get("content-type") || "",
          bytes: buf.length,
          savedAs: path.relative(contentDirAbs, file),
        });

        if ((n + 1) % 50 === 0) {
          console.log(`[acep-assets] ${n + 1}/${assetUrls.length} fetched`);
        }
      } catch (err) {
        manifest.assets.push({
          url,
          status: "error",
          error: String(err && err.message ? err.message : err),
        });
        console.error(`[acep-assets] ERROR ${url}: ${String(err && err.message ? err.message : err)}`);
      }
    }
  }

  await Promise.all(Array.from({ length: args.concurrency }, () => worker()));
  manifest.assets.sort((a, b) => (a.url || "").localeCompare(b.url || ""));
  await writeFile(path.join(contentDirAbs, "assets-index.json"), JSON.stringify(manifest, null, 2));

  const ok = manifest.assets.filter((a) => a.status === 200).length;
  const skipped = manifest.assets.filter((a) => a.status === "skipped_exists").length;
  const errs = manifest.assets.filter((a) => a.status === "error" || (typeof a.status === "number" && a.status >= 400)).length;
  console.log(`[acep-assets] Done. 200: ${ok}  skipped: ${skipped}  errors: ${errs}`);
  console.log(`[acep-assets] Manifest: ${path.join(contentDirAbs, "assets-index.json")}`);
}

main().catch((e) => {
  console.error(`[acep-assets] Fatal: ${e?.stack || e}`);
  process.exit(1);
});

