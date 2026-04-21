'use client'

import { useState, Fragment } from 'react'
import { Copy, Check, Clock, ChevronDown, ChevronRight, Zap } from 'lucide-react'
import type { PlaygroundResponse } from '@/lib/api/playground-client'

function statusColor(status: number): string {
  if (status === 0) return 'bg-gray-100 text-gray-600'
  if (status < 300) return 'bg-green-100 text-green-700'
  if (status < 400) return 'bg-yellow-100 text-yellow-700'
  if (status < 500) return 'bg-red-100 text-red-700'
  return 'bg-purple-100 text-purple-700'
}

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
      <div className="flex h-full flex-col items-center justify-center gap-3">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-400 border-t-transparent" />
        <p className="text-sm text-gray-400">Waiting for response…</p>
      </div>
    )
  }

  if (!response) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50">
          <Zap className="h-5 w-5 text-indigo-400" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600">No response yet</p>
          <p className="mt-0.5 text-xs text-gray-400">
            Configure your request and hit &ldquo;Send Request&rdquo;
          </p>
        </div>
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
      <div className="flex flex-wrap items-center gap-2 border-b border-gray-100 bg-white px-4 py-2.5">
        <span
          className={`rounded-md px-2.5 py-1 text-xs font-bold tabular-nums ${statusColor(response.status)}`}
        >
          {response.status || 'ERR'} {response.statusText}
        </span>
        <span className="flex items-center gap-1 text-xs text-gray-400">
          <Clock className="h-3.5 w-3.5" />
          {response.durationMs}ms
        </span>
        {interesting.map(([k, v]) => (
          <span
            key={k}
            className="max-w-[200px] truncate rounded bg-indigo-50 px-2 py-0.5 text-xs text-indigo-700"
          >
            <span className="font-mono font-semibold">{k}:</span> {v}
          </span>
        ))}
      </div>

      {/* All headers toggle */}
      {(rest.length > 0 || interesting.length > 0) && (
        <div className="border-b border-gray-100">
          <button
            onClick={() => setHeadersOpen(v => !v)}
            className="flex w-full items-center gap-1.5 px-4 py-1.5 text-left text-[11px] text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-600"
          >
            {headersOpen ? (
              <ChevronDown className="h-3 w-3" />
            ) : (
              <ChevronRight className="h-3 w-3" />
            )}
            All headers ({rest.length + interesting.length})
          </button>
          {headersOpen && (
            <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-0.5 px-4 pb-3 pt-1 text-[11px]">
              {[...interesting, ...rest].map(([k, v]) => (
                <Fragment key={k}>
                  <code className="font-mono text-indigo-500">{k}</code>
                  <span className="truncate text-gray-500">{v}</span>
                </Fragment>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Body */}
      <div className="relative flex-1 overflow-hidden">
        <button
          onClick={copy}
          className="absolute right-3 top-3 z-10 rounded-md bg-gray-700/80 p-1.5 text-gray-300 backdrop-blur-sm transition-colors hover:bg-gray-600 hover:text-white"
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 text-green-400" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
        </button>
        <pre className="h-full overflow-auto bg-gray-900 p-4 font-mono text-xs leading-relaxed text-green-300">
          {bodyStr}
        </pre>
      </div>
    </div>
  )
}
