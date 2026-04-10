import { createAdminClient } from '@/lib/supabase/server'

const AUDIO_BUCKET = 'tracks'
const COVERS_BUCKET = 'covers'
const AVATARS_BUCKET = 'avatars'

// Signed URL expiry: 4 hours. Long enough for a listening session,
// short enough that pirated URLs expire quickly.
const SIGNED_URL_EXPIRY_SECONDS = 4 * 60 * 60

/**
 * Generate a signed URL for private audio/video playback.
 * Never expose raw storage paths to the client.
 */
export async function getSignedAudioUrl(storagePath: string): Promise<string> {
  const supabase = createAdminClient()
  const { data, error } = await supabase.storage
    .from(AUDIO_BUCKET)
    .createSignedUrl(storagePath, SIGNED_URL_EXPIRY_SECONDS)

  if (error || !data) throw new Error(`Failed to sign URL: ${error?.message}`)
  return data.signedUrl
}

/**
 * Get public URL for cover art (stored in public bucket).
 */
export function getCoverUrl(storagePath: string | null): string | null {
  if (!storagePath) return null
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  return `${supabaseUrl}/storage/v1/object/public/${COVERS_BUCKET}/${storagePath}`
}

/**
 * Get public URL for avatar (stored in public bucket).
 */
export function getAvatarUrl(storagePath: string | null): string | null {
  if (!storagePath) return null
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  return `${supabaseUrl}/storage/v1/object/public/${AVATARS_BUCKET}/${storagePath}`
}

/**
 * Generate a unique storage path for a track upload.
 * Format: {creatorId}/{trackId}/{filename}
 */
export function buildTrackStoragePath(
  creatorId: string,
  trackId: string,
  filename: string,
  type: 'audio' | 'video'
): string {
  const ext = filename.split('.').pop()
  return `${creatorId}/${trackId}/${type}.${ext}`
}

/**
 * Validate audio file before upload.
 */
export function validateAudioFile(file: File): { valid: boolean; error?: string } {
  const ALLOWED_AUDIO = ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/flac', 'audio/aac']
  const MAX_SIZE_MB = 200

  if (!ALLOWED_AUDIO.includes(file.type)) {
    return { valid: false, error: 'Unsupported audio format. Use MP3, WAV, OGG, FLAC, or AAC.' }
  }

  if (file.size > MAX_SIZE_MB * 1024 * 1024) {
    return { valid: false, error: `File too large. Maximum size is ${MAX_SIZE_MB}MB.` }
  }

  return { valid: true }
}

/**
 * Validate video file before upload.
 */
export function validateVideoFile(file: File): { valid: boolean; error?: string } {
  const ALLOWED_VIDEO = ['video/mp4', 'video/webm', 'video/quicktime']
  const MAX_SIZE_MB = 1000

  if (!ALLOWED_VIDEO.includes(file.type)) {
    return { valid: false, error: 'Unsupported video format. Use MP4, WebM, or MOV.' }
  }

  if (file.size > MAX_SIZE_MB * 1024 * 1024) {
    return { valid: false, error: `File too large. Maximum size is ${MAX_SIZE_MB}MB.` }
  }

  return { valid: true }
}

/**
 * Format duration from seconds to MM:SS or HH:MM:SS.
 */
export function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = Math.floor(seconds % 60)
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  return `${m}:${String(s).padStart(2, '0')}`
}

/**
 * Format price from cents to display string.
 */
export function formatPrice(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(cents / 100)
}
