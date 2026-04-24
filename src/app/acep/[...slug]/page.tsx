import { notFound } from "next/navigation";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Download, Calendar, FileText } from "lucide-react";
import {
  acepUrlFromSlug,
  getAcepSnapshotByUrl,
  readAcepSnapshotHtml,
  transformAcepHtmlForLocalAssets,
} from "@/lib/acep-snapshots";
import { getAllPosts, getPostByUrl } from "@/lib/data/posts";
import { getBackNavigation } from "@/lib/data/sidebar-links";
import { ResourceCentreSidebar } from "@/components/shared/resource-centre-sidebar";
import { getMainCategory } from "@/lib/data/categories";

export const dynamic = "force-dynamic";

export default async function AcepSnapshotPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const url = acepUrlFromSlug(slug);
  const entry = await getAcepSnapshotByUrl(url);

  if (!entry || entry.status !== 200 || !entry.savedAs) {
    notFound();
  }

  // Try to get post data from extracted data
  const allPosts = await getAllPosts();
  const postData = getPostByUrl(url, allPosts);

  const html = await readAcepSnapshotHtml(entry.savedAs);
  const transformed = transformAcepHtmlForLocalAssets(html, { extractBody: true });

  // Extract title
  const titleMatch = transformed.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  const title = titleMatch?.[1]?.replace(/<[^>]+>/g, "").trim() || 
                postData?.title || 
                "Untitled";

  // Extract featured image
  const featuredImageMatch = transformed.match(/<img[^>]*class="[^"]*featured[^"]*"[^>]*src="([^"]+)"/i) ||
                               transformed.match(/<img[^>]*src="([^"]+)"[^>]*class="[^"]*wp-post-image[^"]*"/i);
  const featuredImage = featuredImageMatch?.[1]?.replace("https://acep.africa/wp-content/", "/acep-assets/wp-content/") ||
                        postData?.featuredImage?.replace("https://acep.africa/wp-content/", "/acep-assets/wp-content/");

  // Extract date
  const dateMatch = transformed.match(/<time[^>]*>([\s\S]*?)<\/time>/i);
  const dateText = dateMatch?.[1]?.replace(/<[^>]+>/g, "").trim() || postData?.dateText;

  // Extract main content
  const contentMatch = transformed.match(/<div[^>]*class="[^"]*entry-content[^"]*"[^>]*>([\s\S]*?)<\/div>/i) ||
                       transformed.match(/<article[^>]*>([\s\S]*?)<\/article>/i) ||
                       transformed.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
  const content = contentMatch?.[1] || postData?.content || transformed;

  // Extract PDF links
  const pdfLinks: Array<{ url: string; text: string }> = postData?.pdfLinks || [];
  const pdfMatches = transformed.matchAll(/<a[^>]*href="([^"]+\.pdf)"[^>]*>([\s\S]*?)<\/a>/gi);
  for (const match of pdfMatches) {
    if (!pdfLinks.find(p => p.url === match[1])) {
      pdfLinks.push({
        url: match[1].replace("https://acep.africa/wp-content/", "/acep-assets/wp-content/"),
        text: match[2]?.replace(/<[^>]+>/g, "").trim() || "Download PDF",
      });
    }
  }

  // Get context-aware back navigation
  const { link: backLink, text: backText } = getBackNavigation(url, postData?.category, postData?.title);
  
  // Get main category for badge display
  const mainCategory = getMainCategory(postData?.category, postData?.title, url);

  return (
    <div className="min-h-screen bg-[#fafaf9]">
      <div className="border-b border-slate-200 bg-white">
        <div className="container mx-auto px-4 py-10 sm:px-6 md:py-14 lg:px-8">
          <Link
            href={backLink}
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "mb-6 -ml-2 text-slate-700 hover:bg-slate-100 hover:text-acep-primary",
            )}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {backText}
          </Link>

          <div className="max-w-4xl">
            {mainCategory && (
              <div className="mb-4">
                <span className="inline-flex items-center rounded-md border border-acep-primary/20 bg-acep-primary/5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-acep-primary">
                  {mainCategory}
                </span>
              </div>
            )}
            {dateText && (
              <div className="mb-4 flex items-center gap-2 text-sm text-slate-600">
                <Calendar className="h-4 w-4 text-slate-500" aria-hidden />
                <span>{dateText}</span>
              </div>
            )}
            <h1 className="font-display text-3xl font-semibold leading-tight text-slate-900 sm:text-4xl md:text-5xl">
              {title}
            </h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content */}
          <article className="lg:col-span-8">
            {featuredImage && (
              <div className="mb-8 overflow-hidden rounded-lg border border-slate-200 bg-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={featuredImage}
                  alt={title}
                  className="w-full h-auto object-cover"
                />
              </div>
            )}

            <Card>
              <CardContent className="p-6 md:p-8">
                <div
                  className="prose prose-lg max-w-none prose-headings:text-slate-900 prose-p:text-slate-700 prose-a:text-acep-primary prose-a:no-underline hover:prose-a:underline prose-img:rounded-lg prose-img:border prose-img:border-slate-200"
                  dangerouslySetInnerHTML={{ __html: content }}
                />
              </CardContent>
            </Card>

            {/* PDF Downloads */}
            {pdfLinks.length > 0 && (
              <Card className="mt-8">
                <CardContent className="p-6">
                  <h2 className="mb-4 flex items-center text-xl font-semibold text-slate-900">
                    <FileText className="mr-2 h-5 w-5 text-acep-primary" />
                    Related Documents
                  </h2>
                  <div className="space-y-3">
                    {pdfLinks.map((pdf, idx) => (
                      <a
                        key={idx}
                        href={pdf.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between rounded-lg border border-slate-200 p-4 transition-colors hover:border-acep-primary hover:bg-acep-primary/5"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-acep-primary" />
                          <span className="font-medium text-slate-900">{pdf.text}</span>
                        </div>
                        <Download className="h-5 w-5 text-slate-400" />
                      </a>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </article>

          {/* Sidebar */}
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
