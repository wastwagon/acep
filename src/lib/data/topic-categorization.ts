// Smart topic-based categorization using title analysis
// Similar to IEA's topic system - categorizes publications by analyzing title keywords
// NOTE: This file is being replaced by library-categorization.ts for more comprehensive categorization
// Keeping for backward compatibility

export interface TopicMapping {
  topic: string;
  keywords: string[];
  description: string;
  mainCategory: string; // Maps to main publication category
}

// Topic mappings based on title keywords (IEA-style)
export const TOPIC_MAPPINGS: TopicMapping[] = [
  {
    topic: "Energy Security",
    keywords: [
      "energy security",
      "energy supply",
      "energy access",
      "power supply",
      "electricity access",
      "energy reliability",
      "energy crisis",
      "energy shortage",
      "blackout",
      "load shedding",
    ],
    description: "Energy security, supply, and access",
    mainCategory: "Research & Policy Papers",
  },
  {
    topic: "Climate Change",
    keywords: [
      "climate change",
      "climate",
      "carbon",
      "emissions",
      "greenhouse",
      "global warming",
      "net zero",
      "decarbonization",
      "renewable energy",
      "clean energy",
      "energy transition",
      "sustainability",
      "sustainable",
    ],
    description: "Climate change and energy transition",
    mainCategory: "Research & Policy Papers",
  },
  {
    topic: "Oil & Gas",
    keywords: [
      "oil",
      "petroleum",
      "gas",
      "natural gas",
      "crude",
      "lng",
      "upstream",
      "downstream",
      "exploration",
      "production",
      "refinery",
      "petroleum contract",
      "oil revenue",
      "oil money",
    ],
    description: "Oil and gas sector analysis",
    mainCategory: "Research & Policy Papers",
  },
  {
    topic: "Electricity",
    keywords: [
      "electricity",
      "power",
      "generation",
      "transmission",
      "distribution",
      "grid",
      "power plant",
      "thermal",
      "hydro",
      "solar",
      "wind",
      "renewable",
      "capacity",
      "megawatt",
      "mw",
      "kw",
    ],
    description: "Electricity and power sector",
    mainCategory: "Research & Policy Papers",
  },
  {
    topic: "Fiscal Governance",
    keywords: [
      "fiscal",
      "budget",
      "revenue",
      "tax",
      "taxation",
      "allocation",
      "expenditure",
      "spending",
      "debt",
      "deficit",
      "surplus",
      "finance",
      "financial",
      "economic policy",
      "economic",
      "governance",
    ],
    description: "Fiscal governance and economic policy",
    mainCategory: "Research & Policy Papers",
  },
  {
    topic: "Mining & Extractive",
    keywords: [
      "mining",
      "mineral",
      "extractive",
      "gold",
      "diamond",
      "bauxite",
      "manganese",
      "lithium",
      "mining agreement",
      "mining contract",
      "mining revenue",
    ],
    description: "Mining and extractive industries",
    mainCategory: "Research & Policy Papers",
  },
  {
    topic: "Investment",
    keywords: [
      "investment",
      "invest",
      "funding",
      "finance",
      "financing",
      "capital",
      "fdi",
      "foreign direct investment",
      "infrastructure investment",
      "project finance",
    ],
    description: "Investment and financing",
    mainCategory: "Research & Policy Papers",
  },
  {
    topic: "Transparency & Accountability",
    keywords: [
      "transparency",
      "accountability",
      "corruption",
      "anti-corruption",
      "whistleblower",
      "open data",
      "disclosure",
      "public disclosure",
      "contract transparency",
      "revenue transparency",
    ],
    description: "Transparency and accountability",
    mainCategory: "Research & Policy Papers",
  },
  {
    topic: "Policy Analysis",
    keywords: [
      "policy",
      "policy analysis",
      "policy brief",
      "policy paper",
      "policy recommendation",
      "policy reform",
      "legislation",
      "regulation",
      "regulatory",
    ],
    description: "Policy analysis and recommendations",
    mainCategory: "Research & Policy Papers",
  },
  {
    topic: "Infrastructure",
    keywords: [
      "infrastructure",
      "road",
      "bridge",
      "hospital",
      "school",
      "education",
      "health",
      "water",
      "sanitation",
      "project",
      "development project",
    ],
    description: "Infrastructure development",
    mainCategory: "Reports",
  },
  {
    topic: "Debt & Finance",
    keywords: [
      "debt",
      "borrowing",
      "loan",
      "credit",
      "imf",
      "world bank",
      "debt sustainability",
      "debt management",
      "debt tracker",
      "external debt",
    ],
    description: "Debt and financial management",
    mainCategory: "Research & Policy Papers",
  },
  {
    topic: "Energy Pricing",
    keywords: [
      "pricing",
      "price",
      "tariff",
      "subsidy",
      "subsidies",
      "cost",
      "affordability",
      "fuel price",
      "petrol",
      "diesel",
      "lpg",
    ],
    description: "Energy pricing and subsidies",
    mainCategory: "Research & Policy Papers",
  },
  {
    topic: "Press Statement",
    keywords: [
      "press statement",
      "statement",
      "press release",
      "rejoinder",
      "response",
      "comment",
      "position",
      "clarification",
    ],
    description: "Press statements and releases",
    mainCategory: "Press Statements",
  },
  {
    topic: "Annual Report",
    keywords: [
      "annual report",
      "annual",
      "year in review",
      "yearly report",
      "activity report",
    ],
    description: "Annual reports and reviews",
    mainCategory: "Reports",
  },
  {
    topic: "Conference & Events",
    keywords: [
      "conference",
      "summit",
      "forum",
      "workshop",
      "seminar",
      "event",
      "fec",
      "future of energy",
    ],
    description: "Conferences and events",
    mainCategory: "News & Blog Posts",
  },
  {
    topic: "Analysis",
    keywords: [
      "analysis",
      "analyze",
      "assessment",
      "evaluation",
      "review",
      "study",
      "research",
    ],
    description: "Analysis and assessments",
    mainCategory: "Research & Policy Papers",
  },
];

/**
 * Detect topic from title using keyword matching
 */
export function detectTopicFromTitle(title: string): string | null {
  if (!title) return null;

  const titleLower = title.toLowerCase();
  
  // Score each topic based on keyword matches
  const topicScores: Record<string, number> = {};
  
  for (const mapping of TOPIC_MAPPINGS) {
    let score = 0;
    for (const keyword of mapping.keywords) {
      if (titleLower.includes(keyword.toLowerCase())) {
        // Longer keywords get higher scores
        score += keyword.length;
      }
    }
    if (score > 0) {
      topicScores[mapping.topic] = score;
    }
  }
  
  // Return topic with highest score
  if (Object.keys(topicScores).length === 0) return null;
  
  const topTopic = Object.entries(topicScores).sort((a, b) => b[1] - a[1])[0];
  return topTopic[0];
}

/**
 * Get main category from topic
 */
export function getMainCategoryFromTopic(topic: string | null): string {
  if (!topic) return "Research & Policy Papers"; // Default
  
  const mapping = TOPIC_MAPPINGS.find(m => m.topic === topic);
  return mapping?.mainCategory || "Research & Policy Papers";
}

/**
 * Smart categorization: Uses topic detection from title, falls back to existing category
 * Now uses enhanced library categorization system
 */
import { smartCategorizeWithHierarchy } from "./library-categorization";

export function smartCategorize(
  title: string,
  existingCategory?: string,
  url?: string
): string {
  // Use enhanced library categorization
  const result = smartCategorizeWithHierarchy(title, existingCategory, url);
  return result.mainCategory;
}

/**
 * Get topic for a post (for display purposes)
 * Uses enhanced library categorization
 */
import { detectTopicFromTitle as detectTopicFromTitleLib } from "./library-categorization";

export function getTopicForPost(title: string, category?: string): string | null {
  // Try enhanced library categorization first
  const libTopic = detectTopicFromTitleLib(title);
  if (libTopic) return libTopic;
  
  // Fallback to original detection
  return detectTopicFromTitle(title);
}

/**
 * Get all available topics
 */
export function getAllTopics(): string[] {
  return TOPIC_MAPPINGS.map(m => m.topic);
}

/**
 * Get topic description
 */
export function getTopicDescription(topic: string): string {
  const mapping = TOPIC_MAPPINGS.find(m => m.topic === topic);
  return mapping?.description || "";
}
