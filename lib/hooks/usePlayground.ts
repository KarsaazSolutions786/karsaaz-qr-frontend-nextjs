'use client'

import { useState, useCallback, useMemo } from 'react'
import type { PlaygroundEndpoint, PlaygroundSection } from '@/lib/constants/playground-endpoints'
import { buildFullUrl } from '@/lib/utils/playground-helpers'
import { sendPlaygroundRequest, type PlaygroundResponse } from '@/lib/api/playground-client'
import { envConfig } from '@/lib/config/env-config'

export interface HistoryEntry {
  id: string
  method: string
  url: string
  status: number
  durationMs: number
  timestamp: Date
  response: PlaygroundResponse
}

export function usePlayground(sections: PlaygroundSection[], basePath: string) {
  const [selectedEndpoint, setSelectedEndpoint] = useState<PlaygroundEndpoint | null>(
    sections[0]?.endpoints[0] ?? null
  )
  const [apiKey, setApiKey] = useState('')
  const [pathParams, setPathParams] = useState<Record<string, string>>({})
  const [queryParams, setQueryParams] = useState<Record<string, string>>({})
  const [requestBody, setRequestBody] = useState('')
  const [response, setResponse] = useState<PlaygroundResponse | null>(null)
  const [isSending, setIsSending] = useState(false)
  const [history, setHistory] = useState<HistoryEntry[]>([])

  // When endpoint changes: reset params, pre-fill examples and body
  const selectEndpoint = useCallback((endpoint: PlaygroundEndpoint) => {
    setSelectedEndpoint(endpoint)
    setResponse(null)

    const newPathParams: Record<string, string> = {}
    endpoint.params
      ?.filter(p => p.in === 'path')
      .forEach(p => {
        newPathParams[p.name] = p.example ?? ''
      })
    setPathParams(newPathParams)

    const newQueryParams: Record<string, string> = {}
    endpoint.params
      ?.filter(p => p.in === 'query')
      .forEach(p => {
        newQueryParams[p.name] = ''
      })
    setQueryParams(newQueryParams)

    if (endpoint.bodyExample && ['POST', 'PUT', 'PATCH'].includes(endpoint.method)) {
      setRequestBody(JSON.stringify(endpoint.bodyExample, null, 2))
    } else {
      setRequestBody('')
    }
  }, [])

  // Build the full URL reactively
  const fullUrl = useMemo(() => {
    if (!selectedEndpoint) return ''
    return buildFullUrl(envConfig.API_URL, basePath, selectedEndpoint.path, pathParams, queryParams)
  }, [selectedEndpoint, pathParams, queryParams, basePath])

  const send = useCallback(async () => {
    if (!selectedEndpoint || !apiKey.trim()) return
    setIsSending(true)
    setResponse(null)

    const result = await sendPlaygroundRequest({
      method: selectedEndpoint.method,
      fullUrl,
      apiKey: apiKey.trim(),
      body: requestBody,
    })

    setResponse(result)
    setIsSending(false)

    setHistory(prev => [
      {
        id: String(Date.now()),
        method: selectedEndpoint.method,
        url: fullUrl,
        status: result.status,
        durationMs: result.durationMs,
        timestamp: new Date(),
        response: result,
      },
      ...prev.slice(0, 19),
    ])
  }, [selectedEndpoint, apiKey, fullUrl, requestBody])

  return {
    // State
    selectedEndpoint,
    apiKey,
    pathParams,
    queryParams,
    requestBody,
    response,
    isSending,
    history,
    fullUrl,
    // Actions
    selectEndpoint,
    setApiKey,
    setPathParam: useCallback(
      (name: string, value: string) => setPathParams(prev => ({ ...prev, [name]: value })),
      []
    ),
    setQueryParam: useCallback(
      (name: string, value: string) => setQueryParams(prev => ({ ...prev, [name]: value })),
      []
    ),
    setRequestBody,
    send,
    clearResponse: useCallback(() => setResponse(null), []),
    restoreFromHistory: useCallback((entry: HistoryEntry) => setResponse(entry.response), []),
  }
}
