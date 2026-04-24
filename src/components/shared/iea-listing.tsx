"use client";

import Link from "next/link";
import { useState } from "react";
import { Search, Filter, Calendar, FileText, Download, ChevronDown, X } from "lucide-react";
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
} from "@/lib/data/library-categorization";

interface IEAListingProps {
  items: Post[];
  title: string;
  description?: string;
  showFilters?: boolean;
  showSearch?: boolean;
  sidebarLinks?: Array<{ title: string; href: string }>;
}

export function IEAListing({
  items,
  title,
  description,
  showFilters = true,
  showSearch = true,
  sidebarLinks,
}: IEAListingProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showCategoryFilter, setShowCategoryFilter] = useState(false);

  // Get all main categories
  const mainCategories = getMainCategories();
  const groupedByCategory = groupByMainCategory(items);

  // Filter items
  let filteredItems = items;
  
  if (selectedCategory) {
    filteredItems = filterByMainCategory(items, selectedCategory);
  }
  
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filteredItems = filteredItems.filter(
      (item) =>
        item.title.toLowerCase().includes(query) ||
        item.excerpt?.toLowerCase().includes(query) ||
        item.category?.toLowerCase().includes(query)
    );
  }

  // Group filtered items by category for display
  const filteredGrouped = selectedCategory
    ? { [selectedCategory]: filteredItems }
    : groupByMainCategory(filteredItems);

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

      {/* Filters and Search - IEA Style */}
      {(showSearch || showFilters) && (
        <div className="border-b border-slate-200 bg-slate-50 sticky top-20 z-40">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col md:flex-row gap-4">
              {showSearch && (
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search publications, news, and more..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-acep-primary focus:border-acep-primary outline-none"
                  />
                </div>
              )}
              
              {showFilters && (
                <div className="relative">
                  <button
                    onClick={() => setShowCategoryFilter(!showCategoryFilter)}
                    className="flex items-center gap-2 px-4 py-2.5 border border-slate-300 rounded-lg bg-white hover:bg-slate-50 transition-colors"
                  >
                    <Filter className="h-5 w-5 text-slate-600" />
                    <span className="text-sm font-medium">
                      {selectedCategory || "All Categories"}
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${
                        showCategoryFilter ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {showCategoryFilter && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setShowCategoryFilter(false)}
                      />
                      <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-slate-200 z-20 py-2">
                        <button
                          onClick={() => {
                            setSelectedCategory(null);
                            setShowCategoryFilter(false);
                          }}
                          className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 ${
                            !selectedCategory ? "bg-acep-primary/10 text-acep-primary font-medium" : ""
                          }`}
                        >
                          All Categories ({items.length})
                        </button>
                        {mainCategories.map((category) => {
                          const count = groupedByCategory[category]?.length || 0;
                          if (count === 0) return null;
                          return (
                            <button
                              key={category}
                              onClick={() => {
                                setSelectedCategory(category);
                                setShowCategoryFilter(false);
                              }}
                              className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 flex items-center justify-between ${
                                selectedCategory === category
                                  ? "bg-acep-primary/10 text-acep-primary font-medium"
                                  : ""
                              }`}
                            >
                              <span>{category}</span>
                              <span className="text-xs text-slate-500">({count})</span>
                            </button>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>
              )}

              {selectedCategory && (
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:text-slate-900"
                >
                  <X className="h-4 w-4" />
                  Clear filter
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content - IEA Style List */}
          <div className="lg:col-span-8">
            {filteredItems.length === 0 ? (
              <div className="py-16 text-center">
                <FileText className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <p className="text-lg font-medium text-slate-900 mb-2">No results found</p>
                <p className="text-sm text-slate-600">
                  {searchQuery || selectedCategory
                    ? "Try adjusting your search or filter criteria"
                    : "No content available at this time"}
                </p>
                {(searchQuery || selectedCategory) && (
                  <Button
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory(null);
                    }}
                    variant="outline"
                    className="mt-4"
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
                                  <div className="relative h-32 w-48 overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
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
                                {/* Category and Topic Badges */}
                                <div className="mb-2 flex flex-wrap gap-2">
                                  <span className="inline-flex items-center px-2.5 py-1 text-xs font-semibold text-acep-primary bg-acep-primary/10 rounded-md uppercase tracking-wide">
                                    {mainCategory}
                                  </span>
                                  {detectTopicFromTitle(item.title || "") && (
                                    <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-100 rounded-md">
                                      {detectTopicFromTitle(item.title || "")}
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

          {/* Sidebar - IEA Style */}
          <aside className="lg:col-span-4">
            <div className="sticky top-24 space-y-6">
              <ResourceCentreSidebar
                variant="listing"
                links={sidebarLinks || RESOURCE_CENTRE_SIDEBAR_LINKS}
              />

              {/* Category Stats */}
              {!selectedCategory && (
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wide">
                    Browse by Category
                  </h3>
                  <div className="space-y-3">
                    {mainCategories.map((category) => {
                      const count = groupedByCategory[category]?.length || 0;
                      if (count === 0) return null;
                      return (
                        <button
                          key={category}
                          onClick={() => setSelectedCategory(category)}
                          className="w-full text-left flex items-center justify-between text-sm text-slate-700 hover:text-acep-primary py-2 px-3 rounded-lg hover:bg-slate-50 transition-colors"
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
