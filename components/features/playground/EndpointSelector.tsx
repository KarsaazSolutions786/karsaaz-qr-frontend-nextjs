'use client'

import type { PlaygroundEndpoint, PlaygroundSection } from '@/lib/constants/playground-endpoints'

const METHOD_STYLES: Record<string, string> = {
  GET: 'bg-blue-500 text-white',
  POST: 'bg-green-500 text-white',
  PUT: 'bg-yellow-500 text-white',
  PATCH: 'bg-orange-500 text-white',
  DELETE: 'bg-red-500 text-white',
}

interface Props {
  sections: PlaygroundSection[]
  selectedEndpoint: PlaygroundEndpoint | null
  onSelect: (endpoint: PlaygroundEndpoint) => void
}

export function EndpointSelector({ sections, selectedEndpoint, onSelect }: Props) {
  return (
    <div className="h-full overflow-y-auto py-2">
      {sections.map(section => (
        <div key={section.tag} className="mb-3">
          <div className="sticky top-0 z-10 bg-gray-50 px-4 pb-1 pt-2">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
              {section.tag}
            </p>
          </div>
          <div>
            {section.endpoints.map(ep => {
              const isSelected =
                selectedEndpoint?.method === ep.method && selectedEndpoint?.path === ep.path
              return (
                <button
                  key={`${ep.method}-${ep.path}`}
                  onClick={() => onSelect(ep)}
                  className={`group flex w-full items-center gap-2.5 border-l-2 px-3 py-2 text-left transition-all ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-transparent hover:border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  <span
                    className={`w-12 shrink-0 rounded px-1.5 py-0.5 text-center text-[10px] font-bold ${
                      METHOD_STYLES[ep.method] ?? 'bg-gray-500 text-white'
                    }`}
                  >
                    {ep.method}
                  </span>
                  <span
                    className={`truncate font-mono text-xs ${
                      isSelected
                        ? 'font-semibold text-indigo-700'
                        : 'text-gray-500 group-hover:text-gray-800'
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
