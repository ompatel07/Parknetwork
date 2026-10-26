import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Download, Search } from "lucide-react";
import { can, requireStaff } from "@/lib/admin/auth";
import { FORM_TYPES, formTitle } from "@/lib/admin/forms";
import { createClient } from "@/lib/supabase/server";
import { Card, EmptyState, Notice, PageHeader, SUBMISSION_STATUS, SubmissionBadge, btn, input, td, th } from "@/components/admin/ui";
import { LocalTime } from "@/components/admin/client";
import { cn } from "@/lib/cn";
import type { SubmissionStatus } from "@/lib/supabase/types";

export const metadata: Metadata = { title: "Submissions" };

const PAGE = 25;
type Props = { searchParams: Promise<{ status?: string; form?: string; q?: string; page?: string; deleted?: string }> };

export default async function SubmissionsPage({ searchParams }: Props) {
  await requireStaff(can.handleSubmissions);
  const sp = await searchParams;
  const status = (Object.keys(SUBMISSION_STATUS) as SubmissionStatus[]).includes(sp.status as SubmissionStatus) ? (sp.status as SubmissionStatus) : null;
  const form = FORM_TYPES.includes(sp.form as (typeof FORM_TYPES)[number]) ? sp.form! : null;
  const term = (sp.q ?? "").trim().replace(/[%_,()*\\]/g, " ").slice(0, 80);
  const page = Math.max(1, Number(sp.page) || 1);

  const supabase = await createClient();
  let query = supabase
    .from("submissions")
    .select("id, reference, form, name, email, phone, status, created_at", { count: "exact" })
    .order("created_at", { ascending: false })
    .range((page - 1) * PAGE, page * PAGE - 1);
  if (status) query = query.eq("status", status);
  if (form) query = query.eq("form", form);
  if (term) query = query.or(`name.ilike.%${term}%,email.ilike.%${term}%,phone.ilike.%${term}%,reference.ilike.%${term}%`);

  const head = { count: "exact" as const, head: true };
  const [{ data: rows, count, error }, ...counts] = await Promise.all([
    query,
    ...(Object.keys(SUBMISSION_STATUS) as SubmissionStatus[]).map((s) => {
      let q = supabase.from("submissions").select("id", head).eq("status", s);
      if (form) q = q.eq("form", form);
      return q;
    }),
  ]);
  const statusCounts = Object.fromEntries((Object.keys(SUBMISSION_STATUS) as SubmissionStatus[]).map((s, i) => [s, counts[i]?.count ?? 0]));
  const total = count ?? 0;
  const pages = Math.max(1, Math.ceil(total / PAGE));

  const link = (over: Record<string, string | null>) => {
    const p = new URLSearchParams();
    const merged = { status, form, q: term || null, page: null as string | null, ...over };
    for (const [k, v] of Object.entries(merged)) if (v) p.set(k, v);
    const s = p.toString();
    return `/admin/submissions${s ? `?${s}` : ""}`;
  };
  const exportHref = `/admin/submissions/export${link({}).replace("/admin/submissions", "")}`;

  return (
    <>
      <PageHeader
        eyebrow="Inbox"
        title="Submissions"
        lead="Every form sent from the website: applications, partnerships and support requests."
        actions={
          <a href={exportHref} className={cn(btn.base, btn.ghost)}>
            <Download className="size-4" /> Export CSV
          </a>
        }
      />
      {sp.deleted && (
        <div className="mb-4">
          <Notice tone="success">Submission deleted.</Notice>
        </div>
      )}
      {error && (
        <div className="mb-4">
          <Notice tone="error">Couldn&apos;t load submissions: {error.message}</Notice>
        </div>
      )}

      <nav className="mb-4 flex gap-1 overflow-x-auto rounded-full border border-line bg-surface p-1" aria-label="Filter by status">
        <Link href={link({ status: null })} className={cn("shrink-0 rounded-full px-4 py-1.5 text-sm", !status ? "bg-white/[0.08] text-ink" : "text-muted hover:text-ink")}>
          All
        </Link>
        {(Object.keys(SUBMISSION_STATUS) as SubmissionStatus[]).map((s) => (
          <Link
            key={s}
            href={link({ status: s })}
            className={cn("flex shrink-0 items-center gap-2 rounded-full px-4 py-1.5 text-sm", status === s ? "bg-white/[0.08] text-ink" : "text-muted hover:text-ink")}
          >
            {SUBMISSION_STATUS[s].label}
            <span className={cn("rounded-full px-1.5 text-xs tabular-nums", s === "new" && statusCounts[s] ? "bg-live text-white" : "bg-white/[0.07]")}>
              {statusCounts[s]}
            </span>
          </Link>
        ))}
      </nav>

      <form className="mb-4 flex flex-col gap-2 sm:flex-row" role="search">
        {status && <input type="hidden" name="status" value={status} />}
        <select name="form" defaultValue={form ?? ""} aria-label="Form" className={cn(input, "h-10 py-0 sm:w-60 [color-scheme:dark]")}>
          <option value="">All forms</option>
          {FORM_TYPES.map((f) => (
            <option key={f} value={f}>
              {formTitle(f)}
            </option>
          ))}
        </select>
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted" aria-hidden />
          <input name="q" defaultValue={term} placeholder="Search name, email, phone or reference…" aria-label="Search" className={cn(input, "h-10 py-0 pl-10")} />
        </div>
        <button className={cn(btn.base, btn.ghost)}>Filter</button>
      </form>

      <Card>
        {rows?.length ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-line">
                <tr>
                  <th className={cn(th, "hidden md:table-cell")}>Received</th>
                  <th className={th}>From</th>
                  <th className={cn(th, "hidden sm:table-cell")}>Form</th>
                  <th className={cn(th, "hidden lg:table-cell")}>Reference</th>
                  <th className={th}>Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {rows.map((r) => (
                  <tr key={r.id} className={cn("relative transition-colors hover:bg-white/[0.03]", r.status === "new" && "bg-live/[0.03]")}>
                    <td className={cn(td, "hidden whitespace-nowrap text-muted md:table-cell")}>
                      <LocalTime iso={r.created_at} />
                    </td>
                    <td className={td}>
                      <Link href={`/admin/submissions/${r.id}`} className="block max-w-[13rem] after:absolute after:inset-0 sm:max-w-[16rem]">
                        <span className={cn("block truncate", r.status === "new" ? "font-semibold" : "font-medium")}>{r.name || "No name"}</span>
                        <span className="block truncate text-xs text-muted">{r.email || r.phone || "—"}</span>
                        <span className="block truncate text-xs text-muted md:hidden">
                          <span className="sm:hidden">{formTitle(r.form)} · </span>
                          <LocalTime iso={r.created_at} mode="relative" />
                        </span>
                      </Link>
                    </td>
                    <td className={cn(td, "hidden whitespace-nowrap sm:table-cell")}>{formTitle(r.form)}</td>
                    <td className={cn(td, "hidden font-mono text-xs whitespace-nowrap text-muted lg:table-cell")}>{r.reference}</td>
                    <td className={td}>
                      <SubmissionBadge status={r.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState title={status || form || term ? "Nothing matches" : "No submissions yet"}>
            {status || form || term ? "Try another filter or search." : "When someone sends a form on the website, it lands here."}
          </EmptyState>
        )}
      </Card>

      {pages > 1 && (
        <div className="mt-4 flex items-center justify-between text-sm text-muted">
          <span>
            {(page - 1) * PAGE + 1}–{Math.min(page * PAGE, total)} of {total}
          </span>
          <div className="flex gap-2">
            {page > 1 ? (
              <Link href={link({ page: String(page - 1) })} className={cn(btn.base, btn.ghost, btn.sm)}>
                <ChevronLeft className="size-4" /> Newer
              </Link>
            ) : null}
            {page < pages ? (
              <Link href={link({ page: String(page + 1) })} className={cn(btn.base, btn.ghost, btn.sm)}>
                Older <ChevronRight className="size-4" />
              </Link>
            ) : null}
          </div>
        </div>
      )}
    </>
  );
}
