"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Download, Calendar, Search, Filter, ChevronDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Post } from "@/lib/data/post-types";
import { getMainCategory, getMainCategories, filterByMainCategory } from "@/lib/data/categories";
import { acepUrlToSlug } from "@/lib/utils/url-helpers";
import { ResourceCentreSidebar } from "@/components/shared/resource-centre-sidebar";

interface ReportsListingProps {
  reports: Post[];
}

export function ReportsListing({ reports }: ReportsListingProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [showCategoryFilter, setShowCategoryFilter] = useState(false);
  const [showYearFilter, setShowYearFilter] = useState(false);

  // Get all years
  const allYears = useMemo(() => {
    const years = new Set<string>();
    reports.forEach((report) => {
      const year = report.dateText?.match(/\d{4}/)?.[0] || "Unknown";
      years.add(year);
    });
    return Array.from(years).sort((a, b) => {
      if (a === "Unknown") return 1;
      if (b === "Unknown") return -1;
      return parseInt(b) - parseInt(a);
    });
  }, [reports]);

  // Get all main categories
  const mainCategories = getMainCategories();
  const groupedByCategory = useMemo(() => {
    const grouped: Record<string, Post[]> = {};
    reports.forEach((report) => {
      const mainCat = getMainCategory(report.category, report.title, report.url);
      if (!grouped[mainCat]) grouped[mainCat] = [];
      grouped[mainCat].push(report);
    });
    return grouped;
  }, [reports]);

  // Filter reports
  let filteredReports = reports;

  if (selectedCategory) {
    filteredReports = filterByMainCategory(filteredReports, selectedCategory);
  }

  if (selectedYear) {
    filteredReports = filteredReports.filter((report) => {
      const year = report.dateText?.match(/\d{4}/)?.[0] || "Unknown";
      return year === selectedYear;
    });
  }

  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filteredReports = filteredReports.filter(
      (report) =>
        report.title.toLowerCase().includes(query) ||
        report.excerpt?.toLowerCase().includes(query) ||
        report.category?.toLowerCase().includes(query)
    );
  }

  // Group filtered reports by year
  const reportsByYear: Record<string, Post[]> = {};
  filteredReports.forEach((report) => {
    const year = report.dateText?.match(/\d{4}/)?.[0] || "Unknown";
    if (!reportsByYear[year]) {
      reportsByYear[year] = [];
    }
    reportsByYear[year].push(report);
  });

  const sortedYears = Object.keys(reportsByYear).sort((a, b) => {
    if (a === "Unknown") return 1;
    if (b === "Unknown") return -1;
    return parseInt(b) - parseInt(a);
  });

  // Get year counts
  const yearCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    reports.forEach((report) => {
      const year = report.dateText?.match(/\d{4}/)?.[0] || "Unknown";
      counts[year] = (counts[year] || 0) + 1;
    });
    return counts;
  }, [reports]);

  return (
    <div className="min-h-screen bg-[#fafaf9]">
      <div className="border-b border-slate-200 bg-white">
        <div className="container mx-auto px-4 py-10 sm:px-6 md:py-14 lg:px-8">
          <h1 className="font-display text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
            Reports & Publications
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-slate-600">
            Access comprehensive reports, analyses, policy papers, and publications from ACEP
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="border-b border-slate-200 bg-slate-50 sticky top-20 z-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search reports..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-acepBtn focus:ring-2 focus:ring-acep-primary focus:border-acep-primary outline-none"
              />
            </div>

            <div className="relative">
              <button
                onClick={() => {
                  setShowCategoryFilter(!showCategoryFilter);
                  setShowYearFilter(false);
                }}
                className="flex items-center gap-2 px-4 py-2.5 border border-slate-300 rounded-acepBtn bg-white hover:bg-slate-50 transition-colors"
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
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-acepCard shadow-xl border border-slate-200 z-20 py-2">
                    <button
                      onClick={() => {
                        setSelectedCategory(null);
                        setShowCategoryFilter(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 ${
                        !selectedCategory ? "bg-acep-primary/10 text-acep-primary font-medium" : ""
                      }`}
                    >
                      All Categories ({reports.length})
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

            <div className="relative">
              <button
                onClick={() => {
                  setShowYearFilter(!showYearFilter);
                  setShowCategoryFilter(false);
                }}
                className="flex items-center gap-2 px-4 py-2.5 border border-slate-300 rounded-acepBtn bg-white hover:bg-slate-50 transition-colors"
              >
                <Calendar className="h-5 w-5 text-slate-600" />
                <span className="text-sm font-medium">
                  {selectedYear || "All Years"}
                </span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    showYearFilter ? "rotate-180" : ""
                  }`}
                />
              </button>

              {showYearFilter && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowYearFilter(false)}
                  />
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-acepCard shadow-xl border border-slate-200 z-20 py-2 max-h-96 overflow-y-auto">
                    <button
                      onClick={() => {
                        setSelectedYear(null);
                        setShowYearFilter(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 ${
                        !selectedYear ? "bg-acep-primary/10 text-acep-primary font-medium" : ""
                      }`}
                    >
                      All Years ({reports.length})
                    </button>
                    {allYears.map((year) => (
                      <button
                        key={year}
                        onClick={() => {
                          setSelectedYear(year);
                          setShowYearFilter(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 flex items-center justify-between ${
                          selectedYear === year
                            ? "bg-acep-primary/10 text-acep-primary font-medium"
                            : ""
                        }`}
                      >
                        <span>{year}</span>
                        <span className="text-xs text-slate-500">({yearCounts[year] || 0})</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {(selectedCategory || selectedYear || searchQuery) && (
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedCategory(null);
                  setSelectedYear(null);
                  setSearchQuery("");
                }}
                className="flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                Clear
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="lg:col-span-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-acep-primary">{filteredReports.length}</div>
              <div className="text-sm text-slate-600 mt-1">Total Reports</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-acep-primary">
                {filteredReports.filter((r) => r.pdfLinks.length > 0).length}
              </div>
              <div className="text-sm text-slate-600 mt-1">PDF Documents</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-acep-primary">{sortedYears.length}</div>
              <div className="text-sm text-slate-600 mt-1">Years Covered</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-acep-primary">
                {new Set(filteredReports.map((r) => getMainCategory(r.category, r.title, r.url)).filter(Boolean)).size}
              </div>
              <div className="text-sm text-slate-600 mt-1">Categories</div>
            </CardContent>
          </Card>
        </div>

        {/* Results */}
        {filteredReports.length === 0 ? (
          <div className="py-16 text-center">
            <FileText className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <p className="text-lg font-medium text-slate-900 mb-2">No results found</p>
            <p className="text-sm text-slate-600 mb-4">
              Try adjusting your search or filter criteria
            </p>
            <Button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory(null);
                setSelectedYear(null);
              }}
              variant="outline"
            >
              Clear all filters
            </Button>
          </div>
        ) : (
          <div className="space-y-8">
            {sortedYears.map((year) => (
              <div key={year}>
                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
                  <Calendar className="mr-2 h-6 w-6 text-acep-primary" />
                  {year}
                  <span className="ml-3 text-lg font-normal text-slate-500">
                    ({reportsByYear[year].length} {reportsByYear[year].length === 1 ? "report" : "reports"})
                  </span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {reportsByYear[year].map((report, idx) => {
                    const mainCategory = getMainCategory(report.category, report.title, report.url);
                    const slug = acepUrlToSlug(report.url);
                    const detailHref =
                      report.url && report.url !== "#"
                        ? `/publications/${slug.join("/")}`
                        : "#";
                    return (
                      <Card key={idx} className="hover:shadow-lg transition-shadow h-full flex flex-col">
                        {report.featuredImage && (
                          <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
                            <img
                              src={report.featuredImage.replace(
                                "https://acep.africa/wp-content/",
                                "/acep-assets/wp-content/"
                              )}
                              alt={report.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <CardHeader className="flex-1">
                          {mainCategory && (
                            <div className="text-xs font-semibold text-acep-primary mb-2 uppercase tracking-wide">
                              {mainCategory}
                            </div>
                          )}
                          <CardTitle className="text-lg line-clamp-2 hover:text-acep-primary transition-colors">
                            <Link href={detailHref}>{report.title}</Link>
                          </CardTitle>
                          {report.dateText && (
                            <CardDescription className="flex items-center gap-1 text-xs">
                              <Calendar className="h-3 w-3" />
                              {report.dateText}
                            </CardDescription>
                          )}
                        </CardHeader>
                        <CardContent className="flex-1 flex flex-col justify-between">
                          {report.excerpt && (
                            <p className="text-sm text-slate-600 line-clamp-3 mb-4">{report.excerpt}</p>
                          )}
                          <div className="space-y-2">
                            {report.pdfLinks.length > 0 && (
                              <div className="space-y-1">
                                {report.pdfLinks.slice(0, 2).map((pdf, pdfIdx) => (
                                  <a
                                    key={pdfIdx}
                                    href={pdf.url.replace(
                                      "https://acep.africa/wp-content/",
                                      "/acep-assets/wp-content/"
                                    )}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-sm text-acep-primary hover:text-acep-primary/80 font-medium"
                                  >
                                    <FileText className="h-4 w-4" />
                                    <span className="truncate">{pdf.text}</span>
                                    <Download className="h-3 w-3 ml-auto" />
                                  </a>
                                ))}
                                {report.pdfLinks.length > 2 && (
                                  <div className="text-xs text-slate-500">
                                    +{report.pdfLinks.length - 2} more document
                                    {report.pdfLinks.length - 2 !== 1 ? "s" : ""}
                                  </div>
                                )}
                              </div>
                            )}
                            <Link
                              href={detailHref}
                              className="text-sm font-semibold text-acep-primary hover:underline inline-flex items-center"
                            >
                              Read More →
                            </Link>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
          </div>

          <aside className="lg:col-span-4">
            <div className="sticky top-24 space-y-6">
              <ResourceCentreSidebar />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
