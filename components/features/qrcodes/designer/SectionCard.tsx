'use client'

import { memo } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface SectionCardProps {
  title: string
  sectionKey: string
  expanded: boolean
  onToggle: () => void
  children: React.ReactNode
}

const SectionCard = memo(
  ({ title, sectionKey: _sectionKey, expanded, onToggle, children }: SectionCardProps) => (
    <div className="bg-white rounded-xl border border-purple-100 overflow-hidden shadow-sm">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between px-5 py-4 bg-purple-50/30 hover:bg-purple-50/60 transition-colors"
      >
        <h3 className="text-base font-semibold text-gray-900">{title}</h3>
        {expanded ? (
          <ChevronUp className="w-5 h-5 text-purple-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-purple-400" />
        )}
      </button>
      {expanded && <div className="px-5 py-4 space-y-4">{children}</div>}
    </div>
  )
)
SectionCard.displayName = 'SectionCard'

export { SectionCard }
export type { SectionCardProps }
