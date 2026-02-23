'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  MicrophoneIcon,
  StopIcon,
  PlayIcon,
  TrashIcon,
  ArrowDownTrayIcon,
  PauseIcon,
} from '@heroicons/react/24/solid'

type RecorderState = 'idle' | 'recording' | 'recorded'

interface AudioRecorderProps {
  onRecordingComplete: (blob: Blob) => void
  maxDuration?: number
  className?: string
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

export function AudioRecorder({
  onRecordingComplete,
  maxDuration = 120,
  className,
}: AudioRecorderProps) {
  const [state, setState] = useState<RecorderState>('idle')
  const [elapsed, setElapsed] = useState(0)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const blobRef = useRef<Blob | null>(null)

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      if (audioUrl) URL.revokeObjectURL(audioUrl)
      if (mediaRecorderRef.current?.state === 'recording') {
        mediaRecorderRef.current.stop()
      }
    }
  }, [audioUrl])

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      mediaRecorderRef.current = recorder
      chunksRef.current = []

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }

      recorder.onstop = () => {
        stream.getTracks().forEach((t) => t.stop())
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        blobRef.current = blob
        const url = URL.createObjectURL(blob)
        setAudioUrl(url)
        setState('recorded')
        onRecordingComplete(blob)
      }

      recorder.start()
      setState('recording')
      setElapsed(0)

      timerRef.current = setInterval(() => {
        setElapsed((prev) => {
          const next = prev + 1
          if (next >= maxDuration) {
            recorder.stop()
            if (timerRef.current) clearInterval(timerRef.current)
          }
          return next
        })
      }, 1000)
    } catch {
      // Microphone permission denied or not available
    }
  }, [maxDuration, onRecordingComplete])

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop()
    }
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const togglePlayback = useCallback(() => {
    if (!audioRef.current || !audioUrl) return
    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      audioRef.current.play()
      setIsPlaying(true)
    }
  }, [isPlaying, audioUrl])

  const handleDelete = useCallback(() => {
    if (audioUrl) URL.revokeObjectURL(audioUrl)
    setAudioUrl(null)
    blobRef.current = null
    setState('idle')
    setElapsed(0)
    setIsPlaying(false)
  }, [audioUrl])

  const handleDownload = useCallback(() => {
    if (!blobRef.current) return
    const url = URL.createObjectURL(blobRef.current)
    const a = document.createElement('a')
    a.href = url
    a.download = `recording-${Date.now()}.webm`
    a.click()
    URL.revokeObjectURL(url)
  }, [])

  const progress = maxDuration > 0 ? Math.min((elapsed / maxDuration) * 100, 100) : 0

  return (
    <div className={cn('space-y-3', className)}>
      {/* Timer / progress */}
      <div className="flex items-center gap-3">
        <span className="font-mono text-lg tabular-nums text-gray-700">
          {formatTime(elapsed)}
          {state === 'recording' && (
            <span className="text-sm text-gray-400"> / {formatTime(maxDuration)}</span>
          )}
        </span>

        {state === 'recording' && (
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full rounded-full bg-red-500 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2">
        {state === 'idle' && (
          <Button type="button" onClick={startRecording} size="sm">
            <MicrophoneIcon className="mr-1.5 h-4 w-4" />
            Record
          </Button>
        )}

        {state === 'recording' && (
          <Button
            type="button"
            variant="destructive"
            onClick={stopRecording}
            size="sm"
          >
            <StopIcon className="mr-1.5 h-4 w-4" />
            Stop
          </Button>
        )}

        {state === 'recorded' && (
          <>
            <Button
              type="button"
              variant="outline"
              onClick={togglePlayback}
              size="sm"
            >
              {isPlaying ? (
                <PauseIcon className="mr-1.5 h-4 w-4" />
              ) : (
                <PlayIcon className="mr-1.5 h-4 w-4" />
              )}
              {isPlaying ? 'Pause' : 'Play'}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={handleDownload}
              size="sm"
            >
              <ArrowDownTrayIcon className="mr-1.5 h-4 w-4" />
              Download
            </Button>

            <Button
              type="button"
              variant="ghost"
              onClick={handleDelete}
              size="sm"
              className="text-red-500 hover:text-red-700"
            >
              <TrashIcon className="mr-1.5 h-4 w-4" />
              Delete
            </Button>
          </>
        )}
      </div>

      {/* Hidden audio element for playback */}
      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          onEnded={() => setIsPlaying(false)}
          className="hidden"
        />
      )}
    </div>
  )
}
