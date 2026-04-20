// lib/constants/playground-endpoints.ts

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export interface EndpointParam {
  name: string
  in: 'path' | 'query' | 'body'
  required?: boolean
  type: string
  description: string
  example?: string
}

export interface PlaygroundEndpoint {
  method: HttpMethod
  path: string
  summary: string
  description?: string
  credits?: string
  params?: EndpointParam[]
  bodyExample?: Record<string, unknown>
  responseExample?: Record<string, unknown>
}

export interface PlaygroundSection {
  tag: string
  description: string
  endpoints: PlaygroundEndpoint[]
}

// ── USER API (/api/v1/*) ──────────────────────────────────────────────────────

export const USER_API_BASE_PATH = '/v1'

export const USER_API_SECTIONS: PlaygroundSection[] = [
  {
    tag: 'Account',
    description: 'Retrieve your account profile and plan information.',
    endpoints: [
      {
        method: 'GET',
        path: '/account',
        summary: 'Get account info',
        description: 'Returns your user profile, active plan, and API limits.',
        credits: '1 credit',
        responseExample: {
          data: {
            id: 1,
            name: 'John Doe',
            email: 'john@example.com',
            plan: 'Pro',
            api_monthly_requests: -1,
            api_rate_limit_per_minute: 120,
          },
        },
      },
    ],
  },
  {
    tag: 'Usage',
    description: 'Monitor your API call volume and credit consumption.',
    endpoints: [
      {
        method: 'GET',
        path: '/usage',
        summary: 'Get usage summary',
        description: 'Aggregate call stats and a daily trend chart for the given period.',
        credits: '1 credit',
        params: [
          {
            name: 'period',
            in: 'query',
            type: 'string',
            description: 'Time window',
            example: '7d | 30d | 90d',
          },
        ],
        responseExample: {
          data: {
            period: '30d',
            total_requests: 348,
            success_count: 345,
            error_count: 3,
            daily_trend: [{ date: '2026-03-10', requests: 12 }],
          },
        },
      },
    ],
  },
  {
    tag: 'QR Codes',
    description: 'Full CRUD operations on your QR codes.',
    endpoints: [
      {
        method: 'GET',
        path: '/qrcodes',
        summary: 'List QR codes',
        description: 'Returns a paginated list of your QR codes.',
        credits: '1 credit',
        params: [
          {
            name: 'type',
            in: 'query',
            type: 'string',
            description: 'Filter by QR type',
            example: 'url',
          },
          {
            name: 'search',
            in: 'query',
            type: 'string',
            description: 'Partial title search',
            example: 'promo',
          },
          {
            name: 'per_page',
            in: 'query',
            type: 'integer',
            description: 'Items per page (max 100)',
            example: '15',
          },
          { name: 'page', in: 'query', type: 'integer', description: 'Page number', example: '1' },
        ],
        responseExample: {
          data: [{ id: 1, title: 'My QR', type: 'url', is_dynamic: true, status: 'active' }],
          meta: { current_page: 1, per_page: 15, total: 10, last_page: 1 },
        },
      },
      {
        method: 'POST',
        path: '/qrcodes',
        summary: 'Create a QR code',
        description: 'Creates a new QR code under your account.',
        credits: '2 credits',
        bodyExample: {
          title: 'My Promo',
          type: 'url',
          data: { url: 'https://example.com/promo' },
          is_dynamic: true,
        },
        responseExample: {
          data: {
            id: 42,
            title: 'My Promo',
            type: 'url',
            is_dynamic: true,
            status: 'active',
            created_at: '2026-04-08T10:00:00Z',
          },
        },
      },
      {
        method: 'GET',
        path: '/qrcodes/{id}',
        summary: 'Get a QR code',
        credits: '1 credit',
        params: [
          { name: 'id', in: 'path', required: true, type: 'integer', description: 'QR code ID' },
        ],
        responseExample: {
          data: { id: 42, title: 'My Promo', type: 'url', is_dynamic: true, status: 'active' },
        },
      },
      {
        method: 'PATCH',
        path: '/qrcodes/{id}',
        summary: 'Update a QR code',
        credits: '1 credit',
        params: [
          { name: 'id', in: 'path', required: true, type: 'integer', description: 'QR code ID' },
        ],
        bodyExample: { title: 'Updated Title', status: 'inactive' },
        responseExample: {
          data: { id: 42, title: 'Updated Title', status: 'inactive' },
        },
      },
      {
        method: 'DELETE',
        path: '/qrcodes/{id}',
        summary: 'Delete a QR code',
        credits: '1 credit',
        params: [
          { name: 'id', in: 'path', required: true, type: 'integer', description: 'QR code ID' },
        ],
        responseExample: { message: 'QR code deleted.' },
      },
      {
        method: 'GET',
        path: '/qrcodes/{id}/analytics',
        summary: 'Get scan analytics',
        description: 'Returns daily scan counts for the QR code.',
        credits: '1 credit',
        params: [
          { name: 'id', in: 'path', required: true, type: 'integer', description: 'QR code ID' },
          {
            name: 'period',
            in: 'query',
            type: 'string',
            description: 'Time window',
            example: '30d',
          },
        ],
        responseExample: {
          data: {
            qr_code_id: 42,
            period: '30d',
            total_scans: 847,
            daily: [{ date: '2026-04-07', scans: 33 }],
          },
        },
      },
    ],
  },
]

// ── ORG API (/api/v1/org/*) ───────────────────────────────────────────────────

export const ORG_API_BASE_PATH = '/v1/org'

export const ORG_API_SECTIONS: PlaygroundSection[] = [
  {
    tag: 'Account',
    description: 'Retrieve organization profile and identity.',
    endpoints: [
      {
        method: 'GET',
        path: '/v1/org/account',
        summary: 'Get organization profile',
        description: "Returns the organization's name, slug, plan, status, and credit overview.",
        credits: '1 credit',
        responseExample: {
          data: {
            id: 1,
            name: 'Acme Corp',
            slug: 'acme-corp',
            status: 'active',
            plan: 'Pro',
            credits: { balance: 980.0, lifetime_purchased: 1000.0, lifetime_spent: 20.0 },
          },
        },
      },
    ],
  },
  {
    tag: 'Usage',
    description: 'Monitor API call volume and credit consumption.',
    endpoints: [
      {
        method: 'GET',
        path: '/v1/org/usage',
        summary: 'Get usage summary',
        description: 'Aggregate call stats and a daily trend chart for the given period.',
        credits: '1 credit',
        params: [
          {
            name: 'period',
            in: 'query',
            type: 'string',
            description: 'Time window',
            example: '7d | 30d | 90d | 365d',
          },
        ],
        responseExample: {
          data: {
            period: '30d',
            total_requests: 542,
            total_credits: 1084.0,
            avg_response_ms: 87,
            success_count: 538,
            error_count: 4,
            daily_trend: [{ date: '2026-03-10', requests: 18, credits: 36 }],
          },
        },
      },
      {
        method: 'GET',
        path: '/v1/org/usage/breakdown',
        summary: 'Get per-endpoint breakdown',
        description: 'Calls and credits grouped by endpoint and HTTP method.',
        credits: '1 credit',
        params: [
          {
            name: 'period',
            in: 'query',
            type: 'string',
            description: 'Time window',
            example: '30d',
          },
        ],
        responseExample: {
          data: {
            period: '30d',
            endpoints: [
              {
                endpoint: '/v1/org/qrcodes',
                http_method: 'GET',
                calls: 120,
                credits_consumed: 120,
                avg_response_ms: 45,
                errors: 0,
              },
            ],
          },
        },
      },
      {
        method: 'GET',
        path: '/v1/org/credits',
        summary: 'Get credit balance',
        description: 'Current balance, lifetime stats, and the 20 most recent transactions.',
        credits: '1 credit',
        responseExample: {
          data: {
            balance: 980.0,
            lifetime_purchased: 1000.0,
            lifetime_spent: 20.0,
            recent_transactions: [
              {
                amount: -2,
                type: 'consumption',
                description: 'qrcode.create.dynamic',
                balance_after: 980,
                created_at: '2026-04-07T12:00:00Z',
              },
            ],
          },
        },
      },
    ],
  },
  {
    tag: 'QR Codes',
    description: 'Full CRUD operations on QR codes owned by your organization.',
    endpoints: [
      {
        method: 'GET',
        path: '/v1/org/qrcodes',
        summary: 'List QR codes',
        description: 'Returns a paginated list of QR codes belonging to the organization.',
        credits: '1 credit',
        params: [
          {
            name: 'type',
            in: 'query',
            type: 'string',
            description: 'Filter by QR type',
            example: 'url',
          },
          {
            name: 'search',
            in: 'query',
            type: 'string',
            description: 'Partial title search',
            example: 'promo',
          },
          {
            name: 'per_page',
            in: 'query',
            type: 'integer',
            description: 'Items per page (max 100)',
            example: '15',
          },
          { name: 'page', in: 'query', type: 'integer', description: 'Page number', example: '1' },
        ],
        responseExample: {
          data: [{ id: 1, title: 'Promo QR', type: 'url', is_dynamic: true, status: 'active' }],
          meta: { current_page: 1, per_page: 15, total: 42, last_page: 3 },
        },
      },
      {
        method: 'POST',
        path: '/v1/org/qrcodes',
        summary: 'Create a QR code',
        description: 'Creates a new QR code. Consumes qrcode.create.dynamic credits.',
        credits: '2 credits',
        bodyExample: {
          title: 'Summer Promo',
          type: 'url',
          content: { url: 'https://example.com/promo' },
          is_dynamic: true,
        },
        responseExample: {
          data: {
            id: 42,
            title: 'Summer Promo',
            type: 'url',
            is_dynamic: true,
            status: 'active',
            created_at: '2026-04-08T10:00:00Z',
          },
        },
      },
      {
        method: 'POST',
        path: '/v1/org/qrcodes/bulk',
        summary: 'Bulk create QR codes',
        description: 'Creates up to 50 QR codes in a single request. Credits charged per item.',
        credits: '2 credits × count',
        bodyExample: {
          items: [
            { title: 'QR Alpha', type: 'url', content: { url: 'https://example.com/alpha' } },
            { title: 'QR Beta', type: 'url', content: { url: 'https://example.com/beta' } },
          ],
        },
        responseExample: {
          data: [
            { id: 43, title: 'QR Alpha' },
            { id: 44, title: 'QR Beta' },
          ],
          count: 2,
        },
      },
      {
        method: 'GET',
        path: '/v1/org/qrcodes/{id}',
        summary: 'Get a QR code',
        credits: '1 credit',
        params: [
          { name: 'id', in: 'path', required: true, type: 'integer', description: 'QR code ID' },
        ],
        responseExample: {
          data: { id: 42, title: 'Summer Promo', type: 'url', is_dynamic: true, status: 'active' },
        },
      },
      {
        method: 'PATCH',
        path: '/v1/org/qrcodes/{id}',
        summary: 'Update a QR code',
        credits: '1 credit',
        params: [
          { name: 'id', in: 'path', required: true, type: 'integer', description: 'QR code ID' },
        ],
        bodyExample: { title: 'Updated Title', status: 'inactive' },
        responseExample: {
          data: { id: 42, title: 'Updated Title', status: 'inactive' },
        },
      },
      {
        method: 'DELETE',
        path: '/v1/org/qrcodes/{id}',
        summary: 'Delete a QR code',
        credits: '1 credit',
        params: [
          { name: 'id', in: 'path', required: true, type: 'integer', description: 'QR code ID' },
        ],
        responseExample: { message: 'QR code deleted.' },
      },
      {
        method: 'GET',
        path: '/v1/org/qrcodes/{id}/analytics',
        summary: 'Get scan analytics',
        description: 'Returns daily scan counts for the QR code in the requested period.',
        credits: '1 credit',
        params: [
          { name: 'id', in: 'path', required: true, type: 'integer', description: 'QR code ID' },
          {
            name: 'period',
            in: 'query',
            type: 'string',
            description: 'Time window',
            example: '30d',
          },
        ],
        responseExample: {
          data: {
            qr_code_id: 42,
            period: '30d',
            total_scans: 1847,
            daily: [{ date: '2026-04-07', scans: 63 }],
          },
        },
      },
    ],
  },
]
