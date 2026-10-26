import { NextResponse, type NextRequest } from "next/server";
import { can, checkStaff } from "@/lib/admin/auth";
import { FORM_TYPES, fieldLabel, formTitle, showValue } from "@/lib/admin/forms";
import { createClient } from "@/lib/supabase/server";
import type { SubmissionStatus } from "@/lib/supabase/types";

const STATUSES: SubmissionStatus[] = ["new", "in_progress", "replied", "closed"];

/** A CSV cell. Cells starting with = + - @ are prefixed so spreadsheets don't run them as formulas. */
function cell(v: unknown) {
  let s = showValue(v);
  if (s === "—") s = "";
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

/** Downloads the (filtered) submissions as a spreadsheet-friendly CSV. */
export async function GET(request: NextRequest) {
  const auth = await checkStaff(can.handleSubmissions);
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: 403 });

  const sp = request.nextUrl.searchParams;
  const status = sp.get("status");
  const form = sp.get("form");
  const term = (sp.get("q") ?? "").trim().replace(/[%_,()*\\]/g, " ").slice(0, 80);

  const supabase = await createClient();
  let query = supabase
    .from("submissions")
    .select("reference, form, status, name, email, phone, data, created_at")
    .order("created_at", { ascending: false })
    .limit(5000);
  if (status && STATUSES.includes(status as SubmissionStatus)) query = query.eq("status", status as SubmissionStatus);
  if (form && FORM_TYPES.includes(form as (typeof FORM_TYPES)[number])) query = query.eq("form", form);
  if (term) query = query.or(`name.ilike.%${term}%,email.ilike.%${term}%,phone.ilike.%${term}%,reference.ilike.%${term}%`);
  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // One column per form field that appears in the export
  const keys: string[] = [];
  const labels = new Map<string, string>();
  for (const r of data ?? []) {
    for (const k of Object.keys(r.data ?? {})) {
      if (!labels.has(k)) {
        labels.set(k, fieldLabel(r.form, k));
        keys.push(k);
      }
    }
  }

  const header = ["Received (UTC)", "Reference", "Form", "Status", "Name", "Email", "Phone", ...keys.map((k) => labels.get(k)!)];
  const lines = [header.map(cell).join(",")];
  for (const r of data ?? []) {
    lines.push(
      [
        r.created_at.replace("T", " ").slice(0, 19),
        r.reference,
        formTitle(r.form),
        r.status.replace("_", " "),
        r.name,
        r.email ?? "",
        r.phone ?? "",
        ...keys.map((k) => (r.data as Record<string, unknown>)?.[k] ?? ""),
      ]
        .map(cell)
        .join(","),
    );
  }

  const date = new Date().toISOString().slice(0, 10);
  return new NextResponse("﻿" + lines.join("\r\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="submissions-${date}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
