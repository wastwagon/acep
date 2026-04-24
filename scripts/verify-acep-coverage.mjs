/**
 * Verify local coverage of ACEP snapshot pages and assets.
 *
 * - Reads content/acep/index.json and checks local routes at http://localhost:<port>/<pathname>
 * - Uses HEAD requests to reduce bandwidth
 *
 * Usage:
 *   node scripts/verify-acep-coverage.mjs --port 3100 --out content/acep/local-verify.json
 */

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const DEFAULT_PORT = 3100;
const DEFAULT_CONCURRENCY = 12;

function parseArgs(argv) {
  const args = {
    port: DEFAULT_PORT,
    concurrency: DEFAULT_CONCURRENCY,
    out: "content/acep/local-verify.json",
    max: undefined,
    userAgent: "ACEP-Local-Verify/1.0",
  };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    const next = argv[i + 1];
    if (a === "--port" && next) args.port = Number(next), i++;
    else if (a === "--concurrency" && next) args.concurrency = Number(next), i++;
    else if (a === "--out" && next) args.out = next, i++;
    else if (a === "--max" && next) args.max = Number(next), i++;
  }
  if (!Number.isFinite(args.port)) args.port = DEFAULT_PORT;
  if (!Number.isFinite(args.concurrency) || args.concurrency < 1) args.concurrency = DEFAULT_CONCURRENCY;
  if (args.max !== undefined && (!Number.isFinite(args.max) || args.max < 1)) args.max = undefined;
  return args;
}

async function head(url, ua) {
  try {
    const res = await fetch(url, { method: "HEAD", redirect: "follow", headers: { "user-agent": ua } });
    return { status: res.status };
  } catch (e) {
    return { status: "error", error: String(e?.message || e) };
  }
}

async function main() {
  const args = parseArgs(process.argv);
  const idxPath = path.resolve(process.cwd(), "content", "acep", "index.json");
  const idx = JSON.parse(await readFile(idxPath, "utf8"));
  const pages = Array.isArray(idx.pages) ? idx.pages : [];

  const acepPages = pages
    .filter((p) => p?.status === 200 && typeof p.url === "string")
    .map((p) => {
      const u = new URL(p.url);
      const pathname = u.pathname.endsWith("/") ? u.pathname : `${u.pathname}/`;
      return { sourceUrl: p.url, pathname };
    });

  acepPages.sort((a, b) => a.pathname.localeCompare(b.pathname));
  const list = args.max ? acepPages.slice(0, args.max) : acepPages;

  const base = `http://localhost:${args.port}`;
  const results = [];

  let i = 0;
  async function worker() {
    while (true) {
      const n = i++;
      if (n >= list.length) return;
      const item = list[n];
      const localUrl = `${base}${item.pathname}`;
      const r = await head(localUrl, args.userAgent);
      results.push({ ...item, localUrl, localStatus: r.status, error: r.error });
      if ((n + 1) % 50 === 0) {
        console.log(`[verify] ${n + 1}/${list.length}`);
      }
    }
  }

  await Promise.all(Array.from({ length: args.concurrency }, () => worker()));

  results.sort((a, b) => a.pathname.localeCompare(b.pathname));
  const ok = results.filter((r) => r.localStatus === 200).length;
  const notOk = results.length - ok;

  const out = {
    verifiedAt: new Date().toISOString(),
    base,
    totals: { checked: results.length, ok, notOk },
    failures: results.filter((r) => r.localStatus !== 200).slice(0, 200),
  };

  const outPath = path.resolve(process.cwd(), args.out);
  await writeFile(outPath, JSON.stringify(out, null, 2));
  console.log(`[verify] Done. ok=${ok} notOk=${notOk} report=${args.out}`);
}

main().catch((e) => {
  console.error(e?.stack || e);
  process.exit(1);
});

