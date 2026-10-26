"use client";

import { useState } from "react";
import { useForm, type FieldValues, type UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { AnimatePresence, motion } from "motion/react";
import { AlertCircle, Check, ChevronDown, Lock, MessageCircle } from "lucide-react";
import { site, whatsappHref, type FormType } from "@/config/site";
import { schemas, CONTACT_METHODS } from "@/lib/forms/schemas";
import { FORMS, defaultsFor, type FieldDef } from "@/lib/forms/fields";
import { submitForm } from "@/app/actions/submit";
import { Button } from "@/components/ui/Button";
import { SignalMark } from "@/components/ui/SignalMark";
import { cn } from "@/lib/cn";
import { Turnstile } from "./Turnstile";

type Form = UseFormReturn<FieldValues>;

const box =
  "block rounded-2xl border border-line bg-white/[0.025] px-4 pt-3 pb-2.5 transition-[border-color,background-color,box-shadow] duration-300 focus-within:border-cyan/60 focus-within:bg-white/[0.045] focus-within:shadow-[0_0_0_4px_rgb(79_227_255/0.08)] hover:border-line-strong";
const input = "mt-1.5 w-full bg-transparent text-[1rem] text-ink placeholder:text-muted/50 focus-visible:outline-none";

function Label({ f }: { f: FieldDef }) {
  return (
    <span className="eyebrow flex items-center justify-between text-muted">
      {f.label}
      {f.optional && <span className="normal-case tracking-normal text-muted">optional</span>}
    </span>
  );
}

function ErrorText({ form, name }: { form: Form; name: string }) {
  const msg = form.formState.errors[name]?.message;
  if (typeof msg !== "string") return null;
  return (
    <p id={`${name}-error`} role="alert" className="mt-2 flex items-center gap-1.5 text-sm text-[#ff8aa8]">
      <AlertCircle className="size-3.5 shrink-0" aria-hidden />
      {msg}
    </p>
  );
}

function Pills({ form, name, options, multi = false }: { form: Form; name: string; options: readonly string[]; multi?: boolean }) {
  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {options.map((o) => (
        <label key={o} className="relative cursor-pointer">
          <input type={multi ? "checkbox" : "radio"} value={o} className="peer sr-only" {...form.register(name)} />
          <span className="flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm text-muted transition-all duration-300 peer-checked:border-transparent peer-checked:bg-[linear-gradient(110deg,var(--color-violet),var(--color-signal))] peer-checked:text-white peer-focus-visible:ring-2 peer-focus-visible:ring-cyan hover:border-line-strong hover:text-ink">
            {o}
          </span>
        </label>
      ))}
    </div>
  );
}

function Checkbox({ form, name, children }: { form: Form; name: string; children: React.ReactNode }) {
  const err = !!form.formState.errors[name];
  return (
    <div>
      <label className="flex cursor-pointer items-start gap-3">
        <input type="checkbox" className="peer sr-only" aria-invalid={err} {...form.register(name)} />
        <span
          className={cn(
            "mt-0.5 grid size-5 shrink-0 place-items-center rounded-md border transition-all duration-300 peer-checked:border-transparent peer-checked:bg-cyan peer-focus-visible:ring-2 peer-focus-visible:ring-cyan [&>svg]:opacity-0 peer-checked:[&>svg]:opacity-100",
            err ? "border-live/70" : "border-line-strong",
          )}
        >
          <Check className="size-3.5 text-bg transition-opacity" strokeWidth={3} aria-hidden />
        </span>
        <span className="text-sm leading-relaxed text-ink/85">{children}</span>
      </label>
      <ErrorText form={form} name={name} />
    </div>
  );
}

function Field({ f, form }: { f: FieldDef; form: Form }) {
  const err = !!form.formState.errors[f.name];
  const aria = { "aria-invalid": err, "aria-describedby": err ? `${f.name}-error` : undefined };
  const wrap = cn(f.half ? "sm:col-span-1" : "sm:col-span-2");
  const errBox = err && "border-live/60";
  const method = form.watch("contactMethod") as string | undefined;

  switch (f.kind) {
    case "text":
    case "email":
    case "tel":
      return (
        <div className={wrap}>
          <label className={cn(box, errBox)}>
            <Label f={f} />
            <input type={f.kind} placeholder={f.placeholder} autoComplete={f.autoComplete} className={input} {...aria} {...form.register(f.name)} />
          </label>
          {f.hint && !err && <p className="mt-1.5 text-xs text-muted">{f.hint}</p>}
          <ErrorText form={form} name={f.name} />
        </div>
      );
    case "textarea":
      return (
        <div className={wrap}>
          <label className={cn(box, errBox)}>
            <Label f={f} />
            <textarea rows={f.rows ?? 4} placeholder={f.placeholder} className={cn(input, "resize-y")} {...aria} {...form.register(f.name)} />
          </label>
          <ErrorText form={form} name={f.name} />
        </div>
      );
    case "select":
      return (
        <div className={wrap}>
          <label className={cn(box, errBox, "relative")}>
            <Label f={f} />
            <select className={cn(input, "cursor-pointer appearance-none pr-8 [&>option]:bg-surface")} {...aria} {...form.register(f.name)}>
              <option value="">Choose…</option>
              {f.options.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-4 bottom-3.5 size-4 text-muted" aria-hidden />
          </label>
          <ErrorText form={form} name={f.name} />
        </div>
      );
    case "radio":
    case "multi":
      return (
        <fieldset className={wrap}>
          <legend className="eyebrow text-muted">{f.label}</legend>
          {f.hint && <p className="mt-1 text-xs text-muted">{f.hint}</p>}
          <Pills form={form} name={f.name} options={f.options} multi={f.kind === "multi"} />
          <ErrorText form={form} name={f.name} />
        </fieldset>
      );
    case "checkbox":
      return (
        <div className="sm:col-span-2">
          <Checkbox form={form} name={f.name}>
            {f.label}
          </Checkbox>
        </div>
      );
    case "contact": {
      const email = method === "Email";
      return (
        <fieldset className="sm:col-span-2">
          <legend className="eyebrow text-muted">{f.label}</legend>
          <Pills form={form} name="contactMethod" options={CONTACT_METHODS} />
          <div className="mt-3">
            <label className={cn(box, form.formState.errors.contactValue && "border-live/60")}>
              <span className="eyebrow text-muted">{email ? "Email address" : "WhatsApp number"}</span>
              <input
                type={email ? "email" : "tel"}
                autoComplete={email ? "email" : "tel"}
                placeholder={email ? "you@example.com" : "+91 98765 43210"}
                className={input}
                aria-invalid={!!form.formState.errors.contactValue}
                {...form.register("contactValue")}
              />
            </label>
            <ErrorText form={form} name="contactValue" />
          </div>
        </fieldset>
      );
    }
  }
}

/**
 * One component renders every form from its definition in lib/forms/fields.ts.
 * Validation runs in the browser and again on the server (same Zod schema).
 */
export function SmartForm({
  type,
  defaults,
  hidden,
  className,
}: {
  type: FormType;
  /** Prefilled values, e.g. { role: "Super Admin" } */
  defaults?: Record<string, unknown>;
  /** Values sent but not shown (e.g. the role being applied for) */
  hidden?: Record<string, string>;
  className?: string;
}) {
  const def = FORMS[type];
  const form = useForm<FieldValues>({
    resolver: zodResolver(schemas[type] as unknown as z.ZodType<FieldValues, FieldValues>),
    defaultValues: defaultsFor(type, { ...hidden, ...defaults }),
    mode: "onTouched",
  });
  const [token, setToken] = useState("");
  const [serverError, setServerError] = useState("");
  const [result, setResult] = useState<{ reference: string; delivered: boolean } | null>(null);

  const onSubmit = form.handleSubmit(async (values, event) => {
    setServerError("");
    const formEl = event?.target instanceof HTMLFormElement ? event.target : null;
    const trap = formEl ? String(new FormData(formEl).get("website") ?? "") : "";
    const res = await submitForm(type, { ...values, ...hidden, website: trap, "cf-turnstile-response": token });
    if (res.ok) {
      setResult({ reference: res.reference, delivered: res.delivered });
      return;
    }
    if (res.fieldErrors) {
      for (const [k, message] of Object.entries(res.fieldErrors)) form.setError(k, { message });
    }
    setServerError(res.error);
  });

  const reset = () => {
    form.reset(defaultsFor(type, { ...hidden, ...defaults }));
    setResult(null);
  };

  return (
    <div className={cn("relative", className)}>
      <AnimatePresence mode="wait" initial={false}>
        {result ? (
          <motion.div
            key="done"
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center py-10 text-center"
            role="status"
          >
            <div className="relative grid size-28 place-items-center">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="absolute inset-0 rounded-full border border-cyan/60"
                  style={{ animation: `viz-pulse 2.4s cubic-bezier(.22,1,.36,1) ${i * 0.5}s infinite` }}
                />
              ))}
              <SignalMark className="size-14" animated />
            </div>
            <p className="eyebrow mt-8 text-cyan">Signal received · {result.reference}</p>
            <h3 className="mt-4 text-d3">{def.success}</h3>
            <p className="mt-3 max-w-sm text-muted">
              Thank you. {site.contact.responseTime} We&apos;ll reply using the details you shared.
            </p>
            {!result.delivered && (
              <p className="mt-6 max-w-sm rounded-xl border border-dashed border-line-strong px-4 py-3 text-xs text-muted">
                Preview note: email delivery isn&apos;t connected on this preview yet. For anything urgent, message us on
                WhatsApp.
              </p>
            )}
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button variant="ghost" onClick={reset} icon={false}>
                Send another
              </Button>
              <Button href={whatsappHref(`Hi! I just sent a form — reference ${result.reference}`)} icon={<MessageCircle className="size-[18px]" />}>
                WhatsApp us
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -10 }}
            onSubmit={onSubmit}
            noValidate
            className="grid gap-4 sm:grid-cols-2"
          >
            {def.fields.map((f) => (
              <Field key={f.name} f={f} form={form} />
            ))}

            {/* Honeypot — invisible to people, irresistible to bots */}
            <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
              <label>
                Website
                <input type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
              </label>
            </div>

            <div className="mt-2 space-y-4 border-t border-line pt-6 sm:col-span-2">
              <Checkbox form={form} name="consent">
                I agree that {site.name} may use these details to respond to my enquiry, as described in the{" "}
                <a href="/privacy" target="_blank" className="text-cyan underline underline-offset-2">
                  privacy policy
                </a>
                .
              </Checkbox>
              <p className="flex items-center gap-2 text-xs text-muted">
                <Lock className="size-3.5 shrink-0" aria-hidden />
                We&apos;ll never ask for passwords, OTPs or card details.
              </p>
              <Turnstile onToken={setToken} />
            </div>

            {serverError && (
              <p role="alert" className="flex items-center gap-2 rounded-xl border border-live/40 bg-live/10 px-4 py-3 text-sm text-[#ffb3c6] sm:col-span-2">
                <AlertCircle className="size-4 shrink-0" aria-hidden />
                {serverError}
              </p>
            )}

            <div className="sm:col-span-2">
              <Button type="submit" size="lg" magnetic disabled={form.formState.isSubmitting} className="w-full justify-between sm:w-auto">
                {form.formState.isSubmitting ? "Sending…" : def.submit}
              </Button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
