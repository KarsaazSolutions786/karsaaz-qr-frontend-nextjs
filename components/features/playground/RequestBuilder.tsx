// components/features/playground/RequestBuilder.tsx
'use client'

import { Send, AlertCircle } from 'lucide-react'
import type { PlaygroundEndpoint } from '@/lib/constants/playground-endpoints'

const METHOD_COLORS: Record<string, string> = {
  GET: 'bg-blue-100 text-blue-700 border-blue-200',
  POST: 'bg-green-100 text-green-700 border-green-200',
  PUT: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  PATCH: 'bg-orange-100 text-orange-700 border-orange-200',
  DELETE: 'bg-red-100 text-red-700 border-red-200',
}

interface Props {
  endpoint: PlaygroundEndpoint | null
  apiKey: string
  fullUrl: string
  pathParams: Record<string, string>
  queryParams: Record<string, string>
  requestBody: string
  isSending: boolean
  onApiKeyChange: (v: string) => void
  onPathParamChange: (name: string, value: string) => void
  onQueryParamChange: (name: string, value: string) => void
  onBodyChange: (v: string) => void
  onSend: () => void
}

export function RequestBuilder({
  endpoint,
  apiKey,
  fullUrl,
  pathParams,
  queryParams,
  requestBody,
  isSending,
  onApiKeyChange,
  onPathParamChange,
  onQueryParamChange,
  onBodyChange,
  onSend,
}: Props) {
  if (!endpoint) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-gray-400">
        Select an endpoint from the left panel
      </div>
    )
  }

  const pathParamDefs = endpoint.params?.filter(p => p.in === 'path') ?? []
  const queryParamDefs = endpoint.params?.filter(p => p.in === 'query') ?? []
  const hasBody = ['POST', 'PUT', 'PATCH'].includes(endpoint.method)
  const isReady = apiKey.trim().length > 0
  const hasUnresolvedParams =
    endpoint.path.includes('{') && pathParamDefs.some(p => !pathParams[p.name]?.trim())

  return (
    <div className="flex h-full flex-col gap-4 overflow-y-auto p-4">
      {/* Summary */}
      <div>
        <h3 className="text-base font-semibold text-gray-900">{endpoint.summary}</h3>
        {endpoint.description && (
          <p className="mt-1 text-sm text-gray-500">{endpoint.description}</p>
        )}
        {endpoint.credits && (
          <span className="mt-1 inline-block rounded-full bg-indigo-50 px-2 py-0.5 text-xs text-indigo-600">
            {endpoint.credits}
          </span>
        )}
      </div>

      {/* URL bar */}
      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
          Request URL
        </label>
        <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
          <span
            className={`shrink-0 rounded border px-2 py-0.5 text-xs font-bold font-mono ${
              METHOD_COLORS[endpoint.method] ?? ''
            }`}
          >
            {endpoint.method}
          </span>
          <code className="flex-1 break-all font-mono text-xs text-gray-700">{fullUrl || '—'}</code>
        </div>
      </div>

      {/* API Key */}
      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
          API Key <span className="text-red-400">*</span>
        </label>
        <input
          type="password"
          value={apiKey}
          onChange={e => onApiKeyChange(e.target.value)}
          placeholder="Paste your API key here…"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 font-mono text-sm shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400"
        />
        <p className="mt-1 text-xs text-gray-400">Not stored — only used for this request.</p>
      </div>

      {/* Path Params */}
      {pathParamDefs.length > 0 && (
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
            Path Parameters
          </label>
          <div className="space-y-2">
            {pathParamDefs.map(param => (
              <div key={param.name} className="flex items-center gap-2">
                <code className="w-24 shrink-0 rounded bg-gray-100 px-2 py-1 text-xs font-mono text-indigo-600">
                  {param.name}
                </code>
                <input
                  type="text"
                  value={pathParams[param.name] ?? ''}
                  onChange={e => onPathParamChange(param.name, e.target.value)}
                  placeholder={param.example ?? param.description}
                  className="flex-1 rounded-md border border-gray-300 px-2 py-1 text-sm shadow-sm focus:border-indigo-400 focus:outline-none"
                />
                {param.required && <span className="shrink-0 text-xs text-red-400">required</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Query Params */}
      {queryParamDefs.length > 0 && (
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
            Query Parameters
          </label>
          <div className="space-y-2">
            {queryParamDefs.map(param => (
              <div key={param.name} className="flex items-center gap-2">
                <div className="w-28 shrink-0">
                  <code className="block rounded bg-gray-100 px-2 py-1 text-xs font-mono text-indigo-600">
                    {param.name}
                  </code>
                  <span className="text-[10px] text-gray-400">{param.type}</span>
                </div>
                <input
                  type="text"
                  value={queryParams[param.name] ?? ''}
                  onChange={e => onQueryParamChange(param.name, e.target.value)}
                  placeholder={param.example ?? ''}
                  className="flex-1 rounded-md border border-gray-300 px-2 py-1 text-sm shadow-sm focus:border-indigo-400 focus:outline-none"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Request Body */}
      {hasBody && (
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
            Request Body <span className="text-gray-400">(JSON)</span>
          </label>
          <textarea
            value={requestBody}
            onChange={e => onBodyChange(e.target.value)}
            rows={8}
            spellCheck={false}
            className="w-full resize-y rounded-lg border border-gray-300 bg-gray-900 p-3 font-mono text-xs leading-relaxed text-green-300 shadow-sm focus:border-indigo-400 focus:outline-none"
          />
        </div>
      )}

      {/* Unresolved params warning */}
      {hasUnresolvedParams && (
        <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          Fill in all required path parameters before sending.
        </div>
      )}

      {/* Send Button */}
      <button
        onClick={onSend}
        disabled={isSending || !isReady || hasUnresolvedParams}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSending ? (
          <>
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            Sending…
          </>
        ) : (
          <>
            <Send className="h-4 w-4" />
            Send Request
          </>
        )}
      </button>
    </div>
  )
}
