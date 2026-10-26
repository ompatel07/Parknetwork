"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { site } from "@/config/site";
import { can, checkStaff } from "@/lib/admin/auth";
import { formTitle } from "@/lib/admin/forms";
import { createClient } from "@/lib/supabase/server";
import type { SubmissionStatus } from "@/lib/supabase/types";

const STATUSES = ["new", "in_progress", "replied", "closed"] as const satisfies readonly SubmissionStatus[];

function refresh(id: string) {
  revalidatePath(`/admin/submissions/${id}`);
  revalidatePath("/admin/submissions");
  revalidatePath("/admin", "layout"); // sidebar "new" badge
}

export async function setSubmissionStatus(formData: FormData) {
  const auth = await checkStaff(can.handleSubmissions);
  if ("error" in auth) return;
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!STATUSES.includes(status as SubmissionStatus)) return;
  const supabase = await createClient();
  await supabase.from("submissions").update({ status: status as SubmissionStatus }).eq("id", id);
  refresh(id);
}

export type ReplyState = { ok?: boolean; message?: string; error?: string; warn?: string; at?: number } | null;

const replySchema = z.object({
  id: z.string().uuid(),
  channel: z.enum(["email", "whatsapp", "note"]),
  body: z.string().trim().min(1, "Write a message first.").max(10_000, "That message is too long."),
});

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] ?? c);

async function sendReplyEmail(to: string, subject: string, body: string, from: string) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return false;
  const { Resend } = await import("resend");
  const { error } = await new Resend(key).emails.send({
    from: process.env.EMAIL_FROM ?? `${site.name} <onboarding@resend.dev>`,
    to,
    replyTo: site.contact.email,
    subject,
    text: `${body}\n\n— ${from}\n${site.name}\n${site.url}`,
    html: `<div style="font:15px/1.6 -apple-system,Segoe UI,sans-serif;color:#1a1a24;max-width:600px">${esc(body).replace(/\n/g, "<br>")}<p style="margin-top:24px;color:#6b6880">— ${esc(from)}<br><strong style="color:#1a1a24">${esc(site.name)}</strong><br><a href="${site.url}" style="color:#3d8bff">${esc(site.url.replace(/^https?:\/\//, ""))}</a></p></div>`,
  });
  return !error;
}

/**
 * Adds a reply to a submission. Email replies are sent from the website
 * (Resend); WhatsApp replies are opened in WhatsApp by the browser and
 * logged here; notes are internal only.
 */
export async function addReply(_prev: ReplyState, formData: FormData): Promise<ReplyState> {
  const auth = await checkStaff(can.handleSubmissions);
  if ("error" in auth) return { error: auth.error };
  const parsed = replySchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Check the message." };
  const { id, channel, body } = parsed.data;

  const supabase = await createClient();
  const { data: sub } = await supabase.from("submissions").select("id, reference, form, email, status").eq("id", id).maybeSingle();
  if (!sub) return { error: "This submission no longer exists." };

  let delivered = channel !== "email";
  let warn: string | undefined;
  if (channel === "email") {
    if (!sub.email) return { error: "This submission has no email address — reply on WhatsApp or add a note." };
    try {
      delivered = await sendReplyEmail(sub.email, `Re: your ${formTitle(sub.form).toLowerCase()} — ${sub.reference}`, body, auth.staff.fullName || site.name);
    } catch {
      delivered = false;
    }
    if (!delivered) warn = "The email couldn't be sent (is Resend set up?). The reply was saved so you can send it another way.";
  }

  const { error } = await supabase.from("submission_replies").insert({ submission_id: id, author_id: auth.staff.id, channel, body, delivered });
  if (error) return { error: `Couldn't save the reply: ${error.message}` };

  if (channel !== "note" && delivered && (sub.status === "new" || sub.status === "in_progress")) {
    await supabase.from("submissions").update({ status: "replied" }).eq("id", id);
  } else if (channel === "note" && sub.status === "new") {
    await supabase.from("submissions").update({ status: "in_progress" }).eq("id", id);
  }
  refresh(id);

  const message = channel === "email" ? (delivered ? "Email sent." : undefined) : channel === "whatsapp" ? "WhatsApp reply logged." : "Note added.";
  return { ok: !warn, message, warn, at: Date.now() };
}

export async function deleteSubmission(formData: FormData) {
  const auth = await checkStaff(can.deleteSubmissions);
  if ("error" in auth) redirect("/admin/submissions");
  const id = String(formData.get("id") ?? "");
  const supabase = await createClient();
  await supabase.from("submissions").delete().eq("id", id);
  revalidatePath("/admin/submissions");
  revalidatePath("/admin", "layout");
  redirect("/admin/submissions?deleted=1");
}
