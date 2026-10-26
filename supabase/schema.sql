-- ════════════════════════════════════════════════════════════════════
-- Park Live Network — database setup
--
-- Run once: Supabase dashboard → SQL Editor → New query → paste this
-- whole file → Run. It is safe to run again (it only adds what's missing).
--
-- Tables
--   profiles            one row per admin-panel user (role + status)
--   posts               blog posts
--   submissions         every website form submission
--   submission_replies  replies / notes the team adds to a submission
--
-- Roles
--   admin    everything, including managing users
--   manager  blog posts + form submissions and replies
--   editor   blog posts only
--
-- Security: Row Level Security is on for every table. Visitors can only
-- read published posts. Form submissions are written by the website's
-- server (secret key) and can only be read by managers and admins.
-- ════════════════════════════════════════════════════════════════════

-- ─── Helpers ────────────────────────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ─── Profiles ───────────────────────────────────────────────────────
create table if not exists public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  email       text not null default '',
  full_name   text not null default '',
  role        text not null default 'editor' check (role in ('admin', 'manager', 'editor')),
  status      text not null default 'disabled' check (status in ('active', 'disabled')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();

-- Role of the signed-in user, or null when signed out / disabled.
create or replace function public.staff_role()
returns text
language sql
stable
security definer
set search_path = ''
as $$
  select p.role from public.profiles p where p.id = auth.uid() and p.status = 'active';
$$;

create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select public.staff_role() is not null;
$$;

create or replace function public.has_role(roles text[])
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(public.staff_role() = any (roles), false);
$$;

-- Every new auth user gets a profile. Accounts start DISABLED, so someone
-- who signs up on their own gets no access until an admin enables them.
-- (Accounts created from the admin panel are activated straight away.)
-- The very first account becomes the active admin.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  first_admin boolean := not exists (select 1 from public.profiles where role = 'admin');
begin
  insert into public.profiles (id, email, full_name, role, status)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    case when first_admin then 'admin' else 'editor' end,
    case when first_admin then 'active' else 'disabled' end
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- Keep the profile's email in sync when an account's email changes.
create or replace function public.handle_user_email_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.profiles set email = coalesce(new.email, '') where id = new.id;
  return new;
end;
$$;

drop trigger if exists on_auth_user_email_changed on auth.users;
create trigger on_auth_user_email_changed after update of email on auth.users
  for each row when (old.email is distinct from new.email)
  execute function public.handle_user_email_change();

-- Accounts that existed before this script ran get a profile too; the
-- oldest one becomes the active admin if there is no admin yet.
insert into public.profiles (id, email, full_name)
select u.id, coalesce(u.email, ''), coalesce(u.raw_user_meta_data ->> 'full_name', '')
from auth.users u
on conflict (id) do nothing;

update public.profiles
set role = 'admin', status = 'active'
where id = (
  select p.id from public.profiles p join auth.users u on u.id = p.id
  order by u.created_at asc limit 1
)
and not exists (select 1 from public.profiles where role = 'admin');

alter table public.profiles enable row level security;

drop policy if exists "profiles: read own or staff" on public.profiles;
create policy "profiles: read own or staff" on public.profiles
  for select to authenticated
  using (id = (select auth.uid()) or (select public.is_staff()));
-- No insert/update/delete policies: profiles are changed by the website's
-- server only (after it has checked the user is an admin).

-- ─── Blog posts ─────────────────────────────────────────────────────
create table if not exists public.posts (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and char_length(slug) <= 120),
  title         text not null check (char_length(title) between 1 and 200),
  excerpt       text not null default '' check (char_length(excerpt) <= 400),
  content       text not null default '',
  cover_url     text,
  cover_alt     text not null default '',
  tags          text[] not null default '{}',
  status        text not null default 'draft' check (status in ('draft', 'published')),
  published_at  timestamptz,
  author_id     uuid references public.profiles (id) on delete set null,
  author_name   text not null default '',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
-- for databases created before author_name existed
alter table public.posts add column if not exists author_name text not null default '';

create index if not exists posts_published_idx on public.posts (status, published_at desc);

drop trigger if exists posts_updated_at on public.posts;
create trigger posts_updated_at before update on public.posts
  for each row execute function public.set_updated_at();

alter table public.posts enable row level security;

drop policy if exists "posts: public reads published, staff reads all" on public.posts;
create policy "posts: public reads published, staff reads all" on public.posts
  for select to anon, authenticated
  using ((status = 'published' and published_at <= now()) or (select public.is_staff()));

drop policy if exists "posts: staff create" on public.posts;
create policy "posts: staff create" on public.posts
  for insert to authenticated
  with check ((select public.is_staff()));

drop policy if exists "posts: staff edit" on public.posts;
create policy "posts: staff edit" on public.posts
  for update to authenticated
  using ((select public.is_staff()))
  with check ((select public.is_staff()));

drop policy if exists "posts: staff delete" on public.posts;
create policy "posts: staff delete" on public.posts
  for delete to authenticated
  using ((select public.is_staff()));

-- ─── Form submissions ───────────────────────────────────────────────
create table if not exists public.submissions (
  id          uuid primary key default gen_random_uuid(),
  reference   text not null unique,
  form        text not null,
  name        text not null default '',
  email       text,
  phone       text,
  data        jsonb not null default '{}'::jsonb,
  status      text not null default 'new' check (status in ('new', 'in_progress', 'replied', 'closed')),
  emailed     boolean not null default false,
  ip          text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists submissions_status_idx on public.submissions (status, created_at desc);
create index if not exists submissions_form_idx on public.submissions (form, created_at desc);

drop trigger if exists submissions_updated_at on public.submissions;
create trigger submissions_updated_at before update on public.submissions
  for each row execute function public.set_updated_at();

alter table public.submissions enable row level security;

drop policy if exists "submissions: managers read" on public.submissions;
create policy "submissions: managers read" on public.submissions
  for select to authenticated
  using ((select public.has_role(array['admin', 'manager'])));

drop policy if exists "submissions: managers update" on public.submissions;
create policy "submissions: managers update" on public.submissions
  for update to authenticated
  using ((select public.has_role(array['admin', 'manager'])))
  with check ((select public.has_role(array['admin', 'manager'])));

drop policy if exists "submissions: admins delete" on public.submissions;
create policy "submissions: admins delete" on public.submissions
  for delete to authenticated
  using ((select public.has_role(array['admin'])));
-- No insert policy: the website's server inserts with the secret key.

-- ─── Replies and notes on submissions ───────────────────────────────
create table if not exists public.submission_replies (
  id             uuid primary key default gen_random_uuid(),
  submission_id  uuid not null references public.submissions (id) on delete cascade,
  author_id      uuid references public.profiles (id) on delete set null,
  channel        text not null default 'note' check (channel in ('email', 'whatsapp', 'note')),
  body           text not null check (char_length(body) between 1 and 10000),
  delivered      boolean not null default false,
  created_at     timestamptz not null default now()
);

create index if not exists submission_replies_submission_idx on public.submission_replies (submission_id, created_at);

alter table public.submission_replies enable row level security;

drop policy if exists "replies: managers read" on public.submission_replies;
create policy "replies: managers read" on public.submission_replies
  for select to authenticated
  using ((select public.has_role(array['admin', 'manager'])));

drop policy if exists "replies: managers write" on public.submission_replies;
create policy "replies: managers write" on public.submission_replies
  for insert to authenticated
  with check ((select public.has_role(array['admin', 'manager'])) and author_id = (select auth.uid()));

drop policy if exists "replies: admins delete" on public.submission_replies;
create policy "replies: admins delete" on public.submission_replies
  for delete to authenticated
  using ((select public.has_role(array['admin'])));

-- ─── Privileges (RLS above decides which rows) ──────────────────────
grant usage on schema public to anon, authenticated, service_role;

revoke all on public.profiles, public.posts, public.submissions, public.submission_replies from anon;
grant select on public.posts to anon;

grant select on public.profiles to authenticated;
grant select, insert, update, delete on public.posts to authenticated;
grant select, update, delete on public.submissions to authenticated;
grant select, insert, delete on public.submission_replies to authenticated;

grant all on public.profiles, public.posts, public.submissions, public.submission_replies to service_role;

revoke all on function public.handle_new_user(), public.handle_user_email_change() from public, anon, authenticated;
grant execute on function public.staff_role(), public.is_staff(), public.has_role(text[]) to anon, authenticated, service_role;

-- ─── Storage: public bucket for blog images ─────────────────────────
-- Images are uploaded through the website's server (signed upload URLs),
-- so no extra storage policies are needed. Anyone can view them.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('blog', 'blog', true, 8388608, array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'])
on conflict (id) do update
  set public = true,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- Tell the API about the new tables straight away.
notify pgrst, 'reload schema';
