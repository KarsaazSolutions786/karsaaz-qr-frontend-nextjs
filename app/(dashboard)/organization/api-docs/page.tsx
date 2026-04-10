'use client'

import { useState } from 'react'
import { ChevronDown, ChevronRight, Copy, Check, Download, ExternalLink } from 'lucide-react'

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

interface EndpointParam {
  name: string
  in: 'path' | 'query' | 'body'
  required?: boolean
  type: string
  description: string
  example?: string
}

interface Endpoint {
  method: HttpMethod
  path: string
  summary: string
  description?: string
  credits?: string
  params?: EndpointParam[]
  bodyExample?: object
  responseExample?: object
}

interface ApiSection {
  tag: string
  description: string
  endpoints: Endpoint[]
}

// ─── API Definition ─────────────────────────────────────────────────────────

const BASE_URL = '/api'

const API_SECTIONS: ApiSection[] = [
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

// ─── Method badge ─────────────────────────────────────────────────────────────

const METHOD_COLORS: Record<HttpMethod, string> = {
  GET: 'bg-blue-100 text-blue-700',
  POST: 'bg-green-100 text-green-700',
  PUT: 'bg-yellow-100 text-yellow-700',
  PATCH: 'bg-orange-100 text-orange-700',
  DELETE: 'bg-red-100 text-red-700',
}

function MethodBadge({ method }: { method: HttpMethod }) {
  return (
    <span className={`rounded px-2 py-0.5 text-xs font-bold font-mono ${METHOD_COLORS[method]}`}>
      {method}
    </span>
  )
}

// ─── Copy button ──────────────────────────────────────────────────────────────

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }
  return (
    <button onClick={copy} className="text-gray-400 hover:text-gray-700 transition-colors">
      {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
    </button>
  )
}

// ─── Code block ───────────────────────────────────────────────────────────────

function CodeBlock({ code, lang = 'json' }: { code: string; lang?: string }) {
  return (
    <div className="relative">
      <div className="flex items-center justify-between rounded-t-lg bg-gray-800 px-3 py-1.5">
        <span className="text-xs text-gray-400">{lang}</span>
        <CopyButton text={code} />
      </div>
      <pre className="overflow-x-auto rounded-b-lg bg-gray-900 p-4 text-xs leading-relaxed text-green-300">
        <code>{code}</code>
      </pre>
    </div>
  )
}

// ─── Single endpoint card ─────────────────────────────────────────────────────

function EndpointCard({ endpoint }: { endpoint: Endpoint }) {
  const [open, setOpen] = useState(false)

  const curlExample = [
    `curl -X ${endpoint.method} \\`,
    `  "${BASE_URL}${endpoint.path.replace(/{(\w+)}/g, ':$1')}" \\`,
    `  -H "Authorization: Bearer kq_YOUR_API_KEY" \\`,
    `  -H "Content-Type: application/json"`,
    endpoint.bodyExample ? `  -d '${JSON.stringify(endpoint.bodyExample, null, 2)}'` : null,
  ]
    .filter(Boolean)
    .join('\n')

  const pathParams = endpoint.params?.filter(p => p.in === 'path') ?? []
  const queryParams = endpoint.params?.filter(p => p.in === 'query') ?? []

  return (
    <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
      <button
        className="flex w-full items-center justify-between gap-3 px-5 py-3.5 text-left hover:bg-gray-50 transition-colors"
        onClick={() => setOpen(v => !v)}
      >
        <div className="flex items-center gap-3 min-w-0">
          <MethodBadge method={endpoint.method} />
          <code className="text-sm font-mono text-gray-700 truncate">{endpoint.path}</code>
          <span className="text-sm text-gray-500 hidden md:block">{endpoint.summary}</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {endpoint.credits && (
            <span className="hidden sm:block rounded-full bg-indigo-50 px-2 py-0.5 text-xs text-indigo-600 font-medium">
              {endpoint.credits}
            </span>
          )}
          {open ? (
            <ChevronDown className="h-4 w-4 text-gray-400" />
          ) : (
            <ChevronRight className="h-4 w-4 text-gray-400" />
          )}
        </div>
      </button>

      {open && (
        <div className="border-t px-5 py-5 space-y-5">
          {endpoint.description && <p className="text-sm text-gray-600">{endpoint.description}</p>}

          {pathParams.length > 0 && (
            <div>
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Path Parameters
              </h4>
              <div className="space-y-1">
                {pathParams.map(p => (
                  <div key={p.name} className="flex items-start gap-3 text-sm">
                    <code className="w-24 shrink-0 font-mono text-indigo-600">{p.name}</code>
                    <span className="w-14 shrink-0 text-xs text-gray-400">{p.type}</span>
                    <span className="text-gray-600">{p.description}</span>
                    {p.required && <span className="text-red-400 text-xs">required</span>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {queryParams.length > 0 && (
            <div>
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Query Parameters
              </h4>
              <div className="space-y-1">
                {queryParams.map(p => (
                  <div key={p.name} className="flex items-start gap-3 text-sm">
                    <code className="w-24 shrink-0 font-mono text-indigo-600">{p.name}</code>
                    <span className="w-14 shrink-0 text-xs text-gray-400">{p.type}</span>
                    <span className="text-gray-600">{p.description}</span>
                    {p.example && (
                      <span className="text-gray-400 text-xs italic">e.g. {p.example}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            {endpoint.bodyExample && (
              <div>
                <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Request Body
                </h4>
                <CodeBlock lang="json" code={JSON.stringify(endpoint.bodyExample, null, 2)} />
              </div>
            )}
            {endpoint.responseExample && (
              <div>
                <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Response (200)
                </h4>
                <CodeBlock lang="json" code={JSON.stringify(endpoint.responseExample, null, 2)} />
              </div>
            )}
          </div>

          <div>
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
              cURL Example
            </h4>
            <CodeBlock lang="bash" code={curlExample} />
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ApiDocsPage() {
  return (
    <div className="max-w-4xl">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">API Reference</h1>
          <p className="mt-1 text-sm text-gray-500">
            Base URL:{' '}
            <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs font-mono">{BASE_URL}</code>
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <a
            href="/api-spec/organization-v1.yaml"
            download
            className="flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
          >
            <Download className="h-4 w-4" />
            OpenAPI Spec
          </a>
          <a
            href="/api-spec/organization-v1.yaml"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
          >
            <ExternalLink className="h-4 w-4" />
            Raw YAML
          </a>
        </div>
      </div>

      {/* Auth banner */}
      <div className="mb-8 rounded-xl border border-indigo-100 bg-indigo-50 p-4">
        <h2 className="mb-1 font-semibold text-indigo-900 text-sm">Authentication</h2>
        <p className="text-sm text-indigo-700 mb-2">
          All requests require a Bearer API key in the{' '}
          <code className="font-mono bg-indigo-100 px-1 rounded">Authorization</code> header.
        </p>
        <CodeBlock
          lang="bash"
          code={`curl -H "Authorization: Bearer kq_YOUR_API_KEY" ${BASE_URL}/v1/org/account`}
        />
      </div>

      {/* Response headers info */}
      <div className="mb-8 rounded-xl border bg-white p-4 shadow-sm">
        <h2 className="mb-3 font-semibold text-gray-800 text-sm">Response Headers</h2>
        <div className="grid gap-2 text-sm md:grid-cols-2">
          {[
            ['X-Credits-Consumed', 'Credits deducted for this call'],
            ['X-Credits-Balance', 'Remaining balance after deduction'],
            ['X-RateLimit-Limit', 'Requests allowed per minute'],
            ['X-RateLimit-Remaining', 'Requests remaining this window'],
          ].map(([header, desc]) => (
            <div key={header} className="flex items-start gap-2">
              <code className="shrink-0 rounded bg-gray-100 px-1.5 py-0.5 text-xs font-mono text-indigo-600">
                {header}
              </code>
              <span className="text-gray-500 text-xs">{desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Error codes */}
      <div className="mb-8 rounded-xl border bg-white p-4 shadow-sm">
        <h2 className="mb-3 font-semibold text-gray-800 text-sm">Error Codes</h2>
        <div className="space-y-1.5 text-sm">
          {[
            ['401', 'red', 'Unauthorized — Invalid or missing API key'],
            ['402', 'orange', 'Payment Required — Insufficient credits'],
            ['404', 'yellow', 'Not Found — Resource does not exist or belong to your org'],
            ['422', 'blue', 'Unprocessable — Validation failed (see errors in response)'],
            ['429', 'purple', 'Too Many Requests — Rate limit exceeded (see Retry-After header)'],
          ].map(([code, color, desc]) => (
            <div key={code} className="flex items-start gap-3">
              <span
                className={`shrink-0 rounded px-2 py-0.5 text-xs font-bold bg-${color}-100 text-${color}-700`}
              >
                {code}
              </span>
              <span className="text-gray-600">{desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Sections */}
      {API_SECTIONS.map(section => (
        <div key={section.tag} className="mb-10">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-gray-900">{section.tag}</h2>
            <p className="text-sm text-gray-500">{section.description}</p>
          </div>
          <div className="space-y-3">
            {section.endpoints.map(ep => (
              <EndpointCard key={`${ep.method}-${ep.path}`} endpoint={ep} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
