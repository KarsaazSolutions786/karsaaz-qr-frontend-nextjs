import { envConfig } from '@/lib/config/env-config'

export interface RpcCallDef {
  method: string
  params?: Record<string, unknown>
}

export interface RpcResult<T = unknown> {
  error: RpcError | null
  result: T | null
}

export interface RpcOptions {
  public?: boolean
  skipDedup?: boolean
  signal?: AbortSignal
}

interface JsonRpcRequest {
  jsonrpc: '2.0'
  method: string
  params: Record<string, unknown>
  id: number
}

interface JsonRpcResponse {
  jsonrpc: '2.0'
  id: number | null
  result?: unknown
  error?: { code: number; message: string; data?: unknown }
}

let _nextId = 1
const _dedupCache = new Map<string, { result: unknown; ts: number }>()
const DEDUP_WINDOW_MS = 15000


export async function rpc<T = unknown>(
  method: string,
  params: Record<string, unknown> = {},
  options: RpcOptions = {}
): Promise<T> {
  // Dedup check
  if (!options.skipDedup) {
    const key = _dedupKey(method, params)
    const cached = _dedupCache.get(key)
    if (cached && Date.now() - cached.ts < DEDUP_WINDOW_MS) {
      return cached.result as T
    }
  }

  const id = _nextId++
  const body: JsonRpcRequest = { jsonrpc: '2.0', method, params, id }

  const response = (await _rpcFetch(body, options.public, options.signal)) as JsonRpcResponse

  if (response.error) {
    throw new RpcError(response.error.code, response.error.message, response.error.data)
  }

  const result = response.result as T

  // Cache for dedup
  if (!options.skipDedup) {
    const key = _dedupKey(method, params)
    _dedupCache.set(key, { result, ts: Date.now() })
  }

  return result
}

export async function rpcBatch(
  calls: RpcCallDef[],
  options: RpcOptions = {}
): Promise<Map<string, RpcResult>> {
  if (!calls.length) return new Map()

  const requests: JsonRpcRequest[] = calls.map(call => ({
    jsonrpc: '2.0' as const,
    method: call.method,
    params: call.params || {},
    id: _nextId++,
  }))

  const idToCall = new Map<number, string>()
  requests.forEach((req, i) => {
    idToCall.set(req.id, calls[i]!.method)
  })

  const raw = await _rpcFetch(requests, options.public, options.signal)

  const resultMap = new Map<string, RpcResult>()

  if (!Array.isArray(raw)) {
    const resp = raw as JsonRpcResponse
    const error = resp.error
      ? new RpcError(resp.error.code, resp.error.message, resp.error.data)
      : new RpcError(-32603, 'Invalid batch response')

    for (const call of calls) {
      resultMap.set(call.method, { error, result: null })
    }
    return resultMap
  }

  const byId = new Map<number, JsonRpcResponse>()
  for (const resp of raw as JsonRpcResponse[]) {
    if (resp && resp.id != null) {
      byId.set(resp.id, resp)
    }
  }
  for (const [id, method] of idToCall) {
    const resp = byId.get(id)
    if (!resp) {
      resultMap.set(method, {
        error: new RpcError(-32603, 'No response for method'),
        result: null,
      })
    } else if (resp.error) {
      resultMap.set(method, {
        error: new RpcError(resp.error.code, resp.error.message, resp.error.data),
        result: null,
      })
    } else {
      resultMap.set(method, { error: null, result: resp.result })
    }
  }

  return resultMap
}


export async function rpcComposite<T = unknown>(
  name: string,
  params: Record<string, unknown> = {},
  options: RpcOptions = {}
): Promise<T> {
  return rpc<T>(`compose.${name}`, params, options)
}


export function rpcClearCache(): void {
  _dedupCache.clear()
}


function _getBaseUrl(): string {
  if (typeof window !== 'undefined' && (window as unknown as Record<string, unknown>).BACKEND_URL) {
    return `${(window as unknown as Record<string, unknown>).BACKEND_URL}`
  }
  return envConfig.API_URL
}

async function _rpcFetch(
  body: JsonRpcRequest | JsonRpcRequest[],
  isPublic = false,
  signal?: AbortSignal
): Promise<unknown> {
  const baseUrl = _getBaseUrl()
  const endpoint = isPublic ? '/api/rpc/public' : '/api/rpc'
  const url = `${baseUrl}${endpoint}`

  const headers: Record<string, string> = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  }
  if (!isPublic && typeof window !== 'undefined') {
    const token = localStorage.getItem('token')
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
  }

  const response = await fetch(url, {
    method: 'POST',
    credentials: 'include', // Send httpOnly cookies
    headers,
    body: JSON.stringify(body),
    signal,
  })

  if (!response.ok && response.status === 401) {
    throw new RpcError(-32000, 'Authentication required')
  }

  if (!response.ok && response.status === 429) {
    throw new RpcError(-32004, 'Rate limit exceeded')
  }

  return response.json()
}

function _dedupKey(method: string, params: Record<string, unknown>): string {
  return `${method}:${JSON.stringify(params || {})}`
}

export class RpcError extends Error {
  code: number
  data: unknown

  constructor(code: number, message: string, data?: unknown) {
    super(message)
    this.name = 'RpcError'
    this.code = code
    this.data = data ?? null
  }

  get isAuthError(): boolean {
    return this.code === -32000
  }

  get isForbidden(): boolean {
    return this.code === -32001
  }

  get isNotFound(): boolean {
    return this.code === -32002
  }

  get isValidation(): boolean {
    return this.code === -32003
  }

  get isRateLimited(): boolean {
    return this.code === -32004
  }

  get isMethodNotFound(): boolean {
    return this.code === -32601
  }
}
