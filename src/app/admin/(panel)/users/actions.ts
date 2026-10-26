"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { can, checkStaff } from "@/lib/admin/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Role } from "@/lib/supabase/types";

export type UserState = { ok?: boolean; message?: string; error?: string; created?: { email: string; password: string }; at?: number } | null;

const ROLES = ["admin", "manager", "editor"] as const;
const email = z.string().trim().toLowerCase().email("Enter a valid email address.").max(200);
const password = z.string().min(8, "Use at least 8 characters.").max(72, "Use 72 characters or fewer.");
const fullName = z.string().trim().min(1, "Enter their name.").max(80);

async function guard() {
  const auth = await checkStaff(can.manageUsers);
  if ("error" in auth) return { error: auth.error } as const;
  const admin = createAdminClient();
  if (!admin) return { error: "The secret key isn't set." } as const;
  return { me: auth.staff, admin } as const;
}

/** How many active admins are left — the panel must always keep one. */
async function activeAdmins(admin: NonNullable<ReturnType<typeof createAdminClient>>) {
  const { count } = await admin.from("profiles").select("id", { count: "exact", head: true }).eq("role", "admin").eq("status", "active");
  return count ?? 0;
}

const authError = (msg: string) =>
  /already (been )?registered|already exists/i.test(msg)
    ? "An account with this email already exists."
    : /password/i.test(msg)
      ? `Password problem: ${msg}`
      : msg;

export async function createUser(_prev: UserState, formData: FormData): Promise<UserState> {
  const g = await guard();
  if ("error" in g) return { error: g.error };
  const parsed = z
    .object({ full_name: fullName, email, role: z.enum(ROLES), password })
    .safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };
  const v = parsed.data;

  const { data, error } = await g.admin.auth.admin.createUser({
    email: v.email,
    password: v.password,
    email_confirm: true,
    user_metadata: { full_name: v.full_name },
  });
  if (error || !data.user) return { error: authError(error?.message ?? "Couldn't create the account.") };

  // The database trigger creates the profile (disabled); activate it with the chosen role.
  const { error: pErr } = await g.admin
    .from("profiles")
    .upsert({ id: data.user.id, email: v.email, full_name: v.full_name, role: v.role, status: "active" });
  if (pErr) return { error: `Account created, but its role couldn't be saved: ${pErr.message}` };

  revalidatePath("/admin/users");
  return { ok: true, created: { email: v.email, password: v.password }, at: Date.now() };
}

export async function updateUser(_prev: UserState, formData: FormData): Promise<UserState> {
  const g = await guard();
  if ("error" in g) return { error: g.error };
  const parsed = z
    .object({ id: z.string().uuid(), full_name: fullName, email, role: z.enum(ROLES) })
    .safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };
  const v = parsed.data;

  const { data: current } = await g.admin.from("profiles").select("role, status, email").eq("id", v.id).maybeSingle();
  if (!current) return { error: "This account no longer exists." };
  if (v.id === g.me.id && v.role !== "admin") return { error: "You can't remove your own admin role." };
  if (current.role === "admin" && current.status === "active" && v.role !== "admin" && (await activeAdmins(g.admin)) <= 1) {
    return { error: "This is the only admin. Make someone else an admin first." };
  }

  const authUpdate: { email?: string; email_confirm?: boolean; user_metadata: { full_name: string } } = { user_metadata: { full_name: v.full_name } };
  if (v.email !== current.email) Object.assign(authUpdate, { email: v.email, email_confirm: true });
  const { error: aErr } = await g.admin.auth.admin.updateUserById(v.id, authUpdate);
  if (aErr) return { error: authError(aErr.message) };

  const { error } = await g.admin.from("profiles").update({ full_name: v.full_name, email: v.email, role: v.role as Role }).eq("id", v.id);
  if (error) return { error: error.message };
  revalidatePath("/admin/users");
  revalidatePath("/admin", "layout");
  return { ok: true, message: "Saved.", at: Date.now() };
}

export async function setUserPassword(_prev: UserState, formData: FormData): Promise<UserState> {
  const g = await guard();
  if ("error" in g) return { error: g.error };
  const parsed = z.object({ id: z.string().uuid(), password }).safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };
  const { error } = await g.admin.auth.admin.updateUserById(parsed.data.id, { password: parsed.data.password });
  if (error) return { error: authError(error.message) };
  return { ok: true, message: "Password changed. Share it with them securely.", at: Date.now() };
}

/** Disable or re-enable an account. Disabled accounts can't sign in and lose access at once. */
export async function setUserStatus(formData: FormData) {
  const g = await guard();
  if ("error" in g) redirect("/admin/users");
  const id = String(formData.get("id") ?? "");
  const status = formData.get("status") === "active" ? "active" : "disabled";
  if (id === g.me.id) redirect("/admin/users?notice=self");
  const { data: current } = await g.admin.from("profiles").select("role, status").eq("id", id).maybeSingle();
  if (!current) redirect("/admin/users");
  if (status === "disabled" && current.role === "admin" && current.status === "active" && (await activeAdmins(g.admin)) <= 1) {
    redirect("/admin/users?notice=last-admin");
  }
  await g.admin.auth.admin.updateUserById(id, { ban_duration: status === "disabled" ? "876000h" : "none" });
  await g.admin.from("profiles").update({ status }).eq("id", id);
  revalidatePath("/admin/users");
  redirect(`/admin/users?notice=${status === "disabled" ? "disabled" : "enabled"}`);
}

export async function deleteUser(formData: FormData) {
  const g = await guard();
  if ("error" in g) redirect("/admin/users");
  const id = String(formData.get("id") ?? "");
  if (id === g.me.id) redirect("/admin/users?notice=self");
  const { data: current } = await g.admin.from("profiles").select("role, status").eq("id", id).maybeSingle();
  if (current?.role === "admin" && current.status === "active" && (await activeAdmins(g.admin)) <= 1) {
    redirect("/admin/users?notice=last-admin");
  }
  const { error } = await g.admin.auth.admin.deleteUser(id);
  revalidatePath("/admin/users");
  redirect(`/admin/users?notice=${error ? "delete-failed" : "deleted"}`);
}
