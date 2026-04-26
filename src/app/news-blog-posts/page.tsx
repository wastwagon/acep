import { getNewsBlogPosts, getPressStatements, getCmsPublications } from "@/lib/data/posts";
import { LibraryListing } from "@/components/shared/library-listing";

export const dynamic = "force-dynamic";

export default async function NewsBlogPostsPage() {
  // Get news and press statements
  const newsPosts = await getNewsBlogPosts();
  const pressStatements = await getPressStatements();
  const cmsPosts = await getCmsPublications();

  // Filter out invalid entries
  const validItems = [...newsPosts, ...pressStatements, ...cmsPosts].filter((item) => {
    if (item.url) {
      const url = item.url.toLowerCase();
      if (
        url.includes("/category/") ||
        url.includes("/archives/") ||
        url.includes("/blog/") ||
        url.includes("/blogs-news/") ||
        url.includes("/news-blog-posts/") ||
        url.includes("/member/") ||
        url.includes("/newsletter") ||
        url === "https://acep.africa/blogs-news/" ||
        url === "https://acep.africa/news-blog-posts/"
      ) {
        return false;
      }
    }
    if (item.category && item.category.length > 100) {
      return false;
    }
    if (
      !item.title ||
      item.title.length < 5 ||
      item.title.toLowerCase().includes("page not found") ||
      item.title.toLowerCase() === "blog" ||
      item.title.toLowerCase() === "newsletter" ||
      item.title.toLowerCase() === "blogs & news" ||
      item.title.toLowerCase() === "news & blog posts"
    ) {
      return false;
    }
    if (item.excerpt && item.excerpt.length > 500) {
      return false;
    }
    return true;
  });

  // Sort by date (newest first)
  const sortedItems = validItems.sort((a, b) => {
    if (a.dateText && b.dateText) {
      return new Date(b.dateText).getTime() - new Date(a.dateText).getTime();
    }
    return 0;
  });

  const sidebarLinks = [
    { title: "Research & Policy Papers", href: "/research-and-policy-papers" },
    { title: "Press Statements", href: "/press-statements" },
    { title: "ACEP Radar", href: "/radar" },
    { title: "Annual Reports", href: "/annual-reports" },
    { title: "All Reports", href: "/reports" },
    { title: "Photo Gallery", href: "/photo-gallery" },
    { title: "Video Gallery", href: "/video-gallery" },
  ];

  return (
    <LibraryListing
      items={sortedItems}
      title="News & Blog Posts"
      description="Stay updated with the latest news, analysis, commentary, and insights on energy governance, extractive sector transparency, and policy developments in Africa."
      showFilters={true}
      showSearch={true}
      sidebarLinks={sidebarLinks}
    />
  );
}
