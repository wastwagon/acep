"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { Search, Filter, Calendar, FileText, Download, ChevronDown, X, BookOpen, Layers, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Post } from "@/lib/data/post-types";
import { acepUrlToSlug } from "@/lib/utils/url-helpers";
import { getMainCategory, getMainCategories, filterByMainCategory, groupByMainCategory, getSectors, getTopics, getTopicsBySector } from "@/lib/data/categories";
import { RESOURCE_CENTRE_SIDEBAR_LINKS } from "@/lib/data/sidebar-links";
import { ResourceCentreSidebar } from "@/components/shared/resource-centre-sidebar";
import { 
  smartCategorizeWithHierarchy, 
  getAllSectors, 
  getAllTopics, 
  getTopicsForSector,
  getSectorForTopic,
  getSubcategoriesForTopic,
  getTopicDescription,
  getSectorDescription,
  detectTopicFromTitle,
  detectSectorFromTitle,
} from "@/lib/data/library-categorization";

interface LibraryListingProps {
  items: Post[];
  title: string;
  description?: string;
  showFilters?: boolean;
  showSearch?: boolean;
  sidebarLinks?: Array<{ title: string; href: string }>;
}

interface FilterOption {
  label: string;
  count: number;
  value: string;
  description?: string;
  sector?: string;
}

export function LibraryListing({
  items,
  title,
  description,
  showFilters = true,
  showSearch = true,
  sidebarLinks,
}: LibraryListingProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [activeFilterType, setActiveFilterType] = useState<"category" | "sector" | "topic">("category");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  // Get all filter options
  const mainCategories = getMainCategories();
  const sectors = getAllSectors();
  const topics = getAllTopics();
  
  // Calculate counts for each filter type
  const categoryCounts = useMemo(() => {
    const grouped = groupByMainCategory(items);
    const counts: Record<string, number> = {};
    mainCategories.forEach(cat => {
      counts[cat] = grouped[cat]?.length || 0;
    });
    return counts;
  }, [items, mainCategories]);

  const sectorCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    sectors.forEach(sector => {
      const sectorTopics = getTopicsForSector(sector);
      counts[sector] = items.filter(item => {
        const detectedSector = detectSectorFromTitle(item.title || "");
        return detectedSector === sector;
      }).length;
    });
    return counts;
  }, [items, sectors]);

  const topicCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    topics.forEach(topic => {
      counts[topic] = items.filter(item => {
        const detectedTopic = detectTopicFromTitle(item.title || "");
        return detectedTopic === topic;
      }).length;
    });
    return counts;
  }, [items, topics]);

  // Filter items based on all active filters
  let filteredItems = items;

  if (selectedCategory) {
    filteredItems = filterByMainCategory(filteredItems, selectedCategory);
  }

  if (selectedSector) {
    filteredItems = filteredItems.filter(item => {
      const detectedSector = detectSectorFromTitle(item.title || "");
      return detectedSector === selectedSector;
    });
  }

  if (selectedTopic) {
    filteredItems = filteredItems.filter(item => {
      const detectedTopic = detectTopicFromTitle(item.title || "");
      return detectedTopic === selectedTopic;
    });
  }

  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filteredItems = filteredItems.filter(
      (item) =>
        item.title.toLowerCase().includes(query) ||
        item.excerpt?.toLowerCase().includes(query) ||
        item.category?.toLowerCase().includes(query) ||
        detectTopicFromTitle(item.title || "")?.toLowerCase().includes(query) ||
        detectSectorFromTitle(item.title || "")?.toLowerCase().includes(query)
    );
  }

  // Group filtered items by category for display
  const filteredGrouped = selectedCategory
    ? { [selectedCategory]: filteredItems }
    : groupByMainCategory(filteredItems);

  // Get active filter label
  const getActiveFilterLabel = () => {
    if (selectedTopic) return selectedTopic;
    if (selectedSector) return selectedSector;
    if (selectedCategory) return selectedCategory;
    return `All ${activeFilterType === "category" ? "Categories" : activeFilterType === "sector" ? "Sectors" : "Topics"}`;
  };

  // Get filter options based on active filter type
  const getFilterOptions = (): FilterOption[] => {
    if (activeFilterType === "category") {
      return mainCategories.map(cat => ({
        label: cat,
        count: categoryCounts[cat] || 0,
        value: cat,
      }));
    } else if (activeFilterType === "sector") {
      return sectors.map(sector => ({
        label: sector,
        count: sectorCounts[sector] || 0,
        value: sector,
        description: getSectorDescription(sector),
      }));
    } else {
      return topics.map(topic => ({
        label: topic,
        count: topicCounts[topic] || 0,
        value: topic,
        description: getTopicDescription(topic),
        sector: getSectorForTopic(topic) ?? undefined,
      }));
    }
  };

  const filterOptions = getFilterOptions();

  return (
    <div className="min-h-screen bg-[#fafaf9]">
      <div className="border-b border-slate-200 bg-white">
        <div className="container mx-auto px-4 py-10 sm:px-6 md:py-14 lg:px-8">
          <h1 className="font-display text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
            {title}
          </h1>
          {description && <p className="mt-4 max-w-3xl text-lg text-slate-600">{description}</p>}
        </div>
      </div>

      {/* Enhanced Filters and Search - Library Style */}
      {(showSearch || showFilters) && (
        <div className="border-b border-slate-200 bg-slate-50 sticky top-20 z-40">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col gap-4">
              {/* Search Bar */}
              {showSearch && (
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by title, topic, sector, or keyword..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-acepBtn focus:ring-2 focus:ring-acep-primary focus:border-acep-primary outline-none"
                  />
                </div>
              )}

              {/* Filter Type Selector and Filter Dropdown */}
              {showFilters && (
                <div className="flex flex-wrap gap-3 items-center">
                  {/* Filter Type Buttons */}
                  <div className="flex gap-2 border-r border-slate-300 pr-3">
                    <button
                      onClick={() => {
                        setActiveFilterType("category");
                        setSelectedCategory(null);
                        setSelectedSector(null);
                        setSelectedTopic(null);
                        setShowFilterDropdown(false);
                      }}
                      className={`px-3 py-1.5 text-sm font-medium rounded-acepBtn transition-colors ${
                        activeFilterType === "category"
                          ? "bg-acep-primary text-white"
                          : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-300"
                      }`}
                    >
                      <Layers className="inline h-4 w-4 mr-1.5" />
                      Category
                    </button>
                    <button
                      onClick={() => {
                        setActiveFilterType("sector");
                        setSelectedCategory(null);
                        setSelectedSector(null);
                        setSelectedTopic(null);
                        setShowFilterDropdown(false);
                      }}
                      className={`px-3 py-1.5 text-sm font-medium rounded-acepBtn transition-colors ${
                        activeFilterType === "sector"
                          ? "bg-acep-primary text-white"
                          : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-300"
                      }`}
                    >
                      <BookOpen className="inline h-4 w-4 mr-1.5" />
                      Sector
                    </button>
                    <button
                      onClick={() => {
                        setActiveFilterType("topic");
                        setSelectedCategory(null);
                        setSelectedSector(null);
                        setSelectedTopic(null);
                        setShowFilterDropdown(false);
                      }}
                      className={`px-3 py-1.5 text-sm font-medium rounded-acepBtn transition-colors ${
                        activeFilterType === "topic"
                          ? "bg-acep-primary text-white"
                          : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-300"
                      }`}
                    >
                      <Tag className="inline h-4 w-4 mr-1.5" />
                      Topic
                    </button>
                  </div>

                  {/* Filter Dropdown */}
                  <div className="relative flex-1 min-w-[200px]">
                    <button
                      onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                      className="w-full flex items-center justify-between gap-2 px-4 py-2.5 border border-slate-300 rounded-acepBtn bg-white hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Filter className="h-5 w-5 text-slate-600" />
                        <span className="text-sm font-medium">
                          {getActiveFilterLabel()}
                        </span>
                      </div>
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${
                          showFilterDropdown ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {showFilterDropdown && (
                      <>
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setShowFilterDropdown(false)}
                        />
                        <div className="absolute left-0 mt-2 w-full max-w-md bg-white rounded-acepBtn shadow-xl border border-slate-200 z-20 py-2 max-h-96 overflow-y-auto">
                          <button
                            onClick={() => {
                              if (activeFilterType === "category") setSelectedCategory(null);
                              if (activeFilterType === "sector") setSelectedSector(null);
                              if (activeFilterType === "topic") setSelectedTopic(null);
                              setShowFilterDropdown(false);
                            }}
                            className={`w-full text-left px-4 py-2.5 text-sm hover:bg-slate-50 ${
                              !selectedCategory && !selectedSector && !selectedTopic
                                ? "bg-acep-primary/10 text-acep-primary font-medium"
                                : ""
                            }`}
                          >
                            All {activeFilterType === "category" ? "Categories" : activeFilterType === "sector" ? "Sectors" : "Topics"} ({items.length})
                          </button>
                          <div className="border-t border-slate-200 my-1" />
                          {filterOptions
                            .filter(opt => opt.count > 0)
                            .map((option) => {
                              const isSelected = 
                                (activeFilterType === "category" && selectedCategory === option.value) ||
                                (activeFilterType === "sector" && selectedSector === option.value) ||
                                (activeFilterType === "topic" && selectedTopic === option.value);
                              
                              return (
                                <button
                                  key={option.value}
                                  onClick={() => {
                                    if (activeFilterType === "category") {
                                      setSelectedCategory(option.value);
                                      setSelectedSector(null);
                                      setSelectedTopic(null);
                                    } else if (activeFilterType === "sector") {
                                      setSelectedSector(option.value);
                                      setSelectedCategory(null);
                                      setSelectedTopic(null);
                                    } else {
                                      setSelectedTopic(option.value);
                                      setSelectedCategory(null);
                                      setSelectedSector(null);
                                    }
                                    setShowFilterDropdown(false);
                                  }}
                                  className={`w-full text-left px-4 py-2.5 text-sm hover:bg-slate-50 ${
                                    isSelected
                                      ? "bg-acep-primary/10 text-acep-primary font-medium"
                                      : ""
                                  }`}
                                >
                                  <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                      <div className="font-medium">{option.label}</div>
                                      {option.description && (
                                        <div className="text-xs text-slate-500 mt-0.5">{option.description}</div>
                                      )}
                                      {option.sector && (
                                        <div className="text-xs text-acep-primary mt-0.5">Sector: {option.sector}</div>
                                      )}
                                    </div>
                                    <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded ml-2">
                                      {option.count}
                                    </span>
                                  </div>
                                </button>
                              );
                            })}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Clear Filters */}
                  {(selectedCategory || selectedSector || selectedTopic || searchQuery) && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedCategory(null);
                        setSelectedSector(null);
                        setSelectedTopic(null);
                        setSearchQuery("");
                      }}
                      className="flex items-center gap-2"
                    >
                      <X className="h-4 w-4" />
                      Clear
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content - Library Style List */}
          <div className="lg:col-span-8">
            {filteredItems.length === 0 ? (
              <div className="py-16 text-center">
                <FileText className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <p className="text-lg font-medium text-slate-900 mb-2">No results found</p>
                <p className="text-sm text-slate-600 mb-4">
                  {searchQuery || selectedCategory || selectedSector || selectedTopic
                    ? "Try adjusting your search or filter criteria"
                    : "No content available at this time"}
                </p>
                {(searchQuery || selectedCategory || selectedSector || selectedTopic) && (
                  <Button
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory(null);
                      setSelectedSector(null);
                      setSelectedTopic(null);
                    }}
                    variant="outline"
                  >
                    Clear all filters
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-8">
                {Object.entries(filteredGrouped).map(([category, categoryItems]) => (
                  <section key={category} className="space-y-6">
                    {!selectedCategory && Object.keys(filteredGrouped).length > 1 && (
                      <h2 className="text-2xl font-bold text-slate-900 border-b border-slate-200 pb-3">
                        {category}
                        <span className="ml-2 text-lg font-normal text-slate-500">
                          ({categoryItems.length})
                        </span>
                      </h2>
                    )}

                    <div className="divide-y divide-slate-200">
                      {categoryItems.map((item, idx) => {
                        const slug = item.url ? acepUrlToSlug(item.url) : [];
                        const href = item.url && item.url !== "#" ? `/publications/${slug.join("/")}` : "#";
                        const mainCategory = getMainCategory(item.category, item.title, item.url);
                        const hierarchy = smartCategorizeWithHierarchy(item.title || "", item.category, item.url);
                        const topic = hierarchy.topic || detectTopicFromTitle(item.title || "");
                        const sector = hierarchy.sector || detectSectorFromTitle(item.title || "");

                        return (
                          <article
                            key={idx}
                            className="py-6 group hover:bg-slate-50/50 transition-colors"
                          >
                            <div className="flex gap-6">
                              {/* Image */}
                              {item.featuredImage && (
                                <Link
                                  href={href}
                                  className="hidden sm:block flex-shrink-0 group-hover:opacity-90 transition-opacity"
                                >
                                  <div className="relative h-32 w-48 overflow-hidden rounded-acepBtn border border-slate-200 bg-slate-100">
                                    <img
                                      src={item.featuredImage.replace(
                                        "https://acep.africa/wp-content/",
                                        "/acep-assets/wp-content/"
                                      )}
                                      alt={item.title}
                                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                                      loading="lazy"
                                    />
                                  </div>
                                </Link>
                              )}

                              {/* Content */}
                              <div className="min-w-0 flex-1">
                                {/* Category, Sector, and Topic Badges */}
                                <div className="mb-2 flex flex-wrap gap-2">
                                  <span className="inline-flex items-center px-2.5 py-1 text-xs font-semibold text-acep-primary bg-acep-primary/10 rounded-acepBtn uppercase tracking-wide">
                                    {mainCategory}
                                  </span>
                                  {sector && (
                                    <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium text-blue-700 bg-blue-50 rounded-acepBtn">
                                      {sector}
                                    </span>
                                  )}
                                  {topic && (
                                    <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-100 rounded-acepBtn">
                                      {topic}
                                    </span>
                                  )}
                                </div>

                                {/* Date */}
                                {item.dateText && (
                                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                                    <Calendar className="h-3.5 w-3.5" />
                                    <span>{item.dateText}</span>
                                  </div>
                                )}

                                {/* Title */}
                                <h3 className="text-xl font-semibold text-slate-900 mb-2 group-hover:text-acep-primary transition-colors">
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
                                <div className="flex items-center gap-4 flex-wrap">
                                  <Link
                                    href={href}
                                    className="inline-flex items-center text-sm font-semibold text-acep-primary hover:text-acep-primary/80 hover:underline"
                                  >
                                    Read more
                                    <span className="ml-1">→</span>
                                  </Link>
                                  
                                  {item.pdfLinks && item.pdfLinks.length > 0 && (
                                    <div className="flex items-center gap-2">
                                      <FileText className="h-4 w-4 text-slate-400" />
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
                    </div>
                  </section>
                ))}
              </div>
            )}
          </div>

          {/* Enhanced Sidebar - Library Style */}
          <aside className="lg:col-span-4">
            <div className="sticky top-24 space-y-6">
              <ResourceCentreSidebar
                variant="listing"
                links={sidebarLinks || RESOURCE_CENTRE_SIDEBAR_LINKS}
              />

              {/* Browse by Sector */}
              {!selectedSector && (
                <div className="rounded-acepCard border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wide flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    Browse by Sector
                  </h3>
                  <div className="space-y-2">
                    {sectors.map((sector) => {
                      const count = sectorCounts[sector] || 0;
                      if (count === 0) return null;
                      const topics = getTopicsForSector(sector);
                      return (
                        <button
                          key={sector}
                          onClick={() => {
                            setActiveFilterType("sector");
                            setSelectedSector(sector);
                            setSelectedCategory(null);
                            setSelectedTopic(null);
                          }}
                          className="w-full text-left flex items-center justify-between text-sm text-slate-700 hover:text-acep-primary py-2 px-3 rounded-acepBtn hover:bg-slate-50 transition-colors"
                        >
                          <div className="flex-1">
                            <div className="font-medium">{sector}</div>
                            <div className="text-xs text-slate-500 mt-0.5">
                              {topics.length} topic{topics.length !== 1 ? "s" : ""}
                            </div>
                          </div>
                          <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                            {count}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Browse by Topic */}
              {!selectedTopic && (
                <div className="rounded-acepCard border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wide flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    Browse by Topic
                  </h3>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {topics.map((topic) => {
                      const count = topicCounts[topic] || 0;
                      if (count === 0) return null;
                      const sector = getSectorForTopic(topic);
                      return (
                        <button
                          key={topic}
                          onClick={() => {
                            setActiveFilterType("topic");
                            setSelectedTopic(topic);
                            setSelectedCategory(null);
                            setSelectedSector(null);
                          }}
                          className="w-full text-left flex items-center justify-between text-sm text-slate-700 hover:text-acep-primary py-2 px-3 rounded-acepBtn hover:bg-slate-50 transition-colors"
                        >
                          <div className="flex-1">
                            <div className="font-medium">{topic}</div>
                            {sector && (
                              <div className="text-xs text-slate-500 mt-0.5">{sector}</div>
                            )}
                          </div>
                          <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                            {count}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Browse by Category */}
              {!selectedCategory && (
                <div className="rounded-acepCard border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wide flex items-center gap-2">
                    <Layers className="h-4 w-4" />
                    Browse by Category
                  </h3>
                  <div className="space-y-2">
                    {mainCategories.map((category) => {
                      const count = categoryCounts[category] || 0;
                      if (count === 0) return null;
                      return (
                        <button
                          key={category}
                          onClick={() => {
                            setActiveFilterType("category");
                            setSelectedCategory(category);
                            setSelectedSector(null);
                            setSelectedTopic(null);
                          }}
                          className="w-full text-left flex items-center justify-between text-sm text-slate-700 hover:text-acep-primary py-2 px-3 rounded-acepBtn hover:bg-slate-50 transition-colors"
                        >
                          <span>{category}</span>
                          <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                            {count}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
