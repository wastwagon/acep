// Load extracted posts and publications data
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { Post } from "./post-types";

let cachedPosts: Post[] | null = null;
let cachedPublications: Post[] | null = null;
let cachedPressStatements: Post[] | null = null;
let cachedReports: Post[] | null = null;
let cachedNewsBlogPosts: Post[] | null = null;

async function loadJsonFile(filename: string): Promise<Post[]> {
  try {
    const filePath = join(process.cwd(), "content", "acep", "extracted", filename);
    const content = await readFile(filePath, "utf-8");
    return JSON.parse(content);
  } catch (error) {
    // Silently fail in production, return empty array
    return [];
  }
}

export async function getAllPosts(): Promise<Post[]> {
  if (cachedPosts) return cachedPosts;
  cachedPosts = await loadJsonFile("all-posts.json");
  return cachedPosts;
}

export async function getNewsBlogPosts(): Promise<Post[]> {
  if (cachedNewsBlogPosts) return cachedNewsBlogPosts;
  cachedNewsBlogPosts = await loadJsonFile("news-blog-posts.json");
  return cachedNewsBlogPosts;
}

export async function getPublications(): Promise<Post[]> {
  if (cachedPublications) return cachedPublications;
  cachedPublications = await loadJsonFile("publications.json");
  return cachedPublications;
}

export async function getPressStatements(): Promise<Post[]> {
  if (cachedPressStatements) return cachedPressStatements;
  cachedPressStatements = await loadJsonFile("press-statements.json");
  return cachedPressStatements;
}

export async function getReports(): Promise<Post[]> {
  if (cachedReports) return cachedReports;
  cachedReports = await loadJsonFile("reports.json");
  return cachedReports;
}

/**
 * Get all publications from all sources (unified)
 * Combines: publications, reports, news, press statements, annual reports, radar
 */
export async function getAllPublications(): Promise<Post[]> {
  const [
    publications,
    reports,
    newsBlogPosts,
    pressStatements,
  ] = await Promise.all([
    getPublications(),
    getReports(),
    getNewsBlogPosts(),
    getPressStatements(),
  ]);

  // Also fetch annual reports and radar from snapshots
  let annualReports: Post[] = [];
  let radar: Post[] = [];

  try {
    const { getAcepSnapshotByUrl, readAcepSnapshotHtml } = await import("@/lib/acep-snapshots");
    const { extractListingItems } = await import("@/lib/acep-extract");
    const { convertAcepListItemsToPosts } = await import("@/lib/data/post-converters");

    // Annual Reports
    const annualReportsEntry = await getAcepSnapshotByUrl("https://acep.africa/annual-reports/");
    if (annualReportsEntry && annualReportsEntry.status === 200 && annualReportsEntry.savedAs) {
      const html = await readAcepSnapshotHtml(annualReportsEntry.savedAs);
      const extractedItems = extractListingItems(html);
      annualReports = convertAcepListItemsToPosts(extractedItems, "Annual Reports");
    }

    // Radar
    const radarEntry = await getAcepSnapshotByUrl("https://acep.africa/radar/");
    if (radarEntry && radarEntry.status === 200 && radarEntry.savedAs) {
      const html = await readAcepSnapshotHtml(radarEntry.savedAs);
      const extractedItems = extractListingItems(html);
      radar = convertAcepListItemsToPosts(extractedItems, "ACEP Radar");
    }
  } catch (error) {
    // Silently fail if snapshots aren't available
    console.warn("Could not load annual reports or radar:", error);
  }

  // Combine all and deduplicate by URL
  const allPublications = [
    ...publications,
    ...reports,
    ...newsBlogPosts,
    ...pressStatements,
    ...annualReports,
    ...radar,
  ];

  // Deduplicate by URL
  const seen = new Set<string>();
  const unique: Post[] = [];
  for (const pub of allPublications) {
    const normalizedUrl = pub.url?.replace(/\/$/, "").toLowerCase();
    if (normalizedUrl && !seen.has(normalizedUrl)) {
      seen.add(normalizedUrl);
      unique.push(pub);
    }
  }

  return unique;
}

export function getPostByUrl(url: string, posts: Post[]): Post | undefined {
  return posts.find((p) => p.url === url || p.url.replace(/\/$/, "") === url.replace(/\/$/, ""));
}

// Re-export acepUrlToSlug for backward compatibility (but prefer importing from utils/url-helpers)
export { acepUrlToSlug } from "../utils/url-helpers";
