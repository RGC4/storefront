'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Heart, ShoppingCart } from 'lucide-react'
import { usePlayerStore } from '@/hooks/usePlayerStore'
import { formatDuration, formatPrice } from '@/lib/audio'
import { formatNumber, cn } from '@/lib/utils'

export function GlobalPlayer() {
  const {
    currentTrack, isPlaying, isLoading, currentTime, duration,
    volume, isMuted, pause, resume, next, previous,
    setCurrentTime, setDuration, setVolume, toggleMute, setIsLoading,
  } = usePlayerStore()

  const waveRef = useRef<HTMLDivElement>(null)
  const wavesurferRef = useRef<any>(null)
  const [signedUrl, setSignedUrl] = useState<string | null>(null)
  const [isFetching, setIsFetching] = useState(false)

  // Fetch signed streaming URL when track changes
  useEffect(() => {
    if (!currentTrack) return
    setIsFetching(true)
    setSignedUrl(null)

    fetch(`/api/tracks/${currentTrack.id}/stream`)
      .then(r => r.json())
      .then(({ url, error }) => {
        if (error) throw new Error(error)
        setSignedUrl(url)
      })
      .catch(err => {
        console.error('Stream error:', err)
        setIsLoading(false)
      })
      .finally(() => setIsFetching(false))
  }, [currentTrack?.id])

  // Init / destroy Wavesurfer
  useEffect(() => {
    if (!signedUrl || !waveRef.current) return

    let ws: any = null

    // Dynamic import so it doesn't break SSR
    import('wavesurfer.js').then(({ default: WaveSurfer }) => {
      if (wavesurferRef.current) {
        wavesurferRef.current.destroy()
      }

      ws = WaveSurfer.create({
        container: waveRef.current!,
        waveColor: 'rgba(139, 92, 246, 0.4)',
        progressColor: 'rgba(139, 92, 246, 1)',
        cursorColor: 'transparent',
        barWidth: 2,
        barGap: 1,
        barRadius: 2,
        height: 40,
        normalize: true,
        url: signedUrl,
      })

      ws.on('ready', () => {
        setDuration(ws.getDuration())
        setIsLoading(false)
        wavesurferRef.current = ws
        if (isPlaying) ws.play()
      })

      ws.on('timeupdate', (t: number) => setCurrentTime(t))
      ws.on('finish', () => next())

      wavesurferRef.current = ws
    })

    return () => { ws?.destroy() }
  }, [signedUrl])

  // Sync play/pause
  useEffect(() => {
    const ws = wavesurferRef.current
    if (!ws) return
    if (isPlaying) ws.play()
    else ws.pause()
  }, [isPlaying])

  // Sync volume
  useEffect(() => {
    wavesurferRef.current?.setVolume(isMuted ? 0 : volume)
  }, [volume, isMuted])

  const handleSeek = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const ws = wavesurferRef.current
    if (!ws || !duration) return
    const rect = e.currentTarget.getBoundingClientRect()
    const ratio = (e.clientX - rect.left) / rect.width
    ws.seekTo(Math.max(0, Math.min(1, ratio)))
  }, [duration])

  if (!currentTrack) return null

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">

        {/* Track info */}
        <div className="flex min-w-0 w-48 items-center gap-3">
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md bg-muted">
            {currentTrack.cover_art_path ? (
              <img
                src={`/api/covers/${currentTrack.cover_art_path}`}
                alt={currentTrack.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-lg">🎵</div>
            )}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{currentTrack.title}</p>
            <p className="truncate text-xs text-muted-foreground">
              {currentTrack.creator?.display_name ?? 'Unknown'}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-1 flex-col items-center gap-1">
          <div className="flex items-center gap-3">
            <button
              onClick={previous}
              className="rounded-full p-1.5 text-muted-foreground transition hover:text-foreground"
            >
              <SkipBack className="h-4 w-4" />
            </button>

            <button
              onClick={() => isPlaying ? pause() : resume()}
              disabled={isLoading || isFetching}
              className={cn(
                'flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground transition',
                'hover:bg-primary/90 disabled:cursor-wait disabled:opacity-60'
              )}
            >
              {isLoading || isFetching ? (
                <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : isPlaying ? (
                <Pause className="h-3.5 w-3.5" />
              ) : (
                <Play className="h-3.5 w-3.5 translate-x-px" />
              )}
            </button>

            <button
              onClick={next}
              className="rounded-full p-1.5 text-muted-foreground transition hover:text-foreground"
            >
              <SkipForward className="h-4 w-4" />
            </button>
          </div>

          {/* Waveform + time */}
          <div className="flex w-full max-w-xl items-center gap-2">
            <span className="w-10 text-right text-xs tabular-nums text-muted-foreground">
              {formatDuration(currentTime)}
            </span>
            <div
              ref={waveRef}
              className="flex-1 cursor-pointer"
              onClick={handleSeek}
            />
            <span className="w-10 text-xs tabular-nums text-muted-foreground">
              {duration > 0 ? formatDuration(duration) : '--:--'}
            </span>
          </div>
        </div>

        {/* Volume + actions */}
        <div className="flex w-48 items-center justify-end gap-3">
          <div className="flex items-center gap-1.5">
            <button
              onClick={toggleMute}
              className="text-muted-foreground transition hover:text-foreground"
            >
              {isMuted || volume === 0
                ? <VolumeX className="h-4 w-4" />
                : <Volume2 className="h-4 w-4" />
              }
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={isMuted ? 0 : volume}
              onChange={e => setVolume(Number(e.target.value))}
              className="w-20 accent-primary"
            />
          </div>

          <span className="text-xs text-muted-foreground">
            {formatNumber(currentTrack.play_count)} plays
          </span>
        </div>
      </div>
    </div>
  )
}
