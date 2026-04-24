/**
 * Verify publication PDFs: refs in extracted JSON vs local files.
 *
 * - Collects pdfLinks from reports, publications, news-blog-posts, press-statements
 * - Uses assets-index.json (url → savedAs) to resolve refs to local paths
 * - Handles encoding variants (e.g. – vs _E2_80_93)
 * - Reports: matched, missing (404 vs not-in-index), orphans
 *
 * Usage:
 *   node scripts/verify-publication-pdfs.mjs
 *   node scripts/verify-publication-pdfs.mjs --out content/acep/extracted/pdf-resolved.json
 */

import { readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const CONTENT = path.join(ROOT, "content", "acep");
const ASSETS_ROOT = path.join(CONTENT, "assets", "acep.africa");
const EXTRACTED = path.join(CONTENT, "extracted");
const ASSETS_INDEX = path.join(CONTENT, "assets-index.json");

function parseArgs(argv) {
  const args = { out: null };
  for (let i = 2; i < argv.length; i++) {
    if (argv[i] === "--out" && argv[i + 1]) args.out = argv[++i];
  }
  return args;
}

function normalizeRef(href) {
  if (!href || typeof href !== "string") return null;
  let p = href.trim();
  const m = p.match(/(?:https?:\/\/(?:www\.)?acep\.africa)?(\/wp-content\/[^#?]+)/i);
  if (m) p = m[1];
  else if (!p.startsWith("/wp-content/")) return null;
  return p.slice(1);
}

function toAcepUrl(relPath) {
  return `https://acep.africa/${relPath.startsWith("wp-content/") ? "" : "wp-content/"}${relPath}`;
}

/** En-dash and other chars can appear as literal or _E2_80_93 etc. Generate alternatives for matching. */
function encodingVariants(relPath) {
  const out = [relPath];
  if (relPath.includes("–")) {
    out.push(relPath.replace(/–/g, "_E2_80_93"));
  }
  if (relPath.includes("_E2_80_93")) {
    out.push(relPath.replace(/_E2_80_93/g, "–"));
  }
  return [...new Set(out)];
}

async function loadJson(name) {
  try {
    const raw = await readFile(path.join(EXTRACTED, `${name}.json`), "utf8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

async function loadAssetsIndex() {
  try {
    const raw = await readFile(ASSETS_INDEX, "utf8");
    const data = JSON.parse(raw);
    const list = data.assets || [];
    const byUrl = new Map();
    const bySavedAs = new Set();
    for (const a of list) {
      const u = (a.url || "").trim();
      const s = (a.savedAs || "").trim();
      if (u && s) {
        byUrl.set(u, { savedAs: s, status: a.status });
        bySavedAs.add(s.replace(/^assets\/acep\.africa\//, ""));
      }
    }
    return { byUrl, bySavedAs, list };
  } catch (e) {
    console.warn("Could not load assets-index.json:", e.message);
    return { byUrl: new Map(), bySavedAs: new Set(), list: [] };
  }
}

async function main() {
  const args = parseArgs(process.argv);

  const sources = ["reports", "publications", "news-blog-posts", "press-statements"];
  const refs = new Map();
  for (const name of sources) {
    const arr = await loadJson(name);
    for (const item of arr || []) {
      for (const l of item.pdfLinks || []) {
        const key = normalizeRef(l?.url);
        if (!key || refs.has(key)) continue;
        refs.set(key, {
          title: item.title,
          url: item.url,
          source: name,
          linkText: l?.text,
        });
      }
    }
  }

  const { byUrl, list } = await loadAssetsIndex();
  const wpRoot = path.join(ASSETS_ROOT, "wp-content");
  const localSet = new Set();
  async function walk(d, base) {
    const ents = await readdir(d, { withFileTypes: true });
    for (const e of ents) {
      const rel = base ? `${base}/${e.name}` : e.name;
      const full = path.join(d, e.name);
      if (e.isDirectory()) await walk(full, rel);
      else if (e.name.toLowerCase().endsWith(".pdf")) localSet.add(rel);
    }
  }
  await walk(wpRoot, "wp-content");

  const matched = [];
  const missing = [];
  const refList = [...refs.keys()].sort();

  for (const ref of refList) {
    const meta = refs.get(ref);
    const variants = encodingVariants(ref);
    let localPath = null;
    let reason = null;

    for (const v of variants) {
      const abs = path.join(ASSETS_ROOT, v);
      try {
        await readFile(abs);
        localPath = v;
        break;
      } catch {}
    }
    if (localPath) {
      matched.push({
        ref,
        localPath,
        title: meta.title,
        source: meta.source,
      });
      continue;
    }

    const url = toAcepUrl(ref);
    const urlEnc = ref.includes("–")
      ? `https://acep.africa/${ref.replace(/–/g, "%E2%80%93")}`
      : url;
    const idx = list.find((a) => {
      const u = (a.url || "").trim();
      return u === url || u === urlEnc || decodeURIComponent(u) === url || decodeURIComponent(u) === urlEnc;
    });
    if (idx && idx.savedAs) {
      const s = idx.savedAs.replace(/^assets\/acep\.africa\//, "");
      const abs = path.join(ASSETS_ROOT, s);
      try {
        await readFile(abs);
        localPath = s;
        matched.push({ ref, localPath, title: meta.title, source: meta.source });
        continue;
      } catch {}
    }

    if (idx && (idx.status === 404 || (idx.contentType || "").includes("text/html"))) {
      reason = "404_on_source";
    } else {
      reason = "not_in_assets_index_or_missing_file";
    }
    missing.push({
      ref,
      reason,
      title: meta.title,
      source: meta.source,
      indexStatus: idx?.status,
      indexContentType: idx?.contentType,
    });
  }

  const claimed = new Set(matched.map((m) => m.localPath));
  const orphans = [...localSet].filter((p) => !claimed.has(p)).sort();

  const summary = {
    refsTotal: refList.length,
    matched: matched.length,
    missing: missing.length,
    missing404: missing.filter((m) => m.reason === "404_on_source").length,
    localPdfs: localSet.size,
    orphans: orphans.length,
  };

  console.log("\n=== Publication PDF verification (acep.africa → local) ===\n");
  console.log("Refs in extracted JSON:", summary.refsTotal);
  console.log("Local PDFs on disk:", summary.localPdfs);
  console.log("Matched (ref → local file):", summary.matched);
  console.log("Missing:", summary.missing);
  console.log("  - 404 on source (not scraped):", summary.missing404);
  console.log("Orphans (local, not referenced):", summary.orphans);

  if (missing.length) {
    console.log("\n--- Missing refs ---");
    missing.forEach((m) => {
      console.log(`  [${m.reason}] ${m.ref}`);
      console.log(`    title: ${(m.title || "").slice(0, 60)}...`);
    });
  }

  if (orphans.length > 0 && orphans.length <= 30) {
    console.log("\n--- Orphans (sample) ---");
    orphans.slice(0, 15).forEach((o) => console.log("  ", o));
  } else if (orphans.length > 30) {
    console.log("\n--- Orphans (first 15) ---");
    orphans.slice(0, 15).forEach((o) => console.log("  ", o));
  }

  const resolved = {
    generatedAt: new Date().toISOString(),
    summary,
    matched: matched.map(({ ref, localPath }) => ({ ref, localPath })),
    missing: missing.map(({ ref, reason, title }) => ({ ref, reason, title })),
    orphans,
  };

  if (args.out) {
    await writeFile(args.out, JSON.stringify(resolved, null, 2), "utf8");
    console.log("\nWrote", args.out);
  }

  process.exit(summary.missing > 0 ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
