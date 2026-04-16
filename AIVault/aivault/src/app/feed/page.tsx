import { createClient } from '@/lib/supabase/server'
import { TrackCard } from '@/components/creator/TrackCard'
import Link from 'next/link'

export const revalidate = 60 // Revalidate every minute

export default async function FeedPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Trending tracks (most played last 7 days)
  const { data: trending } = await supabase
    .from('tracks')
    .select('*, creator:profiles!creator_id(*)')
    .eq('is_published', true)
    .eq('status', 'ready')
    .order('play_count', { ascending: false })
    .limit(12)

  // New releases
  const { data: newReleases } = await supabase
    .from('tracks')
    .select('*, creator:profiles!creator_id(*)')
    .eq('is_published', true)
    .eq('status', 'ready')
    .order('published_at', { ascending: false })
    .limit(8)

  // If logged in, get followed creators' tracks
  let followedTracks = null
  if (user) {
    const { data: follows } = await supabase
      .from('follows')
      .select('following_id')
      .eq('follower_id', user.id)

    if (follows && follows.length > 0) {
      const ids = follows.map(f => f.following_id)
      const { data } = await supabase
        .from('tracks')
        .select('*, creator:profiles!creator_id(*)')
        .in('creator_id', ids)
        .eq('is_published', true)
        .eq('status', 'ready')
        .order('published_at', { ascending: false })
        .limit(12)
      followedTracks = data
    }
  }

  return (
    <div className="px-6 py-8 space-y-10">

      {/* Following feed */}
      {followedTracks && followedTracks.length > 0 && (
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">From creators you follow</h2>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {followedTracks.map(track => (
              <TrackCard key={track.id} track={track} queue={followedTracks} />
            ))}
          </div>
        </section>
      )}

      {/* Trending */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Trending</h2>
          <Link href="/explore?sort=trending" className="text-sm text-primary hover:underline">
            See all
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {trending?.map(track => (
            <TrackCard key={track.id} track={track} queue={trending} />
          ))}
        </div>
      </section>

      {/* New releases */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">New releases</h2>
          <Link href="/explore?sort=new" className="text-sm text-primary hover:underline">
            See all
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {newReleases?.map(track => (
            <TrackCard key={track.id} track={track} queue={newReleases} />
          ))}
        </div>
      </section>
    </div>
  )
}
