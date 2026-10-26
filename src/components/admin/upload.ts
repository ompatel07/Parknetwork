"use client";

import { createImageUpload } from "@/app/admin/(panel)/posts/actions";
import { createClient } from "@/lib/supabase/browser";
import { BLOG_BUCKET } from "@/lib/supabase/env";

/**
 * Shrinks big photos in the browser before uploading (max 2000px, WebP),
 * so a 6 MB phone photo becomes ~300 KB. GIFs are left alone (animation).
 */
async function compress(file: File): Promise<Blob> {
  if (file.type === "image/gif" || typeof createImageBitmap !== "function") return file;
  try {
    const bmp = await createImageBitmap(file);
    const scale = Math.min(1, 2000 / Math.max(bmp.width, bmp.height));
    if (scale === 1 && file.size < 500_000) {
      bmp.close();
      return file;
    }
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bmp.width * scale);
    canvas.height = Math.round(bmp.height * scale);
    canvas.getContext("2d")!.drawImage(bmp, 0, 0, canvas.width, canvas.height);
    bmp.close();
    const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/webp", 0.85));
    return blob && blob.size < file.size ? blob : file;
  } catch {
    return file;
  }
}

/** Uploads one image to the blog bucket and returns its public URL. */
export async function uploadImage(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) throw new Error("Please choose an image file.");
  const blob = await compress(file);
  const type = blob.type || file.type;
  const target = await createImageUpload(type, blob.size);
  if ("error" in target) throw new Error(target.error);
  const { error } = await createClient().storage.from(BLOG_BUCKET).uploadToSignedUrl(target.path, target.token, blob, { contentType: type });
  if (error) throw new Error("Upload failed — please try again.");
  return target.publicUrl;
}
