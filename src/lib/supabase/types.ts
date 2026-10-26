/** Database types — mirror supabase/schema.sql. Update both together. */

export type Role = "admin" | "manager" | "editor";
export type AccountStatus = "active" | "disabled";
export type PostStatus = "draft" | "published";
export type SubmissionStatus = "new" | "in_progress" | "replied" | "closed";
export type ReplyChannel = "email" | "whatsapp" | "note";

export type Profile = {
  id: string;
  email: string;
  full_name: string;
  role: Role;
  status: AccountStatus;
  created_at: string;
  updated_at: string;
};

export type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  cover_url: string | null;
  cover_alt: string;
  tags: string[];
  status: PostStatus;
  published_at: string | null;
  author_id: string | null;
  /** Shown publicly on the post (visitors can't read team profiles) */
  author_name: string;
  created_at: string;
  updated_at: string;
};

export type Submission = {
  id: string;
  reference: string;
  form: string;
  name: string;
  email: string | null;
  phone: string | null;
  data: Record<string, unknown>;
  status: SubmissionStatus;
  emailed: boolean;
  ip: string | null;
  created_at: string;
  updated_at: string;
};

export type Reply = {
  id: string;
  submission_id: string;
  author_id: string | null;
  channel: ReplyChannel;
  body: string;
  delivered: boolean;
  created_at: string;
};

type Table<Row, Required extends keyof Row, Rel = []> = {
  Row: Row;
  Insert: Pick<Row, Required> & Partial<Omit<Row, Required>>;
  Update: Partial<Row>;
  Relationships: Rel;
};

export type Database = {
  public: {
    Tables: {
      profiles: Table<Profile, "id">;
      posts: Table<
        Post,
        "slug" | "title",
        [{ foreignKeyName: "posts_author_id_fkey"; columns: ["author_id"]; isOneToOne: false; referencedRelation: "profiles"; referencedColumns: ["id"] }]
      >;
      submissions: Table<Submission, "reference" | "form">;
      submission_replies: Table<
        Reply,
        "submission_id" | "body",
        [
          { foreignKeyName: "submission_replies_submission_id_fkey"; columns: ["submission_id"]; isOneToOne: false; referencedRelation: "submissions"; referencedColumns: ["id"] },
          { foreignKeyName: "submission_replies_author_id_fkey"; columns: ["author_id"]; isOneToOne: false; referencedRelation: "profiles"; referencedColumns: ["id"] },
        ]
      >;
    };
    Views: { [_ in never]: never };
    Functions: {
      is_staff: { Args: Record<string, never>; Returns: boolean };
      staff_role: { Args: Record<string, never>; Returns: string | null };
      has_role: { Args: { roles: string[] }; Returns: boolean };
    };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};
