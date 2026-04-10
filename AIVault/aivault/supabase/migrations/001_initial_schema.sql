-- ============================================================
-- AIVault — Full Database Schema
-- Run this in your Supabase SQL editor or via `supabase db push`
-- ============================================================

-- Enable required extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pg_trgm"; -- for fast text search

-- ─── ENUMS ────────────────────────────────────────────────────────────────────

create type ai_tool as enum (
  'suno', 'udio', 'runway', 'pika', 'kling', 'stable_audio',
  'musicgen', 'beatoven', 'aiva', 'soundraw', 'other'
);

create type content_type as enum ('audio', 'video', 'audio_video');

create type track_status as enum ('processing', 'ready', 'failed', 'draft');

create type subscription_status as enum ('active', 'cancelled', 'past_due', 'trialing');

create type purchase_type as enum ('track', 'prompt_pack');

-- ─── PROFILES ─────────────────────────────────────────────────────────────────
-- Extends Supabase auth.users

create table profiles (
  id              uuid primary key references auth.users(id) on delete cascade,
  username        text unique not null,
  display_name    text not null,
  bio             text,
  avatar_url      text,
  banner_url      text,
  website_url     text,
  -- Stripe Connect for creator payouts
  stripe_account_id       text unique,
  stripe_account_enabled  boolean default false,
  -- Aggregated stats (updated via triggers)
  follower_count  integer default 0,
  following_count integer default 0,
  track_count     integer default 0,
  total_plays     bigint default 0,
  -- Timestamps
  created_at      timestamptz default now(),
  updated_at      timestamptz default now(),
  constraint username_length check (char_length(username) between 3 and 30),
  constraint username_format check (username ~ '^[a-zA-Z0-9_]+$')
);

-- ─── TRACKS ───────────────────────────────────────────────────────────────────

create table tracks (
  id              uuid primary key default uuid_generate_v4(),
  creator_id      uuid not null references profiles(id) on delete cascade,
  title           text not null,
  description     text,
  -- File storage
  audio_path      text,           -- Supabase storage path
  video_path      text,           -- optional video
  cover_art_path  text,
  -- HLS streaming (set after transcoding)
  hls_playlist_url text,
  duration_seconds integer,
  file_size_bytes  bigint,
  -- AI metadata (the unique differentiator)
  content_type    content_type not null default 'audio',
  ai_tools        ai_tool[] not null default '{}',
  prompt_preview  text,           -- short teaser of the prompt
  model_versions  jsonb default '{}', -- e.g. {"suno": "v3.5", "runway": "gen3"}
  -- Monetization
  is_free         boolean default true,
  price_cents     integer,        -- null if free or subscription-only
  is_subscription_exclusive boolean default false,
  -- Discovery
  genre           text,
  mood            text[],
  tags            text[],
  bpm             integer,
  -- Status
  status          track_status default 'processing',
  is_published    boolean default false,
  -- Aggregated stats
  play_count      bigint default 0,
  like_count      integer default 0,
  purchase_count  integer default 0,
  -- Timestamps
  created_at      timestamptz default now(),
  updated_at      timestamptz default now(),
  published_at    timestamptz
);

-- Full text search index on tracks
create index tracks_search_idx on tracks
  using gin(to_tsvector('english', coalesce(title,'') || ' ' || coalesce(description,'') || ' ' || coalesce(genre,'')));
create index tracks_creator_idx on tracks(creator_id);
create index tracks_status_idx on tracks(status, is_published);
create index tracks_ai_tools_idx on tracks using gin(ai_tools);

-- ─── PROMPT PACKS ─────────────────────────────────────────────────────────────

create table prompt_packs (
  id              uuid primary key default uuid_generate_v4(),
  creator_id      uuid not null references profiles(id) on delete cascade,
  title           text not null,
  description     text,
  cover_art_path  text,
  price_cents     integer not null,
  -- The actual content (delivered after purchase)
  prompts         jsonb not null default '[]',
  -- e.g. [{"tool": "suno", "prompt": "...", "settings": {...}, "example_track_id": "..."}]
  ai_tools        ai_tool[] not null default '{}',
  purchase_count  integer default 0,
  is_published    boolean default false,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

-- ─── FOLLOWS ──────────────────────────────────────────────────────────────────

create table follows (
  follower_id     uuid not null references profiles(id) on delete cascade,
  following_id    uuid not null references profiles(id) on delete cascade,
  created_at      timestamptz default now(),
  primary key (follower_id, following_id),
  constraint no_self_follow check (follower_id != following_id)
);

-- ─── LIKES ────────────────────────────────────────────────────────────────────

create table likes (
  user_id         uuid not null references profiles(id) on delete cascade,
  track_id        uuid not null references tracks(id) on delete cascade,
  created_at      timestamptz default now(),
  primary key (user_id, track_id)
);

-- ─── PLAYS ────────────────────────────────────────────────────────────────────

create table plays (
  id              uuid primary key default uuid_generate_v4(),
  track_id        uuid not null references tracks(id) on delete cascade,
  user_id         uuid references profiles(id) on delete set null,
  -- Dedup: one counted play per user per track per hour
  played_at       timestamptz default now(),
  duration_played integer -- seconds actually listened
);

create index plays_track_idx on plays(track_id, played_at desc);

-- ─── SUBSCRIPTIONS ────────────────────────────────────────────────────────────

create table creator_subscriptions (
  id                    uuid primary key default uuid_generate_v4(),
  subscriber_id         uuid not null references profiles(id) on delete cascade,
  creator_id            uuid not null references profiles(id) on delete cascade,
  -- Stripe
  stripe_subscription_id text unique,
  stripe_price_id       text,
  status                subscription_status default 'active',
  price_cents           integer not null,
  current_period_start  timestamptz,
  current_period_end    timestamptz,
  cancelled_at          timestamptz,
  created_at            timestamptz default now(),
  unique (subscriber_id, creator_id)
);

-- ─── CREATOR SUBSCRIPTION TIERS ───────────────────────────────────────────────

create table subscription_tiers (
  id              uuid primary key default uuid_generate_v4(),
  creator_id      uuid not null references profiles(id) on delete cascade,
  name            text not null,         -- e.g. "Supporter", "Super Fan"
  price_cents     integer not null,
  stripe_price_id text unique,
  perks           text[],               -- e.g. ["Early access", "Exclusive tracks"]
  is_active       boolean default true,
  created_at      timestamptz default now()
);

-- ─── PURCHASES ────────────────────────────────────────────────────────────────

create table purchases (
  id                  uuid primary key default uuid_generate_v4(),
  buyer_id            uuid not null references profiles(id) on delete cascade,
  purchase_type       purchase_type not null,
  track_id            uuid references tracks(id) on delete set null,
  prompt_pack_id      uuid references prompt_packs(id) on delete set null,
  -- Financials
  amount_cents        integer not null,
  platform_fee_cents  integer not null,
  creator_payout_cents integer not null,
  -- Stripe
  stripe_payment_intent_id text unique,
  stripe_charge_id    text,
  -- Status
  status              text default 'pending', -- pending | completed | refunded
  created_at          timestamptz default now()
);

-- ─── TIPS ─────────────────────────────────────────────────────────────────────

create table tips (
  id                  uuid primary key default uuid_generate_v4(),
  tipper_id           uuid not null references profiles(id) on delete cascade,
  creator_id          uuid not null references profiles(id) on delete cascade,
  track_id            uuid references tracks(id) on delete set null,
  amount_cents        integer not null,
  message             text,
  stripe_payment_intent_id text unique,
  created_at          timestamptz default now()
);

-- ─── COMMENTS ─────────────────────────────────────────────────────────────────

create table comments (
  id          uuid primary key default uuid_generate_v4(),
  track_id    uuid not null references tracks(id) on delete cascade,
  user_id     uuid not null references profiles(id) on delete cascade,
  body        text not null,
  parent_id   uuid references comments(id) on delete cascade,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- ─── NOTIFICATIONS ────────────────────────────────────────────────────────────

create table notifications (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references profiles(id) on delete cascade,
  type        text not null, -- 'new_follower' | 'new_like' | 'new_subscriber' | 'new_tip' | 'track_ready'
  actor_id    uuid references profiles(id) on delete set null,
  track_id    uuid references tracks(id) on delete set null,
  data        jsonb default '{}',
  is_read     boolean default false,
  created_at  timestamptz default now()
);

create index notifications_user_idx on notifications(user_id, is_read, created_at desc);

-- ─── TRIGGERS ─────────────────────────────────────────────────────────────────

-- Auto-update updated_at
create or replace function update_updated_at()
returns trigger as $$
begin new.updated_at = now(); return new; end;
$$ language plpgsql;

create trigger trg_profiles_updated_at before update on profiles
  for each row execute function update_updated_at();
create trigger trg_tracks_updated_at before update on tracks
  for each row execute function update_updated_at();
create trigger trg_prompt_packs_updated_at before update on prompt_packs
  for each row execute function update_updated_at();

-- Update follower/following counts
create or replace function handle_follow_counts()
returns trigger as $$
begin
  if TG_OP = 'INSERT' then
    update profiles set follower_count  = follower_count  + 1 where id = NEW.following_id;
    update profiles set following_count = following_count + 1 where id = NEW.follower_id;
  elsif TG_OP = 'DELETE' then
    update profiles set follower_count  = greatest(0, follower_count  - 1) where id = OLD.following_id;
    update profiles set following_count = greatest(0, following_count - 1) where id = OLD.follower_id;
  end if;
  return null;
end;
$$ language plpgsql;

create trigger trg_follows after insert or delete on follows
  for each row execute function handle_follow_counts();

-- Update like counts
create or replace function handle_like_counts()
returns trigger as $$
begin
  if TG_OP = 'INSERT' then
    update tracks set like_count = like_count + 1 where id = NEW.track_id;
  elsif TG_OP = 'DELETE' then
    update tracks set like_count = greatest(0, like_count - 1) where id = OLD.track_id;
  end if;
  return null;
end;
$$ language plpgsql;

create trigger trg_likes after insert or delete on likes
  for each row execute function handle_like_counts();

-- Update track count on profiles
create or replace function handle_track_counts()
returns trigger as $$
begin
  if TG_OP = 'INSERT' and NEW.is_published = true then
    update profiles set track_count = track_count + 1 where id = NEW.creator_id;
  elsif TG_OP = 'DELETE' and OLD.is_published = true then
    update profiles set track_count = greatest(0, track_count - 1) where id = OLD.creator_id;
  elsif TG_OP = 'UPDATE' then
    if NEW.is_published = true and OLD.is_published = false then
      update profiles set track_count = track_count + 1 where id = NEW.creator_id;
    elsif NEW.is_published = false and OLD.is_published = true then
      update profiles set track_count = greatest(0, track_count - 1) where id = OLD.creator_id;
    end if;
  end if;
  return null;
end;
$$ language plpgsql;

create trigger trg_track_counts after insert or update or delete on tracks
  for each row execute function handle_track_counts();

-- Auto-create profile on signup
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id, username, display_name)
  values (
    NEW.id,
    coalesce(NEW.raw_user_meta_data->>'username', 'user_' || substr(NEW.id::text, 1, 8)),
    coalesce(NEW.raw_user_meta_data->>'display_name', 'New Creator')
  );
  return NEW;
end;
$$ language plpgsql security definer;

create trigger trg_new_user after insert on auth.users
  for each row execute function handle_new_user();

-- ─── ROW LEVEL SECURITY ───────────────────────────────────────────────────────

alter table profiles enable row level security;
alter table tracks enable row level security;
alter table prompt_packs enable row level security;
alter table follows enable row level security;
alter table likes enable row level security;
alter table plays enable row level security;
alter table creator_subscriptions enable row level security;
alter table subscription_tiers enable row level security;
alter table purchases enable row level security;
alter table tips enable row level security;
alter table comments enable row level security;
alter table notifications enable row level security;

-- Profiles: public read, owner write
create policy "Profiles are publicly readable" on profiles for select using (true);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);

-- Tracks: published tracks are public, creator can see all their own
create policy "Published tracks are public" on tracks for select
  using (is_published = true and status = 'ready');
create policy "Creators see own tracks" on tracks for select
  using (auth.uid() = creator_id);
create policy "Creators can insert tracks" on tracks for insert
  with check (auth.uid() = creator_id);
create policy "Creators can update own tracks" on tracks for update
  using (auth.uid() = creator_id);
create policy "Creators can delete own tracks" on tracks for delete
  using (auth.uid() = creator_id);

-- Follows: public read, authenticated write
create policy "Follows are public" on follows for select using (true);
create policy "Users can follow" on follows for insert with check (auth.uid() = follower_id);
create policy "Users can unfollow" on follows for delete using (auth.uid() = follower_id);

-- Likes: public read, authenticated write
create policy "Likes are public" on likes for select using (true);
create policy "Users can like" on likes for insert with check (auth.uid() = user_id);
create policy "Users can unlike" on likes for delete using (auth.uid() = user_id);

-- Purchases: users see own purchases
create policy "Users see own purchases" on purchases for select
  using (auth.uid() = buyer_id);

-- Subscriptions: users see own subscriptions, creators see their subscribers
create policy "Users see own subscriptions" on creator_subscriptions for select
  using (auth.uid() = subscriber_id or auth.uid() = creator_id);

-- Notifications: users see own
create policy "Users see own notifications" on notifications for select
  using (auth.uid() = user_id);
create policy "Users update own notifications" on notifications for update
  using (auth.uid() = user_id);

-- Comments: public read, authenticated write
create policy "Comments are public" on comments for select using (true);
create policy "Users can comment" on comments for insert with check (auth.uid() = user_id);
create policy "Users can delete own comments" on comments for delete using (auth.uid() = user_id);

-- ─── STORAGE BUCKETS ──────────────────────────────────────────────────────────
-- Run these separately in Supabase dashboard or via CLI

-- insert into storage.buckets (id, name, public) values ('tracks', 'tracks', false);
-- insert into storage.buckets (id, name, public) values ('covers', 'covers', true);
-- insert into storage.buckets (id, name, public) values ('avatars', 'avatars', true);

-- Storage policies (add after creating buckets):
-- Allow authenticated uploads to tracks bucket
-- Allow public reads on covers and avatars
-- Signed URLs for audio files (handled in API routes)
