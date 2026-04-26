"use client";

import Link from "next/link";
import { useState, useMemo, useCallback, useEffect } from "react";
import { Search, Filter, Calendar, FileText, ChevronDown, X, BookOpen, Layers, Tag, ArrowUpDown, Grid, List, Sparkles, CalendarRange } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { format, parse, isValid } from "date-fns";
import "react-day-picker/style.css";
import { Button } from "@/components/ui/button";
import { PlatformHero } from "@/components/layout/platform-hero";
import { Post } from "@/lib/data/post-types";
import { acepUrlToSlug } from "@/lib/utils/url-helpers";
import { getMainCategory, getMainCategories } from "@/lib/data/categories";
import { 
  smartCategorizeWithHierarchy, 
  getAllSectors, 
  getAllTopics, 
  getTopicsForSector,
  getSectorForTopic,
  getTopicDescription,
  getSectorDescription,
  getSectorMatchTokens,
  getTopicMatchTokens,
  detectTopicFromTitle,
  detectSectorFromTitle,
} from "@/lib/data/library-categorization";
import type { DocumentSearchItem } from "@/lib/data/pdf-registry";
import { ResourceCentreSidebar } from "@/components/shared/resource-centre-sidebar";

interface UnifiedPublicationsProps {
  items: Post[];
  pdfPages?: DocumentSearchItem[];
}

type SortOption = "newest" | "oldest" | "title-asc" | "title-desc" | "relevance";
type ViewMode = "grid" | "list";

export function UnifiedPublications({ items, pdfPages = [] }: UnifiedPublicationsProps) {
  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

  // Default category: policy papers + policy briefs
  const defaultCategories = useMemo(
    () => new Set(["Research & Policy Papers", "Policy Briefs"]),
    []
  );

  // Filter state (multi-select)
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(defaultCategories);
  const [selectedSectors, setSelectedSectors] = useState<Set<string>>(new Set());
  const [selectedTopics, setSelectedTopics] = useState<Set<string>>(new Set());

  // Date range filter (real-time). Compact calendar.
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to?: Date } | undefined>(undefined);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // UI state
  const [activeFilterType, setActiveFilterType] = useState<"category" | "sector" | "topic">("category");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [showFilters, setShowFilters] = useState(true);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Get all filter options
  const mainCategories = getMainCategories();
  const sectors = getAllSectors();
  const topics = getAllTopics();

  // Calculate counts and extract metadata for all items
  const itemsWithMetadata = useMemo(() => {
    return items.map(item => {
      const hierarchy = smartCategorizeWithHierarchy(item.title || "", item.category, item.url);
      const topic = hierarchy.topic || detectTopicFromTitle(item.title || "");
      const sector = hierarchy.sector || detectSectorFromTitle(item.title || "");
      const mainCategory = getMainCategory(item.category, item.title, item.url);
      
      // Extract all possible categories, sectors, and topics this item could belong to
      const allCategories = new Set<string>([mainCategory]);
      const allSectors = new Set<string>();
      const allTopics = new Set<string>();

      if (sector) allSectors.add(sector);
      if (topic) {
        allTopics.add(topic);
        const topicSector = getSectorForTopic(topic);
        if (topicSector) allSectors.add(topicSector);
      }

      // Smart matching: use keywords + name tokens so "Climate & Environment" matches "climate" or "environment"
      const titleLower = (item.title || "").toLowerCase();
      const excerptLower = (item.excerpt || "").toLowerCase();
      const searchable = `${titleLower} ${excerptLower}`;

      sectors.forEach(s => {
        const tokens = getSectorMatchTokens(s);
        if (tokens.some(tok => searchable.includes(tok))) {
          allSectors.add(s);
        }
      });

      topics.forEach(t => {
        const tokens = getTopicMatchTokens(t);
        if (tokens.some(tok => searchable.includes(tok))) {
          allTopics.add(t);
          const topicSector = getSectorForTopic(t);
          if (topicSector) allSectors.add(topicSector);
        }
      });

      // Use item.tags when available (e.g. tag-energy-access -> Energy Access)
      (item.tags || []).forEach(tag => {
        const tagNorm = typeof tag === "string" ? tag.replace(/^tag-/, "").replace(/-/g, " ").trim() : "";
        if (!tagNorm) return;
        const tagLower = tagNorm.toLowerCase();
        topics.forEach(t => {
          if (t.toLowerCase().includes(tagLower) || tagLower.includes(t.toLowerCase())) {
            allTopics.add(t);
            const topicSector = getSectorForTopic(t);
            if (topicSector) allSectors.add(topicSector);
          }
        });
        sectors.forEach(s => {
          if (s.toLowerCase().includes(tagLower) || tagLower.includes(s.toLowerCase())) {
            allSectors.add(s);
          }
        });
      });

      return {
        ...item,
        metadata: {
          mainCategory,
          sector,
          topic,
          allCategories: Array.from(allCategories),
          allSectors: Array.from(allSectors),
          allTopics: Array.from(allTopics),
        },
      };
    });
  }, [items, sectors, topics]);

  // Calculate filter counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    mainCategories.forEach(cat => {
      counts[cat] = itemsWithMetadata.filter(item => 
        item.metadata.allCategories.includes(cat)
      ).length;
    });
    return counts;
  }, [itemsWithMetadata, mainCategories]);

  const sectorCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    sectors.forEach(sector => {
      counts[sector] = itemsWithMetadata.filter(item => 
        item.metadata.allSectors.includes(sector)
      ).length;
    });
    return counts;
  }, [itemsWithMetadata, sectors]);

  const topicCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    topics.forEach(topic => {
      counts[topic] = itemsWithMetadata.filter(item => 
        item.metadata.allTopics.includes(topic)
      ).length;
    });
    return counts;
  }, [itemsWithMetadata, topics]);

  const parsePublicationDate = useCallback((dateText: string | undefined): Date | null => {
    if (!dateText || typeof dateText !== "string") return null;
    const trimmed = dateText.trim();
    if (!trimmed) return null;
    const formats = ["MMMM d, yyyy", "MMM d, yyyy", "yyyy-MM-dd", "d MMM yyyy"];
    for (const fmt of formats) {
      try {
        const d = parse(trimmed, fmt, new Date());
        if (isValid(d)) return d;
      } catch {
        /* try next */
      }
    }
    const fallback = new Date(trimmed);
    return isValid(fallback) ? fallback : null;
  }, []);

  // Filter items
  const filteredItems = useMemo(() => {
    let result = itemsWithMetadata;

    // Search filter (real-time): tokenize query, require all words to appear
    if (debouncedSearchQuery) {
      const words = debouncedSearchQuery
        .toLowerCase()
        .trim()
        .split(/\s+/)
        .filter(Boolean);
      result = result.filter(item => {
        const searchableText = [
          item.title,
          item.excerpt,
          item.category,
          ...item.metadata.allCategories,
          ...item.metadata.allSectors,
          ...item.metadata.allTopics,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return words.every(w => searchableText.includes(w));
      });
    }

    // Smart filters: OR across category / sector / topic (match ANY selected)
    const hasAnyFilter =
      selectedCategories.size > 0 ||
      selectedSectors.size > 0 ||
      selectedTopics.size > 0;
    if (hasAnyFilter) {
      result = result.filter(
        (item) =>
          (selectedCategories.size > 0 &&
            item.metadata.allCategories.some((cat) =>
              selectedCategories.has(cat)
            )) ||
          (selectedSectors.size > 0 &&
            item.metadata.allSectors.some((sec) =>
              selectedSectors.has(sec)
            )) ||
          (selectedTopics.size > 0 &&
            item.metadata.allTopics.some((top) => selectedTopics.has(top)))
      );
    }

    // Date range filter (real-time)
    if (dateRange?.from ?? dateRange?.to) {
      const from = dateRange.from ? dateRange.from.getTime() : null;
      const to = dateRange.to ? dateRange.to.getTime() : null;
      result = result.filter((item) => {
        const d = parsePublicationDate(item.dateText);
        if (!d) return false;
        const t = d.getTime();
        if (from != null && t < from) return false;
        if (to != null && t > to) return false;
        return true;
      });
    }

    // Sort
    result = [...result].sort((a, b) => {
      const aTime = a.dateText ? new Date(a.dateText).getTime() : 0;
      const bTime = b.dateText ? new Date(b.dateText).getTime() : 0;
      switch (sortBy) {
        case "newest":
          if (!a.dateText && !b.dateText) return 0;
          if (!a.dateText) return 1;
          if (!b.dateText) return -1;
          return bTime - aTime;
        case "oldest":
          if (!a.dateText && !b.dateText) return 0;
          if (!a.dateText) return 1;
          if (!b.dateText) return -1;
          return aTime - bTime;
        case "title-asc":
          return (a.title || "").localeCompare(b.title || "");
        case "title-desc":
          return (b.title || "").localeCompare(a.title || "");
        case "relevance":
          // If search query exists, prioritize items with query in title
          if (debouncedSearchQuery) {
            const query = debouncedSearchQuery.toLowerCase();
            const aTitle = (a.title || "").toLowerCase();
            const bTitle = (b.title || "").toLowerCase();
            if (aTitle.includes(query) && !bTitle.includes(query)) return -1;
            if (!aTitle.includes(query) && bTitle.includes(query)) return 1;
          }
          return 0;
        default:
          return 0;
      }
    });

    return result;
  }, [itemsWithMetadata, debouncedSearchQuery, selectedCategories, selectedSectors, selectedTopics, dateRange, sortBy, parsePublicationDate]);

  const hasAnyFilter =
    selectedCategories.size > 0 ||
    selectedSectors.size > 0 ||
    selectedTopics.size > 0;

  const matchingDocs = useMemo(() => {
    if (hasAnyFilter || pdfPages.length === 0 || !debouncedSearchQuery) return [];
    const words = debouncedSearchQuery
      .toLowerCase()
      .trim()
      .split(/\s+/)
      .filter(Boolean);
    return pdfPages.filter((doc) => {
      const searchable = [
        doc.title,
        doc.description,
        ...doc.publicationTitles,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return words.every((w) => searchable.includes(w));
    });
  }, [pdfPages, debouncedSearchQuery, hasAnyFilter]);

  // Toggle filter functions
  const toggleCategory = useCallback((category: string) => {
    setSelectedCategories(prev => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  }, []);

  const toggleSector = useCallback((sector: string) => {
    setSelectedSectors(prev => {
      const next = new Set(prev);
      if (next.has(sector)) {
        next.delete(sector);
      } else {
        next.add(sector);
      }
      return next;
    });
  }, []);

  const toggleTopic = useCallback((topic: string) => {
    setSelectedTopics(prev => {
      const next = new Set(prev);
      if (next.has(topic)) {
        next.delete(topic);
      } else {
        next.add(topic);
      }
      return next;
    });
  }, []);

  const clearAllFilters = useCallback(() => {
    setSelectedCategories(new Set());
    setSelectedSectors(new Set());
    setSelectedTopics(new Set());
    setDateRange(undefined);
    setShowDatePicker(false);
    setSearchQuery("");
  }, []);

  const hasDateFilter = !!(dateRange?.from ?? dateRange?.to);
  const activeFiltersCount =
    selectedCategories.size + selectedSectors.size + selectedTopics.size + (hasDateFilter ? 1 : 0);

  return (
    <div className="min-h-screen bg-[#fafaf9]">
      <PlatformHero
        badge={
          <span className="inline-flex items-center gap-2 rounded-acepBtn border border-slate-200/90 bg-white/95 px-4 py-2 text-sm font-semibold text-acep-primary shadow-sm backdrop-blur-sm">
            <Sparkles className="h-4 w-4 text-acep-secondary" aria-hidden />
            Library & analysis
          </span>
        }
        title="Publications"
        description="Research papers, reports, press statements, and analysis on energy governance, extractive-sector transparency, and policy across Africa."
        actions={
          <div className="flex w-full max-w-xl flex-wrap items-center justify-center gap-3 text-sm text-slate-600">
            <span className="inline-flex items-center gap-2 rounded-acepBtn border border-slate-200 bg-white px-3 py-1.5 font-medium shadow-sm">
              <FileText className="h-4 w-4 text-acep-primary" aria-hidden />
              {items.length.toLocaleString()} publications
            </span>
            {pdfPages.length > 0 ? (
              <span className="inline-flex items-center gap-2 rounded-acepBtn border border-slate-200 bg-white px-3 py-1.5 font-medium shadow-sm">
                <FileText className="h-4 w-4 text-acep-primary" aria-hidden />
                {pdfPages.length} documents
              </span>
            ) : null}
            <span className="inline-flex items-center gap-2 rounded-acepBtn border border-slate-200 bg-white px-3 py-1.5 font-medium shadow-sm">
              <Tag className="h-4 w-4 text-acep-primary" aria-hidden />
              {topics.length} topics
            </span>
            <span className="inline-flex items-center gap-2 rounded-acepBtn border border-slate-200 bg-white px-3 py-1.5 font-medium shadow-sm">
              <BookOpen className="h-4 w-4 text-acep-primary" aria-hidden />
              {sectors.length} sectors
            </span>
          </div>
        }
      />

      {/* Search and Controls Bar — mobile-first, premium */}
      <div className="border-b border-slate-200 bg-slate-50/80 sticky top-20 z-40 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex flex-col gap-3 sm:gap-4">
            {/* Search Bar */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-[1.1rem] text-slate-400" />
              <input
                type="text"
                placeholder="Search by title, topic, sector, keyword…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-10 py-2.5 sm:py-3 border border-slate-200 rounded-acepBtn bg-white text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-slate-300 focus:border-slate-400 outline-none text-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Controls Row — compact, touch-friendly */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              {/* Filter Type Selector */}
              <div className="flex gap-1.5 sm:gap-2 border-r border-slate-200 pr-2 sm:pr-3">
                <button
                  onClick={() => {
                    setActiveFilterType("category");
                    setShowFilterDropdown(false);
                  }}
                  className={`px-2.5 py-1.5 sm:px-3 text-xs sm:text-sm font-medium rounded-acepBtn transition-colors touch-manipulation ${
                    activeFilterType === "category"
                      ? "bg-acep-primary text-white"
                      : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
                  }`}
                >
                  <Layers className="inline h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1" />
                  Category
                </button>
                <button
                  onClick={() => {
                    setActiveFilterType("sector");
                    setShowFilterDropdown(false);
                  }}
                  className={`px-2.5 py-1.5 sm:px-3 text-xs sm:text-sm font-medium rounded-acepBtn transition-colors touch-manipulation ${
                    activeFilterType === "sector"
                      ? "bg-acep-primary text-white"
                      : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
                  }`}
                >
                  <BookOpen className="inline h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1" />
                  Sector
                </button>
                <button
                  onClick={() => {
                    setActiveFilterType("topic");
                    setShowFilterDropdown(false);
                  }}
                  className={`px-2.5 py-1.5 sm:px-3 text-xs sm:text-sm font-medium rounded-acepBtn transition-colors touch-manipulation ${
                    activeFilterType === "topic"
                      ? "bg-acep-primary text-white"
                      : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
                  }`}
                >
                  <Tag className="inline h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1" />
                  Topic
                </button>
              </div>

              {/* Filter Dropdown */}
              <div className="relative flex-1 min-w-0 sm:min-w-[180px]">
                <button
                  onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                  className="w-full flex items-center justify-between gap-2 px-3 py-2 sm:px-4 sm:py-2.5 border border-slate-200 rounded-acepBtn bg-white hover:bg-slate-50 transition-colors text-left"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Filter className="h-4 w-4 sm:h-[1.1rem] text-slate-500 flex-shrink-0" />
                    <span className="text-xs sm:text-sm font-medium text-slate-700 truncate">
                      {activeFilterType === "category" ? "Categories" : activeFilterType === "sector" ? "Sectors" : "Topics"}
                    </span>
                    {activeFiltersCount > 0 && (
                      <span className="text-[10px] sm:text-xs font-medium bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded flex-shrink-0">
                        {activeFiltersCount}
                      </span>
                    )}
                  </div>
                  <ChevronDown
                    className={`h-4 w-4 flex-shrink-0 text-slate-400 transition-transform ${
                      showFilterDropdown ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {showFilterDropdown && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      aria-hidden
                      onClick={() => setShowFilterDropdown(false)}
                    />
                    <div className="absolute left-0 mt-2 w-full max-w-md bg-white rounded-acepCard shadow-lg border border-slate-200 z-20 py-2 max-h-[min(70vh,24rem)] overflow-y-auto">
                      {activeFilterType === "category" && mainCategories.map((category) => {
                        const count = categoryCounts[category] || 0;
                        // Show all categories, even if count is 0 (they might have items that need proper categorization)
                        const isSelected = selectedCategories.has(category);
                        return (
                          <label
                            key={category}
                            className="flex items-center gap-3 px-3 py-2 sm:px-4 sm:py-2.5 hover:bg-slate-50 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleCategory(category)}
                              className="rounded border-slate-300 text-slate-600 focus:ring-slate-400"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-slate-800">{category}</div>
                            </div>
                            <span className={`text-xs px-2 py-0.5 rounded flex-shrink-0 ${
                              count > 0 
                                ? "text-slate-500 bg-slate-100" 
                                : "text-slate-400 bg-slate-50"
                            }`}>
                              {count}
                            </span>
                          </label>
                        );
                      })}
                      {activeFilterType === "sector" && sectors.map((sector) => {
                        const count = sectorCounts[sector] || 0;
                        const isSelected = selectedSectors.has(sector);
                        return (
                          <label
                            key={sector}
                            className="flex items-center gap-3 px-3 py-2 sm:px-4 sm:py-2.5 hover:bg-slate-50 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleSector(sector)}
                              className="rounded border-slate-300 text-slate-600 focus:ring-slate-400"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-slate-800">{sector}</div>
                              <div className="text-xs text-slate-500 mt-0.5">{getSectorDescription(sector)}</div>
                            </div>
                            <span className={`text-xs px-2 py-0.5 rounded flex-shrink-0 ${
                              count > 0 ? "text-slate-500 bg-slate-100" : "text-slate-400 bg-slate-50"
                            }`}>
                              {count}
                            </span>
                          </label>
                        );
                      })}
                      {activeFilterType === "topic" && topics.map((topic) => {
                        const count = topicCounts[topic] || 0;
                        const isSelected = selectedTopics.has(topic);
                        const sector = getSectorForTopic(topic);
                        return (
                          <label
                            key={topic}
                            className="flex items-center gap-3 px-3 py-2 sm:px-4 sm:py-2.5 hover:bg-slate-50 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleTopic(topic)}
                              className="rounded border-slate-300 text-slate-600 focus:ring-slate-400"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-slate-800">{topic}</div>
                              {sector && (
                                <div className="text-xs text-slate-500 mt-0.5">Sector: {sector}</div>
                              )}
                            </div>
                            <span className={`text-xs px-2 py-0.5 rounded flex-shrink-0 ${
                              count > 0 ? "text-slate-500 bg-slate-100" : "text-slate-400 bg-slate-50"
                            }`}>
                              {count}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>

              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="appearance-none bg-white border border-slate-200 rounded-acepBtn px-3 py-2 sm:px-4 sm:py-2.5 pr-8 text-xs sm:text-sm font-medium text-slate-700 focus:ring-2 focus:ring-slate-300 focus:border-slate-400 outline-none cursor-pointer"
                >
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                  <option value="title-asc">A–Z</option>
                  <option value="title-desc">Z–A</option>
                  {debouncedSearchQuery && <option value="relevance">Relevance</option>}
                </select>
                <ArrowUpDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
              </div>

              {/* View Mode Toggle */}
              <div className="flex border border-slate-200 rounded-acepBtn overflow-hidden">
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 sm:px-3 sm:py-2 touch-manipulation ${viewMode === "list" ? "bg-acep-primary text-white" : "bg-white text-slate-600 hover:bg-slate-50"}`}
                >
                  <List className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 sm:px-3 sm:py-2 touch-manipulation ${viewMode === "grid" ? "bg-acep-primary text-white" : "bg-white text-slate-600 hover:bg-slate-50"}`}
                >
                  <Grid className="h-4 w-4" />
                </button>
              </div>

              {/* Date range — compact calendar, real-time */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setShowDatePicker((v) => !v);
                    setShowFilterDropdown(false);
                  }}
                  className={`flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 border rounded-acepBtn transition-colors text-sm ${
                    hasDateFilter
                      ? "border-slate-400 bg-slate-50 text-slate-800"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-300"
                  }`}
                >
                  <CalendarRange className="h-4 w-4 sm:h-[1.1rem]" />
                  <span className="font-medium hidden sm:inline">Date range</span>
                  {hasDateFilter && (
                    <span className="text-[10px] sm:text-xs font-medium bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded">1</span>
                  )}
                </button>
                {showDatePicker && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      aria-hidden
                      onClick={() => setShowDatePicker(false)}
                    />
                    <div className="date-range-picker-popover date-range-picker-compact absolute right-0 mt-2 z-20 bg-white rounded-acepCard shadow-lg border border-slate-200 p-3 sm:p-4">
                      <DayPicker
                        mode="range"
                        selected={dateRange ?? { from: undefined, to: undefined }}
                        onSelect={(r) => setDateRange(r)}
                        numberOfMonths={2}
                        defaultMonth={dateRange?.from ?? dateRange?.to ?? new Date()}
                      />
                      <div className="flex justify-between items-center mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() => {
                            setDateRange(undefined);
                            setShowDatePicker(false);
                          }}
                          className="text-xs sm:text-sm text-slate-500 hover:text-slate-700"
                        >
                          Clear dates
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowDatePicker(false)}
                          className="text-xs sm:text-sm font-medium text-slate-700 hover:text-slate-900"
                        >
                          Done
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Clear Filters */}
              {(activeFiltersCount > 0 || searchQuery) && (
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="flex items-center gap-1.5 px-2.5 py-2 sm:px-3 rounded-acepBtn border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 text-xs sm:text-sm font-medium"
                >
                  <X className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  Clear
                </button>
              )}
            </div>

            {/* Active Filters Display */}
            {(selectedCategories.size > 0 || selectedSectors.size > 0 || selectedTopics.size > 0 || hasDateFilter) && (
              <div className="flex flex-wrap gap-1.5 sm:gap-2 pt-2 sm:pt-3 border-t border-slate-200">
                {hasDateFilter && (
                  <button
                    type="button"
                    onClick={() => {
                      setDateRange(undefined);
                      setShowDatePicker(false);
                    }}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-slate-100 text-slate-700 rounded-acepBtn hover:bg-slate-200"
                  >
                    <CalendarRange className="h-3 w-3" />
                    {dateRange?.from && dateRange?.to
                      ? `${format(dateRange.from, "MMM d")} – ${format(dateRange.to, "MMM d, yyyy")}`
                      : dateRange?.from
                        ? `From ${format(dateRange.from, "MMM d, yyyy")}`
                        : dateRange?.to
                          ? `Until ${format(dateRange.to, "MMM d, yyyy")}`
                          : "Date range"}
                    <X className="h-3 w-3" />
                  </button>
                )}
                {Array.from(selectedCategories).map(cat => (
                  <button
                    key={cat}
                    onClick={() => toggleCategory(cat)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-slate-100 text-slate-700 rounded-acepBtn hover:bg-slate-200"
                  >
                    {cat}
                    <X className="h-3 w-3" />
                  </button>
                ))}
                {Array.from(selectedSectors).map(sec => (
                  <button
                    key={sec}
                    onClick={() => toggleSector(sec)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-slate-100 text-slate-700 rounded-acepBtn hover:bg-slate-200"
                  >
                    {sec}
                    <X className="h-3 w-3" />
                  </button>
                ))}
                {Array.from(selectedTopics).map(top => (
                  <button
                    key={top}
                    onClick={() => toggleTopic(top)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-slate-100 text-slate-700 rounded-acepBtn hover:bg-slate-200"
                  >
                    {top}
                    <X className="h-3 w-3" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="container mx-auto bg-white px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-8">
            {filteredItems.length === 0 && matchingDocs.length === 0 ? (
              <div className="rounded-acepCard border border-slate-200/90 bg-white px-6 py-14 text-center shadow-sm ring-1 ring-slate-950/[0.04] sm:px-10">
                <FileText className="mx-auto mb-4 h-14 w-14 text-slate-300" aria-hidden />
                <p className="font-display text-lg font-medium text-slate-900">
                  {hasAnyFilter ? "No publications found" : "No publications or documents found"}
                </p>
                <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-600">
                  {searchQuery || activeFiltersCount > 0
                    ? "Try broadening your search, clearing the date range, or resetting filters."
                    : "No publications are available in this view yet."}
                </p>
                {(searchQuery || activeFiltersCount > 0) && (
                  <Button onClick={clearAllFilters} variant="outline" className="mt-6 rounded-acepBtn">
                    Clear all filters
                  </Button>
                )}
              </div>
            ) : (
              <>
                <div className="mb-6 flex items-center justify-between">
                  <p className="text-sm text-slate-600">
                    {filteredItems.length > 0 && matchingDocs.length > 0 && (
                      <>
                        <span className="font-semibold text-slate-900">{filteredItems.length}</span> publication{filteredItems.length !== 1 ? "s" : ""}
                        {" · "}
                        <span className="font-semibold text-slate-900">{matchingDocs.length}</span> document{matchingDocs.length !== 1 ? "s" : ""}
                      </>
                    )}
                    {filteredItems.length > 0 && matchingDocs.length === 0 && (
                      <>
                        Showing <span className="font-semibold text-slate-900">{filteredItems.length}</span> of{" "}
                        <span className="font-semibold text-slate-900">{items.length}</span> publications
                      </>
                    )}
                    {filteredItems.length === 0 && matchingDocs.length > 0 && (
                      <>
                        <span className="font-semibold text-slate-900">{matchingDocs.length}</span> document{matchingDocs.length !== 1 ? "s" : ""} found
                      </>
                    )}
                  </p>
                </div>

                <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5" : "space-y-4 sm:space-y-5"}>
                  {filteredItems.map((item, idx) => {
                    const slug = item.url ? acepUrlToSlug(item.url) : [];
                    const href = item.url && item.url !== "#" ? `/publications/${slug.join("/")}` : "#";

                    return (
                      <article
                        key={idx}
                        className={`group rounded-acepCard border border-slate-200/80 bg-white p-4 sm:p-5 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 ${
                          viewMode === "list" ? "flex gap-4 sm:gap-6" : ""
                        }`}
                      >
                        <div className={viewMode === "grid" ? "flex flex-col" : "flex gap-4 sm:gap-6 min-w-0 flex-1"}>
                          {/* Image (only in list view) */}
                          {viewMode === "list" && item.featuredImage && (
                            <Link
                              href={href}
                              className="hidden sm:block flex-shrink-0 group-hover:opacity-95 transition-opacity"
                            >
                              <div className="relative h-28 w-40 sm:h-32 sm:w-48 overflow-hidden rounded-acepBtn border border-slate-200 bg-slate-100">
                                <img
                                  src={item.featuredImage.replace(
                                    "https://acep.africa/wp-content/",
                                    "/acep-assets/wp-content/"
                                  )}
                                  alt={item.title}
                                  className="h-full w-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                                  loading="lazy"
                                />
                              </div>
                            </Link>
                          )}

                          {/* Content */}
                          <div className="min-w-0 flex-1">
                            {/* Badges — clean, soft, no dark blue */}
                            <div className="mb-2 flex flex-wrap gap-1.5">
                              {item.metadata.allCategories.map(cat => (
                                <span
                                  key={cat}
                                  className="inline-flex items-center px-2 py-0.5 text-[11px] sm:text-xs font-medium rounded-acepBtn uppercase tracking-wide text-slate-600 bg-slate-100 border border-slate-200/60"
                                >
                                  {cat}
                                </span>
                              ))}
                              {item.metadata.allSectors.slice(0, 2).map(sec => (
                                <span
                                  key={sec}
                                  className="inline-flex items-center px-2 py-0.5 text-[11px] sm:text-xs font-medium rounded-acepBtn text-slate-600 bg-slate-50 border border-slate-200/60"
                                >
                                  {sec}
                                </span>
                              ))}
                              {item.metadata.allTopics.slice(0, 2).map(top => (
                                <span
                                  key={top}
                                  className="inline-flex items-center px-2 py-0.5 text-[11px] sm:text-xs font-medium rounded-acepBtn text-slate-500 bg-slate-50/80 border border-slate-200/50"
                                >
                                  {top}
                                </span>
                              ))}
                            </div>

                            {/* Date */}
                            {item.dateText && (
                              <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1.5">
                                <Calendar className="h-3.5 w-3.5" />
                                <span>{item.dateText}</span>
                              </div>
                            )}

                            {/* Title */}
                            <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-1.5 group-hover:text-slate-700 transition-colors leading-snug">
                              <Link href={href} className="hover:underline">
                                {item.title}
                              </Link>
                            </h3>

                            {/* Excerpt */}
                            {item.excerpt && (
                              <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed mb-3">
                                {item.excerpt}
                              </p>
                            )}

                            {/* Actions */}
                            <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
                              <Link
                                href={href}
                                className="inline-flex items-center text-sm font-medium text-slate-700 hover:text-slate-900 hover:underline"
                              >
                                Read more
                                <span className="ml-1">→</span>
                              </Link>
                              
                              {item.pdfLinks && item.pdfLinks.length > 0 && (
                                <div className="flex items-center gap-1.5">
                                  <FileText className="h-3.5 w-3.5 text-slate-400" />
                                  <span className="text-xs text-slate-500">
                                    {item.pdfLinks.length} PDF{item.pdfLinks.length !== 1 ? "s" : ""}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                  {matchingDocs.map((doc) => (
                    <article
                      key={doc.slug}
                      className="group rounded-acepCard border border-slate-200/80 bg-white p-4 sm:p-5 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200"
                    >
                      <div className="flex flex-col min-w-0">
                        <div className="min-w-0 flex-1">
                          <span className="inline-flex items-center px-2 py-0.5 text-[11px] sm:text-xs font-medium rounded-acepBtn uppercase tracking-wide text-slate-600 bg-slate-100 border border-slate-200/60 mb-2">
                            Document
                          </span>
                          <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-1.5 group-hover:text-slate-700 transition-colors leading-snug">
                            <Link href={`/library/document/${doc.slug}`} className="hover:underline">
                              {doc.title}
                            </Link>
                          </h3>
                          {doc.description && (
                            <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed mb-3">
                              {doc.description}
                            </p>
                          )}
                          {doc.publicationTitles.length > 0 && (
                            <p className="text-xs text-slate-500 mb-3">
                              From: {doc.publicationTitles.slice(0, 3).join(", ")}
                              {doc.publicationTitles.length > 3 && ` +${doc.publicationTitles.length - 3} more`}
                            </p>
                          )}
                          <Link
                            href={`/library/document/${doc.slug}`}
                            className="inline-flex items-center text-sm font-medium text-slate-700 hover:text-slate-900 hover:underline"
                          >
                            View document
                            <span className="ml-1">→</span>
                          </Link>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Sidebar — compact, premium */}
          <aside className="lg:col-span-4">
            <div className="sticky top-24 space-y-4">
              <ResourceCentreSidebar
                variant="listing"
                className="border-slate-200/80 p-4 shadow-sm"
              />
              {/* Browse by Sector */}
              <div className="rounded-acepCard border border-slate-200/80 bg-white p-4 shadow-sm">
                <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wide flex items-center gap-2 mb-3">
                  <BookOpen className="h-3.5 w-3.5" />
                  Browse by Sector
                </h3>
                <div className="space-y-1 max-h-56 overflow-y-auto">
                  {sectors.map((sector) => {
                    const count = sectorCounts[sector] || 0;
                    const isSelected = selectedSectors.has(sector);
                    return (
                      <button
                        key={sector}
                        onClick={() => toggleSector(sector)}
                        className={`w-full text-left flex items-center justify-between text-xs sm:text-sm py-2 px-2.5 rounded-acepBtn transition-colors ${
                          isSelected
                            ? "bg-slate-100 text-slate-800 font-medium"
                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-800"
                        } ${count === 0 ? "opacity-50" : ""}`}
                      >
                        <span className="truncate">{sector}</span>
                        <span className={`text-[10px] sm:text-xs px-1.5 py-0.5 rounded flex-shrink-0 ${
                          count > 0 ? "text-slate-500 bg-slate-100" : "text-slate-400 bg-slate-50"
                        }`}>
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Browse by Topic */}
              <div className="rounded-acepCard border border-slate-200/80 bg-white p-4 shadow-sm">
                <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wide flex items-center gap-2 mb-3">
                  <Tag className="h-3.5 w-3.5" />
                  Browse by Topic
                </h3>
                <div className="space-y-1 max-h-72 overflow-y-auto">
                  {topics.map((topic) => {
                    const count = topicCounts[topic] || 0;
                    const isSelected = selectedTopics.has(topic);
                    const sector = getSectorForTopic(topic);
                    return (
                      <button
                        key={topic}
                        onClick={() => toggleTopic(topic)}
                        className={`w-full text-left flex items-center justify-between gap-2 text-xs sm:text-sm py-2 px-2.5 rounded-acepBtn transition-colors ${
                          isSelected
                            ? "bg-slate-100 text-slate-800 font-medium"
                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-800"
                        } ${count === 0 ? "opacity-50" : ""}`}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="truncate">{topic}</div>
                          {sector && (
                            <div className="text-[10px] sm:text-xs text-slate-500 mt-0.5 truncate">{sector}</div>
                          )}
                        </div>
                        <span className={`text-[10px] sm:text-xs px-1.5 py-0.5 rounded flex-shrink-0 ${
                          count > 0 ? "text-slate-500 bg-slate-100" : "text-slate-400 bg-slate-50"
                        }`}>
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
