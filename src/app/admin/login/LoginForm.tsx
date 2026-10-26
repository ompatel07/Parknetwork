"use client";

import { useActionState, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { signIn, type LoginState } from "../actions";
import { SubmitButton } from "@/components/admin/client";
import { input, labelCls } from "@/components/admin/ui";

export function LoginForm({ next }: { next: string }) {
  const [state, action] = useActionState<LoginState, FormData>(signIn, null);
  const [show, setShow] = useState(false);

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="next" value={next} />
      <div>
        <label htmlFor="email" className={labelCls}>
          Email
        </label>
        <input id="email" name="email" type="email" autoComplete="email" required defaultValue={state?.email} className={input} />
      </div>
      <div>
        <label htmlFor="password" className={labelCls}>
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={show ? "text" : "password"}
            autoComplete="current-password"
            required
            className={`${input} pr-11`}
          />
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            className="absolute inset-y-0 right-0 grid w-11 place-items-center text-muted hover:text-ink"
            aria-label={show ? "Hide password" : "Show password"}
          >
            {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
      </div>
      {state?.error && (
        <p role="alert" className="rounded-xl border border-live/40 bg-live/10 px-4 py-3 text-sm text-[#ffc2d1]">
          {state.error}
        </p>
      )}
      <SubmitButton className="h-11 w-full" pendingText="Signing in…">
        Sign in
      </SubmitButton>
    </form>
  );
}
