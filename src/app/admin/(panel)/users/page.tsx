import type { Metadata } from "next";
import { can, requireStaff } from "@/lib/admin/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { Badge, Card, Notice, PageHeader, RoleBadge, td, th } from "@/components/admin/ui";
import { LocalTime } from "@/components/admin/client";
import { CreateUserButton, ManageUser } from "@/components/admin/UserTools";
import { cn } from "@/lib/cn";

export const metadata: Metadata = { title: "Users" };

const NOTICES: Record<string, { tone: "success" | "error" | "warn"; text: string }> = {
  disabled: { tone: "success", text: "Account disabled." },
  enabled: { tone: "success", text: "Account enabled." },
  deleted: { tone: "success", text: "Account deleted." },
  "delete-failed": { tone: "error", text: "Couldn't delete that account. Please try again." },
  self: { tone: "warn", text: "You can't disable or delete your own account." },
  "last-admin": { tone: "warn", text: "That's the only admin — make someone else an admin first." },
};

type Props = { searchParams: Promise<{ notice?: string }> };

export default async function UsersPage({ searchParams }: Props) {
  const me = await requireStaff(can.manageUsers);
  const { notice } = await searchParams;
  const admin = createAdminClient()!;

  const [{ data: profiles, error }, { data: authList }] = await Promise.all([
    admin.from("profiles").select("*").order("created_at", { ascending: true }),
    admin.auth.admin.listUsers({ page: 1, perPage: 1000 }),
  ]);
  const authById = new Map((authList?.users ?? []).map((u) => [u.id, u]));
  const n = notice ? NOTICES[notice] : undefined;

  // Active first, then by role
  const order = { admin: 0, manager: 1, editor: 2 };
  const people = (profiles ?? []).sort((a, b) => (a.status === b.status ? order[a.role] - order[b.role] : a.status === "active" ? -1 : 1));

  return (
    <>
      <PageHeader
        eyebrow="Team"
        title="Users"
        lead={
          <>
            Who can sign in to this panel. <strong className="font-medium text-ink/85">Admins</strong> manage everything,{" "}
            <strong className="font-medium text-ink/85">managers</strong> handle posts and submissions,{" "}
            <strong className="font-medium text-ink/85">editors</strong> write blog posts.
          </>
        }
        actions={<CreateUserButton />}
      />
      {n && (
        <div className="mb-4">
          <Notice tone={n.tone}>{n.text}</Notice>
        </div>
      )}
      {error && (
        <div className="mb-4">
          <Notice tone="error">Couldn&apos;t load users: {error.message}</Notice>
        </div>
      )}

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-line">
              <tr>
                <th className={th}>Person</th>
                <th className={cn(th, "hidden sm:table-cell")}>Role</th>
                <th className={cn(th, "hidden sm:table-cell")}>Status</th>
                <th className={cn(th, "hidden md:table-cell")}>Last sign-in</th>
                <th className={th}>
                  <span className="sr-only">Manage</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {people.map((p) => {
                const u = authById.get(p.id);
                const isMe = p.id === me.id;
                return (
                  <tr key={p.id} className={cn(p.status !== "active" && "opacity-60")}>
                    <td className={td}>
                      <div className="flex items-center gap-3">
                        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-surface-2 text-sm font-semibold">
                          {(p.full_name || p.email).charAt(0).toUpperCase()}
                        </span>
                        <span className="min-w-0">
                          <span className="flex items-center gap-2 font-medium">
                            <span className="truncate">{p.full_name || "—"}</span>
                            {isMe && <Badge tone="cyan">You</Badge>}
                          </span>
                          <span className="block max-w-[11rem] truncate text-xs text-muted sm:max-w-none">{p.email}</span>
                          <span className="mt-1.5 flex gap-1.5 sm:hidden">
                            <RoleBadge role={p.role} />
                            {p.status !== "active" && <Badge tone="pink">Disabled</Badge>}
                          </span>
                        </span>
                      </div>
                    </td>
                    <td className={cn(td, "hidden sm:table-cell")}>
                      <RoleBadge role={p.role} />
                    </td>
                    <td className={cn(td, "hidden sm:table-cell")}>
                      {p.status === "active" ? (
                        <Badge tone="green" dot>
                          Active
                        </Badge>
                      ) : (
                        <Badge tone="pink" dot>
                          Disabled
                        </Badge>
                      )}
                    </td>
                    <td className={cn(td, "hidden whitespace-nowrap text-muted md:table-cell")}>{u?.last_sign_in_at ? <LocalTime iso={u.last_sign_in_at} mode="relative" /> : "Never"}</td>
                    <td className={cn(td, "text-right")}>
                      <ManageUser user={p} isMe={isMe} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
      <p className="mt-4 text-sm text-muted">
        Tip: someone who signs up on their own (outside this panel) appears here as <em>Disabled</em> and has no access until you enable them.
      </p>
    </>
  );
}
