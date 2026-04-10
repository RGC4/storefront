import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/server'
import { validateAudioFile, validateVideoFile, buildTrackStoragePath } from '@/lib/audio'
import { z } from 'zod'

const CreateTrackSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
  genre: z.string().max(50).optional(),
  mood: z.array(z.string()).max(5).optional(),
  tags: z.array(z.string()).max(10).optional(),
  bpm: z.number().min(40).max(300).optional(),
  ai_tools: z.array(z.enum(['suno','udio','runway','pika','kling','stable_audio','musicgen','beatoven','aiva','soundraw','other'])).min(1),
  model_versions: z.record(z.string()).optional(),
  prompt_preview: z.string().max(500).optional(),
  content_type: z.enum(['audio', 'video', 'audio_video']),
  is_free: z.boolean(),
  price_cents: z.number().min(100).max(100000).optional(),
  is_subscription_exclusive: z.boolean().default(false),
})

export async function POST(request: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const formData = await request.formData()
  const metadata = formData.get('metadata')
  const audioFile = formData.get('audio') as File | null
  const videoFile = formData.get('video') as File | null
  const coverFile = formData.get('cover') as File | null

  // Validate metadata
  let parsed
  try {
    parsed = CreateTrackSchema.parse(JSON.parse(metadata as string))
  } catch (err) {
    return NextResponse.json({ error: 'Invalid track metadata' }, { status: 400 })
  }

  // Validate files
  if (audioFile) {
    const { valid, error } = validateAudioFile(audioFile)
    if (!valid) return NextResponse.json({ error }, { status: 400 })
  }
  if (videoFile) {
    const { valid, error } = validateVideoFile(videoFile)
    if (!valid) return NextResponse.json({ error }, { status: 400 })
  }

  const admin = createAdminClient()

  // Create track record first to get the ID
  const { data: track, error: trackError } = await admin
    .from('tracks')
    .insert({
      creator_id: user.id,
      ...parsed,
      status: 'processing',
      is_published: false,
    })
    .select()
    .single()

  if (trackError || !track) {
    return NextResponse.json({ error: 'Failed to create track' }, { status: 500 })
  }

  // Upload files to storage
  try {
    if (audioFile) {
      const path = buildTrackStoragePath(user.id, track.id, audioFile.name, 'audio')
      const { error } = await admin.storage
        .from('tracks')
        .upload(path, audioFile, { cacheControl: '3600', upsert: false })
      if (error) throw error

      await admin.from('tracks').update({
        audio_path: path,
        file_size_bytes: audioFile.size,
      }).eq('id', track.id)
    }

    if (videoFile) {
      const path = buildTrackStoragePath(user.id, track.id, videoFile.name, 'video')
      const { error } = await admin.storage
        .from('tracks')
        .upload(path, videoFile, { cacheControl: '3600', upsert: false })
      if (error) throw error

      await admin.from('tracks').update({ video_path: path }).eq('id', track.id)
    }

    if (coverFile) {
      const ext = coverFile.name.split('.').pop()
      const path = `${user.id}/${track.id}/cover.${ext}`
      const { error } = await admin.storage
        .from('covers')
        .upload(path, coverFile, { cacheControl: '31536000', upsert: false })
      if (error) throw error

      await admin.from('tracks').update({ cover_art_path: path }).eq('id', track.id)
    }

    // Mark as ready (in production: trigger transcoding job here instead)
    await admin.from('tracks')
      .update({ status: 'ready', is_published: true, published_at: new Date().toISOString() })
      .eq('id', track.id)

    return NextResponse.json({ data: { id: track.id } })

  } catch (error) {
    // Mark track as failed
    await admin.from('tracks').update({ status: 'failed' }).eq('id', track.id)
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const supabase = createClient()
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') ?? '1')
  const pageSize = parseInt(searchParams.get('pageSize') ?? '20')
  const genre = searchParams.get('genre')
  const tool = searchParams.get('tool')
  const search = searchParams.get('search')
  const creatorId = searchParams.get('creator_id')

  let query = supabase
    .from('tracks')
    .select('*, creator:profiles!creator_id(*)', { count: 'exact' })
    .eq('is_published', true)
    .eq('status', 'ready')
    .order('published_at', { ascending: false })
    .range((page - 1) * pageSize, page * pageSize - 1)

  if (genre) query = query.eq('genre', genre)
  if (tool) query = query.contains('ai_tools', [tool])
  if (creatorId) query = query.eq('creator_id', creatorId)
  if (search) query = query.textSearch('title', search, { type: 'websearch' })

  const { data, error, count } = await query

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({
    data,
    count: count ?? 0,
    page,
    pageSize,
    hasMore: (count ?? 0) > page * pageSize,
  })
}
