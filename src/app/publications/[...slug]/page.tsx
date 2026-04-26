import { notFound } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Download, Calendar, FileText, ExternalLink } from "lucide-react";
import { getAcepSnapshotByUrl, readAcepSnapshotHtml, transformAcepHtmlForLocalAssets } from "@/lib/acep-snapshots";
import { acepUrlFromSlug } from "@/lib/acep-snapshots";
import { getAllPublications, getPostByUrl } from "@/lib/data/posts";
import { loadPdfRegistry, getResolvedPdfsForPublication } from "@/lib/data/pdf-registry";
import { getBackNavigation } from "@/lib/data/sidebar-links";
import { ResourceCentreSidebar } from "@/components/shared/resource-centre-sidebar";
import { getMainCategory } from "@/lib/data/categories";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { slugToTitle, isGenericLinkText } from "@/lib/utils/url-helpers";
import { stripCommentSection } from "@/lib/utils/html-utils";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function PublicationDetailPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const isCmsPost = slug[0] === "cms" && slug.length >= 2;

  if (isCmsPost) {
    const cmsSlug = slug[1];
    const post = await prisma.cmsPost.findFirst({
      where: { slug: cmsSlug, status: "PUBLISHED" },
    });
    if (!post) notFound();

    const title = post.title;
    const content = post.content;
    const dateText = (post.publishedAt ?? post.updatedAt).toISOString().slice(0, 10);
    const url = `https://acep.africa/cms/${post.slug}/`;
    const backNav = getBackNavigation(url, "CMS Posts", title);
    const breadcrumbItems = [
      { label: "Home", href: "/" },
      { label: backNav.breadcrumbLabel, href: backNav.link },
      { label: title },
    ];

    return (
      <div className="min-h-screen bg-[#fafaf9]">
        <div className="border-b border-slate-200 bg-white">
          <div className="container mx-auto px-4 py-10 sm:px-6 md:py-14 lg:px-8">
            <Breadcrumbs items={breadcrumbItems} variant="dark" className="mb-6" />
            <div className="max-w-4xl">
              <div className="mb-4">
                <span className="inline-flex items-center rounded-acepBtn border border-acep-primary/20 bg-acep-primary/5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-acep-primary">
                  CMS Post
                </span>
              </div>
              <div className="mb-4 flex items-center gap-2 text-sm text-slate-600">
                <Calendar className="h-4 w-4 text-slate-500" aria-hidden />
                <span>{dateText}</span>
              </div>
              <h1 className="font-display text-2xl font-semibold leading-tight text-slate-900 sm:text-3xl md:text-4xl">
                {title}
              </h1>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <article className="lg:col-span-8">
              <Card>
                <CardContent className="p-6 md:p-8">
                  <div
                    className="prose prose-lg max-w-none prose-headings:text-slate-900 prose-p:text-slate-700 prose-a:text-acep-primary prose-a:no-underline hover:prose-a:underline"
                    dangerouslySetInnerHTML={{ __html: content }}
                  />
                </CardContent>
              </Card>
            </article>

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

  const url = acepUrlFromSlug(slug);

  const allPublications = await getAllPublications();
  const postData = getPostByUrl(url, allPublications);

  const entry = await getAcepSnapshotByUrl(url);
  if (!entry || entry.status !== 200 || !entry.savedAs) {
    notFound();
  }

  const html = await readAcepSnapshotHtml(entry.savedAs);
  const transformed = transformAcepHtmlForLocalAssets(html, { extractBody: true });

  // Extract title: use known publication title when available; otherwise PDF- or slug-derived
  const titleMatch = transformed.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  const h1Title = titleMatch?.[1]?.replace(/<[^>]+>/g, "").trim() || "";
  const knownTitle =
    h1Title || (postData?.title && postData.title.trim() && postData.title !== "Untitled" ? postData.title : "");

  // Extract featured image
  const featuredImageMatch = transformed.match(/<img[^>]*class="[^"]*featured[^"]*"[^>]*src="([^"]+)"/i) ||
    transformed.match(/<img[^>]*src="([^"]+)"[^>]*class="[^"]*wp-post-image[^"]*"/i);
  const featuredImage =
    featuredImageMatch?.[1]?.replace("https://acep.africa/wp-content/", "/acep-assets/wp-content/") ||
    postData?.featuredImage?.replace("https://acep.africa/wp-content/", "/acep-assets/wp-content/");

  // Extract date
  const dateMatch = transformed.match(/<time[^>]*>([\s\S]*?)<\/time>/i);
  const dateText = dateMatch?.[1]?.replace(/<[^>]+>/g, "").trim() || postData?.dateText;

  // Extract main content
  const contentMatch =
    transformed.match(/<div[^>]*class="[^"]*entry-content[^"]*"[^>]*>([\s\S]*?)<\/div>/i) ||
    transformed.match(/<article[^>]*>([\s\S]*?)<\/article>/i) ||
    transformed.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
  const rawContent = contentMatch?.[1] || postData?.content || transformed;
  const content = stripCommentSection(rawContent);

  const pdfLinks: Array<{ url: string; text: string }> = postData?.pdfLinks || [];
  const pdfMatches = transformed.matchAll(/<a[^>]*href="([^"]+\.pdf)"[^>]*>([\s\S]*?)<\/a>/gi);
  for (const match of pdfMatches) {
    const href = match[1].replace("https://acep.africa/wp-content/", "/acep-assets/wp-content/");
    if (!pdfLinks.some((p) => p.url === href || p.url === match[1])) {
      pdfLinks.push({
        url: href,
        text: match[2]?.replace(/<[^>]+>/g, "").trim() || "Download PDF",
      });
    }
  }

  const registry = await loadPdfRegistry();
  const syntheticPost = postData ?? {
    url,
    title: knownTitle || "Untitled",
    excerpt: undefined,
    pdfLinks,
    category: undefined,
    tags: [],
  };
  const resolvedPdfs = getResolvedPdfsForPublication(registry, syntheticPost);

  // Prefer known title; else use PDF-derived (linkText or slug) or slug-derived from page URL
  const pdfDerived = resolvedPdfs[0]
    ? !isGenericLinkText(resolvedPdfs[0].linkText)
      ? resolvedPdfs[0].linkText
      : slugToTitle(resolvedPdfs[0].slug)
    : "";
  const title = knownTitle || pdfDerived || (slug.length ? slugToTitle(slug) : "") || "Untitled";

  const mainCategory = getMainCategory(postData?.category, postData?.title, url);
  const backNav = getBackNavigation(url, postData?.category, postData?.title ?? title);

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: backNav.breadcrumbLabel, href: backNav.link },
    { label: title },
  ];

  return (
    <div className="min-h-screen bg-[#fafaf9]">
      <div className="border-b border-slate-200 bg-white">
        <div className="container mx-auto px-4 py-10 sm:px-6 md:py-14 lg:px-8">
          <Breadcrumbs items={breadcrumbItems} variant="dark" className="mb-6" />

          <div className="max-w-4xl">
            {mainCategory && (
              <div className="mb-4">
                <span className="inline-flex items-center rounded-acepBtn border border-acep-primary/20 bg-acep-primary/5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-acep-primary">
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
            <h1 className="font-display text-2xl font-semibold leading-tight text-slate-900 sm:text-3xl md:text-4xl">
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
              <div className="mb-8 overflow-hidden rounded-acepCard border border-slate-200 bg-white">
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
                  className="prose prose-lg max-w-none prose-headings:text-slate-900 prose-p:text-slate-700 prose-a:text-acep-primary prose-a:no-underline hover:prose-a:underline prose-img:rounded-acepBtn prose-img:border prose-img:border-slate-200"
                  dangerouslySetInnerHTML={{ __html: content }}
                />
                {/* Read full / Download — directly below description, with short copy */}
                {resolvedPdfs.length > 0 && (
                  <div className="mt-8 rounded-acepCard border-t border-slate-200 bg-gradient-to-br from-slate-50 to-acep-primary/5 p-6 pt-8 md:p-8">
                    <p className="mb-4 max-w-2xl text-slate-700">
                      Read the full publication in your browser or download it to your device.
                    </p>
                    <div className="flex flex-wrap items-center gap-3">
                      <a
                        href={resolvedPdfs[0].appUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-acepBtn bg-acep-primary text-white font-medium hover:bg-acep-primary/90 transition-colors shadow-sm"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Read full publication
                      </a>
                      <a
                        href={resolvedPdfs[0].appUrl}
                        download={resolvedPdfs[0].filename}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-acepBtn border-2 border-acep-primary text-acep-primary font-medium hover:bg-acep-primary/5 transition-colors"
                      >
                        <Download className="h-4 w-4" />
                        Download
                      </a>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Related Documents: only when there are additional PDFs beyond the primary one */}
            {resolvedPdfs.length > 1 && (
              <Card className="mt-8">
                <CardContent className="p-6">
                  <h2 className="mb-4 flex items-center text-xl font-semibold text-slate-900">
                    <FileText className="mr-2 h-5 w-5 text-acep-primary" />
                    Related Documents
                  </h2>
                  <div className="space-y-3">
                    {resolvedPdfs.slice(1).map((pdf) => (
                      <div
                        key={pdf.slug}
                        className="flex flex-wrap items-center justify-between gap-3 rounded-acepCard border border-slate-200 p-4 transition-colors hover:border-acep-primary hover:bg-acep-primary/5"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <FileText className="h-5 w-5 flex-shrink-0 text-acep-primary" />
                          <span className="font-medium text-slate-900">{pdf.linkText}</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <a
                            href={pdf.appUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-acepBtn bg-acep-primary text-white hover:bg-acep-primary/90"
                          >
                            <ExternalLink className="h-4 w-4" />
                            Read full
                          </a>
                          <a
                            href={pdf.appUrl}
                            download={pdf.filename}
                            className="inline-flex items-center gap-1.5 rounded-acepBtn border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                          >
                            <Download className="h-4 w-4" />
                            Download
                          </a>
                        </div>
                      </div>
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
