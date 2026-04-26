import Link from "next/link";
import { prisma } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FileText,
  Image as ImageIcon,
  Database,
  Calendar,
  Globe2,
  ArrowRight,
  PenLine,
  LayoutTemplate,
  Inbox,
  ClipboardList,
} from "lucide-react";

export default async function AdminHomePage() {
  const [totalPosts, publishedPosts, draftPosts, mediaCount, contentCount, eventTotal, eventPublished, publicFormCount] =
    await Promise.all([
      prisma.cmsPost.count(),
      prisma.cmsPost.count({ where: { status: "PUBLISHED" } }),
      prisma.cmsPost.count({ where: { status: "DRAFT" } }),
      prisma.cmsMedia.count(),
      prisma.cmsContentEntry.count(),
      prisma.event.count(),
      prisma.event.count({ where: { status: "PUBLISHED" } }),
      prisma.publicFormSubmission.count(),
    ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-semibold text-slate-900 sm:text-3xl">Dashboard</h1>
        <p className="mt-1.5 max-w-2xl text-sm text-slate-600">
          Unified control for the public site: articles and pages under <strong>News &amp; posts</strong>, event registration under{" "}
          <strong>Events</strong>, files under <strong>Media</strong>, and marketing images plus global copy under{" "}
          <strong>Public website</strong>, hub index copy under <strong>Marketing hub pages</strong>. System settings are isolated under{" "}
          <strong>Settings</strong>.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button asChild>
            <Link href="/admin/posts/new">New post</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/admin/events/new">New event</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/admin/website">Site &amp; image keys</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/admin/marketing-pages" className="inline-flex items-center gap-1.5">
              <PenLine className="h-3.5 w-3.5" />
              Marketing page copy
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/admin/marketing-hubs" className="inline-flex items-center gap-1.5">
              <LayoutTemplate className="h-3.5 w-3.5" />
              Marketing hub pages
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7">
        <Link
          href="/admin/posts"
          className="block rounded-acepCard focus:outline-none focus-visible:ring-2 focus-visible:ring-acep-primary/40"
        >
          <Card className="h-full transition-colors hover:border-slate-300 hover:bg-white">
            <CardHeader className="pb-1">
              <CardTitle className="flex items-center gap-1.5 text-sm font-medium text-slate-600">
                <FileText className="h-4 w-4" /> All posts
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 text-2xl font-semibold text-acep-primary">{totalPosts}</CardContent>
          </Card>
        </Link>
        <Link
          href="/admin/posts"
          className="block rounded-acepCard focus:outline-none focus-visible:ring-2 focus-visible:ring-acep-primary/40"
        >
          <Card className="h-full transition-colors hover:border-slate-300 hover:bg-white">
            <CardHeader className="pb-1">
              <CardTitle className="text-sm font-medium text-slate-600">Published</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 text-2xl font-semibold text-emerald-700">{publishedPosts}</CardContent>
          </Card>
        </Link>
        <Link
          href="/admin/posts"
          className="block rounded-acepCard focus:outline-none focus-visible:ring-2 focus-visible:ring-acep-primary/40"
        >
          <Card className="h-full transition-colors hover:border-slate-300 hover:bg-white">
            <CardHeader className="pb-1">
              <CardTitle className="text-sm font-medium text-slate-600">Drafts</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 text-2xl font-semibold text-amber-700">{draftPosts}</CardContent>
          </Card>
        </Link>
        <Link
          href="/admin/media"
          className="block rounded-acepCard focus:outline-none focus-visible:ring-2 focus-visible:ring-acep-primary/40"
        >
          <Card className="h-full transition-colors hover:border-slate-300 hover:bg-white">
            <CardHeader className="pb-1">
              <CardTitle className="flex items-center gap-1.5 text-sm font-medium text-slate-600">
                <ImageIcon className="h-4 w-4" aria-hidden /> Media
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 text-2xl font-semibold text-slate-800">{mediaCount}</CardContent>
          </Card>
        </Link>
        <Link
          href="/admin/events"
          className="block rounded-acepCard focus:outline-none focus-visible:ring-2 focus-visible:ring-acep-primary/40"
        >
          <Card className="h-full transition-colors hover:border-slate-300 hover:bg-white">
            <CardHeader className="pb-1">
              <CardTitle className="flex items-center gap-1.5 text-sm font-medium text-slate-600">
                <Calendar className="h-4 w-4" /> Events
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">{eventPublished} published</CardDescription>
            </CardHeader>
            <CardContent className="pt-0 text-2xl font-semibold text-slate-800">{eventTotal}</CardContent>
          </Card>
        </Link>
        <Link
          href="/admin/website"
          className="block rounded-acepCard focus:outline-none focus-visible:ring-2 focus-visible:ring-acep-primary/40"
        >
          <Card className="h-full transition-colors hover:border-slate-300 hover:bg-white">
            <CardHeader className="pb-1">
              <CardTitle className="flex items-center gap-1.5 text-sm font-medium text-slate-600">
                <Globe2 className="h-4 w-4" /> Site blocks
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 text-2xl font-semibold text-slate-800">{contentCount}</CardContent>
          </Card>
        </Link>
        <Link
          href="/admin/public-submissions"
          className="block rounded-acepCard focus:outline-none focus-visible:ring-2 focus-visible:ring-acep-primary/40"
        >
          <Card className="h-full transition-colors hover:border-slate-300 hover:bg-white">
            <CardHeader className="pb-1">
              <CardTitle className="flex items-center gap-1.5 text-sm font-medium text-slate-600">
                <ClipboardList className="h-4 w-4" aria-hidden /> Public forms
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 text-2xl font-semibold text-slate-800">{publicFormCount}</CardContent>
          </Card>
        </Link>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Publishing &amp; comms</CardTitle>
            <CardDescription>Articles, features, and downloadable assets for the news feed and publications area.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin/posts" className="inline-flex items-center gap-1">
                All posts
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin/media" className="inline-flex items-center gap-1">
                Media library
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Engagement &amp; live programs</CardTitle>
            <CardDescription>Event pages, registration, exhibitors, and check-in (separate from static marketing pages).</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin/events" className="inline-flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" /> Events &amp; registration
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin/portal-contributions" className="inline-flex items-center gap-1">
                <Inbox className="h-3.5 w-3.5" /> Organiser materials (portal)
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin/public-submissions" className="inline-flex items-center gap-1">
                <ClipboardList className="h-3.5 w-3.5" /> Public form inbox
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Public site (Next.js)</CardTitle>
            <CardDescription>
              <span className="block">Image keys, branding, and hub tiles — or switch to full page HTML for each marketing route.</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            <Button variant="default" size="sm" asChild>
              <Link href="/admin/website" className="inline-flex items-center gap-1">
                <Globe2 className="h-3.5 w-3.5" />
                Site &amp; image keys
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin/marketing-pages" className="inline-flex items-center gap-1">
                <PenLine className="h-3.5 w-3.5" />
                Marketing page copy
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin/marketing-hubs" className="inline-flex items-center gap-1">
                <LayoutTemplate className="h-3.5 w-3.5" />
                Marketing hub pages
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">System</CardTitle>
            <CardDescription>Environment and platform notes for operators.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin/settings" className="inline-flex items-center gap-1">
                <Database className="h-3.5 w-3.5" />
                Settings
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
            <form action="/api/admin/auth/logout" method="post" className="mt-3">
              <Button variant="ghost" type="submit" className="h-auto p-0 text-acep-primary">
                Sign out
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
