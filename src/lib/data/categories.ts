// Intelligent categorization system for ACEP publications
// Maps sub-categories to main categories for better organization and searchability
// Enhanced with library-style hierarchical categorization

import { smartCategorize } from "./topic-categorization";

// Lazy load library categorization to avoid circular dependencies
let libraryCategorization: typeof import("./library-categorization") | null = null;

async function getLibraryCategorization() {
  if (!libraryCategorization) {
    libraryCategorization = await import("./library-categorization");
  }
  return libraryCategorization;
}

export interface CategoryMapping {
  mainCategory: string;
  subCategories: string[];
  description: string;
  icon?: string;
}

// Main publication categories
export const PUBLICATION_CATEGORIES: CategoryMapping[] = [
  {
    mainCategory: "Research & Policy Papers",
    subCategories: [
      "Research & Policy Papers",
      "Research-Policy Papers",
      "research-policy-papers",
      "policy-paper",
      "policy-analysis",
      "our-policy-analysis",
      "working-paper",
      "Policy Paper",
      "Policy Analysis",
      "Research Paper",
    ],
    description: "In-depth research and policy analysis documents",
  },
  {
    mainCategory: "Policy Briefs",
    subCategories: [
      "Policy Brief",
      "policy-brief",
      "Brief",
    ],
    description: "Concise policy briefs and summaries",
  },
  {
    mainCategory: "Reports",
    subCategories: [
      "Reports",
      "Report",
      "report-summary",
      "Annual Reports",
      "annual-reports",
    ],
    description: "Comprehensive reports and annual publications",
  },
  {
    mainCategory: "Press Statements",
    subCategories: [
      "Press Statement",
      "Press Statements",
      "press-statements",
      "our-press-statements",
      "press-release",
      "press-releases",
      "Press Release",
      "Press Releases",
      "press-conference",
      "Rejoinder",
      "rejoinder",
    ],
    description: "Official press statements and releases",
  },
  {
    mainCategory: "News & Blog Posts",
    subCategories: [
      "News & Blog Posts",
      "News & Blog",
      "news-blog-posts",
      "blogs-news",
      "blogs",
      "news",
      "Blog Post",
      "Blog",
      "News",
      "Analysis",
      "Commentary",
    ],
    description: "News articles, blog posts, and commentary",
  },
  {
    mainCategory: "ACEP Radar",
    subCategories: [
      "ACEP Radar",
      "acep-radar",
      "Radar",
      "radar",
    ],
    description: "ACEP Radar publications and insights",
  },
];

// News and media categories
export const NEWS_CATEGORIES: CategoryMapping[] = [
  {
    mainCategory: "Press Statements",
    subCategories: [
      "Press Statement",
      "Press Statements",
      "press-statements",
      "our-press-statements",
      "press-release",
      "press-conference",
    ],
    description: "Official press statements",
  },
  {
    mainCategory: "Analysis",
    subCategories: [
      "Analysis",
      "Policy Analysis",
      "Budget Analysis",
      "Economic Analysis",
    ],
    description: "In-depth analysis articles",
  },
  {
    mainCategory: "Blog Posts",
    subCategories: [
      "Blog Post",
      "Blog",
      "blogs",
      "Commentary",
      "Opinion",
    ],
    description: "Blog posts and commentary",
  },
  {
    mainCategory: "News",
    subCategories: [
      "News",
      "news",
      "News & Blog Posts",
      "news-blog-posts",
    ],
    description: "News articles and updates",
  },
];

/**
 * Normalize category name for consistent matching
 */
export function normalizeCategory(category: string | undefined): string {
  if (!category) return "Uncategorized";
  return category.trim();
}

/**
 * Map a sub-category to its main category
 * Enhanced with smart title-based categorization
 */
export function getMainCategory(
  category: string | undefined,
  title?: string,
  url?: string
): string {
  const normalized = normalizeCategory(category);
  
  // Check URL patterns first (most reliable)
  if (url) {
    const urlLower = url.toLowerCase();
    if (urlLower.includes("/radar") || urlLower.includes("acep-radar")) {
      return "ACEP Radar";
    }
    if (urlLower.includes("/press") || urlLower.includes("/statement") || urlLower.includes("press-release")) {
      return "Press Statements";
    }
    if (urlLower.includes("/annual") || urlLower.includes("/report")) {
      return "Reports";
    }
    if (urlLower.includes("/news") || urlLower.includes("/blog")) {
      return "News & Blog Posts";
    }
    if (urlLower.includes("/research") || urlLower.includes("/policy")) {
      return "Research & Policy Papers";
    }
  }
  
  // If category is "Uncategorized" or empty, use smart categorization from title
  if ((!normalized || normalized === "Uncategorized") && title) {
    return smartCategorize(title, category, url);
  }
  
  // Check all publication categories (case-insensitive, partial matching)
  for (const mapping of PUBLICATION_CATEGORIES) {
    const normalizedLower = normalized.toLowerCase();
    if (mapping.subCategories.some(sub => {
      const subLower = sub.toLowerCase();
      return normalizedLower === subLower ||
        normalizedLower.includes(subLower) ||
        subLower.includes(normalizedLower) ||
        // Also check if category contains any part of the subcategory
        normalizedLower.split(/[\s-_,]+/).some(part => subLower.includes(part)) ||
        subLower.split(/[\s-_,]+/).some(part => normalizedLower.includes(part));
    })) {
      return mapping.mainCategory;
    }
  }
  
  // Check news categories
  for (const mapping of NEWS_CATEGORIES) {
    const normalizedLower = normalized.toLowerCase();
    if (mapping.subCategories.some(sub => {
      const subLower = sub.toLowerCase();
      return normalizedLower === subLower ||
        normalizedLower.includes(subLower) ||
        subLower.includes(normalizedLower) ||
        normalizedLower.split(/[\s-_,]+/).some(part => subLower.includes(part)) ||
        subLower.split(/[\s-_,]+/).some(part => normalizedLower.includes(part));
    })) {
      return mapping.mainCategory;
    }
  }
  
  // If still no match and we have a title, use smart categorization
  if (title) {
    return smartCategorize(title, category, url);
  }
  
  // Return original if no match found
  return normalized;
}

/**
 * Get category description
 */
export function getCategoryDescription(category: string): string {
  const mainCategory = getMainCategory(category);
  
  const mapping = [...PUBLICATION_CATEGORIES, ...NEWS_CATEGORIES].find(
    m => m.mainCategory === mainCategory
  );
  
  return mapping?.description || "Publications and resources";
}

/**
 * Get all main categories
 */
export function getMainCategories(): string[] {
  return PUBLICATION_CATEGORIES.map(c => c.mainCategory);
}

/**
 * Get all sectors (for library-style browsing)
 * Note: This is a synchronous wrapper - library categorization is loaded on demand
 */
export function getSectors(): string[] {
  // For client components, we'll handle this differently
  // This will be called from client components that have direct access
  return [];
}

/**
 * Get all topics (for library-style browsing)
 */
export function getTopics(): string[] {
  return [];
}

/**
 * Get topics for a specific sector
 */
export function getTopicsBySector(sector: string): string[] {
  return [];
}

/**
 * Get sub-categories for a main category
 */
export function getSubCategories(mainCategory: string): string[] {
  const mapping = PUBLICATION_CATEGORIES.find(m => m.mainCategory === mainCategory);
  return mapping?.subCategories || [];
}

/**
 * Filter posts by main category
 */
export function filterByMainCategory<T extends { category?: string; title?: string; url?: string }>(
  posts: T[],
  mainCategory: string
): T[] {
  const subCategories = getSubCategories(mainCategory);
  return posts.filter(post => {
    const postCategory = normalizeCategory(post.category);
    const postMainCategory = getMainCategory(post.category, post.title, post.url);
    return subCategories.some(sub => 
      postCategory.toLowerCase().includes(sub.toLowerCase()) ||
      sub.toLowerCase().includes(postCategory.toLowerCase())
    ) || postMainCategory === mainCategory;
  });
}

/**
 * Group posts by main category
 */
export function groupByMainCategory<T extends { category?: string; title?: string; url?: string }>(
  posts: T[]
): Record<string, T[]> {
  const grouped: Record<string, T[]> = {};
  
  posts.forEach(post => {
    const mainCategory = getMainCategory(post.category, post.title, post.url);
    if (!grouped[mainCategory]) {
      grouped[mainCategory] = [];
    }
    grouped[mainCategory].push(post);
  });
  
  return grouped;
}
