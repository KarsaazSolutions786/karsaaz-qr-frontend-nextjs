const DEFAULT_BASE_URL = 'https://api.karsaazqr.com'

export interface QRCode {
  id: string
  type: string
  content: string
  name?: string
  scan_count: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface CreateQRCodeOptions {
  type: string
  content: string
  name?: string
  design?: Record<string, unknown>
}

export interface ListQRCodesOptions {
  page?: number
  limit?: number
  keyword?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    current_page: number
    per_page: number
    total: number
    last_page: number
  }
}

export interface CreditsBalance {
  balance: number
  lifetime_purchased: number
  lifetime_spent: number
}

export interface ScanResult {
  scanned: boolean
  qrcode: QRCode
}

class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly body: unknown,
    message: string
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export class KarsaazQr {
  private readonly apiKey: string
  private readonly baseUrl: string

  constructor(apiKey: string, options: { baseUrl?: string } = {}) {
    if (!apiKey) throw new Error('apiKey is required')
    this.apiKey = apiKey
    this.baseUrl = (options.baseUrl ?? DEFAULT_BASE_URL).replace(/\/$/, '')
  }

  private async request<T>(method: string, path: string, body?: unknown): Promise<T> {
    const url = `${this.baseUrl}/api/v1/org${path}`
    const res = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })

    const json = await res.json().catch(() => ({}))

    if (!res.ok) {
      throw new ApiError(res.status, json, (json as any)?.error ?? `HTTP ${res.status}`)
    }

    return (json as { data: T }).data ?? (json as T)
  }

  readonly qrcodes = {
    list: (opts: ListQRCodesOptions = {}): Promise<PaginatedResponse<QRCode>> => {
      const params = new URLSearchParams()
      if (opts.page !== undefined) params.set('page', String(opts.page))
      if (opts.limit !== undefined) params.set('page_size', String(opts.limit))
      if (opts.keyword) params.set('keyword', opts.keyword)
      const qs = params.toString()
      return this.request<PaginatedResponse<QRCode>>('GET', `/qrcodes${qs ? `?${qs}` : ''}`)
    },

    create: (options: CreateQRCodeOptions): Promise<QRCode> =>
      this.request<QRCode>('POST', '/qrcodes', options),

    get: (id: string): Promise<QRCode> => this.request<QRCode>('GET', `/qrcodes/${id}`),

    update: (id: string, options: Partial<CreateQRCodeOptions>): Promise<QRCode> =>
      this.request<QRCode>('PATCH', `/qrcodes/${id}`, options),

    delete: (id: string): Promise<void> => this.request<void>('DELETE', `/qrcodes/${id}`),
  }

  readonly credits = {
    balance: (): Promise<CreditsBalance> => this.request<CreditsBalance>('GET', '/credits'),
  }
}

export { ApiError }
export default KarsaazQr
