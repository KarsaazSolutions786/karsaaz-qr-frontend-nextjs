'use client'

import { useState } from 'react'
import { Copy, Check, Clock, ChevronDown, ChevronRight } from 'lucide-react'
import type { PlaygroundResponse } from '@/lib/api/playground-client'

function statusColor(status: number): string {
  if (status === 0) return 'bg-gray-200 text-gray-700'
  if (status < 300) return 'bg-green-100 text-green-700'
  if (status < 400) return 'bg-yellow-100 text-yellow-700'
  if (status < 500) return 'bg-red-100 text-red-700'
  return 'bg-purple-100 text-purple-700'
}

// Headers that get promoted to the status bar for quick visibility
const INTERESTING_HEADERS = [
  'x-ratelimit-limit',
  'x-ratelimit-remaining',
  'x-credits-consumed',
  'x-credits-balance',
  'x-tokens-consumed',
  'x-tokens-feature',
  'retry-after',
  'content-type',
]

interface Props {
  response: PlaygroundResponse | null
  isLoading: boolean
}

export function ResponseViewer({ response, isLoading }: Props) {
  const [copied, setCopied] = useState(false)
  const [headersOpen, setHeadersOpen] = useState(false)

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center gap-3 text-sm text-gray-400">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-400 border-t-transparent" />
        Waiting for response…
      </div>
    )
  }

  if (!response) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-gray-400">
        Hit &ldquo;Send Request&rdquo; to see the response here
      </div>
    )
  }

  const bodyStr =
    typeof response.data === 'string' ? response.data : JSON.stringify(response.data, null, 2)

  const copy = async () => {
    await navigator.clipboard.writeText(bodyStr)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const interesting = Object.entries(response.headers).filter(([k]) =>
    INTERESTING_HEADERS.includes(k.toLowerCase())
  )
  const rest = Object.entries(response.headers).filter(
    ([k]) => !INTERESTING_HEADERS.includes(k.toLowerCase())
  )

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      {/* Status bar */}
      <div className="flex flex-wrap items-center gap-3 border-b border-gray-100 px-4 py-3">
        <span className={`rounded px-2.5 py-1 text-sm font-bold ${statusColor(response.status)}`}>
          {response.status || 'ERR'} {response.statusText}
        </span>
        <span className="flex items-center gap-1 text-xs text-gray-500">
          <Clock className="h-3.5 w-3.5" />
          {response.durationMs}ms
        </span>
        {interesting.map(([k, v]) => (
          <span key={k} className="rounded bg-indigo-50 px-2 py-0.5 text-xs text-indigo-700">
            <span className="font-mono font-semibold">{k}:</span> {v}
          </span>
        ))}
      </div>

      {/* All headers toggle */}
      {(rest.length > 0 || interesting.length > 0) && (
        <div className="border-b border-gray-100">
          <button
            onClick={() => setHeadersOpen(v => !v)}
            className="flex w-full items-center gap-2 px-4 py-2 text-left text-xs text-gray-400 hover:text-gray-600"
          >
            {headersOpen ? (
              <ChevronDown className="h-3.5 w-3.5" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5" />
            )}
            All response headers ({rest.length + interesting.length})
          </button>
          {headersOpen && (
            <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5 px-4 pb-3 text-xs">
              {[...interesting, ...rest].map(([k, v]) => (
                <>
                  <code key={`k-${k}`} className="font-mono text-indigo-600">
                    {k}
                  </code>
                  <span key={`v-${k}`} className="truncate text-gray-600">
                    {v}
                  </span>
                </>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Body */}
      <div className="relative flex-1 overflow-hidden">
        <div className="absolute right-3 top-3 z-10">
          <button
            onClick={copy}
            className="rounded-md bg-gray-800 p-1.5 text-gray-400 transition-colors hover:text-white"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-green-400" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
          </button>
        </div>
        <pre className="h-full overflow-auto bg-gray-900 p-4 font-mono text-xs leading-relaxed text-green-300">
          {bodyStr}
        </pre>
      </div>
    </div>
  )
}
