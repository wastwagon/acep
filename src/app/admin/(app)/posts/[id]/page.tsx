import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PostForm } from "@/components/admin/post-form";

export default async function AdminEditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const post = await prisma.cmsPost.findUnique({ where: { id } });
  if (!post) notFound();

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <Link href="/admin/posts" className="text-sm font-medium text-acep-primary hover:underline">
          ← All posts
        </Link>
        <h1 className="mt-2 font-display text-2xl font-semibold text-slate-900 sm:text-3xl">Edit post</h1>
        <p className="text-sm text-slate-500">{post.title}</p>
      </div>
      <Card>
        <CardContent className="pt-6">
          <PostForm
            mode="edit"
            postId={post.id}
            initial={{
              title: post.title,
              slug: post.slug,
              excerpt: post.excerpt || "",
              content: post.content,
              status: post.status,
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
