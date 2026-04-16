import type { AiTool } from '@/types'

export const AI_TOOL_LABELS: Record<AiTool, string> = {
  suno: 'Suno',
  udio: 'Udio',
  runway: 'Runway',
  pika: 'Pika',
  kling: 'Kling',
  stable_audio: 'Stable Audio',
  musicgen: 'MusicGen',
  beatoven: 'Beatoven',
  aiva: 'AIVA',
  soundraw: 'Soundraw',
  other: 'Other',
}

export const AI_TOOLS: AiTool[] = [
  'suno', 'udio', 'runway', 'pika', 'kling',
  'stable_audio', 'musicgen', 'beatoven', 'aiva', 'soundraw', 'other',
]

export const GENRES = [
  'Electronic', 'Hip Hop', 'Lo-Fi', 'Ambient', 'Pop', 'Rock',
  'Jazz', 'Classical', 'R&B', 'Cinematic', 'Folk', 'Metal',
  'Funk', 'Reggae', 'Country', 'World', 'Experimental', 'Other',
]

export const MOODS = [
  'Energetic', 'Chill', 'Melancholy', 'Happy', 'Dark', 'Uplifting',
  'Aggressive', 'Romantic', 'Mysterious', 'Epic', 'Relaxing', 'Tense',
]

export const SUBSCRIPTION_PERKS_SUGGESTIONS = [
  'Access to all exclusive tracks',
  'Early access to new releases',
  'Behind-the-scenes content',
  'Prompt packs included',
  'Discord community access',
  'Monthly Q&A sessions',
  'Stems and project files',
  'Custom requests',
]

export const MAX_UPLOAD_SIZE_AUDIO_MB = 200
export const MAX_UPLOAD_SIZE_VIDEO_MB = 1000
export const PLATFORM_FEE_PERCENT = 10
export const MIN_TRACK_PRICE_CENTS = 100    // $1.00
export const MAX_TRACK_PRICE_CENTS = 100000 // $1000.00
export const MIN_SUB_PRICE_CENTS = 300      // $3.00
export const MAX_SUB_PRICE_CENTS = 10000    // $100.00
