# Publication PDFs verification (acep.africa → local)

## Summary

All PDFs scraped from **acep.africa** are present locally. No files are lost.

| Metric | Count |
|--------|--------|
| PDF refs in extracted JSON (reports, publications, news, press) | 218 |
| Local PDFs on disk (`content/acep/assets/acep.africa/wp-content/...`) | 217 |
| **Matched** (ref → local file) | **217** |
| **Missing** (referenced but not available) | **1** |
| Orphans (local, not referenced) | 0 |

## Matched (217)

Every referenced PDF that exists on the live site has been scraped and matched to a local file. The verification script:

- Resolves `pdfLinks` in extracted JSON to local paths.
- Uses `content/acep/assets-index.json` (url → savedAs) when useful.
- Handles **encoding variants**: e.g. en-dash `–` in refs vs `_E2_80_93` in saved filenames.

## Missing (1)

**One** PDF is referenced in our data but **not** available locally:

| Ref | Publication | Reason |
|-----|-------------|--------|
| `ACEPs-Rejoinder-to-GNPCs-Response-on-the-71-Acquisition-in-Jubilee-and-TEN-Fields.pdf` | Rejoinder: GNPC's Responses to Assertions in ACEP's Statement… | **404 on source** |

The asset scraper attempted this URL; the live site returned **404** (and `text/html`). The file was likely removed or relocated on acep.africa. We do **not** lose it from our **publication** record—the post stays. We simply cannot offer a **local** PDF for that link. Options:

- Keep the link as “external” (open acep.africa URL in new tab) if you still want to try the live URL.
- Or hide “Download” / “Read full” for that specific attachment and show “PDF unavailable” instead.

## Orphans (0)

There are no local PDFs that are unused by any publication. Everything on disk is referenced.

## Scripts and outputs

- **Verify:**  
  `node scripts/verify-publication-pdfs.mjs`

- **Write resolved map:**  
  `node scripts/verify-publication-pdfs.mjs --out content/acep/extracted/pdf-resolved.json`

`pdf-resolved.json` contains:

- `summary`: counts above.
- `matched`: `{ ref, localPath }[]` for use when resolving `pdfLinks` → local URLs (e.g. `/acep-assets/...`).
- `missing`: `{ ref, reason, title }[]`.
- `orphans`: paths of local PDFs not referenced (currently none).

## Using real local files

When implementing “Read full” / “Download”:

1. **Resolve** each `pdfLink` using `pdf-resolved.json`:
   - If `ref` is in `matched`, use `localPath` → serve under `/acep-assets/wp-content/...`.
   - If `ref` is in `missing`, either skip local action or treat as external.
2. **Normalize** refs the same way as the script (path extraction, encoding variants) so resolution stays consistent.
3. **Do not drop** any publication or ref; only avoid claiming a local file when we know it’s missing (e.g. 404).

This keeps **all** publications and **all** scraped files; the single 404 PDF is the only exception and is documented above.
