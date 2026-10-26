import type { Metadata } from "next";
import { can, requireStaff } from "@/lib/admin/auth";
import { PostEditor } from "@/components/admin/PostEditor";

export const metadata: Metadata = { title: "New post" };

export default async function NewPostPage() {
  const staff = await requireStaff(can.writePosts);
  return <PostEditor post={null} defaultAuthor={staff.fullName} />;
}
