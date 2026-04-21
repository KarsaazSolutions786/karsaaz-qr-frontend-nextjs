'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ChevronDown, ChevronRight, Copy, Check, BookOpen, Key, Download } from 'lucide-react'
import apiClient from '@/lib/api/client'
import { useTranslation } from '@/lib/i18n'
import { envConfig } from '@/lib/config/env-config'
import { QR_TYPES } from '@/lib/constants/qr-types'
import { QR_TYPE_CATEGORIES } from '@/lib/constants/qr-type-categories'
import {
  USER_API_SECTIONS,
  USER_API_BASE_PATH,
  type PlaygroundEndpoint,
  type HttpMethod,
} from '@/lib/constants/playground-endpoints'
import { PlaygroundPanel } from '@/components/features/playground/PlaygroundPanel'

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface ApiKey {
  id: number
  name: string
  prefix: string
  rate_limit_per_minute: number
  is_active: boolean
  last_used_at: string | null
  expires_at: string | null
  created_at: string
}

interface PlanLimits {
  has_api_access: boolean
  api_monthly_requests: number
  api_rate_limit_per_minute: number
  monthly_requests_used: number
}

interface ApiKeysResponse {
  data: ApiKey[]
  plan_limits: PlanLimits
}

// ─── API Guide HTML generator ─────────────────────────────────────────────────

const DOCS_BASE = `${envConfig.API_URL}/api/v1`

function buildApiGuideHtml(baseUrl: string): string {
  const now = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const methodColor: Record<string, string> = {
    GET: '#2563eb',
    POST: '#16a34a',
    PUT: '#d97706',
    PATCH: '#ea580c',
    DELETE: '#dc2626',
  }
  const methodBg: Record<string, string> = {
    GET: '#dbeafe',
    POST: '#dcfce7',
    PUT: '#fef3c7',
    PATCH: '#ffedd5',
    DELETE: '#fee2e2',
  }

  const escHtml = (s: string) =>
    s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

  const badge = (method: string) =>
    `<span style="background:${methodBg[method]};color:${methodColor[method]};padding:2px 8px;border-radius:4px;font-family:monospace;font-size:11px;font-weight:700;">${method}</span>`

  const code = (txt: string) =>
    `<code style="background:#f1f5f9;color:#4f46e5;padding:2px 6px;border-radius:4px;font-size:12px;font-family:monospace;">${escHtml(txt)}</code>`

  const pre = (txt: string) =>
    `<pre style="background:#0f172a;color:#86efac;padding:16px;border-radius:8px;font-size:12px;overflow-x:auto;white-space:pre-wrap;word-break:break-all;margin:8px 0;">${escHtml(txt)}</pre>`

  const sectionHeader = (title: string, desc: string) =>
    `<div style="margin:36px 0 12px;border-left:4px solid #4f46e5;padding-left:14px;">
      <h2 style="margin:0;font-size:18px;color:#1e1b4b;">${escHtml(title)}</h2>
      <p style="margin:4px 0 0;font-size:13px;color:#64748b;">${escHtml(desc)}</p>
    </div>`

  let endpointBlocks = ''
  for (const section of USER_API_SECTIONS) {
    endpointBlocks += sectionHeader(section.tag, section.description)
    for (const ep of section.endpoints) {
      const fullPath = `${baseUrl}${ep.path}`
      const pathParams = ep.params?.filter(p => p.in === 'path') ?? []
      const queryParams = ep.params?.filter(p => p.in === 'query') ?? []
      const curlLines = [
        `curl -X ${ep.method} \\`,
        `  "${fullPath.replace(/{(\w+)}/g, ':$1')}" \\`,
        `  -H "Authorization: Bearer YOUR_API_KEY" \\`,
        `  -H "Content-Type: application/json"`,
        ep.bodyExample ? `  -d '${JSON.stringify(ep.bodyExample, null, 2)}'` : null,
      ]
        .filter(Boolean)
        .join('\n')

      endpointBlocks += `
      <div style="border:1px solid #e2e8f0;border-radius:10px;margin-bottom:16px;overflow:hidden;">
        <div style="background:#f8fafc;padding:12px 16px;display:flex;align-items:center;gap:10px;flex-wrap:wrap;">
          ${badge(ep.method)}
          <code style="font-family:monospace;font-size:13px;color:#334155;font-weight:600;">${escHtml(fullPath)}</code>
          <span style="font-size:13px;color:#64748b;margin-left:auto;">${escHtml(ep.summary)}</span>
          ${ep.credits ? `<span style="background:#eef2ff;color:#4f46e5;padding:2px 8px;border-radius:99px;font-size:11px;">${escHtml(ep.credits)}</span>` : ''}
        </div>
        <div style="padding:14px 16px;">
          ${ep.description ? `<p style="margin:0 0 10px;font-size:13px;color:#475569;">${escHtml(ep.description)}</p>` : ''}

          ${
            pathParams.length > 0
              ? `
          <p style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:#94a3b8;margin:0 0 6px;">Path Parameters</p>
          <table style="width:100%;font-size:12px;border-collapse:collapse;margin-bottom:12px;">
            <tr style="background:#f8fafc;">
              <th style="text-align:left;padding:6px 10px;border:1px solid #e2e8f0;color:#64748b;">Name</th>
              <th style="text-align:left;padding:6px 10px;border:1px solid #e2e8f0;color:#64748b;">Type</th>
              <th style="text-align:left;padding:6px 10px;border:1px solid #e2e8f0;color:#64748b;">Required</th>
              <th style="text-align:left;padding:6px 10px;border:1px solid #e2e8f0;color:#64748b;">Description</th>
            </tr>
            ${pathParams
              .map(
                p => `<tr>
              <td style="padding:6px 10px;border:1px solid #e2e8f0;">${code(p.name)}</td>
              <td style="padding:6px 10px;border:1px solid #e2e8f0;color:#64748b;">${escHtml(p.type)}</td>
              <td style="padding:6px 10px;border:1px solid #e2e8f0;color:${p.required ? '#dc2626' : '#94a3b8'};">${p.required ? 'Yes' : 'No'}</td>
              <td style="padding:6px 10px;border:1px solid #e2e8f0;color:#475569;">${escHtml(p.description)}</td>
            </tr>`
              )
              .join('')}
          </table>`
              : ''
          }

          ${
            queryParams.length > 0
              ? `
          <p style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:#94a3b8;margin:0 0 6px;">Query Parameters</p>
          <table style="width:100%;font-size:12px;border-collapse:collapse;margin-bottom:12px;">
            <tr style="background:#f8fafc;">
              <th style="text-align:left;padding:6px 10px;border:1px solid #e2e8f0;color:#64748b;">Name</th>
              <th style="text-align:left;padding:6px 10px;border:1px solid #e2e8f0;color:#64748b;">Type</th>
              <th style="text-align:left;padding:6px 10px;border:1px solid #e2e8f0;color:#64748b;">Description</th>
              <th style="text-align:left;padding:6px 10px;border:1px solid #e2e8f0;color:#64748b;">Example</th>
            </tr>
            ${queryParams
              .map(
                p => `<tr>
              <td style="padding:6px 10px;border:1px solid #e2e8f0;">${code(p.name)}</td>
              <td style="padding:6px 10px;border:1px solid #e2e8f0;color:#64748b;">${escHtml(p.type)}</td>
              <td style="padding:6px 10px;border:1px solid #e2e8f0;color:#475569;">${escHtml(p.description)}</td>
              <td style="padding:6px 10px;border:1px solid #e2e8f0;color:#94a3b8;font-family:monospace;">${p.example ? escHtml(p.example) : '—'}</td>
            </tr>`
              )
              .join('')}
          </table>`
              : ''
          }

          ${
            ep.bodyExample
              ? `
          <p style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:#94a3b8;margin:0 0 4px;">Request Body</p>
          ${pre(JSON.stringify(ep.bodyExample, null, 2))}`
              : ''
          }

          ${
            ep.responseExample
              ? `
          <p style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:#94a3b8;margin:8px 0 4px;">Response (200)</p>
          ${pre(JSON.stringify(ep.responseExample, null, 2))}`
              : ''
          }

          <p style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:#94a3b8;margin:8px 0 4px;">cURL Example</p>
          ${pre(curlLines)}
        </div>
      </div>`
    }
  }

  // QR types table
  const qrRows = QR_TYPES.map(
    t => `
    <tr style="border-bottom:1px solid #f1f5f9;">
      <td style="padding:8px 12px;font-family:monospace;font-size:12px;color:#4f46e5;font-weight:600;">${escHtml(t.id)}</td>
      <td style="padding:8px 12px;font-size:13px;color:#334155;">${escHtml(t.name)}</td>
      <td style="padding:8px 12px;text-align:center;">
        ${
          t.cat === 'dynamic'
            ? '<span style="background:#dcfce7;color:#16a34a;padding:2px 8px;border-radius:99px;font-size:11px;font-weight:600;">Dynamic</span>'
            : '<span style="background:#f1f5f9;color:#64748b;padding:2px 8px;border-radius:99px;font-size:11px;font-weight:600;">Static</span>'
        }
      </td>
      <td style="padding:8px 12px;font-size:12px;color:#64748b;">${escHtml(t.description ?? '')}</td>
    </tr>`
  ).join('')

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Karsaaz QR — API Reference Guide</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0;}
    body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;color:#1e293b;background:#f8fafc;line-height:1.6;}
    .page{max-width:900px;margin:0 auto;background:#fff;padding:48px 40px;min-height:100vh;}
    @media(max-width:640px){.page{padding:24px 16px;}}
    @media print{body{background:#fff;}.page{padding:0;max-width:100%;}}
    h1{font-size:28px;font-weight:800;color:#1e1b4b;margin-bottom:4px;}
    h3{font-size:15px;font-weight:700;color:#1e293b;margin:20px 0 8px;}
    table{width:100%;border-collapse:collapse;}
    a{color:#4f46e5;text-decoration:none;}
    hr{border:0;border-top:1px solid #e2e8f0;margin:32px 0;}
  </style>
</head>
<body>
<div class="page">

  <!-- Header -->
  <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:16px;margin-bottom:32px;padding-bottom:24px;border-bottom:2px solid #e2e8f0;">
    <div>
      <h1>Karsaaz QR — API Reference</h1>
      <p style="color:#64748b;font-size:14px;margin-top:4px;">Complete endpoint guide for Pro Plan API access</p>
      <p style="color:#94a3b8;font-size:12px;margin-top:8px;">Generated: ${now}</p>
    </div>
    <div style="text-align:right;flex-shrink:0;">
      <div style="background:#eef2ff;border:1px solid #c7d2fe;border-radius:8px;padding:10px 16px;">
        <p style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:#6366f1;margin-bottom:4px;">Base URL</p>
        <code style="font-family:monospace;font-size:13px;color:#1e1b4b;">${escHtml(baseUrl)}</code>
      </div>
    </div>
  </div>

  <!-- Table of Contents -->
  <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:20px 24px;margin-bottom:32px;">
    <h3 style="margin-top:0;font-size:13px;text-transform:uppercase;letter-spacing:.05em;color:#94a3b8;">Contents</h3>
    <ol style="margin:8px 0 0 16px;font-size:13px;color:#4f46e5;">
      <li style="margin-bottom:4px;"><a href="#auth">Authentication</a></li>
      <li style="margin-bottom:4px;"><a href="#headers">Response Headers</a></li>
      <li style="margin-bottom:4px;"><a href="#errors">Error Codes</a></li>
      ${USER_API_SECTIONS.map((s, i) => `<li style="margin-bottom:4px;"><a href="#section-${i}">${escHtml(s.tag)}</a> — ${s.endpoints.length} endpoint${s.endpoints.length !== 1 ? 's' : ''}</li>`).join('')}
      <li style="margin-bottom:4px;"><a href="#qr-types">Supported QR Types (${QR_TYPES.length})</a></li>
    </ol>
  </div>

  <!-- Authentication -->
  <div id="auth">
    ${sectionHeader('Authentication', 'Pass your API key as a Bearer token in the Authorization header for every request.')}
    <div style="background:#eef2ff;border:1px solid #c7d2fe;border-radius:10px;padding:16px 20px;margin-bottom:8px;">
      <p style="font-size:13px;color:#3730a3;margin-bottom:10px;">
        Include the following header in all API requests:
      </p>
      ${pre('Authorization: Bearer YOUR_API_KEY')}
      <p style="font-size:13px;color:#3730a3;margin:10px 0 8px;">Example cURL:</p>
      ${pre(`curl -H "Authorization: Bearer YOUR_API_KEY" \\\n  -H "Accept: application/json" \\\n  ${escHtml(baseUrl)}/account`)}
    </div>
  </div>

  <!-- Response Headers -->
  <div id="headers">
    ${sectionHeader('Response Headers', 'Every API response includes these useful headers.')}
    <table style="font-size:13px;">
      <tr style="background:#f8fafc;">
        <th style="text-align:left;padding:8px 12px;border:1px solid #e2e8f0;color:#64748b;">Header</th>
        <th style="text-align:left;padding:8px 12px;border:1px solid #e2e8f0;color:#64748b;">Description</th>
      </tr>
      ${(
        [
          ['X-RateLimit-Limit', 'Requests allowed per minute'],
          ['X-RateLimit-Remaining', 'Requests remaining in current window'],
          ['X-Credits-Consumed', 'Credits deducted for this call'],
          ['X-Credits-Balance', 'Remaining credit balance'],
        ] as [string, string][]
      )
        .map(
          ([h, d]) => `<tr>
        <td style="padding:8px 12px;border:1px solid #e2e8f0;">${code(h)}</td>
        <td style="padding:8px 12px;border:1px solid #e2e8f0;color:#475569;">${escHtml(d)}</td>
      </tr>`
        )
        .join('')}
    </table>
  </div>

  <!-- Error Codes -->
  <div id="errors">
    ${sectionHeader('Error Codes', 'Standard HTTP error codes returned by the API.')}
    <table style="font-size:13px;">
      <tr style="background:#f8fafc;">
        <th style="text-align:left;padding:8px 12px;border:1px solid #e2e8f0;color:#64748b;">Status</th>
        <th style="text-align:left;padding:8px 12px;border:1px solid #e2e8f0;color:#64748b;">Meaning</th>
      </tr>
      ${(
        [
          ['401', '#dc2626', '#fee2e2', 'Unauthorized — Invalid or missing API key'],
          ['429', '#7c3aed', '#ede9fe', 'Too Many Requests — Rate limit exceeded'],
          ['422', '#2563eb', '#dbeafe', 'Unprocessable — Validation failed, check request body'],
          ['404', '#d97706', '#fef3c7', 'Not Found — Resource does not exist'],
          ['500', '#475569', '#f1f5f9', 'Server Error — Something went wrong on our end'],
        ] as [string, string, string, string][]
      )
        .map(
          ([status, color, bg, desc]) => `<tr>
        <td style="padding:8px 12px;border:1px solid #e2e8f0;">
          <span style="background:${bg};color:${color};padding:2px 8px;border-radius:4px;font-size:11px;font-weight:700;">${status}</span>
        </td>
        <td style="padding:8px 12px;border:1px solid #e2e8f0;color:#475569;">${escHtml(desc)}</td>
      </tr>`
        )
        .join('')}
    </table>
  </div>

  <hr />

  <!-- Endpoints -->
  ${USER_API_SECTIONS.map((_s, i) => `<div id="section-${i}"></div>`).join('')}
  ${endpointBlocks}

  <hr />

  <!-- QR Types -->
  <div id="qr-types">
    ${sectionHeader(`Supported QR Types (${QR_TYPES.length})`, 'Use the Type ID as the "type" field when creating a QR code via POST /qrcodes.')}
    <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:14px 18px;margin-bottom:16px;">
      <p style="font-size:12px;font-weight:600;color:#64748b;margin-bottom:8px;">Example — create a dynamic URL QR:</p>
      ${pre(JSON.stringify({ type: 'url', is_dynamic: true, data: { url: 'https://example.com' }, title: 'My QR Code' }, null, 2))}
      <p style="font-size:12px;color:#94a3b8;margin-top:8px;">
        <strong>Dynamic</strong> QR codes redirect via a short URL that you can update anytime without reprinting.
        <strong>Static</strong> QR codes embed the data directly in the image and cannot be edited.
      </p>
    </div>
    <table style="font-size:13px;">
      <tr style="background:#f8fafc;">
        <th style="text-align:left;padding:8px 12px;border:1px solid #e2e8f0;color:#64748b;">Type ID</th>
        <th style="text-align:left;padding:8px 12px;border:1px solid #e2e8f0;color:#64748b;">Name</th>
        <th style="text-align:center;padding:8px 12px;border:1px solid #e2e8f0;color:#64748b;">Kind</th>
        <th style="text-align:left;padding:8px 12px;border:1px solid #e2e8f0;color:#64748b;">Description</th>
      </tr>
      ${qrRows}
    </table>
  </div>

  <!-- Footer -->
  <div style="margin-top:48px;padding-top:24px;border-top:1px solid #e2e8f0;text-align:center;">
    <p style="font-size:12px;color:#94a3b8;">
      Karsaaz QR API Reference • Generated ${now} •
      Base URL: <code style="font-family:monospace;">${escHtml(baseUrl)}</code>
    </p>
  </div>

</div>
</body>
</html>`
}

function downloadApiGuide() {
  const html = buildApiGuideHtml(DOCS_BASE)
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'karsaaz-qr-api-guide.html'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

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

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 1500)
      }}
      className="text-gray-400 hover:text-gray-700 transition-colors"
    >
      {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
    </button>
  )
}

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

function EndpointCard({ endpoint }: { endpoint: PlaygroundEndpoint }) {
  const [open, setOpen] = useState(false)
  const pathParams = endpoint.params?.filter(p => p.in === 'path') ?? []
  const queryParams = endpoint.params?.filter(p => p.in === 'query') ?? []
  const fullUrl = `${DOCS_BASE}${endpoint.path}`
  const curlLines = [
    `curl -X ${endpoint.method} \\`,
    `  "${fullUrl.replace(/{(\w+)}/g, ':$1')}" \\`,
    `  -H "Authorization: Bearer YOUR_API_KEY" \\`,
    `  -H "Content-Type: application/json"`,
    endpoint.bodyExample ? `  -d '${JSON.stringify(endpoint.bodyExample, null, 2)}'` : null,
  ]
    .filter(Boolean)
    .join('\n')

  return (
    <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
      <button
        className="flex w-full items-center justify-between gap-3 px-5 py-3.5 text-left hover:bg-gray-50 transition-colors"
        onClick={() => setOpen(v => !v)}
      >
        <div className="flex items-center gap-3 min-w-0">
          <MethodBadge method={endpoint.method} />
          <code className="text-sm font-mono text-gray-700 truncate">{fullUrl}</code>
          <span className="text-sm text-gray-500 hidden lg:block">{endpoint.summary}</span>
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
            <CodeBlock lang="bash" code={curlLines} />
          </div>
        </div>
      )}
    </div>
  )
}

function ApiDocsTab() {
  return (
    <div>
      {/* Download Guide Button */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-gray-900">API Reference</h2>
          <p className="text-sm text-gray-500">All endpoints, slugs, parameters and examples.</p>
        </div>
        <button
          onClick={downloadApiGuide}
          className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 active:scale-95 transition-all"
        >
          <Download className="h-4 w-4" />
          Download Guide
        </button>
      </div>
      {/* Base URL Banner */}
      <div className="mb-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="mb-3 font-semibold text-gray-900 text-sm uppercase tracking-wide">
          Base URL
        </h2>
        <div className="flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-3">
          <code className="flex-1 font-mono text-sm text-green-400 break-all">{DOCS_BASE}</code>
          <CopyButton text={DOCS_BASE} />
        </div>
        <p className="mt-3 text-xs text-gray-500">
          All endpoints are relative to this base URL. Example full endpoint:
        </p>
        <div className="mt-2 flex items-center gap-2 rounded-lg bg-gray-50 border border-gray-200 px-4 py-2">
          <span className="rounded bg-blue-100 px-2 py-0.5 text-xs font-bold font-mono text-blue-700">
            GET
          </span>
          <code className="font-mono text-sm text-gray-700 break-all">{DOCS_BASE}/qrcodes</code>
        </div>
        <div className="mt-2 flex items-center gap-2 rounded-lg bg-gray-50 border border-gray-200 px-4 py-2">
          <span className="rounded bg-green-100 px-2 py-0.5 text-xs font-bold font-mono text-green-700">
            POST
          </span>
          <code className="font-mono text-sm text-gray-700 break-all">{DOCS_BASE}/qrcodes</code>
        </div>
        <div className="mt-2 flex items-center gap-2 rounded-lg bg-gray-50 border border-gray-200 px-4 py-2">
          <span className="rounded bg-red-100 px-2 py-0.5 text-xs font-bold font-mono text-red-700">
            DELETE
          </span>
          <code className="font-mono text-sm text-gray-700 break-all">
            {DOCS_BASE}/qrcodes/&#123;id&#125;
          </code>
        </div>
      </div>

      {/* Auth banner */}
      <div className="mb-6 rounded-xl border border-indigo-100 bg-indigo-50 p-4">
        <h2 className="mb-1 font-semibold text-indigo-900 text-sm">Authentication</h2>
        <p className="text-sm text-indigo-700 mb-2">
          Pass your API key as a{' '}
          <code className="font-mono bg-indigo-100 px-1 rounded">Bearer</code> token in every
          request.
        </p>
        <CodeBlock
          lang="bash"
          code={`curl -H "Authorization: Bearer YOUR_API_KEY" ${DOCS_BASE}/account`}
        />
      </div>

      {/* Response headers */}
      <div className="mb-6 rounded-xl border bg-white p-4 shadow-sm">
        <h2 className="mb-3 font-semibold text-gray-800 text-sm">Useful Response Headers</h2>
        <div className="grid gap-2 text-sm md:grid-cols-2">
          {(
            [
              ['X-RateLimit-Limit', 'Requests allowed per minute'],
              ['X-RateLimit-Remaining', 'Requests remaining this window'],
              ['X-Credits-Consumed', 'Credits deducted for this call'],
              ['X-Credits-Balance', 'Remaining credit balance'],
            ] as [string, string][]
          ).map(([header, desc]) => (
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
        <div className="space-y-1.5">
          {(
            [
              ['401', 'bg-red-100 text-red-700', 'Unauthorized — Invalid or missing API key'],
              ['429', 'bg-purple-100 text-purple-700', 'Too Many Requests — Rate limit exceeded'],
              ['422', 'bg-blue-100 text-blue-700', 'Unprocessable — Validation failed'],
              ['404', 'bg-yellow-100 text-yellow-700', 'Not Found — Resource not found'],
            ] as [string, string, string][]
          ).map(([code, cls, desc]) => (
            <div key={code} className="flex items-start gap-3 text-sm">
              <span className={`shrink-0 rounded px-2 py-0.5 text-xs font-bold ${cls}`}>
                {code}
              </span>
              <span className="text-gray-600">{desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Endpoint sections */}
      {USER_API_SECTIONS.map(section => (
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

      {/* Supported QR Types */}
      <QrTypesSection />
    </div>
  )
}

function QrTypesSection() {
  const [activeCategory, setActiveCategory] = useState('all')
  const categories = QR_TYPE_CATEGORIES.filter(c => c.id !== 'all')

  const filteredTypes =
    activeCategory === 'all'
      ? QR_TYPES
      : QR_TYPES.filter(t => {
          const cat = QR_TYPE_CATEGORIES.find(c => c.id === activeCategory)
          return cat ? cat.typeIds.includes(t.id) : true
        })

  const exampleBody = JSON.stringify(
    { type: 'url', is_dynamic: true, data: { url: 'https://example.com' }, title: 'My QR Code' },
    null,
    2
  )

  return (
    <div className="mb-10">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-gray-900">Supported QR Types</h2>
        <p className="mt-1 text-sm text-gray-500">
          Pass the{' '}
          <code className="rounded bg-gray-100 px-1 font-mono text-xs text-indigo-600">type</code>{' '}
          value in your{' '}
          <code className="rounded bg-gray-100 px-1 font-mono text-xs text-indigo-600">
            POST /qrcodes
          </code>{' '}
          request body. Dynamic QR codes can be edited after creation; static ones are fixed.
        </p>
      </div>

      {/* Example request using a type */}
      <div className="mb-5 rounded-xl border bg-white p-4 shadow-sm">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
          Example — Create a dynamic URL QR
        </p>
        <CodeBlock lang="json" code={exampleBody} />
      </div>

      {/* Category filter tabs */}
      <div className="mb-4 flex flex-wrap gap-2">
        <button
          onClick={() => setActiveCategory('all')}
          className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
            activeCategory === 'all'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          All ({QR_TYPES.length})
        </button>
        {categories.map(cat => {
          const count = QR_TYPES.filter(t => cat.typeIds.includes(t.id)).length
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                activeCategory === cat.id
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat.label} ({count})
            </button>
          )
        })}
      </div>

      {/* Types grid */}
      <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
        <div className="grid grid-cols-[1fr_auto_auto] gap-0 text-xs font-semibold uppercase tracking-wide text-gray-500 bg-gray-50 border-b px-4 py-2">
          <span>Type ID / Name</span>
          <span className="px-6 text-center">Kind</span>
          <span className="w-32 text-left pl-2">Description</span>
        </div>
        <div className="divide-y divide-gray-100">
          {filteredTypes.map(t => (
            <div
              key={t.id}
              className="grid grid-cols-[1fr_auto_auto] items-center gap-0 px-4 py-2.5 hover:bg-gray-50 transition-colors"
            >
              <div className="flex flex-col gap-0.5 min-w-0">
                <code className="font-mono text-sm font-semibold text-indigo-600">{t.id}</code>
                <span className="text-xs text-gray-500 truncate">{t.name}</span>
              </div>
              <div className="px-6">
                {t.cat === 'dynamic' ? (
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
                    Dynamic
                  </span>
                ) : (
                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                    Static
                  </span>
                )}
              </div>
              <div className="w-32 text-xs text-gray-500 pl-2">{t.description}</div>
            </div>
          ))}
        </div>
      </div>
      <p className="mt-3 text-xs text-gray-400">
        {filteredTypes.length} type{filteredTypes.length !== 1 ? 's' : ''} shown. Static QR codes
        embed data directly in the image; dynamic QR codes redirect through a short URL that you can
        update anytime.
      </p>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// API calls
// ─────────────────────────────────────────────────────────────────────────────

const fetchApiKeys = async (): Promise<ApiKeysResponse> => {
  const res = await apiClient.get('/user/api-keys')
  return res.data
}

const createApiKey = async (name: string): Promise<{ data: ApiKey & { token: string } }> => {
  const res = await apiClient.post('/user/api-keys', { name })
  return res.data
}

const revokeApiKey = async (id: number): Promise<void> => {
  await apiClient.delete(`/user/api-keys/${id}`)
}

// ─────────────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────────────

type Tab = 'keys' | 'docs' | 'playground'

export default function ApisPage() {
  const { t } = useTranslation()
  const qc = useQueryClient()

  const [tab, setTab] = useState<Tab>('keys')
  const [newKeyName, setNewKeyName] = useState('')
  const [revealedToken, setRevealedToken] = useState<{ name: string; token: string } | null>(null)
  const [copied, setCopied] = useState(false)

  const { data, isLoading, error } = useQuery<ApiKeysResponse>({
    queryKey: ['user-api-keys'],
    queryFn: fetchApiKeys,
    retry: false,
  })

  const createMutation = useMutation({
    mutationFn: createApiKey,
    onSuccess: result => {
      setRevealedToken({ name: result.data.name, token: result.data.token })
      setNewKeyName('')
      qc.invalidateQueries({ queryKey: ['user-api-keys'] })
    },
  })

  const revokeMutation = useMutation({
    mutationFn: revokeApiKey,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['user-api-keys'] }),
  })

  const copyToken = async () => {
    if (!revealedToken) return
    await navigator.clipboard.writeText(revealedToken.token)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const formatLimit = (n: number) => (n === -1 ? t('Unlimited') : n.toLocaleString())

  // ──────────────────────────────────────────────────────────────────────────
  // Render: no API access
  // ──────────────────────────────────────────────────────────────────────────

  const is403 = (error as any)?.response?.status === 403

  if (!isLoading && (is403 || (!error && !data?.plan_limits?.has_api_access))) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-8">
          <svg
            className="mx-auto mb-4 h-12 w-12 text-amber-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
            />
          </svg>
          <h2 className="mb-2 text-xl font-semibold text-amber-800">
            {t('API Access Unavailable')}
          </h2>
          <p className="mb-6 text-sm text-amber-700">
            {t(
              'Your current plan does not include API access. Upgrade to a Pro or higher plan to generate API keys and access QR features programmatically.'
            )}
          </p>
          <Link
            href="/plans"
            className="inline-block rounded-lg bg-amber-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-amber-700"
          >
            {t('View Plans')}
          </Link>
        </div>
      </div>
    )
  }

  if (!isLoading && error && !is403) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <div className="rounded-xl border border-red-200 bg-red-50 p-8">
          <h2 className="mb-2 text-xl font-semibold text-red-800">{t('Something went wrong')}</h2>
          <p className="mb-6 text-sm text-red-700">
            {t('Could not load API keys. Please try again.')}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="inline-block rounded-lg bg-red-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
          >
            {t('Retry')}
          </button>
        </div>
      </div>
    )
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Render: loading
  // ──────────────────────────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <div className="flex min-h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    )
  }

  const limits = data!.plan_limits

  // ──────────────────────────────────────────────────────────────────────────
  // Render: main page
  // ──────────────────────────────────────────────────────────────────────────

  return (
    <div className="overflow-x-hidden px-4 py-8 sm:px-6 lg:px-8">
      {/* Header + Tabs — always narrow */}
      <div className="mx-auto max-w-3xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">{t('API Access')}</h1>
          <p className="mt-1 text-sm text-gray-500">
            {t('Manage your API keys and explore available endpoints.')}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="mx-auto mb-6 flex w-fit max-w-3xl gap-1 rounded-lg border border-gray-200 bg-gray-100 p-1">
        <button
          onClick={() => setTab('keys')}
          className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            tab === 'keys'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Key className="h-4 w-4" />
          {t('API Keys')}
        </button>
        <button
          onClick={() => setTab('docs')}
          className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            tab === 'docs'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <BookOpen className="h-4 w-4" />
          {t('Documentation')}
        </button>
        <button
          onClick={() => setTab('playground')}
          className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            tab === 'playground'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z"
            />
          </svg>
          {t('Playground')}
        </button>
      </div>

      {/* ── Docs tab ── */}
      {tab === 'docs' && (
        <div className="mx-auto max-w-3xl">
          <ApiDocsTab />
        </div>
      )}

      {/* ── Playground tab — full width ── */}
      {tab === 'playground' && (
        <PlaygroundPanel sections={USER_API_SECTIONS} basePath={USER_API_BASE_PATH} />
      )}

      {/* ── Keys tab ── */}
      {tab === 'keys' && (
        <div className="mx-auto max-w-3xl">
          <>
            {/* Plan limits banner */}
            <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                <p className="text-2xl font-bold text-blue-600">
                  {(limits.monthly_requests_used ?? 0).toLocaleString()}
                  <span className="text-sm font-normal text-gray-400">
                    {' '}
                    / {formatLimit(limits.api_monthly_requests)}
                  </span>
                </p>
                <p className="mt-0.5 text-xs text-gray-500">{t('Monthly Requests')}</p>
                {limits.api_monthly_requests !== -1 && (
                  <div className="mt-2 h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        (limits.monthly_requests_used ?? 0) / limits.api_monthly_requests > 0.9
                          ? 'bg-red-500'
                          : (limits.monthly_requests_used ?? 0) / limits.api_monthly_requests > 0.7
                            ? 'bg-amber-400'
                            : 'bg-blue-500'
                      }`}
                      style={{
                        width: `${Math.min(
                          100,
                          ((limits.monthly_requests_used ?? 0) / limits.api_monthly_requests) * 100
                        )}%`,
                      }}
                    />
                  </div>
                )}
              </div>
              <div className="rounded-lg border border-gray-200 bg-white p-4 text-center shadow-sm">
                <p className="text-2xl font-bold text-blue-600">
                  {limits.api_rate_limit_per_minute}
                </p>
                <p className="mt-0.5 text-xs text-gray-500">{t('Requests / min')}</p>
              </div>
              <div className="rounded-lg border border-gray-200 bg-white p-4 text-center shadow-sm sm:col-span-1 col-span-2">
                <p className="text-2xl font-bold text-blue-600">{data!.data.length} / 5</p>
                <p className="mt-0.5 text-xs text-gray-500">{t('Active Keys')}</p>
              </div>
            </div>

            {/* One-time token reveal */}
            {revealedToken && (
              <div className="mb-6 rounded-lg border border-green-300 bg-green-50 p-5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-green-800">
                      🎉 {t('Key created')}: <span className="font-mono">{revealedToken.name}</span>
                    </p>
                    <p className="mt-1 text-xs text-green-700">
                      ⚠️ {t('Copy this token now — it will not be shown again.')}
                    </p>
                  </div>
                  <button
                    onClick={() => setRevealedToken(null)}
                    className="text-green-600 hover:text-green-800"
                    aria-label="Dismiss"
                  >
                    ✕
                  </button>
                </div>
                <div className="mt-3 flex items-center gap-2 rounded-md bg-white p-3 shadow-inner">
                  <code className="flex-1 break-all font-mono text-xs text-gray-700">
                    {revealedToken.token}
                  </code>
                  <button
                    onClick={copyToken}
                    className="shrink-0 rounded-md bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700"
                  >
                    {copied ? t('Copied!') : t('Copy')}
                  </button>
                </div>
              </div>
            )}

            {/* Create new key */}
            <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-base font-semibold text-gray-900">
                {t('Generate New Key')}
              </h2>
              <form
                className="flex gap-3"
                onSubmit={e => {
                  e.preventDefault()
                  if (newKeyName.trim()) createMutation.mutate(newKeyName.trim())
                }}
              >
                <input
                  type="text"
                  required
                  maxLength={80}
                  placeholder={t('Key name, e.g. "My App"')}
                  value={newKeyName}
                  onChange={e => setNewKeyName(e.target.value)}
                  className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={createMutation.isPending || !newKeyName.trim()}
                  className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {createMutation.isPending ? t('Creating…') : t('Generate')}
                </button>
              </form>
              {createMutation.isError && (
                <p className="mt-2 text-xs text-red-600">
                  {t(
                    'Failed to create key. You may have reached the 5-key limit or your plan does not allow API access.'
                  )}
                </p>
              )}
            </div>

            {/* Key list */}
            <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
              <div className="border-b border-gray-200 px-6 py-4">
                <h2 className="text-base font-semibold text-gray-900">{t('Your API Keys')}</h2>
              </div>

              {data!.data.length === 0 ? (
                <div className="px-6 py-10 text-center text-sm text-gray-400">
                  {t('No API keys yet. Generate one above.')}
                </div>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {data!.data.map(key => (
                    <li key={key.id} className="flex items-center justify-between gap-4 px-6 py-4">
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium text-gray-900">{key.name}</p>
                        <p className="mt-0.5 font-mono text-xs text-gray-500">
                          {key.prefix}
                          <span className="select-none">
                            ••••••••••••••••••••••••••••••••••••••••••••••••••••
                          </span>
                        </p>
                        <div className="mt-1 flex flex-wrap gap-2 text-xs text-gray-400">
                          <span>
                            {t('Rate limit')}: {key.rate_limit_per_minute} {t('req/min')}
                          </span>
                          {key.last_used_at && (
                            <span>
                              {t('Last used')}: {new Date(key.last_used_at).toLocaleDateString()}
                            </span>
                          )}
                          {key.expires_at && (
                            <span>
                              {t('Expires')}: {new Date(key.expires_at).toLocaleDateString()}
                            </span>
                          )}
                          <span>
                            {t('Created')}: {new Date(key.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => revokeMutation.mutate(key.id)}
                        disabled={revokeMutation.isPending}
                        className="shrink-0 rounded-md border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                      >
                        {t('Revoke')}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Usage hint */}
            <div className="mt-6 rounded-lg bg-gray-50 p-4 text-sm text-gray-600">
              <p className="font-medium">{t('How to use your API key')}</p>
              <p className="mt-1 text-xs">
                {t('Include your key as a Bearer token in the')}{' '}
                <code className="font-mono">Authorization</code> {t('header of every request:')}
              </p>
              <pre className="mt-2 overflow-x-auto rounded-md bg-gray-900 p-3 font-mono text-xs text-green-400">
                {`Authorization: Bearer YOUR_API_KEY`}
              </pre>
            </div>
          </>
        </div>
      )}
    </div>
  )
}
