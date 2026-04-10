'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Play, Pause, Heart, Lock, Crown } from 'lucide-react'
import { usePlayerStore } from '@/hooks/usePlayerStore'
import { formatDuration, formatPrice } from '@/lib/audio'
import { formatNumber, timeAgo, cn } from '@/lib/utils'
import { AI_TOOL_LABELS } from '@/lib/utils/constants'
import type { Track } from '@/types'

interface TrackCardProps {
  track: Track
  queue?: Track[]
  showCreator?: boolean
  compact?: boolean
}

export function TrackCard({ track, queue, showCreator = true, compact = false }: TrackCardProps) {
  const { currentTrack, isPlaying, play, pause, resume } = usePlayerStore()
  const [isLiked, setIsLiked] = useState(track.is_liked ?? false)
  const [likeCount, setLikeCount] = useState(track.like_count)

  const isActive = currentTrack?.id === track.id
  const isThisPlaying = isActive && isPlaying

  const handlePlayPause = (e: React.MouseEvent) => {
    e.preventDefault()
    if (isActive) {
      isPlaying ? pause() : resume()
    } else {
      play(track, queue)
    }
  }

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault()
    const next = !isLiked
    setIsLiked(next)
    setLikeCount(c => c + (next ? 1 : -1))

    await fetch(`/api/tracks/${track.id}/like`, {
      method: next ? 'POST' : 'DELETE',
    })
  }

  if (compact) {
    return (
      <div className={cn(
        'group flex items-center gap-3 rounded-lg px-3 py-2 transition hover:bg-muted/50',
        isActive && 'bg-muted/50'
      )}>
        {/* Play button */}
        <button
          onClick={handlePlayPause}
          className={cn(
            'relative flex h-9 w-9 shrink-0 items-center justify-center rounded-md transition',
            isActive ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground hover:bg-primary hover:text-primary-foreground'
          )}
        >
          {isThisPlaying
            ? <Pause className="h-3.5 w-3.5" />
            : <Play className="h-3.5 w-3.5 translate-x-px" />
          }
        </button>

        <div className="min-w-0 flex-1">
          <p className={cn('truncate text-sm font-medium', isActive && 'text-primary')}>
            {track.title}
          </p>
          {showCreator && (
            <p className="truncate text-xs text-muted-foreground">
              {track.creator?.display_name}
            </p>
          )}
        </div>

        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          {track.duration_seconds && (
            <span className="tabular-nums">{formatDuration(track.duration_seconds)}</span>
          )}
          {!track.is_free && (
            <span className="font-medium text-primary">
              {track.price_cents ? formatPrice(track.price_cents) : <Crown className="h-3 w-3" />}
            </span>
          )}
        </div>
      </div>
    )
  }

  return (
    <Link
      href={`/track/${track.id}`}
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card transition',
        'hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5',
        isActive && 'border-primary/40'
      )}
    >
      {/* Cover art */}
      <div className="relative aspect-square overflow-hidden bg-muted">
        {track.cover_art_path ? (
          <img
            src={`/api/covers/${track.cover_art_path}`}
            alt={track.title}
            className="h-full w-full object-cover transition group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-5xl">🎵</div>
        )}

        {/* Play overlay */}
        <button
          onClick={handlePlayPause}
          className={cn(
            'absolute inset-0 flex items-center justify-center bg-black/40 transition',
            isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          )}
        >
          <div className={cn(
            'flex h-12 w-12 items-center justify-center rounded-full transition',
            isActive ? 'bg-primary text-white' : 'bg-white/90 text-black'
          )}>
            {isThisPlaying
              ? <Pause className="h-5 w-5" />
              : <Play className="h-5 w-5 translate-x-0.5" />
            }
          </div>
        </button>

        {/* Access badge */}
        {!track.is_free && (
          <div className="absolute left-2 top-2">
            {track.is_subscription_exclusive ? (
              <span className="flex items-center gap-1 rounded-full bg-yellow-500/90 px-2 py-0.5 text-xs font-medium text-black backdrop-blur-sm">
                <Crown className="h-3 w-3" /> Sub
              </span>
            ) : (
              <span className="flex items-center gap-1 rounded-full bg-black/70 px-2 py-0.5 text-xs font-medium text-white backdrop-blur-sm">
                <Lock className="h-3 w-3" /> {formatPrice(track.price_cents!)}
              </span>
            )}
          </div>
        )}

        {/* Duration */}
        {track.duration_seconds && (
          <span className="absolute bottom-2 right-2 rounded bg-black/70 px-1.5 py-0.5 text-xs tabular-nums text-white">
            {formatDuration(track.duration_seconds)}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col gap-2 p-3">
        <div>
          <h3 className={cn('truncate font-medium', isActive && 'text-primary')}>
            {track.title}
          </h3>
          {showCreator && track.creator && (
            <p className="truncate text-sm text-muted-foreground">
              {track.creator.display_name}
            </p>
          )}
        </div>

        {/* AI Tools */}
        <div className="flex flex-wrap gap-1">
          {track.ai_tools.slice(0, 3).map(tool => (
            <span
              key={tool}
              className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"
            >
              {AI_TOOL_LABELS[tool] ?? tool}
            </span>
          ))}
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {formatNumber(track.play_count)} plays
          </span>
          <button
            onClick={handleLike}
            className="flex items-center gap-1 text-xs text-muted-foreground transition hover:text-red-500"
          >
            <Heart className={cn('h-3.5 w-3.5', isLiked && 'fill-red-500 text-red-500')} />
            {formatNumber(likeCount)}
          </button>
        </div>
      </div>
    </Link>
  )
}
