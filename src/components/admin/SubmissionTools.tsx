"use client";

import { useActionState, useRef, useState } from "react";
import { Mail, MessageCircle, StickyNote } from "lucide-react";
import { addReply, setSubmissionStatus, type ReplyState } from "@/app/admin/(panel)/submissions/actions";
import { SubmitButton } from "./client";
import { Notice, SUBMISSION_STATUS, input } from "./ui";
import { cn } from "@/lib/cn";
import type { ReplyChannel, SubmissionStatus } from "@/lib/supabase/types";

/** Status picker that saves as soon as it changes. */
export function StatusSelect({ id, status }: { id: string; status: SubmissionStatus }) {
  const form = useRef<HTMLFormElement>(null);
  return (
    <form ref={form} action={setSubmissionStatus}>
      <input type="hidden" name="id" value={id} />
      <label htmlFor="status" className="sr-only">
        Status
      </label>
      <select
        id="status"
        name="status"
        defaultValue={status}
        onChange={() => form.current?.requestSubmit()}
        className={cn(input, "h-10 w-auto py-0 pr-9 [color-scheme:dark]")}
      >
        {(Object.keys(SUBMISSION_STATUS) as SubmissionStatus[]).map((s) => (
          <option key={s} value={s}>
            {SUBMISSION_STATUS[s].label}
          </option>
        ))}
      </select>
    </form>
  );
}

/**
 * Reply box. Email is sent from the website; WhatsApp opens a chat with the
 * message ready to send (and logs it here); notes stay internal.
 */
export function ReplyComposer({
  id,
  name,
  email,
  wa,
  emailReady,
}: {
  id: string;
  name: string;
  email: string | null;
  wa: string | null;
  emailReady: boolean;
}) {
  const [state, action] = useActionState<ReplyState, FormData>(addReply, null);
  const first = name.split(" ")[0] || "there";
  const defaultChannel: ReplyChannel = email && emailReady ? "email" : wa ? "whatsapp" : "note";
  const [channel, setChannel] = useState<ReplyChannel>(defaultChannel);
  const [body, setBody] = useState("");

  // Clear the box once a reply has been saved (adjusting state during render,
  // the React-recommended way to respond to a new result)
  const [handledAt, setHandledAt] = useState<number | undefined>(undefined);
  if (state?.at && state.at !== handledAt && (state.ok || state.warn)) {
    setHandledAt(state.at);
    setBody("");
  }

  const greeting = channel === "note" ? "" : `Hi ${first},\n\n`;
  const options: { key: ReplyChannel; label: string; icon: typeof Mail; disabled?: string }[] = [
    { key: "email", label: "Email", icon: Mail, disabled: !email ? "No email address" : !emailReady ? "Email isn't set up (Resend)" : undefined },
    { key: "whatsapp", label: "WhatsApp", icon: MessageCircle, disabled: !wa ? "No phone number" : undefined },
    { key: "note", label: "Internal note", icon: StickyNote },
  ];

  return (
    <form
      action={action}
      onSubmit={(e) => {
        // WhatsApp must open during the click itself, or browsers block the new tab
        if (channel === "whatsapp" && wa && body.trim()) {
          window.open(`https://wa.me/${wa}?text=${encodeURIComponent(body.trim())}`, "_blank", "noopener,noreferrer");
        } else if (channel === "whatsapp") {
          e.preventDefault();
        }
      }}
      className="space-y-3"
    >
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="channel" value={channel} />
      <div className="flex flex-wrap gap-1.5" role="radiogroup" aria-label="Reply by">
        {options.map((o) => (
          <button
            key={o.key}
            type="button"
            role="radio"
            aria-checked={channel === o.key}
            disabled={!!o.disabled}
            title={o.disabled}
            onClick={() => {
              setChannel(o.key);
              if (!body.trim() && o.key !== "note") setBody(`Hi ${first},\n\n`);
            }}
            className={cn(
              "flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-40",
              channel === o.key ? "border-cyan/50 bg-cyan/10 text-ink" : "border-line-strong text-muted hover:text-ink",
            )}
          >
            <o.icon className="size-4" aria-hidden /> {o.label}
          </button>
        ))}
      </div>
      <label htmlFor="reply-body" className="sr-only">
        Message
      </label>
      <textarea
        id="reply-body"
        name="body"
        rows={6}
        value={body}
        onFocus={() => !body && greeting && setBody(greeting)}
        onChange={(e) => setBody(e.target.value)}
        placeholder={channel === "note" ? "Add a note for the team (the sender won't see it)…" : `Write your reply to ${first}…`}
        className={cn(input, "resize-y")}
      />
      {state?.error && <Notice tone="error">{state.error}</Notice>}
      {state?.warn && <Notice tone="warn">{state.warn}</Notice>}
      {state?.ok && state.message && <Notice tone="success">{state.message}</Notice>}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-muted">
          {channel === "email" && email && `Sends from the website to ${email}.`}
          {channel === "whatsapp" && "Opens WhatsApp with your message ready to send, and logs it here."}
          {channel === "note" && "Only your team can see notes."}
        </p>
        <SubmitButton pendingText="Sending…">
          {channel === "email" ? "Send email" : channel === "whatsapp" ? "Open WhatsApp" : "Add note"}
        </SubmitButton>
      </div>
    </form>
  );
}
