import type { Metadata } from "next";
import { LogOut } from "lucide-react";
import { ROLE_LABEL, requireStaff } from "@/lib/admin/auth";
import { signOut } from "@/app/admin/actions";
import { Card, PageHeader, RoleBadge, btn } from "@/components/admin/ui";
import { PasswordForm, ProfileForm } from "./AccountForms";
import { cn } from "@/lib/cn";

export const metadata: Metadata = { title: "My account" };

const ROLE_TEXT = {
  admin: "You can manage everything, including who can sign in.",
  manager: "You can write blog posts and handle form submissions.",
  editor: "You can write and publish blog posts.",
};

export default async function AccountPage() {
  const staff = await requireStaff();
  return (
    <>
      <PageHeader
        eyebrow="Account"
        title="My account"
        lead={
          <span className="inline-flex flex-wrap items-center gap-2">
            Signed in as {staff.email} <RoleBadge role={staff.role} />
          </span>
        }
        actions={
          <form action={signOut}>
            <button className={cn(btn.base, btn.ghost)}>
              <LogOut className="size-4" /> Sign out
            </button>
          </form>
        }
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Profile">
          <ProfileForm name={staff.fullName} email={staff.email} />
        </Card>
        <Card title="Password">
          <PasswordForm />
        </Card>
      </div>
      <p className="mt-6 text-sm text-muted">
        {ROLE_LABEL[staff.role]}: {ROLE_TEXT[staff.role]}
      </p>
    </>
  );
}
