/**
 * Strip WordPress comment form and related block from scraped HTML.
 * Removes #respond (comment form) then the sec_comments wrapper when present.
 */
export function stripCommentSection(html: string): string {
  if (!html || typeof html !== "string") return html;
  let out = html;

  // 1. Remove #respond block (WordPress comment form)
  out = out.replace(
    /<div\s+id="respond"[^>]*>[\s\S]*?<\/form>\s*<\/div>\s*<!--\s*#respond\s*-->/gi,
    ""
  );

  // 2. Remove sec_comments wrapper (structure: sec_comments > container > row > col)
  out = out.replace(
    /<div[^>]*(?:class="[^"]*sec_comments[^"]*"|id="comment")[^>]*>[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/div>/gi,
    ""
  );

  return out.trim();
}
