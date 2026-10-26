import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Mail, MessageCircle, Phone, StickyNote, Trash2 } from "lucide-react";
import { can, requireStaff } from "@/lib/admin/auth";
import { fieldLabel, formTitle, showValue } from "@/lib/admin/forms";
import { waNumber } from "@/lib/forms/contact";
import { createClient } from "@/lib/supabase/server";
import { Card, SubmissionBadge, btn } from "@/components/admin/ui";
import { ConfirmAction, LocalTime } from "@/components/admin/client";
import { ReplyComposer, StatusSelect } from "@/components/admin/SubmissionTools";
import { deleteSubmission } from "../actions";
import { cn } from "@/lib/cn";

export const metadata: Metadata = { title: "Submission" };

type Props = { params: Promise<{ id: string }> };

const CHANNEL = {
  email: { icon: Mail, label: "Email" },
  whatsapp: { icon: MessageCircle, label: "WhatsApp" },
  note: { icon: StickyNote, label: "Note" },
};

export default async function SubmissionPage({ params }: Props) {
  const staff = await requireStaff(can.handleSubmissions);
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();

  const supabase = await createClient();
  const [{ data: s }, { data: replies }] = await Promise.all([
    supabase.from("submissions").select("*").eq("id", id).maybeSingle(),
    supabase.from("submission_replies").select("*").eq("submission_id", id).order("created_at", { ascending: true }),
  ]);
  if (!s) notFound();

  // Names of the team members who replied
  const authorIds = [...new Set((replies ?? []).map((r) => r.author_id).filter(Boolean))] as string[];
  const { data: authors } = authorIds.length ? await supabase.from("profiles").select("id, full_name, email").in("id", authorIds) : { data: [] };
  const who = (aid: string | null) => {
    const a = authors?.find((x) => x.id === aid);
    return a?.full_name || a?.email || "Former team member";
  };

  const wa = waNumber(s.phone);
  const entries = Object.entries(s.data ?? {}).filter(([k]) => k !== "consent");

  return (
    <>
      <Link href="/admin/submissions" className="mb-5 inline-flex items-center gap-2 text-sm text-muted hover:text-ink">
        <ArrowLeft className="size-4" /> All submissions
      </Link>

      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          <p className="eyebrow mb-2 text-cyan">{formTitle(s.form)}</p>
          <h1 className="font-display text-[clamp(1.6rem,1.2rem+1.3vw,2.3rem)] leading-tight font-semibold tracking-[-0.03em]">{s.name || "No name"}</h1>
          <p className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
            <span className="font-mono">{s.reference}</span>
            <span aria-hidden>·</span>
            <LocalTime iso={s.created_at} />
            <SubmissionBadge status={s.status} />
          </p>
        </div>
        <div className="flex items-center gap-2">
          <StatusSelect key={s.status} id={s.id} status={s.status} />
          {can.deleteSubmissions(staff.role) && (
            <ConfirmAction
              action={deleteSubmission}
              fields={{ id: s.id }}
              title="Delete this submission?"
              body="It and all of its replies and notes are removed for good."
              confirmLabel="Delete"
              triggerClassName={cn(btn.base, btn.danger, "px-3")}
              trigger={<Trash2 className="size-4" aria-label="Delete submission" />}
            />
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="min-w-0 space-y-6">
          <Card title="Details">
            <dl className="divide-y divide-line">
              {entries.map(([k, v]) => (
                <div key={k} className="grid gap-1 px-5 py-3.5 sm:grid-cols-[12rem_1fr] sm:gap-4">
                  <dt className="text-sm text-muted">{fieldLabel(s.form, k)}</dt>
                  <dd className="text-[0.95rem] break-words whitespace-pre-wrap">{showValue(v)}</dd>
                </div>
              ))}
            </dl>
          </Card>

          <Card title={`Replies & notes${replies?.length ? ` (${replies.length})` : ""}`}>
            {replies?.length ? (
              <ol className="divide-y divide-line">
                {replies.map((r) => {
                  const c = CHANNEL[r.channel];
                  return (
                    <li key={r.id} className={cn("px-5 py-4", r.channel === "note" && "bg-[#ffd23f]/[0.03]")}>
                      <p className="mb-2 flex flex-wrap items-center gap-2 text-xs text-muted">
                        <c.icon className="size-3.5" aria-hidden />
                        <span className="font-medium text-ink/85">{who(r.author_id)}</span>
                        <span>· {c.label}</span>
                        {r.channel === "email" && !r.delivered && <span className="text-[#ff9db5]">· not sent</span>}
                        <span>
                          · <LocalTime iso={r.created_at} />
                        </span>
                      </p>
                      <p className="text-[0.95rem] break-words whitespace-pre-wrap">{r.body}</p>
                    </li>
                  );
                })}
              </ol>
            ) : (
              <p className="px-5 py-6 text-sm text-muted">No replies yet.</p>
            )}
            <div className="border-t border-line p-5">
              <ReplyComposer id={s.id} name={s.name} email={s.email} wa={wa} emailReady={!!process.env.RESEND_API_KEY} />
            </div>
          </Card>
        </div>

        <aside className="space-y-6">
          <Card title="Contact">
            <div className="space-y-2 p-5">
              {s.email && (
                <a href={`mailto:${s.email}?subject=${encodeURIComponent(`Re: ${s.reference}`)}`} className="flex items-center gap-3 rounded-xl border border-line px-3.5 py-2.5 text-sm break-all hover:border-cyan/40">
                  <Mail className="size-4 shrink-0 text-cyan" aria-hidden /> {s.email}
                </a>
              )}
              {wa && (
                <a href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-xl border border-line px-3.5 py-2.5 text-sm hover:border-cyan/40">
                  <MessageCircle className="size-4 shrink-0 text-[#25D366]" aria-hidden /> WhatsApp {s.phone}
                </a>
              )}
              {wa && (
                <a href={`tel:+${wa}`} className="flex items-center gap-3 rounded-xl border border-line px-3.5 py-2.5 text-sm hover:border-cyan/40">
                  <Phone className="size-4 shrink-0 text-cyan" aria-hidden /> Call
                </a>
              )}
              {!s.email && !wa && <p className="text-sm text-muted">No email or phone number was given{s.phone ? ` (they wrote: ${s.phone})` : ""}.</p>}
            </div>
          </Card>
          <Card title="Info">
            <dl className="space-y-3 p-5 text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-muted">Emailed to team</dt>
                <dd>{s.emailed ? "Yes" : "No"}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted">Last updated</dt>
                <dd>
                  <LocalTime iso={s.updated_at} mode="relative" />
                </dd>
              </div>
            </dl>
          </Card>
        </aside>
      </div>
    </>
  );
}
