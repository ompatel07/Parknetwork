import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import type { Role } from "@/lib/supabase/types";

export type Staff = { id: string; email: string; fullName: string; role: Role };

export type Access =
  | { kind: "ok"; staff: Staff }
  | { kind: "signed-out" }
  | { kind: "inactive"; email: string }
  | { kind: "setup"; reason: "env" | "database" };

/** "relation does not exist" / "table not in schema cache" → schema.sql not run yet */
export const isMissingTable = (e: { code?: string } | null | undefined) =>
  !!e && (e.code === "PGRST205" || e.code === "42P01" || e.code === "PGRST204");

/**
 * Who is signed in, and may they use the admin panel? Cached per request.
 * The session's JWT is verified (getClaims) and the role/status always come
 * from the database, so disabling someone takes effect immediately.
 */
export const getAccess = cache(async (): Promise<Access> => {
  if (!isSupabaseConfigured || !createAdminClient()) return { kind: "setup", reason: "env" };
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getClaims();
  const uid = auth?.claims?.sub;
  if (!uid) return { kind: "signed-out" };

  const { data: p, error } = await createAdminClient()!.from("profiles").select("*").eq("id", uid).maybeSingle();
  if (isMissingTable(error)) return { kind: "setup", reason: "database" };
  const email = (auth.claims.email as string | undefined) ?? "";
  if (!p || p.status !== "active") return { kind: "inactive", email: p?.email || email };
  return { kind: "ok", staff: { id: p.id, email: p.email || email, fullName: p.full_name, role: p.role } };
});

export const ROLE_LABEL: Record<Role, string> = { admin: "Admin", manager: "Manager", editor: "Editor" };

export const can = {
  manageUsers: (r: Role) => r === "admin",
  handleSubmissions: (r: Role) => r === "admin" || r === "manager",
  deleteSubmissions: (r: Role) => r === "admin",
  writePosts: (_r: Role) => true,
};

/** For pages: returns the staff member or redirects. */
export async function requireStaff(allowed?: (r: Role) => boolean): Promise<Staff> {
  const a = await getAccess();
  if (a.kind !== "ok") redirect("/admin/login");
  if (allowed && !allowed(a.staff.role)) redirect("/admin?denied=1");
  return a.staff;
}

/** For server actions: returns the staff member or a reason it isn't allowed. */
export async function checkStaff(allowed?: (r: Role) => boolean): Promise<{ staff: Staff } | { error: string }> {
  const a = await getAccess();
  if (a.kind === "setup") return { error: "The database isn't set up yet." };
  if (a.kind !== "ok") return { error: "Your session has ended. Please sign in again." };
  if (allowed && !allowed(a.staff.role)) return { error: "You don't have permission to do that." };
  return { staff: a.staff };
}
