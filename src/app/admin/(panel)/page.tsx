import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, FileText, Inbox, Plus, Users } from "lucide-react";
import { can, requireStaff } from "@/lib/admin/auth";
import { formTitle } from "@/lib/admin/forms";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { Card, EmptyState, Notice, PageHeader, PostBadge, SubmissionBadge, btn } from "@/components/admin/ui";
import { LocalTime } from "@/components/admin/client";
import { cn } from "@/lib/cn";

export const metadata: Metadata = { title: "Dashboard" };

type Props = { searchParams: Promise<{ denied?: string }> };

const daysAgo = (n: number) => new Date(Date.now() - n * 86400_000).toISOString();

export default async function Dashboard({ searchParams }: Props) {
  const staff = await requireStaff();
  const { denied } = await searchParams;
  const supabase = await createClient();
  const handles = can.handleSubmissions(staff.role);
  const weekAgo = daysAgo(7);

  const head = { count: "exact" as const, head: true };
  const [published, drafts, recentPosts, newSubs, weekSubs, recentSubs, team] = await Promise.all([
    supabase.from("posts").select("id", head).eq("status", "published"),
    supabase.from("posts").select("id", head).eq("status", "draft"),
    supabase.from("posts").select("id, title, status, published_at, updated_at").order("updated_at", { ascending: false }).limit(5),
    handles ? supabase.from("submissions").select("id", head).eq("status", "new") : null,
    handles ? supabase.from("submissions").select("id", head).gte("created_at", weekAgo) : null,
    handles
      ? supabase.from("submissions").select("id, reference, form, name, status, created_at").order("created_at", { ascending: false }).limit(6)
      : null,
    can.manageUsers(staff.role) ? createAdminClient()!.from("profiles").select("id", head).eq("status", "active") : null,
  ]);

  const stats = [
    handles && { label: "New submissions", value: newSubs?.count ?? 0, href: "/admin/submissions?status=new", icon: Inbox, hot: (newSubs?.count ?? 0) > 0 },
    handles && { label: "Submissions this week", value: weekSubs?.count ?? 0, href: "/admin/submissions", icon: Inbox },
    { label: "Published posts", value: published.count ?? 0, href: "/admin/posts?status=published", icon: FileText },
    { label: "Drafts", value: drafts.count ?? 0, href: "/admin/posts?status=draft", icon: FileText },
    team && { label: "Active team members", value: team.count ?? 0, href: "/admin/users", icon: Users },
  ].filter(Boolean) as { label: string; value: number; href: string; icon: typeof Inbox; hot?: boolean }[];

  return (
    <>
      <PageHeader
        eyebrow="Dashboard"
        title={`Welcome back${staff.fullName ? `, ${staff.fullName.split(" ")[0]}` : ""}.`}
        lead="Here's what's happening on the network today."
        actions={
          <Link href="/admin/posts/new" className={cn(btn.base, btn.primary)}>
            <Plus className="size-4" /> New post
          </Link>
        }
      />

      {denied && (
        <div className="mb-6">
          <Notice tone="warn">That page is for admins only.</Notice>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className={cn(
              "group rounded-2xl border bg-surface p-5 transition-colors hover:border-cyan/40",
              s.hot ? "border-live/40 bg-[linear-gradient(135deg,rgb(255_61_110/0.12),transparent_60%)]" : "border-line",
            )}
          >
            <s.icon className={cn("size-5", s.hot ? "text-live" : "text-cyan")} aria-hidden />
            <p className="mt-4 font-display text-3xl font-semibold tabular-nums">{s.value}</p>
            <p className="mt-1 text-sm text-muted">{s.label}</p>
          </Link>
        ))}
      </div>

      <div className={cn("mt-6 grid gap-6", handles && "lg:grid-cols-2")}>
        {handles && (
          <Card
            title="Latest submissions"
            action={
              <Link href="/admin/submissions" className="flex items-center gap-1 text-sm text-muted hover:text-ink">
                All <ArrowRight className="size-3.5" />
              </Link>
            }
          >
            {recentSubs?.data?.length ? (
              <ul className="divide-y divide-line">
                {recentSubs.data.map((s) => (
                  <li key={s.id}>
                    <Link href={`/admin/submissions/${s.id}`} className="flex items-center gap-3 px-5 py-3.5 transition-colors hover:bg-white/[0.03]">
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-medium">{s.name || "No name"}</span>
                        <span className="block truncate text-sm text-muted">
                          {formTitle(s.form)} · <LocalTime iso={s.created_at} mode="relative" />
                        </span>
                      </span>
                      <SubmissionBadge status={s.status} />
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState title="No submissions yet">Forms sent from the website will appear here.</EmptyState>
            )}
          </Card>
        )}

        <Card
          title="Recently edited posts"
          action={
            <Link href="/admin/posts" className="flex items-center gap-1 text-sm text-muted hover:text-ink">
              All <ArrowRight className="size-3.5" />
            </Link>
          }
        >
          {recentPosts.data?.length ? (
            <ul className="divide-y divide-line">
              {recentPosts.data.map((p) => (
                <li key={p.id}>
                  <Link href={`/admin/posts/${p.id}`} className="flex items-center gap-3 px-5 py-3.5 transition-colors hover:bg-white/[0.03]">
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-medium">{p.title}</span>
                      <span className="block text-sm text-muted">
                        Edited <LocalTime iso={p.updated_at} mode="relative" />
                      </span>
                    </span>
                    <PostBadge status={p.status} scheduled={!!p.published_at && new Date(p.published_at) > new Date()} />
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState
              title="No posts yet"
              action={
                <Link href="/admin/posts/new" className={cn(btn.base, btn.primary)}>
                  <Plus className="size-4" /> Write the first post
                </Link>
              }
            >
              Posts you publish appear on the website&apos;s Blog page.
            </EmptyState>
          )}
        </Card>
      </div>
    </>
  );
}
