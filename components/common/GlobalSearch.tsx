'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import {
  MagnifyingGlassIcon,
  QrCodeIcon,
  UserIcon,
  DocumentTextIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'

interface SearchResult {
  id: string
  title: string
  category: 'qr-codes' | 'pages' | 'users'
  href: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
}

const categoryIcons = {
  'qr-codes': QrCodeIcon,
  pages: DocumentTextIcon,
  users: UserIcon,
}

const categoryLabels = {
  'qr-codes': 'QR Codes',
  pages: 'Pages',
  users: 'Users',
}

// Mock search results for now
const mockResults: SearchResult[] = [
  { id: '1', title: 'My Website QR', category: 'qr-codes', href: '/qrcodes/1', icon: QrCodeIcon },
  { id: '2', title: 'Restaurant Menu QR', category: 'qr-codes', href: '/qrcodes/2', icon: QrCodeIcon },
  { id: '3', title: 'Landing Page', category: 'pages', href: '/pages/1', icon: DocumentTextIcon },
  { id: '4', title: 'About Us', category: 'pages', href: '/pages/2', icon: DocumentTextIcon },
  { id: '5', title: 'John Doe', category: 'users', href: '/users/1', icon: UserIcon },
  { id: '6', title: 'Jane Smith', category: 'users', href: '/users/2', icon: UserIcon },
]

export function GlobalSearch() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const filteredResults = query.length > 0
    ? mockResults.filter((r) => r.title.toLowerCase().includes(query.toLowerCase()))
    : []

  const groupedResults = filteredResults.reduce<Record<string, SearchResult[]>>((acc, r) => {
    if (!acc[r.category]) acc[r.category] = []
    acc[r.category]!.push(r)
    return acc
  }, {})

  const flatResults = filteredResults

  // Ctrl+K shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setOpen(true)
      }
      if (e.key === 'Escape') {
        setOpen(false)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Focus input when dialog opens
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50)
      setQuery('')
      setSelectedIndex(0)
    }
  }, [open])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex((i) => Math.min(i + 1, flatResults.length - 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex((i) => Math.max(i - 1, 0))
      } else if (e.key === 'Enter' && flatResults[selectedIndex]) {
        e.preventDefault()
        router.push(flatResults[selectedIndex].href)
        setOpen(false)
      }
    },
    [flatResults, selectedIndex, router]
  )

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-1.5 text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
      >
        <MagnifyingGlassIcon className="h-4 w-4" />
        <span className="hidden sm:inline">Search...</span>
        <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded border border-gray-200 dark:border-gray-500 bg-gray-100 dark:bg-gray-600 px-1.5 py-0.5 text-[10px] font-mono text-gray-500 dark:text-gray-300">
          Ctrl K
        </kbd>
      </button>
    )
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50" onClick={() => setOpen(false)} />

      {/* Dialog */}
      <div className="relative w-full max-w-lg rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-2xl">
        {/* Search input */}
        <div className="flex items-center gap-3 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search QR codes, pages, users..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setSelectedIndex(0)
            }}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 outline-none"
          />
          <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto p-2">
          {query.length === 0 && (
            <p className="px-3 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
              Start typing to search...
            </p>
          )}
          {query.length > 0 && flatResults.length === 0 && (
            <p className="px-3 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
              No results found for &quot;{query}&quot;
            </p>
          )}
          {Object.entries(groupedResults).map(([category, items]) => (
            <div key={category} className="mb-2">
              <div className="px-3 py-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                {categoryLabels[category as keyof typeof categoryLabels]}
              </div>
              {items.map((result) => {
                const globalIndex = flatResults.indexOf(result)
                const Icon = categoryIcons[result.category]
                return (
                  <button
                    key={result.id}
                    onClick={() => {
                      router.push(result.href)
                      setOpen(false)
                    }}
                    onMouseEnter={() => setSelectedIndex(globalIndex)}
                    className={`w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                      globalIndex === selectedIndex
                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span>{result.title}</span>
                  </button>
                )
              })}
            </div>
          ))}
        </div>

        {/* Footer hint */}
        <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-2 flex gap-4 text-[11px] text-gray-400">
          <span><kbd className="font-mono">↑↓</kbd> navigate</span>
          <span><kbd className="font-mono">↵</kbd> select</span>
          <span><kbd className="font-mono">esc</kbd> close</span>
        </div>
      </div>
    </div>
  )
}
