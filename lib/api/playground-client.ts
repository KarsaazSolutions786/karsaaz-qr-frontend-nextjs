// lib/api/playground-client.ts
//
// Isolated Axios instance for the API Playground.
// - Sends Authorization: Bearer {token} — NOT the session cookie
// - withCredentials: false  (no cookie)
// - Never redirects on 401 — surface the error response directly
// - Captures response time and raw headers for display

import axios, { type AxiosRequestConfig } from 'axios'
import { envConfig } from '@/lib/config/env-config'

export interface PlaygroundResponse {
  status: number
  statusText: string
  durationMs: number
  data: unknown
  headers: Record<string, string>
  error: boolean
}

export async function sendPlaygroundRequest({
  method,
  fullUrl,
  apiKey,
  body,
}: {
  method: string
  fullUrl: string
  apiKey: string
  body: string
}): Promise<PlaygroundResponse> {
  // Guard: only allow requests to our own API origin
  const expectedOrigin = new URL(envConfig.API_URL).origin
  if (!fullUrl.startsWith(expectedOrigin)) {
    return {
      status: 0,
      statusText: 'Blocked',
      durationMs: 0,
      data: { error: `Playground requests must target ${expectedOrigin}` },
      headers: {},
      error: true,
    }
  }

  const hasBody = body.trim() !== '' && method !== 'GET' && method !== 'DELETE'

  const config: AxiosRequestConfig = {
    method,
    url: fullUrl,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      Accept: 'application/json',
      ...(hasBody ? { 'Content-Type': 'application/json' } : {}),
    },
    withCredentials: false,
    validateStatus: () => true, // never throw — surface all HTTP statuses
    timeout: 30_000,
    ...(hasBody
      ? {
          data: (() => {
            try {
              return JSON.parse(body)
            } catch {
              return body
            }
          })(),
        }
      : {}),
  }

  const start = performance.now()
  try {
    const res = await axios(config)
    const durationMs = Math.round(performance.now() - start)

    // Flatten response headers to plain string Record
    const headers: Record<string, string> = {}
    Object.entries(res.headers).forEach(([k, v]) => {
      if (typeof v === 'string') headers[k] = v
    })

    return {
      status: res.status,
      statusText: res.statusText,
      durationMs,
      data: res.data,
      headers,
      error: res.status >= 400,
    }
  } catch (err: unknown) {
    const durationMs = Math.round(performance.now() - start)
    return {
      status: 0,
      statusText: 'Network Error',
      durationMs,
      data: { error: err instanceof Error ? err.message : 'Unknown network error' },
      headers: {},
      error: true,
    }
  }
}
