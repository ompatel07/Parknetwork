"use client";

import { useActionState, useEffect, useRef } from "react";
import { changePassword, updateProfile, type AccountState } from "./actions";
import { SubmitButton } from "@/components/admin/client";
import { Notice, input, labelCls } from "@/components/admin/ui";

export function ProfileForm({ name, email }: { name: string; email: string }) {
  const [state, action] = useActionState<AccountState, FormData>(updateProfile, null);
  return (
    <form action={action} className="space-y-4 p-5">
      <div>
        <label htmlFor="full_name" className={labelCls}>
          Your name
        </label>
        <input id="full_name" name="full_name" defaultValue={name} required maxLength={80} className={input} />
        <p className="mt-1.5 text-xs text-muted">Shown as the author on posts you write.</p>
      </div>
      <div>
        <label htmlFor="email" className={labelCls}>
          Email (your login)
        </label>
        <input id="email" name="email" type="email" defaultValue={email} required className={input} />
      </div>
      {state?.error && <Notice tone="error">{state.error}</Notice>}
      {state?.ok && <Notice tone="success">{state.message}</Notice>}
      <div className="flex justify-end">
        <SubmitButton pendingText="Saving…">Save</SubmitButton>
      </div>
    </form>
  );
}

export function PasswordForm() {
  const [state, action] = useActionState<AccountState, FormData>(changePassword, null);
  const form = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (state?.ok) form.current?.reset();
  }, [state]);
  return (
    <form ref={form} action={action} className="space-y-4 p-5">
      <div>
        <label htmlFor="current" className={labelCls}>
          Current password
        </label>
        <input id="current" name="current" type="password" autoComplete="current-password" required className={input} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="next" className={labelCls}>
            New password
          </label>
          <input id="next" name="next" type="password" autoComplete="new-password" minLength={8} maxLength={72} required className={input} />
        </div>
        <div>
          <label htmlFor="confirm" className={labelCls}>
            Repeat new password
          </label>
          <input id="confirm" name="confirm" type="password" autoComplete="new-password" minLength={8} maxLength={72} required className={input} />
        </div>
      </div>
      {state?.error && <Notice tone="error">{state.error}</Notice>}
      {state?.ok && <Notice tone="success">{state.message}</Notice>}
      <div className="flex justify-end">
        <SubmitButton pendingText="Changing…">Change password</SubmitButton>
      </div>
    </form>
  );
}
