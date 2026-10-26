import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink, Plus, Search } from "lucide-react";
import { can, requireStaff } from "@/lib/admin/auth";
import { createClient } from "@/lib/supabase/server";
import { Card, EmptyState, Notice, PageHeader, PostBadge, btn, input, td, th } from "@/components/admin/ui";
import { LocalTime } from "@/components/admin/client";
import { cn } from "@/lib/cn";

export const metadata: Metadata = { title: "Blog posts" };

type Props = { searchParams: Promise<{ status?: string; q?: string; deleted?: string }> };

export default async function PostsPage({ searchParams }: Props) {
  await requireStaff(can.writePosts);
  const { status = "all", q = "", deleted } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("posts")
    .select("id, slug, title, status, published_at, updated_at, author_name, cover_url")
    .order("updated_at", { ascending: false })
    .limit(200);
  if (status === "published" || status === "draft") query = query.eq("status", status);
  const term = q.trim().replace(/[%_,()]/g, " ").slice(0, 80);
  if (term) query = query.ilike("title", `%${term}%`);
  const { data: posts, error } = await query;

  const tabs = [
    { key: "all", label: "All" },
    { key: "published", label: "Published" },
    { key: "draft", label: "Drafts" },
  ];
  const now = new Date();

  return (
    <>
      <PageHeader
        eyebrow="Blog"
        title="Blog posts"
        lead="Write, publish and manage the posts on the website's Blog page."
        actions={
          <Link href="/admin/posts/new" className={cn(btn.base, btn.primary)}>
            <Plus className="size-4" /> New post
          </Link>
        }
      />
      {deleted && (
        <div className="mb-4">
          <Notice tone="success">Post deleted.</Notice>
        </div>
      )}
      {error && (
        <div className="mb-4">
          <Notice tone="error">Couldn&apos;t load posts: {error.message}</Notice>
        </div>
      )}

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <nav className="flex gap-1 rounded-full border border-line bg-surface p-1" aria-label="Filter posts">
          {tabs.map((t) => (
            <Link
              key={t.key}
              href={`/admin/posts${t.key === "all" ? "" : `?status=${t.key}`}`}
              className={cn("rounded-full px-4 py-1.5 text-sm transition-colors", status === t.key ? "bg-white/[0.08] text-ink" : "text-muted hover:text-ink")}
            >
              {t.label}
            </Link>
          ))}
        </nav>
        <form className="relative w-full sm:w-72" role="search">
          {status !== "all" && <input type="hidden" name="status" value={status} />}
          <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted" aria-hidden />
          <input name="q" defaultValue={q} placeholder="Search titles…" aria-label="Search posts" className={cn(input, "h-10 py-0 pl-10")} />
        </form>
      </div>

      <Card>
        {posts?.length ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-line">
                <tr>
                  <th className={th}>Title</th>
                  <th className={th}>Status</th>
                  <th className={cn(th, "hidden md:table-cell")}>Publish date</th>
                  <th className={cn(th, "hidden sm:table-cell")}>Last edited</th>
                  <th className={cn(th, "hidden sm:table-cell")}>
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {posts.map((p) => {
                  const scheduled = !!p.published_at && new Date(p.published_at) > now;
                  const live = p.status === "published" && !scheduled;
                  return (
                    <tr key={p.id} className="transition-colors hover:bg-white/[0.02]">
                      <td className={td}>
                        <Link href={`/admin/posts/${p.id}`} className="block max-w-[11rem] hover:text-cyan sm:max-w-[28rem]">
                          <span className="block truncate font-medium">{p.title}</span>
                          <span className="block truncate text-xs text-muted">/blog/{p.slug}</span>
                        </Link>
                      </td>
                      <td className={td}>
                        <PostBadge status={p.status} scheduled={scheduled} />
                      </td>
                      <td className={cn(td, "hidden whitespace-nowrap text-muted md:table-cell")}>{p.published_at ? <LocalTime iso={p.published_at} mode="date" /> : "—"}</td>
                      <td className={cn(td, "hidden whitespace-nowrap text-muted sm:table-cell")}>
                        <LocalTime iso={p.updated_at} mode="relative" />
                      </td>
                      <td className={cn(td, "hidden text-right whitespace-nowrap sm:table-cell")}>
                        <div className="flex justify-end gap-1">
                          {live && (
                            <a href={`/blog/${p.slug}`} target="_blank" rel="noopener noreferrer" className={cn(btn.base, btn.quiet, btn.sm)} title="View on the website">
                              <ExternalLink className="size-3.5" aria-hidden /> <span className="sr-only sm:not-sr-only">View</span>
                            </a>
                          )}
                          <Link href={`/admin/posts/${p.id}`} className={cn(btn.base, btn.ghost, btn.sm)}>
                            Edit
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            title={term || status !== "all" ? "No matching posts" : "No posts yet"}
            action={
              <Link href="/admin/posts/new" className={cn(btn.base, btn.primary)}>
                <Plus className="size-4" /> New post
              </Link>
            }
          >
            {term || status !== "all" ? "Try another search or filter." : "Write your first post — it appears on the website once you publish it."}
          </EmptyState>
        )}
      </Card>
    </>
  );
}
