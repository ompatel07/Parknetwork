"use client";

import Link from "next/link";
import { useActionState, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { ArrowLeft, ExternalLink, ImagePlus, Loader2, X } from "lucide-react";
import { savePost, type PostFormState } from "@/app/admin/(panel)/posts/actions";
import { MarkdownEditor } from "./MarkdownEditor";
import { SubmitButton } from "./client";
import { Notice, PostBadge, btn, input, labelCls } from "./ui";
import { uploadImage } from "./upload";
import { slugify } from "@/lib/slug";
import { cn } from "@/lib/cn";
import type { Post } from "@/lib/supabase/types";

export type EditablePost = Pick<
  Post,
  "id" | "slug" | "title" | "excerpt" | "content" | "cover_url" | "cover_alt" | "tags" | "status" | "published_at" | "author_name"
>;

/** ISO → value for <input type="datetime-local"> in the writer's own time zone */
function toLocalInput(iso: string | null | undefined) {
  if (!iso) return "";
  const d = new Date(iso);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
}

/** False during server render and hydration, true afterwards. */
const noop = () => () => {};
const useIsClient = () => useSyncExternalStore(noop, () => true, () => false);

const Err = ({ msg }: { msg?: string }) => (msg ? <p className="mt-1.5 text-sm text-[#ff9db5]">{msg}</p> : null);

export function PostEditor({ post, notice, defaultAuthor }: { post: EditablePost | null; notice?: string; defaultAuthor: string }) {
  const [state, action] = useActionState<PostFormState, FormData>(savePost, null);
  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [slugEdited, setSlugEdited] = useState(!!post);
  const [content, setContent] = useState(post?.content ?? "");
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [cover, setCover] = useState(post?.cover_url ?? "");
  // The publish date is shown in the writer's own time zone, which the
  // server doesn't know — so it's only filled in once running in the browser.
  const isClient = useIsClient();
  const [publishEdit, setPublishEdit] = useState<string | null>(null);
  const publishLocal = isClient ? (publishEdit ?? toLocalInput(post?.published_at)) : "";
  const setPublishLocal = setPublishEdit;
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  // "Unsaved changes" = edits made after the last successful save
  const [edits, setEdits] = useState(0);
  const [editsSent, setEditsSent] = useState(0);
  const dirty = state?.ok ? edits > editsSent : edits > 0;
  const setDirty = (on: boolean) => on && setEdits((n) => n + 1);
  const coverInput = useRef<HTMLInputElement>(null);
  // Warn before closing the tab with unsaved changes
  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const shownSlug = slugEdited ? slug : slugify(title);
  const published = post?.status === "published";
  const scheduled = published && !!post?.published_at && new Date(post.published_at) > new Date();
  const fe = state?.fieldErrors ?? {};

  const onCover = async (f: File | undefined) => {
    if (!f) return;
    setUploadError("");
    setUploading(true);
    try {
      setCover(await uploadImage(f));
      setDirty(true);
    } catch (e) {
      setUploadError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setUploading(false);
      if (coverInput.current) coverInput.current.value = "";
    }
  };

  return (
    <form action={action} onChange={() => setDirty(true)} onSubmit={() => setEditsSent(edits)} className="pb-10">
      {post && <input type="hidden" name="id" value={post.id} />}
      <input type="hidden" name="cover_url" value={cover} />
      <input type="hidden" name="published_at" value={publishLocal ? new Date(publishLocal).toISOString() : ""} />

      {/* Action bar */}
      <div className="sticky top-16 z-30 -mx-4 mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-line bg-bg/95 px-4 py-3 sm:-mx-6 sm:px-6 md:-mx-8 md:px-8 lg:top-0 lg:-mx-10 lg:px-10">
        <div className="flex min-w-0 items-center gap-3">
          <Link href="/admin/posts" className={cn(btn.base, btn.quiet, "px-2")} aria-label="Back to posts">
            <ArrowLeft className="size-4" />
          </Link>
          <h1 className="truncate font-display text-lg font-semibold">{post ? "Edit post" : "New post"}</h1>
          {post && <PostBadge status={post.status} scheduled={scheduled} />}
          {dirty && <span className="hidden text-xs text-muted sm:inline">Unsaved changes</span>}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {published && !scheduled && (
            <a href={`/blog/${post!.slug}`} target="_blank" rel="noopener noreferrer" className={cn(btn.base, btn.quiet)}>
              <ExternalLink className="size-4" /> View
            </a>
          )}
          {published ? (
            <>
              <SubmitButton variant="ghost" name="intent" value="unpublish">
                Unpublish
              </SubmitButton>
              <SubmitButton name="intent" value="save" pendingText="Saving…">
                Update
              </SubmitButton>
            </>
          ) : (
            <>
              <SubmitButton variant="ghost" name="intent" value={post ? "save" : "draft"} pendingText="Saving…">
                Save draft
              </SubmitButton>
              <SubmitButton name="intent" value="publish" pendingText="Publishing…">
                {publishLocal && new Date(publishLocal) > new Date() ? "Schedule" : "Publish"}
              </SubmitButton>
            </>
          )}
        </div>
      </div>

      <div className="mb-5 space-y-3">
        {notice && !state && <Notice tone="success">{notice}</Notice>}
        {state?.ok && state.message && <Notice tone="success">{state.message}</Notice>}
        {state?.error && <Notice tone="error">{state.error}</Notice>}
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_19rem]">
        {/* Main column */}
        <div className="min-w-0 space-y-5">
          <div>
            <label htmlFor="title" className="sr-only">
              Title
            </label>
            <textarea
              id="title"
              name="title"
              rows={1}
              value={title}
              onChange={(e) => setTitle(e.target.value.replace(/\n/g, " "))}
              placeholder="Post title"
              className="field-sizing-content w-full resize-none bg-transparent font-display text-[clamp(1.7rem,1.2rem+1.6vw,2.6rem)] leading-tight font-semibold tracking-[-0.03em] placeholder:text-muted/40 focus:outline-none"
              maxLength={200}
            />
            <Err msg={fe.title} />
          </div>

          <div>
            <label htmlFor="excerpt" className={labelCls}>
              Summary <span className="font-normal text-muted">— shown on the blog page and in link previews</span>
            </label>
            <textarea
              id="excerpt"
              name="excerpt"
              rows={2}
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              maxLength={400}
              placeholder="One or two sentences about the post"
              className={cn(input, "resize-y")}
            />
            <p className="mt-1 text-right text-xs text-muted">{excerpt.length}/400</p>
            <Err msg={fe.excerpt} />
          </div>

          <div>
            <p className={labelCls}>Content</p>
            <MarkdownEditor
              name="content"
              value={content}
              onChange={(v) => {
                setContent(v);
                setDirty(true);
              }}
            />
          </div>
        </div>

        {/* Settings column */}
        <aside className="space-y-5">
          <section className="rounded-2xl border border-line bg-surface p-5">
            <h2 className="mb-3 text-sm font-semibold">Cover image</h2>
            {cover ? (
              <div className="relative overflow-hidden rounded-xl border border-line">
                {/* eslint-disable-next-line @next/next/no-img-element -- live preview of a just-uploaded file */}
                <img src={cover} alt="" className="aspect-[16/10] w-full object-cover" />
                <button
                  type="button"
                  onClick={() => {
                    setCover("");
                    setDirty(true);
                  }}
                  className="absolute top-2 right-2 grid size-8 place-items-center rounded-full bg-black/70 text-white hover:bg-black"
                  aria-label="Remove cover image"
                >
                  <X className="size-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => coverInput.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  onCover(e.dataTransfer.files?.[0]);
                }}
                disabled={uploading}
                className="flex aspect-[16/10] w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-line-strong text-sm text-muted transition-colors hover:border-cyan/50 hover:text-ink"
              >
                {uploading ? <Loader2 className="size-6 animate-spin" /> : <ImagePlus className="size-6" />}
                {uploading ? "Uploading…" : "Upload or drop an image"}
              </button>
            )}
            <input ref={coverInput} type="file" accept="image/*" hidden onChange={(e) => onCover(e.target.files?.[0])} />
            {uploadError && <p className="mt-2 text-sm text-[#ff9db5]">{uploadError}</p>}
            {cover && (
              <button type="button" onClick={() => coverInput.current?.click()} className="mt-2 text-sm text-muted underline-offset-4 hover:text-ink hover:underline">
                Replace image
              </button>
            )}
            <label htmlFor="cover_alt" className={cn(labelCls, "mt-4")}>
              Image description <span className="font-normal text-muted">(for screen readers)</span>
            </label>
            <input id="cover_alt" name="cover_alt" defaultValue={post?.cover_alt ?? ""} maxLength={200} className={input} placeholder="e.g. A host streaming live" />
          </section>

          <section className="space-y-4 rounded-2xl border border-line bg-surface p-5">
            <div>
              <label htmlFor="published_local" className={labelCls}>
                Publish date
              </label>
              <input
                id="published_local"
                type="datetime-local"
                value={publishLocal}
                onChange={(e) => setPublishLocal(e.target.value)}
                className={cn(input, "[color-scheme:dark]")}
              />
              <p className="mt-1.5 text-xs text-muted">Leave empty to publish now. Pick a future date to schedule the post.</p>
              <Err msg={fe.published_at} />
            </div>
            <div>
              <label htmlFor="slug" className={labelCls}>
                Web address
              </label>
              <div className="flex items-center rounded-xl border border-line-strong bg-bg/70 focus-within:border-cyan/60">
                <span className="pl-3.5 text-sm text-muted">/blog/</span>
                <input
                  id="slug"
                  name="slug"
                  value={shownSlug}
                  onChange={(e) => {
                    setSlugEdited(true);
                    let v = e.target.value.trim();
                    // a whole link was pasted → keep just its last part (empty = use the title)
                    if (/^(https?:\/\/|www\.)/i.test(v)) v = v.replace(/^(https?:\/\/)?[^/]+/i, "").split("/").filter(Boolean).pop() ?? "";
                    setSlug(v.toLowerCase().replace(/[^a-z0-9-]/g, "-"));
                  }}
                  maxLength={120}
                  placeholder="made-from-the-title"
                  className="min-w-0 flex-1 bg-transparent py-2.5 pr-3.5 pl-0.5 text-[0.95rem] focus:outline-none"
                />
              </div>
              {published && <p className="mt-1.5 text-xs text-muted">Changing it breaks links people have already shared.</p>}
              <Err msg={fe.slug} />
            </div>
            <div>
              <label htmlFor="tags" className={labelCls}>
                Tags
              </label>
              <input id="tags" name="tags" defaultValue={post?.tags.join(", ") ?? ""} className={input} placeholder="live-streaming, agencies" />
              <p className="mt-1.5 text-xs text-muted">Separate with commas. Up to 8.</p>
            </div>
            <div>
              <label htmlFor="author_name" className={labelCls}>
                Author name
              </label>
              <input id="author_name" name="author_name" defaultValue={post?.author_name || defaultAuthor} maxLength={80} className={input} placeholder="Park Live Network" />
            </div>
          </section>
        </aside>
      </div>
    </form>
  );
}
