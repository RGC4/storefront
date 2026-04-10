'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useDropzone } from 'react-dropzone'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Upload, Music, Video, X, ChevronDown } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { validateAudioFile, validateVideoFile, formatPrice } from '@/lib/audio'
import { AI_TOOLS, AI_TOOL_LABELS, GENRES, MOODS } from '@/lib/utils/constants'
import type { AiTool } from '@/types'

const schema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().max(2000).optional(),
  genre: z.string().optional(),
  bpm: z.number().min(40).max(300).optional().or(z.literal('')),
  ai_tools: z.array(z.string()).min(1, 'Select at least one AI tool'),
  prompt_preview: z.string().max(500).optional(),
  is_free: z.boolean(),
  price_cents: z.number().min(100).optional(),
  is_subscription_exclusive: z.boolean(),
  content_type: z.enum(['audio', 'video', 'audio_video']),
})

type FormData = z.infer<typeof schema>

export default function UploadPage() {
  const router = useRouter()
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [coverPreview, setCoverPreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      is_free: true,
      is_subscription_exclusive: false,
      content_type: 'audio',
      ai_tools: [],
    },
  })

  const isFree = watch('is_free')
  const selectedTools = watch('ai_tools') as AiTool[]
  const contentType = watch('content_type')

  // Audio dropzone
  const onAudioDrop = useCallback((files: File[]) => {
    const file = files[0]
    if (!file) return
    const { valid, error } = validateAudioFile(file)
    if (!valid) { toast.error(error); return }
    setAudioFile(file)
  }, [])

  const { getRootProps: getAudioProps, getInputProps: getAudioInput, isDragActive: isAudioDrag } =
    useDropzone({ onDrop: onAudioDrop, accept: { 'audio/*': ['.mp3', '.wav', '.ogg', '.flac', '.aac'] }, maxFiles: 1 })

  // Video dropzone
  const onVideoDrop = useCallback((files: File[]) => {
    const file = files[0]
    if (!file) return
    const { valid, error } = validateVideoFile(file)
    if (!valid) { toast.error(error); return }
    setVideoFile(file)
  }, [])

  const { getRootProps: getVideoProps, getInputProps: getVideoInput, isDragActive: isVideoDrag } =
    useDropzone({ onDrop: onVideoDrop, accept: { 'video/*': ['.mp4', '.webm', '.mov'] }, maxFiles: 1 })

  // Cover art dropzone
  const onCoverDrop = useCallback((files: File[]) => {
    const file = files[0]
    if (!file) return
    setCoverFile(file)
    setCoverPreview(URL.createObjectURL(file))
  }, [])

  const { getRootProps: getCoverProps, getInputProps: getCoverInput } =
    useDropzone({ onDrop: onCoverDrop, accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] }, maxFiles: 1 })

  const toggleTool = (tool: AiTool) => {
    const current = selectedTools
    const next = current.includes(tool)
      ? current.filter(t => t !== tool)
      : [...current, tool]
    setValue('ai_tools', next, { shouldValidate: true })
  }

  const onSubmit = async (data: FormData) => {
    if (!audioFile && contentType === 'audio') {
      toast.error('Please upload an audio file')
      return
    }

    setIsUploading(true)
    setUploadProgress(10)

    try {
      const formData = new FormData()
      formData.append('metadata', JSON.stringify(data))
      if (audioFile) formData.append('audio', audioFile)
      if (videoFile) formData.append('video', videoFile)
      if (coverFile) formData.append('cover', coverFile)

      setUploadProgress(30)

      const res = await fetch('/api/tracks', { method: 'POST', body: formData })
      const result = await res.json()

      setUploadProgress(100)

      if (!res.ok) throw new Error(result.error ?? 'Upload failed')

      toast.success('Track uploaded successfully!')
      router.push(`/track/${result.data.id}`)
    } catch (err: any) {
      toast.error(err.message ?? 'Upload failed. Please try again.')
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold">Upload a track</h1>
        <p className="mt-1 text-muted-foreground">
          Share your AI-generated music or video with the world.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

        {/* Content type */}
        <div>
          <label className="mb-2 block text-sm font-medium">Content type</label>
          <div className="flex gap-2">
            {(['audio', 'video', 'audio_video'] as const).map(type => (
              <button
                key={type}
                type="button"
                onClick={() => setValue('content_type', type)}
                className={cn(
                  'flex items-center gap-2 rounded-lg border px-4 py-2 text-sm transition',
                  contentType === type
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border hover:border-primary/40'
                )}
              >
                {type === 'audio' ? <Music className="h-4 w-4" /> : <Video className="h-4 w-4" />}
                {type === 'audio' ? 'Audio' : type === 'video' ? 'Video' : 'Audio + Video'}
              </button>
            ))}
          </div>
        </div>

        {/* Audio upload */}
        {(contentType === 'audio' || contentType === 'audio_video') && (
          <div>
            <label className="mb-2 block text-sm font-medium">Audio file *</label>
            {audioFile ? (
              <div className="flex items-center justify-between rounded-lg border border-primary/40 bg-primary/5 p-3">
                <div className="flex items-center gap-2">
                  <Music className="h-4 w-4 text-primary" />
                  <span className="text-sm">{audioFile.name}</span>
                  <span className="text-xs text-muted-foreground">
                    ({(audioFile.size / 1024 / 1024).toFixed(1)} MB)
                  </span>
                </div>
                <button type="button" onClick={() => setAudioFile(null)}>
                  <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                </button>
              </div>
            ) : (
              <div
                {...getAudioProps()}
                className={cn(
                  'cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition',
                  isAudioDrag ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/40'
                )}
              >
                <input {...getAudioInput()} />
                <Upload className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Drop audio here or <span className="text-primary">browse</span>
                </p>
                <p className="mt-1 text-xs text-muted-foreground">MP3, WAV, OGG, FLAC, AAC — up to 200MB</p>
              </div>
            )}
          </div>
        )}

        {/* Video upload */}
        {(contentType === 'video' || contentType === 'audio_video') && (
          <div>
            <label className="mb-2 block text-sm font-medium">
              Video file {contentType === 'audio_video' ? '(optional)' : '*'}
            </label>
            {videoFile ? (
              <div className="flex items-center justify-between rounded-lg border border-primary/40 bg-primary/5 p-3">
                <div className="flex items-center gap-2">
                  <Video className="h-4 w-4 text-primary" />
                  <span className="text-sm">{videoFile.name}</span>
                </div>
                <button type="button" onClick={() => setVideoFile(null)}>
                  <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                </button>
              </div>
            ) : (
              <div
                {...getVideoProps()}
                className={cn(
                  'cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition',
                  isVideoDrag ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/40'
                )}
              >
                <input {...getVideoInput()} />
                <Video className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Drop video here or <span className="text-primary">browse</span>
                </p>
                <p className="mt-1 text-xs text-muted-foreground">MP4, WebM, MOV — up to 1GB</p>
              </div>
            )}
          </div>
        )}

        {/* Cover art */}
        <div>
          <label className="mb-2 block text-sm font-medium">Cover art</label>
          <div className="flex gap-4">
            {coverPreview ? (
              <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg">
                <img src={coverPreview} alt="Cover" className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => { setCoverFile(null); setCoverPreview(null) }}
                  className="absolute right-1 top-1 rounded-full bg-black/60 p-0.5"
                >
                  <X className="h-3 w-3 text-white" />
                </button>
              </div>
            ) : (
              <div
                {...getCoverProps()}
                className="flex h-24 w-24 shrink-0 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border transition hover:border-primary/40"
              >
                <input {...getCoverInput()} />
                <Upload className="h-5 w-5 text-muted-foreground" />
                <span className="mt-1 text-xs text-muted-foreground">Cover</span>
              </div>
            )}
            <p className="self-center text-xs text-muted-foreground">
              Recommended: 1:1 aspect ratio, at least 500×500px. JPG, PNG, or WebP.
            </p>
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="mb-2 block text-sm font-medium">Title *</label>
          <input
            {...register('title')}
            placeholder="Track title"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
          />
          {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>}
        </div>

        {/* Description */}
        <div>
          <label className="mb-2 block text-sm font-medium">Description</label>
          <textarea
            {...register('description')}
            rows={3}
            placeholder="Tell listeners about this track..."
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>

        {/* Genre + BPM row */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-2 block text-sm font-medium">Genre</label>
            <select
              {...register('genre')}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none transition focus:border-primary"
            >
              <option value="">Select genre</option>
              {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">BPM</label>
            <input
              type="number"
              {...register('bpm', { valueAsNumber: true })}
              placeholder="e.g. 120"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        {/* AI Tools */}
        <div>
          <label className="mb-2 block text-sm font-medium">AI tools used *</label>
          <div className="flex flex-wrap gap-2">
            {AI_TOOLS.map(tool => (
              <button
                key={tool}
                type="button"
                onClick={() => toggleTool(tool)}
                className={cn(
                  'rounded-full border px-3 py-1 text-sm transition',
                  selectedTools.includes(tool)
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border hover:border-primary/40'
                )}
              >
                {AI_TOOL_LABELS[tool]}
              </button>
            ))}
          </div>
          {errors.ai_tools && <p className="mt-1 text-xs text-red-500">{errors.ai_tools.message}</p>}
        </div>

        {/* Prompt preview */}
        <div>
          <label className="mb-2 block text-sm font-medium">
            Prompt preview <span className="text-muted-foreground">(optional teaser)</span>
          </label>
          <textarea
            {...register('prompt_preview')}
            rows={2}
            placeholder="Share a glimpse of the prompt you used..."
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>

        {/* Pricing */}
        <div className="rounded-xl border border-border p-4 space-y-4">
          <h3 className="font-medium">Pricing</h3>

          <div className="flex gap-4">
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="radio"
                checked={isFree}
                onChange={() => { setValue('is_free', true); setValue('is_subscription_exclusive', false) }}
                className="accent-primary"
              />
              <span className="text-sm">Free</span>
            </label>
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="radio"
                checked={!isFree && !watch('is_subscription_exclusive')}
                onChange={() => { setValue('is_free', false); setValue('is_subscription_exclusive', false) }}
                className="accent-primary"
              />
              <span className="text-sm">Paid</span>
            </label>
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="radio"
                checked={watch('is_subscription_exclusive')}
                onChange={() => { setValue('is_free', false); setValue('is_subscription_exclusive', true) }}
                className="accent-primary"
              />
              <span className="text-sm">Subscribers only</span>
            </label>
          </div>

          {!isFree && !watch('is_subscription_exclusive') && (
            <div>
              <label className="mb-1 block text-sm text-muted-foreground">Price (USD)</label>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">$</span>
                <input
                  type="number"
                  step="0.01"
                  min="1"
                  placeholder="4.99"
                  onChange={e => setValue('price_cents', Math.round(parseFloat(e.target.value) * 100))}
                  className="w-32 rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                You receive 90% of each sale. Platform fee: 10%.
              </p>
            </div>
          )}
        </div>

        {/* Upload button */}
        {isUploading && (
          <div className="overflow-hidden rounded-full bg-muted">
            <div
              className="h-1.5 rounded-full bg-primary transition-all duration-500"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        )}

        <button
          type="submit"
          disabled={isUploading}
          className={cn(
            'w-full rounded-xl bg-primary py-3 font-medium text-primary-foreground transition',
            'hover:bg-primary/90 disabled:cursor-wait disabled:opacity-60'
          )}
        >
          {isUploading ? 'Uploading...' : 'Publish track'}
        </button>
      </form>
    </div>
  )
}
