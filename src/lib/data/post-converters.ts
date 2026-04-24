// Helper functions to convert between different post/item formats

import { Post } from "./post-types";
import { AcepListItem } from "../acep-extract";
import { getMainCategory } from "./categories";

/**
 * Convert AcepListItem (from snapshot extraction) to Post format
 * Uses getMainCategory for proper categorization (handles press-release, acep-radar, etc.)
 */
export function convertAcepListItemToPost(item: AcepListItem, category?: string): Post {
  // Ensure href is a full URL
  const url = item.href.startsWith("http") 
    ? item.href 
    : item.href.startsWith("/")
    ? `https://acep.africa${item.href}`
    : `https://acep.africa/${item.href}`;

  // Use getMainCategory to properly map categories (handles press-release -> Press Statements, etc.)
  const mainCategory = getMainCategory(category, item.title, url);

  return {
    url,
    title: item.title,
    featuredImage: item.imageSrc,
    dateText: item.dateText,
    excerpt: item.excerpt,
    content: undefined, // Not available from listing extraction
    pdfLinks: [],
    category: mainCategory, // Use getMainCategory for proper categorization
    tags: [],
  };
}

/**
 * Convert multiple AcepListItems to Posts
 */
export function convertAcepListItemsToPosts(
  items: AcepListItem[],
  category?: string
): Post[] {
  return items.map((item) => convertAcepListItemToPost(item, category));
}
