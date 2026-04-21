'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import {
  buildCurlSnippet,
  buildFetchSnippet,
  buildPythonSnippet,
  buildPhpSnippet,
} from '@/lib/utils/playground-helpers'

type Lang = 'curl' | 'javascript' | 'python' | 'php'

const LANGS: { id: Lang; label: string }[] = [
  { id: 'curl', label: 'cURL' },
  { id: 'javascript', label: 'JS' },
  { id: 'python', label: 'Python' },
  { id: 'php', label: 'PHP' },
]

interface Props {
  method: string
  fullUrl: string
  apiKey: string
  body: string
}

export function CodeSnippets({ method, fullUrl, apiKey, body }: Props) {
  const [lang, setLang] = useState<Lang>('curl')
  const [copied, setCopied] = useState(false)

  const displayKey = apiKey.trim() || 'YOUR_API_KEY'

  const snippets: Record<Lang, string> = {
    curl: buildCurlSnippet({ method, fullUrl, apiKey: displayKey, body }),
    javascript: buildFetchSnippet({ method, fullUrl, apiKey: displayKey, body }),
    python: buildPythonSnippet({ method, fullUrl, apiKey: displayKey, body }),
    php: buildPhpSnippet({ method, fullUrl, apiKey: displayKey, body }),
  }

  const currentSnippet = snippets[lang]

  const copy = async () => {
    await navigator.clipboard.writeText(currentSnippet)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-gray-900">
      {/* Tab bar */}
      <div className="flex items-center justify-between border-b border-gray-700 bg-gray-800 px-2 py-1">
        <div className="flex gap-0.5">
          {LANGS.map(l => (
            <button
              key={l.id}
              onClick={() => setLang(l.id)}
              className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${
                lang === l.id ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
        <button
          onClick={copy}
          className="flex items-center gap-1 rounded px-2 py-1 text-xs text-gray-400 transition-colors hover:text-gray-200"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 text-green-400" />
              <span className="text-green-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" />
              Copy
            </>
          )}
        </button>
      </div>
      {/* API key disclosure warning */}
      {apiKey.trim() && (
        <p className="border-b border-yellow-900/50 bg-yellow-900/30 px-3 py-1 text-[11px] text-yellow-400">
          API key included — do not share this snippet publicly.
        </p>
      )}
      {/* Code */}
      <pre className="max-h-40 overflow-auto p-3 font-mono text-xs leading-relaxed text-green-300">
        {currentSnippet}
      </pre>
    </div>
  )
}
