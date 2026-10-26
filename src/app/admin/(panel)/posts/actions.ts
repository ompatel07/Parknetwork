"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { can, checkStaff } from "@/lib/admin/auth";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { BLOG_BUCKET, isOwnImage, supabaseUrl } from "@/lib/supabase/env";
import { slugify } from "@/lib/slug";

export type PostFormState = {
  ok?: boolean;
  message?: string;
  error?: string;
  fieldErrors?: Partial<Record<"title" | "slug" | "excerpt" | "cover_url" | "published_at", string>>;
  savedAt?: number;
} | null;

const schema = z.object({
  id: z.string().uuid().optional().or(z.literal("")),
  title: z.string().trim().min(1, "Give the post a title.").max(200, "Keep the title under 200 characters."),
  slug: z.string().trim().max(120).optional().default(""),
  excerpt: z.string().trim().max(400, "Keep the summary under 400 characters.").default(""),
  content: z.string().max(200_000, "The post is too long.").default(""),
  cover_url: z.string().trim().url("That doesn't look like a valid image link.").or(z.literal("")).default(""),
  cover_alt: z.string().trim().max(200).default(""),
  tags: z.string().default(""),
  author_name: z.string().trim().max(80).default(""),
  published_at: z.string().trim().default(""),
  intent: z.enum(["save", "publish", "unpublish", "draft"]),
});

function revalidateBlog(...slugs: (string | null | undefined)[]) {
  revalidatePath("/blog");
  revalidatePath("/sitemap.xml");
  for (const s of new Set(slugs.filter(Boolean))) revalidatePath(`/blog/${s}`);
  revalidatePath("/admin/posts");
  revalidatePath("/admin");
}

export async function savePost(_prev: PostFormState, formData: FormData): Promise<PostFormState> {
  const auth = await checkStaff(can.writePosts);
  if ("error" in auth) return { error: auth.error };
  const { staff } = auth;

  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const i of parsed.error.issues) fieldErrors[String(i.path[0])] ??= i.message;
    return { error: "Please check the highlighted fields.", fieldErrors };
  }
  const v = parsed.data;
  const supabase = await createClient();

  // Existing post (for edits)
  const existing = v.id
    ? (await supabase.from("posts").select("id, slug, status, published_at").eq("id", v.id).maybeSingle()).data
    : null;
  if (v.id && !existing) return { error: "This post no longer exists." };

  // URL slug: typed by the author, or made from the title
  const typed = slugify(v.slug);
  if (v.slug && !typed) return { error: "Please check the highlighted fields.", fieldErrors: { slug: "Use letters, numbers and dashes." } };
  let slug = typed || slugify(v.title) || `post-${Date.now().toString(36)}`;
  const taken = async (s: string) => {
    let q = supabase.from("posts").select("id").eq("slug", s);
    if (v.id) q = q.neq("id", v.id);
    return !!(await q.maybeSingle()).data;
  };
  if (await taken(slug)) {
    if (typed) return { error: "Please check the highlighted fields.", fieldErrors: { slug: "Another post already uses this URL." } };
    let n = 2;
    while (await taken(`${slug}-${n}`)) n++;
    slug = `${slug}-${n}`;
  }

  // Publish date (optional): an ISO time from the editor
  let publishedAt: string | null = existing?.published_at ?? null;
  if (v.published_at) {
    const d = new Date(v.published_at);
    if (Number.isNaN(d.getTime())) return { error: "Please check the highlighted fields.", fieldErrors: { published_at: "Pick a valid date." } };
    publishedAt = d.toISOString();
  }

  let status = existing?.status ?? "draft";
  if (v.intent === "publish") {
    status = "published";
    publishedAt ??= new Date().toISOString();
  } else if (v.intent === "unpublish" || v.intent === "draft") {
    status = "draft";
  }

  const tags = [...new Set(v.tags.split(",").map((t) => slugify(t)).filter(Boolean))].slice(0, 8);
  const row = {
    slug,
    title: v.title,
    excerpt: v.excerpt,
    content: v.content,
    cover_url: v.cover_url || null,
    cover_alt: v.cover_alt,
    tags,
    status,
    published_at: publishedAt,
    author_name: v.author_name || staff.fullName,
  };

  if (!existing) {
    const { data, error } = await supabase
      .from("posts")
      .insert({ ...row, author_id: staff.id })
      .select("id")
      .single();
    if (error || !data) return { error: friendly(error?.message) };
    revalidateBlog(slug);
    redirect(`/admin/posts/${data.id}?saved=${status === "published" ? "published" : "draft"}`);
  }

  const { error } = await supabase.from("posts").update(row).eq("id", existing.id);
  if (error) return { error: friendly(error.message) };
  revalidateBlog(slug, existing.slug);
  revalidatePath(`/admin/posts/${existing.id}`);
  const message =
    v.intent === "publish"
      ? publishedAt && new Date(publishedAt) > new Date()
        ? "Scheduled — it goes live at the publish date."
        : "Published — it's live on the blog."
      : v.intent === "unpublish"
        ? "Unpublished — it's now a draft."
        : "Saved.";
  return { ok: true, message, savedAt: Date.now() };
}

function friendly(msg?: string) {
  if (!msg) return "Couldn't save the post. Please try again.";
  if (/row-level security|permission/i.test(msg)) return "You don't have permission to change posts.";
  return `Couldn't save the post: ${msg}`;
}

export async function deletePost(formData: FormData) {
  const auth = await checkStaff(can.writePosts);
  if ("error" in auth) redirect("/admin/login");
  const id = String(formData.get("id") ?? "");
  const supabase = await createClient();
  const { data: post } = await supabase.from("posts").select("slug, cover_url").eq("id", id).maybeSingle();
  if (post) {
    await supabase.from("posts").delete().eq("id", id);
    // tidy up the cover image if it was uploaded here
    if (isOwnImage(post.cover_url)) {
      const prefix = `${supabaseUrl}/storage/v1/object/public/${BLOG_BUCKET}/`;
      await createAdminClient()?.storage.from(BLOG_BUCKET).remove([post.cover_url!.slice(prefix.length)]);
    }
    revalidateBlog(post.slug);
  }
  redirect("/admin/posts?deleted=1");
}

const IMAGE_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
};

/**
 * Gives the browser a one-time URL to upload a blog image straight to
 * Supabase Storage (no size limits from our server, no storage keys exposed).
 */
export async function createImageUpload(
  contentType: string,
  size: number,
): Promise<{ path: string; token: string; publicUrl: string } | { error: string }> {
  const auth = await checkStaff(can.writePosts);
  if ("error" in auth) return { error: auth.error };
  const ext = IMAGE_TYPES[contentType];
  if (!ext) return { error: "Use a JPG, PNG, WebP, GIF or AVIF image." };
  if (size > 8 * 1024 * 1024) return { error: "That image is over 8 MB — please use a smaller one." };
  const admin = createAdminClient();
  if (!admin) return { error: "Storage isn't connected." };

  const now = new Date();
  const path = `posts/${now.getUTCFullYear()}/${String(now.getUTCMonth() + 1).padStart(2, "0")}/${randomUUID()}.${ext}`;
  const { data, error } = await admin.storage.from(BLOG_BUCKET).createSignedUploadUrl(path);
  if (error || !data) {
    return { error: /not found/i.test(error?.message ?? "") ? "The image bucket is missing — run supabase/schema.sql." : "Couldn't prepare the upload." };
  }
  const publicUrl = admin.storage.from(BLOG_BUCKET).getPublicUrl(path).data.publicUrl;
  return { path, token: data.token, publicUrl };
}
