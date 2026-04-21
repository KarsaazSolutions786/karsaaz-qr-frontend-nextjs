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
  { id: 'javascript', label: 'JavaScript' },
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
    <div className="flex flex-col overflow-hidden rounded-xl border border-gray-200">
      {/* Tab bar */}
      <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-3 py-1.5">
        <div className="flex gap-1">
          {LANGS.map(l => (
            <button
              key={l.id}
              onClick={() => setLang(l.id)}
              className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${
                lang === l.id
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
        <button
          onClick={copy}
          className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-gray-400 hover:text-gray-700"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 text-green-500" /> Copied
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" /> Copy
            </>
          )}
        </button>
      </div>
      {/* API key disclosure warning */}
      {apiKey.trim() && (
        <p className="border-b border-amber-100 bg-amber-50 px-3 py-1 text-xs text-amber-700">
          Your API key is included in this snippet — do not share it.
        </p>
      )}
      {/* Code */}
      <pre className="max-h-40 overflow-auto bg-gray-900 p-4 font-mono text-xs leading-relaxed text-green-300">
        {currentSnippet}
      </pre>
    </div>
  )
}
