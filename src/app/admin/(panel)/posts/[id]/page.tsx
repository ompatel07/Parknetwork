import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Trash2 } from "lucide-react";
import { can, requireStaff } from "@/lib/admin/auth";
import { createClient } from "@/lib/supabase/server";
import { PostEditor } from "@/components/admin/PostEditor";
import { ConfirmAction } from "@/components/admin/client";
import { deletePost } from "../actions";

export const metadata: Metadata = { title: "Edit post" };

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ saved?: string }> };

export default async function EditPostPage({ params, searchParams }: Props) {
  const staff = await requireStaff(can.writePosts);
  const { id } = await params;
  const { saved } = await searchParams;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();

  const supabase = await createClient();
  const { data: post } = await supabase
    .from("posts")
    .select("id, slug, title, excerpt, content, cover_url, cover_alt, tags, status, published_at, author_name")
    .eq("id", id)
    .maybeSingle();
  if (!post) notFound();

  const notice = saved === "published" ? "Post published — it's live on the blog." : saved === "draft" ? "Draft saved." : undefined;

  return (
    <>
      <PostEditor key={post.id} post={post} notice={notice} defaultAuthor={staff.fullName} />
      <div className="mt-2 flex flex-col gap-3 rounded-2xl border border-live/25 bg-live/[0.04] p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold">Delete this post</p>
          <p className="text-sm text-muted">It&apos;s removed from the website straight away. This can&apos;t be undone.</p>
        </div>
        <ConfirmAction
          action={deletePost}
          fields={{ id: post.id }}
          title="Delete this post?"
          body={
            <>
              <strong className="text-ink">{post.title}</strong> will be removed from the website and the admin panel. This can&apos;t be undone.
            </>
          }
          confirmLabel="Delete post"
          trigger={
            <>
              <Trash2 className="size-4" /> Delete post
            </>
          }
        />
      </div>
    </>
  );
}
