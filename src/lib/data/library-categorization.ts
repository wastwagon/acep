// Comprehensive library-style categorization system
// Hierarchical: Sector > Topic > Subcategory
// Similar to IEA's topic system but expanded for ACEP's diverse publications

export interface SectorMapping {
  sector: string;
  topics: string[];
  description: string;
  keywords: string[];
  mainCategory: string;
}

export interface TopicMapping {
  topic: string;
  keywords: string[];
  description: string;
  sector: string;
  subcategories?: string[];
}

// Main Sectors (Broad Categories)
export const SECTORS: SectorMapping[] = [
  {
    sector: "Energy",
    topics: [
      "Energy Security",
      "Energy Access",
      "Energy Pricing",
      "Energy Policy",
      "Renewable Energy",
      "Energy Transition",
      "Energy Efficiency",
      "Energy Infrastructure",
    ],
    description: "Energy sector analysis and policy",
    keywords: ["energy", "power", "electricity", "renewable", "solar", "wind", "hydro"],
    mainCategory: "Research & Policy Papers",
  },
  {
    sector: "Extractive Industries",
    topics: [
      "Petroleum",
      "Oil & Gas",
      "Mining",
      "Lithium",
      "Gold Mining",
      "Diamond Mining",
      "Bauxite",
      "Manganese",
      "Critical Minerals",
      "Extractive Governance",
    ],
    description: "Extractive industries and natural resources",
    keywords: ["oil", "gas", "petroleum", "mining", "mineral", "extractive", "lithium", "gold", "diamond"],
    mainCategory: "Research & Policy Papers",
  },
  {
    sector: "Fiscal Governance",
    topics: [
      "Revenue Management",
      "Tax Policy",
      "Budget Analysis",
      "Debt Management",
      "Public Finance",
      "Fiscal Transparency",
      "Revenue Allocation",
      "Economic Policy",
    ],
    description: "Fiscal governance and economic policy",
    keywords: ["fiscal", "revenue", "tax", "budget", "debt", "finance", "economic", "allocation"],
    mainCategory: "Research & Policy Papers",
  },
  {
    sector: "Climate & Environment",
    topics: [
      "Climate Change",
      "Methane Emissions",
      "Carbon Emissions",
      "Environmental Policy",
      "Sustainability",
      "Green Energy",
      "Climate Finance",
      "Adaptation",
    ],
    description: "Climate change and environmental issues",
    keywords: ["climate", "emission", "carbon", "methane", "environment", "sustainability", "green"],
    mainCategory: "Research & Policy Papers",
  },
  {
    sector: "Infrastructure",
    topics: [
      "Energy Infrastructure",
      "Transport Infrastructure",
      "Social Infrastructure",
      "Water & Sanitation",
      "Healthcare Infrastructure",
      "Education Infrastructure",
      "Digital Infrastructure",
    ],
    description: "Infrastructure development and projects",
    keywords: ["infrastructure", "road", "bridge", "hospital", "school", "water", "sanitation", "project"],
    mainCategory: "Reports",
  },
  {
    sector: "Transparency & Accountability",
    topics: [
      "Contract Transparency",
      "Revenue Transparency",
      "Open Data",
      "Anti-Corruption",
      "Whistleblower Protection",
      "Public Disclosure",
      "Accountability Mechanisms",
    ],
    description: "Transparency and accountability initiatives",
    keywords: ["transparency", "accountability", "corruption", "disclosure", "open data", "whistleblower"],
    mainCategory: "Research & Policy Papers",
  },
  {
    sector: "Investment & Finance",
    topics: [
      "Foreign Direct Investment",
      "Project Finance",
      "Infrastructure Investment",
      "Energy Investment",
      "Public-Private Partnerships",
      "Development Finance",
    ],
    description: "Investment and financing",
    keywords: ["investment", "finance", "funding", "fdi", "ppp", "capital"],
    mainCategory: "Research & Policy Papers",
  },
];

// Detailed Topic Mappings with Keywords
export const TOPIC_MAPPINGS: TopicMapping[] = [
  // Energy Topics
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
      "power outage",
      "energy independence",
    ],
    description: "Energy security, supply, and access",
    sector: "Energy",
  },
  {
    topic: "Energy Access",
    keywords: [
      "energy access",
      "electricity access",
      "rural electrification",
      "energy poverty",
      "access to energy",
      "energy for all",
      "universal access",
    ],
    description: "Energy access and electrification",
    sector: "Energy",
  },
  {
    topic: "Renewable Energy",
    keywords: [
      "renewable energy",
      "solar",
      "wind",
      "hydro",
      "geothermal",
      "biomass",
      "clean energy",
      "green energy",
      "solar power",
      "wind power",
      "hydroelectric",
    ],
    description: "Renewable energy sources and development",
    sector: "Energy",
  },
  {
    topic: "Energy Transition",
    keywords: [
      "energy transition",
      "clean energy transition",
      "decarbonization",
      "net zero",
      "energy transformation",
      "low carbon",
      "carbon neutral",
    ],
    description: "Energy transition and decarbonization",
    sector: "Energy",
  },
  {
    topic: "Energy Pricing",
    keywords: [
      "energy pricing",
      "electricity tariff",
      "energy price",
      "fuel price",
      "petrol price",
      "diesel price",
      "lpg price",
      "pricing policy",
      "tariff",
      "subsidy",
      "subsidies",
    ],
    description: "Energy pricing and tariffs",
    sector: "Energy",
  },
  
  // Extractive Industries Topics
  {
    topic: "Petroleum",
    keywords: [
      "petroleum",
      "oil",
      "crude oil",
      "oil production",
      "oil exploration",
      "oil revenue",
      "petroleum contract",
      "oil contract",
      "upstream",
      "downstream",
      "oil sector",
      "petroleum sector",
    ],
    description: "Petroleum and oil sector",
    sector: "Extractive Industries",
    subcategories: ["Exploration", "Production", "Revenue", "Contracts", "Upstream", "Downstream"],
  },
  {
    topic: "Oil & Gas",
    keywords: [
      "oil and gas",
      "oil & gas",
      "natural gas",
      "lng",
      "gas production",
      "gas exploration",
      "gas revenue",
      "gas contract",
      "gas sector",
    ],
    description: "Oil and gas industry",
    sector: "Extractive Industries",
  },
  {
    topic: "Mining",
    keywords: [
      "mining",
      "mineral",
      "mining sector",
      "mining industry",
      "mining contract",
      "mining agreement",
      "mining revenue",
      "mineral extraction",
      "quarry",
    ],
    description: "Mining and mineral extraction",
    sector: "Extractive Industries",
    subcategories: ["Gold", "Diamond", "Bauxite", "Manganese", "Lithium", "Other Minerals"],
  },
  {
    topic: "Lithium",
    keywords: [
      "lithium",
      "lithium mining",
      "lithium extraction",
      "lithium agreement",
      "lithium contract",
      "lithium project",
      "lithium deposit",
    ],
    description: "Lithium mining and extraction",
    sector: "Extractive Industries",
  },
  {
    topic: "Critical Minerals",
    keywords: [
      "critical minerals",
      "strategic minerals",
      "rare earth",
      "cobalt",
      "nickel",
      "copper",
      "mineral security",
    ],
    description: "Critical and strategic minerals",
    sector: "Extractive Industries",
  },
  {
    topic: "Extractive Governance",
    keywords: [
      "extractive governance",
      "resource governance",
      "mining governance",
      "oil governance",
      "extractive sector governance",
      "resource management",
    ],
    description: "Governance of extractive industries",
    sector: "Extractive Industries",
  },
  
  // Fiscal Governance Topics
  {
    topic: "Revenue Management",
    keywords: [
      "revenue management",
      "revenue collection",
      "revenue allocation",
      "revenue sharing",
      "revenue distribution",
      "oil revenue",
      "mining revenue",
      "revenue tracking",
    ],
    description: "Revenue management and allocation",
    sector: "Fiscal Governance",
  },
  {
    topic: "Debt Management",
    keywords: [
      "debt",
      "debt management",
      "debt sustainability",
      "external debt",
      "public debt",
      "debt tracker",
      "borrowing",
      "loan",
      "debt crisis",
    ],
    description: "Debt management and sustainability",
    sector: "Fiscal Governance",
  },
  {
    topic: "Budget Analysis",
    keywords: [
      "budget",
      "budget analysis",
      "budget statement",
      "budget review",
      "fiscal budget",
      "national budget",
      "budget allocation",
      "budget policy",
    ],
    description: "Budget analysis and policy",
    sector: "Fiscal Governance",
  },
  {
    topic: "Tax Policy",
    keywords: [
      "tax",
      "taxation",
      "tax policy",
      "tax reform",
      "tax revenue",
      "income tax",
      "corporate tax",
      "vat",
      "tax compliance",
    ],
    description: "Tax policy and revenue",
    sector: "Fiscal Governance",
  },
  
  // Climate & Environment Topics
  {
    topic: "Climate Change",
    keywords: [
      "climate change",
      "climate",
      "climate policy",
      "climate action",
      "climate finance",
      "climate adaptation",
      "climate mitigation",
      "global warming",
    ],
    description: "Climate change and policy",
    sector: "Climate & Environment",
  },
  {
    topic: "Methane Emissions",
    keywords: [
      "methane",
      "methane emission",
      "methane reduction",
      "methane capture",
      "methane leakage",
      "fugitive methane",
      "greenhouse gas",
    ],
    description: "Methane emissions and reduction",
    sector: "Climate & Environment",
  },
  {
    topic: "Carbon Emissions",
    keywords: [
      "carbon",
      "carbon emission",
      "co2",
      "carbon footprint",
      "carbon reduction",
      "carbon capture",
      "decarbonization",
      "carbon neutral",
    ],
    description: "Carbon emissions and reduction",
    sector: "Climate & Environment",
  },
  
  // Infrastructure Topics
  {
    topic: "Energy Infrastructure",
    keywords: [
      "energy infrastructure",
      "power infrastructure",
      "electricity infrastructure",
      "power plant",
      "generation capacity",
      "transmission line",
      "distribution network",
      "grid",
    ],
    description: "Energy infrastructure development",
    sector: "Infrastructure",
  },
  {
    topic: "Social Infrastructure",
    keywords: [
      "social infrastructure",
      "healthcare",
      "education",
      "hospital",
      "school",
      "health facility",
      "educational facility",
      "public service",
    ],
    description: "Social infrastructure projects",
    sector: "Infrastructure",
  },
  
  // Transparency Topics
  {
    topic: "Contract Transparency",
    keywords: [
      "contract transparency",
      "contract disclosure",
      "petroleum contract",
      "mining contract",
      "contract monitoring",
      "contract analysis",
      "contract terms",
    ],
    description: "Contract transparency and disclosure",
    sector: "Transparency & Accountability",
  },
  {
    topic: "Revenue Transparency",
    keywords: [
      "revenue transparency",
      "revenue disclosure",
      "open revenue",
      "revenue tracking",
      "revenue monitoring",
      "transparent revenue",
    ],
    description: "Revenue transparency initiatives",
    sector: "Transparency & Accountability",
  },
  
  // Investment Topics
  {
    topic: "Foreign Direct Investment",
    keywords: [
      "foreign direct investment",
      "fdi",
      "foreign investment",
      "international investment",
      "investment flow",
      "capital flow",
    ],
    description: "Foreign direct investment",
    sector: "Investment & Finance",
  },
  {
    topic: "Project Finance",
    keywords: [
      "project finance",
      "project funding",
      "project investment",
      "infrastructure finance",
      "development finance",
      "project financing",
    ],
    description: "Project financing and funding",
    sector: "Investment & Finance",
  },
  
  // Policy & Analysis Topics
  {
    topic: "Policy Analysis",
    keywords: [
      "policy analysis",
      "policy review",
      "policy assessment",
      "policy evaluation",
      "policy paper",
      "policy brief",
      "policy recommendation",
    ],
    description: "Policy analysis and recommendations",
    sector: "Energy",
  },
  
  // Press & Media Topics
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
      "policy note",
    ],
    description: "Press statements and releases",
    sector: "Transparency & Accountability",
  },
  
  // Reports Topics
  {
    topic: "Annual Report",
    keywords: [
      "annual report",
      "annual",
      "year in review",
      "yearly report",
      "activity report",
      "annual review",
    ],
    description: "Annual reports and reviews",
    sector: "Infrastructure",
  },
  
  // Events Topics
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
      "summer school",
    ],
    description: "Conferences and events",
    sector: "Energy",
  },
];

/**
 * Detect sector from title
 */
export function detectSectorFromTitle(title: string): string | null {
  if (!title) return null;

  const titleLower = title.toLowerCase();
  const sectorScores: Record<string, number> = {};

  for (const sector of SECTORS) {
    let score = 0;
    for (const keyword of sector.keywords) {
      if (titleLower.includes(keyword.toLowerCase())) {
        score += keyword.length;
      }
    }
    if (score > 0) {
      sectorScores[sector.sector] = score;
    }
  }

  if (Object.keys(sectorScores).length === 0) return null;

  const topSector = Object.entries(sectorScores).sort((a, b) => b[1] - a[1])[0];
  return topSector[0];
}

/**
 * Detect topic from title (enhanced with more topics)
 */
export function detectTopicFromTitle(title: string): string | null {
  if (!title) return null;

  const titleLower = title.toLowerCase();
  const topicScores: Record<string, number> = {};

  for (const mapping of TOPIC_MAPPINGS) {
    let score = 0;
    for (const keyword of mapping.keywords) {
      if (titleLower.includes(keyword.toLowerCase())) {
        // Longer keywords get higher scores
        score += keyword.length;
        // Exact matches get bonus
        if (titleLower === keyword.toLowerCase() || titleLower.startsWith(keyword.toLowerCase() + " ") || titleLower.includes(" " + keyword.toLowerCase())) {
          score += 10;
        }
      }
    }
    if (score > 0) {
      topicScores[mapping.topic] = score;
    }
  }

  if (Object.keys(topicScores).length === 0) return null;

  const topTopic = Object.entries(topicScores).sort((a, b) => b[1] - a[1])[0];
  return topTopic[0];
}

/**
 * Get sector for a topic
 */
export function getSectorForTopic(topic: string): string | null {
  const mapping = TOPIC_MAPPINGS.find(m => m.topic === topic);
  return mapping?.sector || null;
}

/**
 * Get all sectors
 */
export function getAllSectors(): string[] {
  return SECTORS.map(s => s.sector);
}

/**
 * Get all topics
 */
export function getAllTopics(): string[] {
  return TOPIC_MAPPINGS.map(t => t.topic);
}

/**
 * Get topics for a sector
 */
export function getTopicsForSector(sector: string): string[] {
  return TOPIC_MAPPINGS
    .filter(t => t.sector === sector)
    .map(t => t.topic);
}

/**
 * Get subcategories for a topic
 */
export function getSubcategoriesForTopic(topic: string): string[] {
  const mapping = TOPIC_MAPPINGS.find(m => m.topic === topic);
  return mapping?.subcategories || [];
}

/**
 * Get topic description
 */
export function getTopicDescription(topic: string): string {
  const mapping = TOPIC_MAPPINGS.find(m => m.topic === topic);
  return mapping?.description || "";
}

/**
 * Get sector description
 */
export function getSectorDescription(sector: string): string {
  const mapping = SECTORS.find(s => s.sector === sector);
  return mapping?.description || "";
}

/**
 * Get match tokens for a sector (keywords + name parts split by "&").
 * Used for smart matching: document matches sector if any token appears in title/excerpt.
 */
export function getSectorMatchTokens(sector: string): string[] {
  const mapping = SECTORS.find(s => s.sector === sector);
  const tokens = new Set<string>();
  if (mapping) {
    mapping.keywords.forEach(k => tokens.add(k.toLowerCase()));
    mapping.topics.forEach(t => tokens.add(t.toLowerCase()));
  }
  sector
    .split(/[\s&]+/)
    .map(p => p.trim().toLowerCase())
    .filter(Boolean)
    .forEach(p => tokens.add(p));
  return Array.from(tokens);
}

/**
 * Get match tokens for a topic (keywords + topic name).
 */
export function getTopicMatchTokens(topic: string): string[] {
  const mapping = TOPIC_MAPPINGS.find(m => m.topic === topic);
  const tokens = new Set<string>([topic.toLowerCase()]);
  if (mapping) {
    mapping.keywords.forEach(k => tokens.add(k.toLowerCase()));
  }
  return Array.from(tokens);
}

/**
 * Smart categorization with sector and topic
 */
export function smartCategorizeWithHierarchy(
  title: string,
  existingCategory?: string,
  url?: string
): {
  mainCategory: string;
  sector: string | null;
  topic: string | null;
} {
  const topic = detectTopicFromTitle(title);
  const sector = topic ? getSectorForTopic(topic) : detectSectorFromTitle(title);
  
  // Get main category from sector or topic
  let mainCategory = "Research & Policy Papers"; // Default
  
  if (sector) {
    const sectorMapping = SECTORS.find(s => s.sector === sector);
    mainCategory = sectorMapping?.mainCategory || mainCategory;
  } else if (topic) {
    const topicMapping = TOPIC_MAPPINGS.find(t => t.topic === topic);
    if (topicMapping) {
      const sectorMapping = SECTORS.find(s => s.sector === topicMapping.sector);
      mainCategory = sectorMapping?.mainCategory || mainCategory;
    }
  }
  
  // Fallback to URL patterns
  if (!sector && !topic && url) {
    const urlLower = url.toLowerCase();
    if (urlLower.includes("/radar") || urlLower.includes("acep-radar")) {
      mainCategory = "ACEP Radar";
    } else if (urlLower.includes("/press") || urlLower.includes("/statement") || urlLower.includes("press-release")) {
      mainCategory = "Press Statements";
    } else if (urlLower.includes("/news") || urlLower.includes("/blog")) {
      mainCategory = "News & Blog Posts";
    } else if (urlLower.includes("/report") || urlLower.includes("/annual")) {
      mainCategory = "Reports";
    } else if (urlLower.includes("/research") || urlLower.includes("/policy")) {
      mainCategory = "Research & Policy Papers";
    }
  }
  
  // Also check existing category field for press-release and acep-radar
  if (existingCategory) {
    const catLower = existingCategory.toLowerCase();
    if (catLower.includes("press-release") || catLower.includes("press-release") || catLower.includes("press statement")) {
      mainCategory = "Press Statements";
    } else if (catLower.includes("acep-radar") || catLower.includes("radar")) {
      mainCategory = "ACEP Radar";
    }
  }
  
  // Use existing category if valid
  if (existingCategory && existingCategory !== "Uncategorized" && !sector && !topic) {
    mainCategory = existingCategory;
  }
  
  return {
    mainCategory,
    sector,
    topic,
  };
}
