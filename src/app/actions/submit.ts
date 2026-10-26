"use server";

import { headers } from "next/headers";
import { site, type FormType } from "@/config/site";
import { schemas } from "@/lib/forms/schemas";
import { FORMS } from "@/lib/forms/fields";
import { rateLimit } from "@/lib/forms/ratelimit";
import { extractContact } from "@/lib/forms/contact";
import { createAdminClient } from "@/lib/supabase/admin";

export type SubmitResult =
  | { ok: true; reference: string; delivered: boolean }
  | { ok: false; error: string; fieldErrors?: Record<string, string> };

const escape = (v: string) =>
  v.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] ?? c);

const show = (v: unknown) => (Array.isArray(v) ? v.join(", ") : typeof v === "boolean" ? (v ? "Yes" : "No") : String(v ?? ""));

async function verifyTurnstile(token: unknown, ip: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true; // not configured yet
  if (typeof token !== "string" || !token) return false;
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: new URLSearchParams({ secret, response: token, remoteip: ip }),
      cache: "no-store",
    });
    const data = (await res.json()) as { success?: boolean };
    return !!data.success;
  } catch {
    return false;
  }
}

async function sendEmail(type: FormType, data: Record<string, unknown>, reference: string) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return false;
  const { Resend } = await import("resend");
  const resend = new Resend(key);
  const title = FORMS[type].title;
  const rows = Object.entries(data)
    .filter(([k]) => k !== "consent")
    .map(
      ([k, v]) =>
        `<tr><td style="padding:8px 12px;color:#6b6880;font:13px sans-serif;vertical-align:top">${escape(k)}</td><td style="padding:8px 12px;font:14px sans-serif;color:#111">${escape(show(v)).replace(/\n/g, "<br>")}</td></tr>`,
    )
    .join("");
  const replyTo =
    (typeof data.email === "string" && data.email) ||
    (typeof data.businessEmail === "string" && data.businessEmail) ||
    (data.contactMethod === "Email" && typeof data.contactValue === "string" ? data.contactValue : undefined);

  const { error } = await resend.emails.send({
    from: process.env.EMAIL_FROM ?? `${site.name} <onboarding@resend.dev>`,
    to: site.contact.formRecipient,
    replyTo: replyTo || undefined,
    subject: `[${site.shortName}] ${title} — ${reference}`,
    html: `<div style="max-width:640px"><h2 style="font:600 18px sans-serif">${escape(title)}</h2><p style="font:13px sans-serif;color:#6b6880">Reference ${reference} · ${new Date().toISOString()}</p><table style="border-collapse:collapse;width:100%;background:#f7f6fb;border-radius:8px">${rows}</table></div>`,
  });
  return !error;
}

/** Validates, filters spam and delivers one form submission. */
export async function submitForm(type: FormType, payload: Record<string, unknown>): Promise<SubmitResult> {
  const schema = schemas[type];
  if (!schema) return { ok: false, error: "Unknown form." };

  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
  const reference = `PLN-${Date.now().toString(36).slice(-4).toUpperCase()}${Math.random().toString(36).slice(2, 5).toUpperCase()}`;

  // Honeypot: bots fill hidden fields. Pretend it worked.
  if (typeof payload.website === "string" && payload.website.length > 0) {
    return { ok: true, reference, delivered: true };
  }

  if (!(await rateLimit(ip))) {
    return { ok: false, error: "Too many submissions — please wait a few minutes and try again." };
  }

  if (!(await verifyTurnstile(payload["cf-turnstile-response"], ip))) {
    return { ok: false, error: "We couldn't verify you're human. Please try again." };
  }

  const { website: _w, "cf-turnstile-response": _t, ...rest } = payload;
  const parsed = schema.safeParse(rest);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const k = String(issue.path[0] ?? "form");
      fieldErrors[k] ??= issue.message;
    }
    return { ok: false, error: "Please check the highlighted fields.", fieldErrors };
  }

  const data = parsed.data as Record<string, unknown>;

  // 1. Email the team (when Resend is set up)
  let emailed = false;
  try {
    emailed = await sendEmail(type, data, reference);
  } catch {
    emailed = false;
  }

  // 2. Save it for the admin panel (when Supabase is set up)
  const stored = await storeSubmission(type, data, reference, ip, emailed);

  const delivered = emailed || stored;
  const deliveryConfigured = !!process.env.RESEND_API_KEY || !!createAdminClient();
  if (!delivered && deliveryConfigured) {
    return { ok: false, error: "Something went wrong sending your message. Please try again or contact us on WhatsApp." };
  }
  return { ok: true, reference, delivered };
}

async function storeSubmission(type: FormType, data: Record<string, unknown>, reference: string, ip: string, emailed: boolean) {
  const db = createAdminClient();
  if (!db) return false;
  const { name, email, phone } = extractContact(data);
  const { consent: _c, ...rest } = data;
  try {
    const { error } = await db.from("submissions").insert({
      reference,
      form: type,
      name,
      email,
      phone,
      data: rest,
      emailed,
      ip: ip === "unknown" ? null : ip,
    });
    return !error;
  } catch {
    return false;
  }
}
