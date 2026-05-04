// lib/utils/playground-helpers.ts

export interface SnippetParams {
  method: string
  fullUrl: string
  apiKey: string
  body: string
}

/** Replace {param} tokens in a path template with actual values */
export function buildUrl(pathTemplate: string, pathParams: Record<string, string>): string {
  return pathTemplate.replace(/\{(\w+)\}/g, (_, key) =>
    pathParams[key] ? encodeURIComponent(pathParams[key]) : `{${key}}`
  )
}

/** Build a query string from a key-value map, skipping empty values */
export function buildQueryString(params: Record<string, string>): string {
  const filled = Object.entries(params).filter(([, v]) => v.trim() !== '')
  if (filled.length === 0) return ''
  const qs = new URLSearchParams(filled).toString()
  return '?' + qs
}

/** Build the full URL by combining base, resolved path, and query string */
export function buildFullUrl(
  baseUrl: string,
  basePath: string,
  pathTemplate: string,
  pathParams: Record<string, string>,
  queryParams: Record<string, string>
): string {
  const resolvedPath = buildUrl(pathTemplate, pathParams)
  const qs = buildQueryString(queryParams)
  return `${baseUrl}/api${basePath}${resolvedPath}${qs}`
}

export function buildCurlSnippet({ method, fullUrl, apiKey, body }: SnippetParams): string {
  const lines: string[] = [
    `curl -X ${method} \\`,
    `  "${fullUrl}" \\`,
    `  -H "Authorization: Bearer ${apiKey}" \\`,
    `  -H "Accept: application/json"`,
  ]
  if (body.trim() && method !== 'GET' && method !== 'DELETE') {
    // Escape single quotes so the shell -d '...' literal is valid
    const escapedBody = body.replace(/'/g, "'\\''")
    lines[lines.length - 1] += ' \\'
    lines.push(`  -H "Content-Type: application/json" \\`)
    lines.push(`  -d '${escapedBody}'`)
  }
  return lines.join('\n')
}

export function buildFetchSnippet({ method, fullUrl, apiKey, body }: SnippetParams): string {
  const hasBody = body.trim() !== '' && method !== 'GET' && method !== 'DELETE'
  const bodyParsed = hasBody
    ? (() => {
        try {
          return JSON.parse(body)
        } catch {
          return body
        }
      })()
    : null

  return `const response = await fetch('${fullUrl}', {
  method: '${method}',
  headers: {
    'Authorization': 'Bearer ${apiKey}',
    'Accept': 'application/json',${hasBody ? "\n    'Content-Type': 'application/json'," : ''}
  },${hasBody ? `\n  body: JSON.stringify(${JSON.stringify(bodyParsed, null, 4).replace(/\n/g, '\n  ')}),` : ''}
})

const data = await response.json()
if (process.env.NODE_ENV === 'development') console.log(data)`
}

export function buildPythonSnippet({ method, fullUrl, apiKey, body }: SnippetParams): string {
  const hasBody = body.trim() !== '' && method !== 'GET' && method !== 'DELETE'
  const methodLower = method.toLowerCase()
  const escapedBody = body.replace(/\\/g, '\\\\').replace(/'/g, "\\'")

  return `import requests
import json

headers = {
    "Authorization": "Bearer ${apiKey}",
    "Accept": "application/json",${hasBody ? '\n    "Content-Type": "application/json",' : ''}
}
${hasBody ? `\npayload = json.loads('${escapedBody}')\n` : ''}
response = requests.${methodLower}(
    "${fullUrl}",
    headers=headers,${hasBody ? '\n    json=payload,' : ''}
)

print(response.status_code)
print(response.json())`
}

export function buildPhpSnippet({ method, fullUrl, apiKey, body }: SnippetParams): string {
  const hasBody = body.trim() !== '' && method !== 'GET' && method !== 'DELETE'
  const escapedBody = body.replace(/\\/g, '\\\\').replace(/'/g, "\\'")

  return `<?php

$ch = curl_init();

curl_setopt_array($ch, [
    CURLOPT_URL => "${fullUrl}",
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_CUSTOMREQUEST => "${method}",
    CURLOPT_HTTPHEADER => [
        "Authorization: Bearer ${apiKey}",
        "Accept: application/json",${hasBody ? '\n        "Content-Type: application/json",' : ''}
    ],${hasBody ? `\n    CURLOPT_POSTFIELDS => '${escapedBody}',` : ''}
]);

$response = curl_exec($ch);
curl_close($ch);

echo $response;`
}
