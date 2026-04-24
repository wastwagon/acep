// URL helper functions - safe for client components
// Pure JavaScript functions, no Node.js imports

/**
 * Convert an ACEP URL to a slug array for Next.js routing
 */
export function acepUrlToSlug(url: string): string[] {
  try {
    const urlObj = new URL(url);
    const path = urlObj.pathname.replace(/^\/|\/$/g, "");
    return path ? path.split("/") : [];
  } catch {
    const path = url.replace(/^https?:\/\/acep\.africa\/?/, "").replace(/^\/|\/$/g, "");
    return path ? path.split("/") : [];
  }
}

const GENERIC_LINK_TEXTS = new Set([
  "download pdf",
  "read full",
  "read full publication",
  "view pdf",
  "pdf",
]);

/**
 * Derive a human-readable title from a URL slug or PDF-style slug.
 * Use for publication/document pages when no explicit title is known.
 * Handles both path slugs (e.g. "policy-brief-...") and PDF slugs with "--" separators.
 */
export function slugToTitle(input: string | string[]): string {
  const raw =
    typeof input === "string"
      ? input.replace(/--/g, " ").replace(/-/g, " ")
      : input
          .map((s) => s.replace(/-/g, " "))
          .join(" ");
  const words = raw.replace(/\s+/g, " ").trim().split(" ");
  if (words.length === 0) return "";
  return words
    .map((w) => (w.length === 0 ? w : w[0].toUpperCase() + w.slice(1).toLowerCase()))
    .join(" ");
}

/** True if link text is generic and should not be used as a publication title. */
export function isGenericLinkText(text: string | undefined): boolean {
  if (!text || typeof text !== "string") return true;
  return GENERIC_LINK_TEXTS.has(text.trim().toLowerCase());
}
