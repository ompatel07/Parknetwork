"use server";

import { revalidatePath } from "next/cache";
import { createClient as createPlainClient } from "@supabase/supabase-js";
import { z } from "zod";
import { checkStaff } from "@/lib/admin/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { supabasePublishableKey, supabaseUrl } from "@/lib/supabase/env";

export type AccountState = { ok?: boolean; message?: string; error?: string; at?: number } | null;

export async function updateProfile(_prev: AccountState, formData: FormData): Promise<AccountState> {
  const auth = await checkStaff();
  if ("error" in auth) return { error: auth.error };
  const parsed = z
    .object({
      full_name: z.string().trim().min(1, "Enter your name.").max(80),
      email: z.string().trim().toLowerCase().email("Enter a valid email address."),
    })
    .safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };
  const admin = createAdminClient()!;
  const { full_name, email } = parsed.data;

  const change: { user_metadata: { full_name: string }; email?: string; email_confirm?: boolean } = { user_metadata: { full_name } };
  if (email !== auth.staff.email) Object.assign(change, { email, email_confirm: true });
  const { error: aErr } = await admin.auth.admin.updateUserById(auth.staff.id, change);
  if (aErr) return { error: /already/i.test(aErr.message) ? "Another account already uses that email." : aErr.message };

  const { error } = await admin.from("profiles").update({ full_name, email }).eq("id", auth.staff.id);
  if (error) return { error: error.message };
  revalidatePath("/admin", "layout");
  return { ok: true, message: email !== auth.staff.email ? "Saved. Use your new email next time you sign in." : "Saved.", at: Date.now() };
}

export async function changePassword(_prev: AccountState, formData: FormData): Promise<AccountState> {
  const auth = await checkStaff();
  if ("error" in auth) return { error: auth.error };
  const parsed = z
    .object({
      current: z.string().min(1, "Enter your current password."),
      next: z.string().min(8, "Use at least 8 characters.").max(72),
      confirm: z.string(),
    })
    .refine((v) => v.next === v.confirm, { message: "The new passwords don't match." })
    .safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };

  // Check the current password without touching this browser's session
  const check = createPlainClient(supabaseUrl, supabasePublishableKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const { error: wrong } = await check.auth.signInWithPassword({ email: auth.staff.email, password: parsed.data.current });
  if (wrong) return { error: "Your current password is wrong." };
  await check.auth.signOut();

  const { error } = await createAdminClient()!.auth.admin.updateUserById(auth.staff.id, { password: parsed.data.next });
  if (error) return { error: error.message };
  return { ok: true, message: "Password changed.", at: Date.now() };
}
