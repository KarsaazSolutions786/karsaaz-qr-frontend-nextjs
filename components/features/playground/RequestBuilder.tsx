'use client'

import { Send, AlertCircle } from 'lucide-react'
import type { PlaygroundEndpoint } from '@/lib/constants/playground-endpoints'

const METHOD_STYLES: Record<string, string> = {
  GET: 'bg-blue-500 text-white',
  POST: 'bg-green-500 text-white',
  PUT: 'bg-yellow-500 text-white',
  PATCH: 'bg-orange-500 text-white',
  DELETE: 'bg-red-500 text-white',
}

/**
 * Purpose: Executes FieldLabel functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: April 2026
 */
function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-gray-400">
      {children}
    </label>
  )
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

/**
 * Purpose: Executes RequestBuilder functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: April 2026
 */
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
      <div className="flex h-full flex-col items-center justify-center gap-2 px-6 text-center">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
          <Send className="h-4 w-4 text-gray-400" />
        </div>
        <p className="text-sm font-medium text-gray-500">Select an endpoint</p>
        <p className="text-xs text-gray-400">Choose from the list on the left to get started</p>
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
    <div className="flex h-full flex-col overflow-y-auto">
      {/* Endpoint summary */}
      <div className="border-b border-gray-100 p-4">
        <div className="mb-1 flex items-center gap-2">
          <span
            className={`rounded px-2 py-0.5 text-[10px] font-bold ${
              METHOD_STYLES[endpoint.method] ?? 'bg-gray-500 text-white'
            }`}
          >
            {endpoint.method}
          </span>
          <code className="font-mono text-xs text-gray-500">{endpoint.path}</code>
        </div>
        <h3 className="text-sm font-semibold text-gray-900">{endpoint.summary}</h3>
        {endpoint.description && (
          <p className="mt-0.5 text-xs text-gray-400">{endpoint.description}</p>
        )}
        {endpoint.credits && (
          <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-600">
            {endpoint.credits}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-4 p-4">
        {/* URL bar */}
        <div>
          <FieldLabel>Request URL</FieldLabel>
          <div className="flex min-h-9 items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
            <span
              className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold ${
                METHOD_STYLES[endpoint.method] ?? 'bg-gray-500 text-white'
              }`}
            >
              {endpoint.method}
            </span>
            <code className="flex-1 break-all font-mono text-xs text-gray-600">
              {fullUrl || '—'}
            </code>
          </div>
        </div>

        {/* API Key */}
        <div>
          <FieldLabel>
            API Key <span className="text-red-400 normal-case">*</span>
          </FieldLabel>
          <input
            type="password"
            value={apiKey}
            onChange={e => onApiKeyChange(e.target.value)}
            placeholder="Paste your API key here…"
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 font-mono text-sm shadow-sm transition-colors focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400"
          />
          <p className="mt-1 text-[11px] text-gray-400">Not stored — only used for this request.</p>
        </div>

        {/* Path Params */}
        {pathParamDefs.length > 0 && (
          <div>
            <FieldLabel>Path Parameters</FieldLabel>
            <div className="space-y-2">
              {pathParamDefs.map(param => (
                <div key={param.name} className="flex items-center gap-2">
                  <code className="w-24 shrink-0 rounded bg-gray-100 px-2 py-1.5 text-xs font-mono text-indigo-600">
                    {param.name}
                  </code>
                  <input
                    type="text"
                    value={pathParams[param.name] ?? ''}
                    onChange={e => onPathParamChange(param.name, e.target.value)}
                    placeholder={param.example ?? param.description}
                    className="flex-1 rounded-md border border-gray-200 px-2 py-1.5 text-sm shadow-sm focus:border-indigo-400 focus:outline-none"
                  />
                  {param.required && (
                    <span className="shrink-0 text-[11px] text-red-400">required</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Query Params */}
        {queryParamDefs.length > 0 && (
          <div>
            <FieldLabel>Query Parameters</FieldLabel>
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
                    className="flex-1 rounded-md border border-gray-200 px-2 py-1.5 text-sm shadow-sm focus:border-indigo-400 focus:outline-none"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Request Body */}
        {hasBody && (
          <div>
            <FieldLabel>
              Request Body <span className="normal-case text-gray-400">(JSON)</span>
            </FieldLabel>
            <textarea
              value={requestBody}
              onChange={e => onBodyChange(e.target.value)}
              rows={8}
              spellCheck={false}
              className="w-full resize-y rounded-lg border border-gray-200 bg-gray-900 p-3 font-mono text-xs leading-relaxed text-green-300 shadow-sm focus:border-indigo-400 focus:outline-none"
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
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 active:bg-indigo-800 disabled:cursor-not-allowed disabled:opacity-40"
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
    </div>
  )
}
