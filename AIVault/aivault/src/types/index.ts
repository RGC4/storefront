// ─── Database Types ────────────────────────────────────────────────────────────

export type AiTool =
  | 'suno' | 'udio' | 'runway' | 'pika' | 'kling'
  | 'stable_audio' | 'musicgen' | 'beatoven' | 'aiva' | 'soundraw' | 'other'

export type ContentType = 'audio' | 'video' | 'audio_video'
export type TrackStatus = 'processing' | 'ready' | 'failed' | 'draft'
export type SubscriptionStatus = 'active' | 'cancelled' | 'past_due' | 'trialing'
export type PurchaseType = 'track' | 'prompt_pack'

export interface Profile {
  id: string
  username: string
  display_name: string
  bio: string | null
  avatar_url: string | null
  banner_url: string | null
  website_url: string | null
  stripe_account_id: string | null
  stripe_account_enabled: boolean
  follower_count: number
  following_count: number
  track_count: number
  total_plays: number
  created_at: string
  updated_at: string
}

export interface Track {
  id: string
  creator_id: string
  title: string
  description: string | null
  audio_path: string | null
  video_path: string | null
  cover_art_path: string | null
  hls_playlist_url: string | null
  duration_seconds: number | null
  file_size_bytes: number | null
  content_type: ContentType
  ai_tools: AiTool[]
  prompt_preview: string | null
  model_versions: Record<string, string>
  is_free: boolean
  price_cents: number | null
  is_subscription_exclusive: boolean
  genre: string | null
  mood: string[]
  tags: string[]
  bpm: number | null
  status: TrackStatus
  is_published: boolean
  play_count: number
  like_count: number
  purchase_count: number
  created_at: string
  updated_at: string
  published_at: string | null
  // Joined
  creator?: Profile
  is_liked?: boolean
  is_purchased?: boolean
}

export interface PromptPack {
  id: string
  creator_id: string
  title: string
  description: string | null
  cover_art_path: string | null
  price_cents: number
  prompts: PromptPackItem[]
  ai_tools: AiTool[]
  purchase_count: number
  is_published: boolean
  created_at: string
  updated_at: string
  creator?: Profile
}

export interface PromptPackItem {
  tool: AiTool
  prompt: string
  settings: Record<string, unknown>
  example_track_id?: string
}

export interface CreatorSubscription {
  id: string
  subscriber_id: string
  creator_id: string
  stripe_subscription_id: string | null
  stripe_price_id: string | null
  status: SubscriptionStatus
  price_cents: number
  current_period_start: string | null
  current_period_end: string | null
  cancelled_at: string | null
  created_at: string
}

export interface SubscriptionTier {
  id: string
  creator_id: string
  name: string
  price_cents: number
  stripe_price_id: string | null
  perks: string[]
  is_active: boolean
  created_at: string
}

export interface Purchase {
  id: string
  buyer_id: string
  purchase_type: PurchaseType
  track_id: string | null
  prompt_pack_id: string | null
  amount_cents: number
  platform_fee_cents: number
  creator_payout_cents: number
  stripe_payment_intent_id: string | null
  status: string
  created_at: string
}

export interface Notification {
  id: string
  user_id: string
  type: 'new_follower' | 'new_like' | 'new_subscriber' | 'new_tip' | 'track_ready'
  actor_id: string | null
  track_id: string | null
  data: Record<string, unknown>
  is_read: boolean
  created_at: string
  actor?: Profile
  track?: Track
}

// ─── API Response Types ────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T | null
  error: string | null
}

export interface PaginatedResponse<T> {
  data: T[]
  count: number
  page: number
  pageSize: number
  hasMore: boolean
}

// ─── Form Types ────────────────────────────────────────────────────────────────

export interface UploadTrackForm {
  title: string
  description?: string
  genre?: string
  mood?: string[]
  tags?: string[]
  bpm?: number
  ai_tools: AiTool[]
  model_versions?: Record<string, string>
  prompt_preview?: string
  content_type: ContentType
  is_free: boolean
  price_cents?: number
  is_subscription_exclusive: boolean
}

export interface CreatorProfileForm {
  display_name: string
  username: string
  bio?: string
  website_url?: string
}
