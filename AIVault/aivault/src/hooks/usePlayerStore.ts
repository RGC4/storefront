import { create } from 'zustand'
import type { Track } from '@/types'

interface PlayerState {
  // Current track
  currentTrack: Track | null
  queue: Track[]
  queueIndex: number
  // Playback state
  isPlaying: boolean
  isLoading: boolean
  currentTime: number
  duration: number
  volume: number
  isMuted: boolean
  // Actions
  play: (track: Track, queue?: Track[]) => void
  pause: () => void
  resume: () => void
  togglePlay: () => void
  next: () => void
  previous: () => void
  setCurrentTime: (time: number) => void
  setDuration: (duration: number) => void
  setVolume: (volume: number) => void
  toggleMute: () => void
  setIsLoading: (loading: boolean) => void
  addToQueue: (track: Track) => void
  clearQueue: () => void
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  currentTrack: null,
  queue: [],
  queueIndex: 0,
  isPlaying: false,
  isLoading: false,
  currentTime: 0,
  duration: 0,
  volume: 0.8,
  isMuted: false,

  play: (track, queue) => {
    const newQueue = queue ?? [track]
    const index = newQueue.findIndex(t => t.id === track.id)
    set({
      currentTrack: track,
      queue: newQueue,
      queueIndex: Math.max(0, index),
      isPlaying: true,
      isLoading: true,
      currentTime: 0,
    })
  },

  pause: () => set({ isPlaying: false }),
  resume: () => set({ isPlaying: true }),

  togglePlay: () => {
    const { isPlaying, currentTrack } = get()
    if (!currentTrack) return
    set({ isPlaying: !isPlaying })
  },

  next: () => {
    const { queue, queueIndex } = get()
    const nextIndex = queueIndex + 1
    if (nextIndex < queue.length) {
      set({ currentTrack: queue[nextIndex], queueIndex: nextIndex, currentTime: 0, isLoading: true })
    }
  },

  previous: () => {
    const { queue, queueIndex, currentTime } = get()
    // If more than 3 seconds in, restart. Otherwise go previous.
    if (currentTime > 3) {
      set({ currentTime: 0 })
      return
    }
    const prevIndex = queueIndex - 1
    if (prevIndex >= 0) {
      set({ currentTrack: queue[prevIndex], queueIndex: prevIndex, currentTime: 0, isLoading: true })
    }
  },

  setCurrentTime: (time) => set({ currentTime: time }),
  setDuration: (duration) => set({ duration }),
  setVolume: (volume) => set({ volume, isMuted: volume === 0 }),
  toggleMute: () => set(s => ({ isMuted: !s.isMuted })),
  setIsLoading: (isLoading) => set({ isLoading }),

  addToQueue: (track) => set(s => ({ queue: [...s.queue, track] })),
  clearQueue: () => set({ queue: [], queueIndex: 0 }),
}))
