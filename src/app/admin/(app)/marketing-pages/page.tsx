import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/db";
import { MARKETING_PROSE_SLUGS } from "@/lib/marketing-page-slugs";
import { Pencil, ExternalLink } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function MarketingPagesListPage() {
  const rows = await prisma.cmsMarketingPage.findMany({ orderBy: { slug: "asc" } });
  const by = Object.fromEntries(rows.map((r) => [r.slug, r]));

  const publicBase = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3100").replace(/\/$/, "");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-slate-900 sm:text-3xl">Marketing pages (copy)</h1>
        <p className="mt-1.5 max-w-2xl text-sm text-slate-600">
          Edit long-form copy for the main public marketing routes. Titles, intros, and HTML body override the built-in template
          and scraped snapshot for that URL. <strong>Hub index headings</strong> (About / Programs / Resource centre) are in{" "}
          <Link href="/admin/marketing-hubs" className="font-medium text-acep-primary hover:underline">Marketing hub pages</Link>.{" "}
          <strong>Hero and hub card images</strong> are still in{" "}
          <Link href="/admin/website" className="font-medium text-acep-primary hover:underline">Public website</Link>.
        </p>
        <p className="mt-1 text-xs text-slate-500">News articles use Posts; event registration uses Events.</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin">Dashboard</Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/media">Media library</Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/website">Images &amp; site blocks</Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Pages</CardTitle>
          <CardDescription>Each row links to the editor. “Body in DB” means the public site will use your HTML instead of the default.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[32rem] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-600">
                  <th className="py-2 pr-4 font-medium">Path</th>
                  <th className="py-2 pr-4 font-medium">In DB</th>
                  <th className="py-2 pr-4 font-medium">Body override</th>
                  <th className="py-2 pr-4 font-medium">Updated</th>
                  <th className="py-2 font-medium" />
                </tr>
              </thead>
              <tbody>
                {MARKETING_PROSE_SLUGS.map((slug) => {
                  const r = by[slug];
                  return (
                    <tr key={slug} className="border-b border-slate-100">
                      <td className="py-2 pr-4 font-mono text-xs text-slate-800">/{slug}</td>
                      <td className="py-2 pr-4">{r ? "Yes" : "—"}</td>
                      <td className="py-2 pr-4">{r?.bodyHtml?.trim() ? "Yes" : "—"}</td>
                      <td className="py-2 pr-4 text-slate-600">
                        {r ? new Date(r.updatedAt).toLocaleString() : "—"}
                      </td>
                      <td className="py-2 text-right">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/admin/marketing-pages/${slug}`} className="inline-flex items-center gap-1">
                            <Pencil className="h-3.5 w-3.5" />
                            Edit
                          </Link>
                        </Button>
                        <a
                          href={`${publicBase}/${slug}/`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-2 inline-flex h-8 items-center justify-center rounded-acepBtn px-2 text-acep-primary hover:bg-slate-100"
                        >
                          <span className="sr-only">Open</span>
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
