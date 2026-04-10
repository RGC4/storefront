import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/server'
import { getSignedAudioUrl } from '@/lib/audio'

// GET /api/tracks/[id]/stream
// Returns a signed URL for audio playback.
// Validates access (free, purchased, or subscribed).
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const admin = createAdminClient()

  // Fetch the track
  const { data: track, error } = await admin
    .from('tracks')
    .select('*, creator:profiles!creator_id(stripe_account_id)')
    .eq('id', params.id)
    .eq('is_published', true)
    .single()

  if (error || !track) {
    return NextResponse.json({ error: 'Track not found' }, { status: 404 })
  }

  // Access control
  const isOwner = user?.id === track.creator_id

  if (!track.is_free && !isOwner) {
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    if (track.is_subscription_exclusive) {
      // Check subscription
      const { data: sub } = await admin
        .from('creator_subscriptions')
        .select('id, status')
        .eq('subscriber_id', user.id)
        .eq('creator_id', track.creator_id)
        .eq('status', 'active')
        .single()

      if (!sub) {
        return NextResponse.json({ error: 'Subscription required' }, { status: 403 })
      }
    } else {
      // Check purchase
      const { data: purchase } = await admin
        .from('purchases')
        .select('id')
        .eq('buyer_id', user.id)
        .eq('track_id', track.id)
        .eq('status', 'completed')
        .single()

      if (!purchase) {
        return NextResponse.json({ error: 'Purchase required' }, { status: 403 })
      }
    }
  }

  // Generate signed URL
  try {
    const path = track.audio_path ?? track.video_path
    if (!path) return NextResponse.json({ error: 'No audio file' }, { status: 404 })

    const signedUrl = await getSignedAudioUrl(path)

    // Record the play (fire and forget)
    admin.from('plays').insert({
      track_id: track.id,
      user_id: user?.id ?? null,
      played_at: new Date().toISOString(),
    }).then(() => {
      // Also bump the play_count
      admin.rpc('increment_play_count', { track_id: track.id })
    })

    return NextResponse.json({ url: signedUrl })
  } catch (err) {
    console.error('Stream error:', err)
    return NextResponse.json({ error: 'Failed to generate stream URL' }, { status: 500 })
  }
}
