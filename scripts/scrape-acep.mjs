/**
 * Scrape (snapshot) acep.africa content without rewriting.
 *
 * - Discovers URLs from Yoast sitemap index
 * - Downloads rendered HTML for each URL
 * - Stores raw responses on disk for later templating (IEA-style)
 *
 * Usage:
 *   node scripts/scrape-acep.mjs --out content/acep --concurrency 6
 *   node scripts/scrape-acep.mjs --out content/acep --max 100
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const DEFAULT_OUT_DIR = "content/acep";
const DEFAULT_CONCURRENCY = 6;
const DEFAULT_TIMEOUT_MS = 45_000;

function parseArgs(argv) {
  const args = {
    out: DEFAULT_OUT_DIR,
    concurrency: DEFAULT_CONCURRENCY,
    max: undefined,
    timeoutMs: DEFAULT_TIMEOUT_MS,
    sitemapIndex: "https://acep.africa/sitemap_index.xml",
    userAgent: "ACEP-Snapshot/1.0 (+https://acep.africa) - internal migration",
  };

  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    const next = argv[i + 1];
    if (a === "--out" && next) args.out = next, i++;
    else if (a === "--concurrency" && next) args.concurrency = Number(next), i++;
    else if (a === "--max" && next) args.max = Number(next), i++;
    else if (a === "--timeoutMs" && next) args.timeoutMs = Number(next), i++;
    else if (a === "--sitemapIndex" && next) args.sitemapIndex = next, i++;
    else if (a === "--userAgent" && next) args.userAgent = next, i++;
    else if (a === "--help") {
      console.log(`\nACEP scraper\n\nOptions:\n  --out <dir>\n  --concurrency <n>\n  --max <n>\n  --timeoutMs <ms>\n  --sitemapIndex <url>\n  --userAgent <ua>\n`);
      process.exit(0);
    }
  }

  if (!Number.isFinite(args.concurrency) || args.concurrency < 1) args.concurrency = DEFAULT_CONCURRENCY;
  if (args.max !== undefined && (!Number.isFinite(args.max) || args.max < 1)) args.max = undefined;
  if (!Number.isFinite(args.timeoutMs) || args.timeoutMs < 1_000) args.timeoutMs = DEFAULT_TIMEOUT_MS;
  return args;
}

function extractLocs(xmlText) {
  const locs = [];
  const re = /<loc>\s*([^<]+?)\s*<\/loc>/g;
  let m;
  while ((m = re.exec(xmlText))) locs.push(m[1].trim());
  return locs;
}

function normalizeUrl(u) {
  // Prefer https, keep host/path/query as-is otherwise.
  try {
    const url = new URL(u);
    url.protocol = "https:";
    return url.toString();
  } catch {
    return u;
  }
}

function urlToPathParts(urlString) {
  const u = new URL(urlString);
  // / -> index
  const pathname = u.pathname.endsWith("/") ? u.pathname : `${u.pathname}/`;
  // Keep query in filename to avoid collisions
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

  const outRoot = path.resolve(process.cwd(), args.out);
  const snapshotsDir = path.join(outRoot, "snapshots");
  await ensureDir(snapshotsDir);

  console.log(`[acep-scrape] Fetching sitemap index: ${args.sitemapIndex}`);
  const { buf: idxBuf } = await fetchWithTimeout(args.sitemapIndex, {
    timeoutMs: args.timeoutMs,
    headers: { "user-agent": args.userAgent },
  });
  const sitemapIndexXml = idxBuf.toString("utf8");
  const sitemapUrls = extractLocs(sitemapIndexXml).map(normalizeUrl);

  if (!sitemapUrls.length) {
    throw new Error("No <loc> entries found in sitemap index. Cannot continue.");
  }

  console.log(`[acep-scrape] Found ${sitemapUrls.length} sitemap files`);

  const allUrlsSet = new Set();
  for (const sm of sitemapUrls) {
    console.log(`[acep-scrape] Fetching sitemap: ${sm}`);
    const { buf } = await fetchWithTimeout(sm, {
      timeoutMs: args.timeoutMs,
      headers: { "user-agent": args.userAgent },
    });
    const xml = buf.toString("utf8");
    for (const loc of extractLocs(xml)) allUrlsSet.add(normalizeUrl(loc));
  }

  let urls = Array.from(allUrlsSet);
  // Keep deterministic ordering
  urls.sort((a, b) => a.localeCompare(b));

  if (args.max) urls = urls.slice(0, args.max);

  console.log(`[acep-scrape] Total URLs to snapshot: ${urls.length}`);

  const index = {
    source: {
      sitemapIndex: args.sitemapIndex,
      fetchedAt: new Date().toISOString(),
      userAgent: args.userAgent,
    },
    totals: { urls: urls.length },
    pages: [],
  };

  let i = 0;
  const concurrency = args.concurrency;

  async function worker() {
    while (true) {
      const n = i++;
      if (n >= urls.length) return;
      const url = urls[n];

      try {
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

        index.pages.push({
          url,
          status: res.status,
          contentType,
          bytes: buf.length,
          savedAs: path.relative(outRoot, filePath),
        });

        if ((n + 1) % 25 === 0) {
          console.log(`[acep-scrape] ${n + 1}/${urls.length} saved`);
        }
      } catch (err) {
        index.pages.push({
          url,
          status: "error",
          error: String(err && err.message ? err.message : err),
        });
        console.error(`[acep-scrape] ERROR ${url}: ${String(err && err.message ? err.message : err)}`);
      }
    }
  }

  await Promise.all(Array.from({ length: concurrency }, () => worker()));

  // Write index last
  index.pages.sort((a, b) => (a.url || "").localeCompare(b.url || ""));
  await writeFile(path.join(outRoot, "index.json"), JSON.stringify(index, null, 2));

  console.log(`[acep-scrape] Done. Saved index: ${path.join(outRoot, "index.json")}`);
  const ok = index.pages.filter((p) => p.status === 200).length;
  const errs = index.pages.filter((p) => p.status === "error" || (typeof p.status === "number" && p.status >= 400)).length;
  console.log(`[acep-scrape] Success(200): ${ok}  Errors(>=400|error): ${errs}`);
}

main().catch((e) => {
  console.error(`[acep-scrape] Fatal: ${e?.stack || e}`);
  process.exit(1);
});

