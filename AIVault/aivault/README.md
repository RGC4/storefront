# AIVault — AI Music & Video Marketplace

The platform for AI-generated music and video. Creators upload, fans stream and buy.

---

## What's in the box

- **Next.js 14** — App Router, Server Components, streaming
- **Supabase** — Postgres + Auth + Storage + Real-time
- **Stripe Connect** — Creator payouts, subscriptions, one-time purchases
- **Wavesurfer.js** — Waveform visualizer + audio streaming
- **Zustand** — Global player state
- **Zod + React Hook Form** — Type-safe forms with validation
- **Tailwind CSS** — Dark/light mode, responsive

---

## Project structure

```
src/
  app/
    login/           → Auth pages
    register/
    feed/            → Main platform (sidebar + player layout)
    upload/          → Creator upload flow
    explore/         → Browse + search
    track/[id]/      → Track detail page
    [username]/      → Creator profile page
    api/
      tracks/        → Upload, list, stream signed URLs
      subscriptions/ → Stripe subscription management
      purchases/     → One-time purchases
      webhooks/stripe → Stripe event handling
  components/
    player/          → GlobalPlayer (Wavesurfer)
    creator/         → TrackCard, CreatorCard
    layout/          → SidebarNav
    ui/              → Shared primitives (Button, Input, etc.)
  lib/
    supabase/        → Browser + server clients, admin client
    stripe/          → Payment intents, Connect, fee calculation
    audio/           → Signed URLs, validation, formatting
    utils/           → cn(), formatNumber(), constants
  hooks/
    usePlayerStore   → Zustand global player
  types/
    index.ts         → All TypeScript types matching DB schema
supabase/
  migrations/
    001_initial_schema.sql  → Complete DB schema with RLS
```

---

## Setup

### 1. Clone and install

```bash
git clone <your-repo>
cd aivault
npm install
cp .env.local.example .env.local
```

### 2. Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Copy your project URL and anon key into `.env.local`
3. Copy your service role key into `.env.local`
4. Run the migration:
   ```bash
   # Option A: Paste the SQL into Supabase Dashboard → SQL Editor
   # Option B: Use the CLI
   npx supabase link --project-ref <your-project-ref>
   npx supabase db push
   ```
5. Create storage buckets in Dashboard → Storage:
   - `tracks` — private (audio/video files)
   - `covers` — public (cover art)
   - `avatars` — public (profile photos)

6. Enable Google OAuth in Dashboard → Auth → Providers (optional but recommended)

### 3. Stripe

1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Enable Stripe Connect in Dashboard → Connect → Settings
3. Copy publishable and secret keys into `.env.local`
4. Set up the webhook endpoint:
   ```bash
   # Dev: use Stripe CLI to forward events
   npm run stripe:listen
   ```
   Copy the webhook signing secret into `.env.local` as `STRIPE_WEBHOOK_SECRET`

5. For production: add `https://yourdomain.com/api/webhooks/stripe` in Stripe Dashboard → Webhooks

### 4. Run locally

```bash
npm run dev
```

---

## Launch checklist

### Before you deploy

**Supabase**
- [ ] All migrations applied
- [ ] Storage buckets created (`tracks`, `covers`, `avatars`)
- [ ] Storage policies set (see migration file comments)
- [ ] Auth email templates customized (Dashboard → Auth → Email Templates)
- [ ] Rate limits configured (Dashboard → Auth → Rate Limits)
- [ ] Point-in-time recovery enabled (if on Pro plan)

**Stripe**
- [ ] Connect platform profile completed
- [ ] Webhook endpoint registered for production URL
- [ ] Test payments working end-to-end
- [ ] Stripe tax settings configured if needed
- [ ] Payout schedule set (Dashboard → Connect → Settings)

**Security**
- [ ] `SUPABASE_SERVICE_ROLE_KEY` never exposed to the browser (it's server-only)
- [ ] All API routes validate `auth.getUser()` before mutating data
- [ ] Stripe webhook validates signature before processing
- [ ] File upload validates MIME type and size server-side
- [ ] RLS enabled on all tables (already in migration)

**Performance**
- [ ] Cloudflare in front of your domain (free tier works)
- [ ] `next/image` used for all cover art and avatars
- [ ] Track pages use `generateStaticParams` for popular tracks
- [ ] Supabase connection pooling enabled (Dashboard → Settings → Database)

**Before going live**
- [ ] Privacy policy and terms of service pages created
- [ ] DMCA takedown contact email set up
- [ ] Creator payout terms documented (your 10% platform fee)
- [ ] Error monitoring set up (Sentry free tier)
- [ ] Analytics connected (Vercel Analytics or Plausible)

---

## Deploying to Vercel

```bash
npm i -g vercel
vercel
```

Add all env vars in Vercel Dashboard → Project → Settings → Environment Variables.

---

## What to build next (Phase 2)

1. **`/track/[id]`** — Full track detail page with purchase/subscribe CTAs
2. **`/[username]`** — Creator profile with track grid and subscription tiers
3. **`/explore`** — Browse with filters (genre, AI tool, BPM, mood)
4. **`/api/subscriptions`** — Create/cancel Stripe subscriptions
5. **`/api/purchases`** — Purchase flow with Stripe Payment Intent
6. **`/settings/payouts`** — Stripe Connect onboarding for creators
7. **HLS transcoding** — FFmpeg + BullMQ worker for multi-bitrate streaming
8. **Notifications** — Real-time via Supabase Realtime
9. **Prompt packs** — Upload, purchase, and deliver prompt pack content

---

## Architecture decisions

**Why signed URLs for audio?**
Raw Supabase storage URLs are publicly guessable. Signed URLs with 4-hour expiry mean paid content can't be pirated by sharing the URL. They expire before sharing becomes useful.

**Why Stripe Connect Express?**
Express accounts handle KYC/identity verification for creators automatically. You don't have to build a compliance layer — Stripe handles it.

**Why Zustand for player state?**
The player persists across route changes. React Context would cause full-tree re-renders on every time update (60fps from Wavesurfer). Zustand's selective subscriptions mean only the components that care about `currentTime` re-render.

**Why Supabase Storage over S3 directly?**
Supabase Storage is S3-compatible under the hood but integrates with your RLS policies and gives you signed URL generation in the same SDK. You can migrate to direct S3 later with no code changes.
