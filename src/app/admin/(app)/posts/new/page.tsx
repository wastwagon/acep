import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PostForm } from "@/components/admin/post-form";

export default function AdminNewPostPage() {
  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <Link href="/admin/posts" className="text-sm font-medium text-acep-primary hover:underline">
          ← All posts
        </Link>
        <h1 className="mt-2 font-display text-2xl font-semibold text-slate-900 sm:text-3xl">New post</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Draft</CardTitle>
        </CardHeader>
        <CardContent>
          <PostForm mode="create" />
        </CardContent>
      </Card>
    </div>
  );
}
