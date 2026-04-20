'use client'

import { useState } from 'react'
import { ChevronDown, ChevronRight, Copy, Check, Download, ExternalLink } from 'lucide-react'
import {
  ORG_API_SECTIONS,
  type PlaygroundEndpoint,
  type HttpMethod,
} from '@/lib/constants/playground-endpoints'
import { envConfig } from '@/lib/config/env-config'

// Local aliases so existing component code requires no further changes
type Endpoint = PlaygroundEndpoint

// ─── API Definition ─────────────────────────────────────────────────────────

const BASE_URL = `${envConfig.API_URL}/api/v1/org`

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
          code={`curl -H "Authorization: Bearer kq_YOUR_API_KEY" ${BASE_URL}/account`}
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
      {ORG_API_SECTIONS.map(section => (
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
