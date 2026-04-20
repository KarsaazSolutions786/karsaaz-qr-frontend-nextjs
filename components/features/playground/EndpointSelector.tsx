// components/features/playground/EndpointSelector.tsx
'use client'

import type { PlaygroundEndpoint, PlaygroundSection } from '@/lib/constants/playground-endpoints'

const METHOD_COLORS: Record<string, string> = {
  GET: 'bg-blue-100 text-blue-700',
  POST: 'bg-green-100 text-green-700',
  PUT: 'bg-yellow-100 text-yellow-700',
  PATCH: 'bg-orange-100 text-orange-700',
  DELETE: 'bg-red-100 text-red-700',
}

interface Props {
  sections: PlaygroundSection[]
  selectedEndpoint: PlaygroundEndpoint | null
  onSelect: (endpoint: PlaygroundEndpoint) => void
}

export function EndpointSelector({ sections, selectedEndpoint, onSelect }: Props) {
  return (
    <div className="h-full overflow-y-auto">
      {sections.map(section => (
        <div key={section.tag} className="mb-1">
          <div className="sticky top-0 z-10 bg-gray-50 px-3 py-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              {section.tag}
            </p>
          </div>
          <div className="pb-1">
            {section.endpoints.map(ep => {
              const isSelected =
                selectedEndpoint?.method === ep.method && selectedEndpoint?.path === ep.path
              return (
                <button
                  key={`${ep.method}-${ep.path}`}
                  onClick={() => onSelect(ep)}
                  className={`flex w-full items-center gap-2 px-3 py-2 text-left transition-colors hover:bg-gray-100 ${
                    isSelected ? 'bg-indigo-50 hover:bg-indigo-50' : ''
                  }`}
                >
                  <span
                    className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold font-mono ${
                      METHOD_COLORS[ep.method] ?? 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {ep.method}
                  </span>
                  <span
                    className={`truncate font-mono text-xs ${
                      isSelected ? 'font-semibold text-indigo-700' : 'text-gray-600'
                    }`}
                  >
                    {ep.path}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
