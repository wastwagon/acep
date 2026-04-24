# Publication pages, real PDFs, and search — design discussion

**Goal:** Use the **217 real local PDFs**, assign them to publications via `pdf-resolved.json`, create proper pages with **titles and descriptions**, add **Read full / Download** links, and have everything appear correctly in **search**. Discuss and agree before implementation.

---

## 1. What exists today

- **Listing:** `/publications` uses `getAllPublications()` (reports, news, press, annual, radar, etc., deduped). Each item links to `/posts/[...slug]` via `acepUrlToSlug(item.url)`.
- **Detail:** `/posts/[...slug]` loads post from `getAllPosts()` (all-posts) or falls back to **snapshot HTML**. It shows title, excerpt, content, and a “Related Documents” block built from `pdfLinks`. Each PDF is a single link (opens in new tab). Links use whatever URL is in data (often `/wp-content/...` or `acep.africa/...`); they are **not** yet resolved to local files.
- **Search:** The library search (UnifiedPublications) is client-side over `getAllPublications()`. Results link to the same `/posts/[...slug]` detail pages.
- **PDF resolution:** We have `pdf-resolved.json` with **217 matched** (ref → localPath) and **1 missing** (404 on source). Script: `verify-publication-pdfs.mjs`.

---

## 2. Page granularity: one page per what?

We need to choose what “individual pages” means.

### Option A — One page per **publication** (recommended)

- **Each publication** (post) = one page at `/posts/[...slug]`.
- **217 PDFs** are **attachments** to those pages. A publication can have 0, 1, or several PDFs.
- **Title / description** = the publication’s `title` and `excerpt` (from JSON or snapshot). No new “summary” — we use what we have.
- **Below the fold:** “Related Documents” (or “Read full / Download”) with **real local links** for each resolved PDF.
- **Search:** Continues to index **publications**. Users search publications; they land on a publication page that lists its PDF(s) with Read/Download.

**Pros:** Matches current structure, minimal new routes, search already covers these.  
**Cons:** Each PDF is not its own URL; you can’t deep-link to “the PDF page” (only to the publication page that lists it).

### Option B — One page per **PDF** (217 extra pages)

- **Each of the 217 PDFs** gets its own page, e.g. `/library/document/[slug]`.
- **Title:** From the “primary” publication that references it, or from filename if we ever have orphans.
- **Description:** From that publication’s excerpt, or a short “PDF document” line.
- **Body:** “Read full” and “Download” (same file, same URL; different UX).
- **Search:** We’d need to index **both** publication pages and PDF pages so searches can hit either.

**Pros:** Each PDF is a first-class, linkable, searchable page.  
**Cons:** More routes, more UI, possible duplication (same title/description as parent publication). Same PDF can be referenced by multiple publications — we’d need a clear rule for “primary” (e.g. first in `pdf-resolved` or first in our merge order).

### Option C — Hybrid

- Keep **one page per publication** as now.
- **Additionally** create **217 PDF pages** for power users / SEO. Publication page lists its PDFs with Read/Download; each PDF also has its own page. Search indexes both.

---

**Recommendation:** Start with **Option A**. Use the 217 real PDFs only as attachments on existing publication pages, with proper titles/descriptions and Read/Download. Add Option B later if you want dedicated PDF pages and extra search surface.

---

## 3. Where do “individual pages” live?

- **Option A:** Keep using **`/posts/[...slug]`** as the publication detail page. We **enhance** it (real PDF resolution, title/description, Read/Download) rather than adding new routes.
- **Option B (or C):** Add **new** routes for PDF-level pages, e.g. `/library/document/[...]` or `/publications/doc/[...]`, and link to them from the library + from publication pages.

**Recommendation (Option A):** No new route. Improve `/posts/[...slug]` and keep all “individual pages” there.

---

## 4. Titles and descriptions

- **Publication page:** Use **existing** `title` and `excerpt` from:
  - Extracted JSON (reports, news, press, etc.) when we have it, or
  - Snapshot HTML (e.g. `<h1>`, first paragraph / meta description) when we don’t.
- **“Summary”:** If you mean a **short display** for cards vs full detail page, we can:
  - **Cards:** Truncate `excerpt` (e.g. 120–160 chars).
  - **Detail:** Full `title` + full `excerpt` (or full content).
- **PDF-specific:** For “Related Documents” we use **link label** (`pdfLinks[].text`, e.g. “Read Full Report”) for the button. The **page** title/description stay the publication’s.

If we add **PDF-level pages** (Option B/C), we’d derive **PDF page** title/description from the primary publication (or filename) as above.

---

## 5. Smart assigning (ref → local file)

- **Source of truth:** `pdf-resolved.json` (`matched` and `missing`).
- **Per publication:** Each item has `pdfLinks[]` with `url` (and `text`). We:
  1. **Normalise** `url` to a `ref` (e.g. `wp-content/uploads/.../file.pdf`), same logic as the verification script.
  2. **Look up** `ref` in `matched` → get `localPath`.
  3. **Build app URL:** `/acep-assets/` + `localPath` (e.g. `/acep-assets/wp-content/uploads/.../file.pdf`).
- **If `ref` is in `missing`:** We **don’t** use a local file. Either:
  - **Skip** that link, or
  - **External link:** “Open on website” → `https://acep.africa/.../file.pdf` (with a note like “PDF may be unavailable”), or
  - **“PDF unavailable”** with no link.
- **Duplicate refs:** The same PDF can appear in multiple publications. Each publication page lists **its own** pdfLinks; we resolve each ref independently. No need to merge.

**Implementation:** A small helper (e.g. `resolvePdfLink(ref) => { localPath, appUrl } | null`) that uses `pdf-resolved.json`. Run at build time or load once at runtime; keep it sync for simplicity.

---

## 6. Linking: Read full vs Download

- **Read full:**  
  `<a href="/acep-assets/.../file.pdf" target="_blank" rel="noopener">Read full publication</a>`  
  Opens PDF in a new tab.

- **Download:**  
  `<a href="/acep-assets/.../file.pdf" download="sensible-filename.pdf">Download</a>`  
  Same URL; `download` encourages “save to device”. Use a safe filename (e.g. last path segment, or derived from title).

- **Placement:** Both sit **below** the main content (and below title/description), in a “Related Documents” or “Downloads” block. Per PDF: one row with “Read full” and “Download” (or a single “Read / Download” that does both depending on context — but two explicit actions are clearer).

- **Only for resolved PDFs:** Use these links **only** when we have a `localPath` for that ref. For the **1 missing** ref, use “Open on website” or “Unavailable” as above.

---

## 7. Search

- **Current:** Library search runs over `getAllPublications()`. Results are publication **cards**; each links to `/posts/[...slug]`.
- **Option A:** No change to what’s indexed. We improve the **target** pages (real PDFs, titles, descriptions). Search still returns publications; users open a publication page and then Read/Download.
- **Option B/C:** If we add PDF pages, we need to **add** those 217 pages to the search index (same in-app search or sitemap/SSG) and decide ranking (e.g. prefer publication vs PDF when both match).

**Recommendation (Option A):** Keep search as “publications only”. Ensure each publication has correct **title** and **description** so that search snippets and result cards look right. No change to search indexing logic.

---

## 8. Data flow (high level)

1. **Build / data prep**
   - Run `verify-publication-pdfs.mjs` → `pdf-resolved.json`.
   - Optionally: build a **publication index** that includes, per publication, `resolvedPdfs: [{ ref, localPath, linkText, filename }]` (only refs present in `matched`).

2. **Publication listing** (`/publications`, UnifiedPublications)
   - Still uses `getAllPublications()`.
   - Each item links to `/posts/[...slug]`. Title/description from `item.title`, `item.excerpt` (already used for cards).

3. **Publication detail** (`/posts/[...slug]`)
   - Resolve slug → ACEP URL; load post from extracted data (all-posts or reports/news/press if we extend lookup) or snapshot.
   - **Title / description:** From post or snapshot as above.
   - **PDFs:** For each `pdfLink`, resolve via `pdf-resolved` → `localPath` → app URL. Render “Related Documents” with **Read full** and **Download** for each resolved PDF; handle missing ref as agreed.

4. **Search**
   - Same as now (publications). Only the content of the target pages changes (real links, better titles/descriptions).

---

## 9. Checklist before implementation

- [ ] **Page granularity:** Option A (one page per publication) vs B (one per PDF) vs C (both). **Suggested: A.**
- [ ] **Routes:** Keep `/posts/[...slug]` only vs add `/library/document/...` (or similar). **Suggested: keep only `/posts/[...slug]`.**
- [ ] **Titles/descriptions:** Use existing `title` + `excerpt`; truncate for cards only. Agree?
- [ ] **Missing PDF (1 ref):** Skip, “Open on website”, or “PDF unavailable”? **Suggested: “Open on website” with short note.**
- [ ] **Read vs Download:** Two explicit actions per PDF, both for resolved refs only. Agree?
- [ ] **Search:** Continue to index publications only; no PDF-level indexing for v1. Agree?
- [ ] **Lookup:** Use `getAllPublications()` (or merged sources) for **detail** page lookup so that reports/news/press all have `pdfLinks` when available, not only `all-posts`. (Current code uses `getAllPosts`; we may need to extend to avoid missing pdfLinks for reports.)

---

## 10. Summary

- **Use the 217 real PDFs** via `pdf-resolved.json`; resolve each `pdfLink` to `localPath` → `/acep-assets/...`.
- **Smart assigning:** Same ref can be used by multiple publications; each publication page resolves and shows its own set of PDFs.
- **Individual pages:** One per **publication** at `/posts/[...slug]`, with clear **titles** and **descriptions** (existing `title`/`excerpt`), and a **Related Documents** block with **Read full** + **Download** per resolved PDF.
- **Search:** Stays publication-based; no new PDF-level pages or index in the first version.

Once these choices are confirmed, we can translate them into concrete implementation steps (helpers, changes to `/posts/[...slug]`, and any small indexing tweaks).

---

## Implementation status (Option C)

- **PDF registry** (`src/lib/data/pdf-registry.ts`): Loads `pdf-resolved.json`, builds ref→localPath, ref→publications, slug generation. Exposes `loadPdfRegistry`, `getPdfBySlug`, `getAllPdfs`, `getDocumentSearchItems`, `getResolvedPdfsForPublication`.
- **Publication detail** (`/posts/[...slug]`): Uses `getAllPublications` for lookup. Resolves PDFs via registry; "Related Documents" shows **Read full**, **Download**, and **View document page** per resolved PDF. Real `/acep-assets/...` links only for matched refs.
- **Document pages** (`/library/document/[slug]`): One page per PDF. Title/description from primary publication (or filename). **Read full** and **Download** buttons; "From publication(s)" links to respective `/posts/...` pages.
- **Search**: Publications page passes `pdfPages` from registry. When user **searches** (and no filters), matching documents appear as cards; "From: X, Y" and link to `/library/document/[slug]`. Filters apply only to publications; documents are search-only.
- **Assignments**: Each PDF is assigned to its respective publication(s) via `pdf.publications` in the registry. Same PDF can appear on multiple publication pages.
