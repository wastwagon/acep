import Link from "next/link";
import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function AdminPostsPage() {
  const posts = await prisma.cmsPost.findMany({
    orderBy: { updatedAt: "desc" },
    include: { author: { select: { email: true } } },
    take: 200,
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-slate-900 sm:text-3xl">Manage posts</h1>
          <p className="mt-1 text-sm text-slate-600">{posts.length} item(s)</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" asChild>
            <Link href="/admin">Dashboard</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/admin/media">Media library</Link>
          </Button>
          <Button asChild>
            <Link href="/admin/posts/new">New post</Link>
          </Button>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">All posts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {posts.map((post) => (
            <div key={post.id} className="rounded-acepCard border border-slate-200 bg-white p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <Link href={`/admin/posts/${post.id}`} className="text-base font-semibold text-slate-900 hover:text-acep-primary">
                    {post.title}
                  </Link>
                  <p className="mt-1 text-xs text-slate-500">/{post.slug}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {post.author.email} · {post.updatedAt.toLocaleString()}
                  </p>
                </div>
                <span className="rounded-acepBtn bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">{post.status}</span>
              </div>
            </div>
          ))}
          {posts.length === 0 && <p className="text-sm text-slate-600">No posts yet.</p>}
        </CardContent>
      </Card>
    </div>
  );
}
