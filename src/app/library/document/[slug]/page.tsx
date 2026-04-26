import { notFound } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Download, FileText, ExternalLink } from "lucide-react";
import { loadPdfRegistry, getPdfBySlug } from "@/lib/data/pdf-registry";
import { ResourceCentreSidebar } from "@/components/shared/resource-centre-sidebar";
import { acepUrlToSlug, slugToTitle } from "@/lib/utils/url-helpers";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";

export const dynamic = "force-dynamic";

export default async function LibraryDocumentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const registry = await loadPdfRegistry();
  const pdf = getPdfBySlug(registry, slug);
  if (!pdf) notFound();

  const primary = pdf.publications[0];
  const title =
    primary?.title && primary.title.trim() && primary.title !== "Untitled"
      ? primary.title
      : slugToTitle(pdf.slug) || pdf.filename.replace(/\.pdf$/i, "").replace(/[-_]/g, " ");
  const description = primary?.excerpt ?? `PDF document: ${pdf.filename}`;

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Publications", href: "/publications" },
    { label: title },
  ];

  return (
    <div className="min-h-screen bg-[#fafaf9]">
      <div className="border-b border-slate-200 bg-white">
        <div className="container mx-auto px-4 py-10 sm:px-6 md:py-14 lg:px-8">
          <Breadcrumbs items={breadcrumbItems} variant="dark" className="mb-6" />
          <div className="max-w-4xl">
            <span className="mb-4 inline-flex items-center gap-2 rounded-acepBtn border border-acep-primary/20 bg-acep-primary/5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-acep-primary">
              <FileText className="h-4 w-4" aria-hidden />
              Document
            </span>
            <h1 className="font-display text-2xl font-semibold leading-tight text-slate-900 sm:text-3xl md:text-4xl">
              {title}
            </h1>
            <p className="mt-4 max-w-3xl text-lg text-slate-600">{description}</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-6">
            <Card>
              <CardContent className="p-6 md:p-8">
                <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-slate-900">
                  <FileText className="h-5 w-5 text-acep-primary" />
                  Download or read
                </h2>
                <div className="flex flex-wrap gap-3">
                  <a
                    href={pdf.appUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-acepBtn bg-acep-primary text-white font-medium hover:bg-acep-primary/90 transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Read full publication
                  </a>
                  <a
                    href={pdf.appUrl}
                    download={pdf.filename}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-acepBtn border-2 border-acep-primary text-acep-primary font-medium hover:bg-acep-primary/5 transition-colors"
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </a>
                </div>
              </CardContent>
            </Card>

            {pdf.publications.length > 0 && (
              <Card>
                <CardContent className="p-6 md:p-8">
                  <h2 className="mb-4 text-xl font-semibold text-slate-900">
                    From publication{pdf.publications.length !== 1 ? "s" : ""}
                  </h2>
                  <ul className="space-y-3">
                    {pdf.publications.map((pub) => {
                      const segs = acepUrlToSlug(pub.url);
                      const href = segs.length ? `/publications/${segs.join("/")}` : "/publications";
                      return (
                        <li key={pub.url}>
                          <Link
                            href={href}
                            className="block rounded-acepCard border border-slate-200 p-3 transition-colors hover:border-acep-primary hover:bg-acep-primary/5"
                          >
                            <span className="font-medium text-slate-900">{pub.title}</span>
                            {pub.linkText && pub.linkText !== "Download PDF" && (
                              <span className="ml-2 text-sm text-slate-500">— {pub.linkText}</span>
                            )}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </CardContent>
              </Card>
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
