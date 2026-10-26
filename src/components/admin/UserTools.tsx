"use client";

import { useActionState, useState } from "react";
import { Check, Copy, KeyRound, RefreshCw, Settings2, Trash2, UserPlus } from "lucide-react";
import {
  createUser,
  deleteUser,
  setUserPassword,
  setUserStatus,
  updateUser,
  type UserState,
} from "@/app/admin/(panel)/users/actions";
import { ConfirmAction, Modal, SubmitButton } from "./client";
import { Notice, btn, input, labelCls } from "./ui";
import { cn } from "@/lib/cn";
import type { AccountStatus, Role } from "@/lib/supabase/types";

const ROLE_HELP: Record<Role, string> = {
  admin: "Everything, including managing users",
  manager: "Blog posts + form submissions and replies",
  editor: "Blog posts only",
};

/** A strong, readable password (no look-alike characters). */
function generatePassword() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%";
  const bytes = crypto.getRandomValues(new Uint32Array(14));
  return Array.from(bytes, (b) => chars[b % chars.length]).join("");
}

function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setDone(true);
          setTimeout(() => setDone(false), 1800);
        } catch {
          window.prompt("Copy:", text);
        }
      }}
      className={cn(btn.base, btn.ghost, btn.sm)}
    >
      {done ? <Check className="size-3.5 text-[#3ddc84]" /> : <Copy className="size-3.5" />} {done ? "Copied" : label}
    </button>
  );
}

function PasswordField({ name = "password", value, onChange }: { name?: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label htmlFor={`${name}-field`} className={labelCls}>
        Password
      </label>
      <div className="flex gap-2">
        <input
          id={`${name}-field`}
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          minLength={8}
          maxLength={72}
          required
          autoComplete="new-password"
          className={cn(input, "font-mono")}
        />
        <button type="button" onClick={() => onChange(generatePassword())} className={cn(btn.base, btn.ghost, "px-3")} title="Generate a new password" aria-label="Generate a new password">
          <RefreshCw className="size-4" />
        </button>
      </div>
      <p className="mt-1.5 text-xs text-muted">At least 8 characters. They can change it later under My account.</p>
    </div>
  );
}

function RoleSelect({ defaultValue, disabled }: { defaultValue: Role; disabled?: boolean }) {
  const [role, setRole] = useState<Role>(defaultValue);
  return (
    <div>
      <label htmlFor="role" className={labelCls}>
        Role
      </label>
      <select id="role" name="role" value={role} onChange={(e) => setRole(e.target.value as Role)} disabled={disabled} className={cn(input, "[color-scheme:dark]")}>
        <option value="editor">Editor</option>
        <option value="manager">Manager</option>
        <option value="admin">Admin</option>
      </select>
      {disabled && <input type="hidden" name="role" value={role} />}
      <p className="mt-1.5 text-xs text-muted">{ROLE_HELP[role]}</p>
    </div>
  );
}

/** "Add user" button + dialog. Shows the new login details once created. */
export function CreateUserButton() {
  const [round, setRound] = useState(0);
  return (
    <Modal
      title="Add a team member"
      triggerClassName={cn(btn.base, btn.primary)}
      trigger={
        <>
          <UserPlus className="size-4" /> Add user
        </>
      }
      // however it's closed, the next "Add user" starts with an empty form
      onOpenChange={(open) => !open && setRound((r) => r + 1)}
    >
      {(close) => <CreateUserForm key={round} close={close} />}
    </Modal>
  );
}

function CreateUserForm({ close }: { close: () => void }) {
  const [state, action] = useActionState<UserState, FormData>(createUser, null);
  const [pw, setPw] = useState("");
  return state?.created ? (
          <div className="space-y-4">
            <Notice tone="success">Account created. Send these login details to them privately (e.g. WhatsApp):</Notice>
            <div className="space-y-2 rounded-xl border border-line bg-bg/70 p-4 font-mono text-sm">
              <p>Login: {typeof window !== "undefined" ? `${window.location.origin}/admin` : "/admin"}</p>
              <p>Email: {state.created.email}</p>
              <p>Password: {state.created.password}</p>
            </div>
            <div className="flex flex-wrap justify-end gap-2">
              <CopyButton
                label="Copy details"
                text={`Park Live admin login\n${typeof window !== "undefined" ? window.location.origin : ""}/admin\nEmail: ${state.created.email}\nPassword: ${state.created.password}`}
              />
              <button type="button" className={cn(btn.base, btn.primary)} onClick={close}>
                Done
              </button>
            </div>
          </div>
        ) : (
          <form action={action} className="space-y-4">
            <div>
              <label htmlFor="new-name" className={labelCls}>
                Full name
              </label>
              <input id="new-name" name="full_name" required maxLength={80} className={input} />
            </div>
            <div>
              <label htmlFor="new-email" className={labelCls}>
                Email
              </label>
              <input id="new-email" name="email" type="email" required autoComplete="off" className={input} />
            </div>
            <RoleSelect defaultValue="editor" />
            <PasswordField value={pw || ""} onChange={setPw} />
            {!pw && (
              <button type="button" onClick={() => setPw(generatePassword())} className="text-sm text-cyan hover:underline">
                Generate a strong password
              </button>
            )}
            {state?.error && <Notice tone="error">{state.error}</Notice>}
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={close} className={cn(btn.base, btn.ghost)}>
                Cancel
              </button>
              <SubmitButton pendingText="Creating…">Create account</SubmitButton>
            </div>
          </form>
        );
}

type Member = { id: string; email: string; full_name: string; role: Role; status: AccountStatus };

/** "Manage" dialog for one account: details, password, access, delete. */
export function ManageUser({ user, isMe }: { user: Member; isMe: boolean }) {
  const [details, detailsAction] = useActionState<UserState, FormData>(updateUser, null);
  const [pwState, pwAction] = useActionState<UserState, FormData>(setUserPassword, null);
  const [pw, setPw] = useState("");

  return (
    <Modal
      title={user.full_name || user.email}
      triggerClassName={cn(btn.base, btn.ghost, btn.sm)}
      trigger={
        <>
          <Settings2 className="size-3.5" aria-hidden /> <span className="sr-only sm:not-sr-only">Manage</span>
        </>
      }
    >
      <div className="space-y-7">
        <form action={detailsAction} className="space-y-4">
          <input type="hidden" name="id" value={user.id} />
          <div>
            <label htmlFor={`name-${user.id}`} className={labelCls}>
              Full name
            </label>
            <input id={`name-${user.id}`} name="full_name" defaultValue={user.full_name} required maxLength={80} className={input} />
          </div>
          <div>
            <label htmlFor={`email-${user.id}`} className={labelCls}>
              Email (their login)
            </label>
            <input id={`email-${user.id}`} name="email" type="email" defaultValue={user.email} required className={input} />
          </div>
          <RoleSelect defaultValue={user.role} disabled={isMe} />
          {details?.error && <Notice tone="error">{details.error}</Notice>}
          {details?.ok && <Notice tone="success">{details.message}</Notice>}
          <div className="flex justify-end">
            <SubmitButton pendingText="Saving…">Save changes</SubmitButton>
          </div>
        </form>

        <form action={pwAction} className="space-y-4 border-t border-line pt-6">
          <input type="hidden" name="id" value={user.id} />
          <p className="flex items-center gap-2 text-sm font-semibold">
            <KeyRound className="size-4 text-cyan" /> Set a new password
          </p>
          <PasswordField value={pw} onChange={setPw} />
          {pwState?.error && <Notice tone="error">{pwState.error}</Notice>}
          {pwState?.ok && (
            <Notice tone="success">
              {pwState.message} <span className="font-mono">{pw}</span>
            </Notice>
          )}
          <div className="flex justify-end gap-2">
            {pwState?.ok && pw && <CopyButton text={pw} label="Copy password" />}
            <SubmitButton variant="ghost" pendingText="Saving…">
              Set password
            </SubmitButton>
          </div>
        </form>

        {!isMe && (
          <div className="space-y-3 border-t border-line pt-6">
            <p className="text-sm font-semibold">Access</p>
            <div className="flex flex-wrap gap-2">
              {user.status === "active" ? (
                <ConfirmAction
                  action={setUserStatus}
                  fields={{ id: user.id, status: "disabled" }}
                  title="Disable this account?"
                  body={`${user.full_name || user.email} won't be able to sign in, and loses access straight away. You can enable it again any time.`}
                  confirmLabel="Disable"
                  triggerClassName={cn(btn.base, btn.ghost)}
                  trigger="Disable account"
                />
              ) : (
                <ConfirmAction
                  action={setUserStatus}
                  fields={{ id: user.id, status: "active" }}
                  title="Enable this account?"
                  body={`${user.full_name || user.email} will be able to sign in again with their role (${user.role}).`}
                  confirmLabel="Enable"
                  tone="primary"
                  triggerClassName={cn(btn.base, btn.ghost)}
                  trigger="Enable account"
                />
              )}
              <ConfirmAction
                action={deleteUser}
                fields={{ id: user.id }}
                title="Delete this account?"
                body={`${user.full_name || user.email}'s login is removed for good. Posts they wrote stay on the blog.`}
                confirmLabel="Delete account"
                trigger={
                  <>
                    <Trash2 className="size-4" /> Delete
                  </>
                }
              />
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
