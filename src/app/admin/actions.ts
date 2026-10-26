"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { rateLimit } from "@/lib/forms/ratelimit";

export type LoginState = { error?: string; email?: string } | null;

/** Only redirect back inside the admin panel (never to another site or an odd path). */
function safeNext(v: FormDataEntryValue | null) {
  const s = typeof v === "string" ? v : "";
  return /^\/admin(\/[\w\-/]*)?(\?[\w\-=&%.]*)?$/.test(s) && !s.includes("..") && !s.includes("//") ? s : "/admin";
}

export async function signIn(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  if (!isSupabaseConfigured) return { error: "Supabase isn't connected yet (see README → Admin panel).", email };
  if (!email || !password) return { error: "Enter your email and password.", email };

  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
  // Slow down password guessing: 10 tries per account, and 30 per network
  // (a whole office may share one internet connection) every 10 minutes
  if (!(await rateLimit(`login-email:${email}`, 10, 600)) || !(await rateLimit(`login:${ip}`, 30, 600))) {
    return { error: "Too many sign-in attempts. Please wait a few minutes and try again.", email };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.user) {
    const banned = /banned/i.test(error?.message ?? "");
    return { error: banned ? "This account is disabled. Ask an admin to enable it." : "Wrong email or password.", email };
  }

  // Signed in to Supabase — but is this account allowed into the panel?
  const { data: profile } = (await createAdminClient()?.from("profiles").select("status").eq("id", data.user.id).maybeSingle()) ?? { data: null };
  if (profile && profile.status !== "active") {
    await supabase.auth.signOut();
    return { error: "This account is disabled. Ask an admin to enable it.", email };
  }

  redirect(safeNext(formData.get("next")));
}

export async function signOut() {
  if (isSupabaseConfigured) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }
  redirect("/admin/login");
}
