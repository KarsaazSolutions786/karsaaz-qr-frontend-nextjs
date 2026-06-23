'use client'

import { memo } from 'react'
import { Lock } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ShapeItem {
  value: string
  label: string
  image?: string
}

interface ShapeGridProps {
  items: ShapeItem[]
  selectedValue: string
  onSelect: (value: string) => void
  showAll: boolean
  onToggleShowAll: () => void
  maxVisible?: number
  /** When true, all items except the first are locked for free users */
  premiumLocked?: boolean
  onPremiumBlock: () => void
  t: (key: string) => string
}

const ShapeGrid = memo(
  ({
    items,
    selectedValue,
    onSelect,
    showAll,
    onToggleShowAll,
    maxVisible = 15,
    premiumLocked = false,
    onPremiumBlock,
    t,
  }: ShapeGridProps) => {
    const visibleItems = showAll ? items : items.slice(0, maxVisible)
    return (
      <div>
        <div className="grid grid-cols-7 gap-2">
          {visibleItems.map((item, idx) => {
            const isLocked = premiumLocked && idx > 0
            return (
              <button
                key={item.value}
                type="button"
                onClick={() => {
                  if (isLocked) {
                    onPremiumBlock()
                    return
                  }
                  onSelect(item.value)
                }}
                className={cn(
                  'aspect-square rounded-lg border-2 flex items-center justify-center p-1.5 transition-all relative',
                  selectedValue === item.value
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300',
                  isLocked && 'opacity-50 cursor-not-allowed'
                )}
                title={isLocked ? `${item.label} (requires paid plan)` : item.label}
              >
                {item.image ? (
                  <img src={item.image} alt={item.label} className="w-full h-full object-contain" />
                ) : (
                  <span className="text-[8px] text-gray-500">{item.label}</span>
                )}
                {isLocked && (
                  <Lock className="absolute bottom-0.5 right-0.5 w-3 h-3 text-gray-400" />
                )}
              </button>
            )
          })}
        </div>
        {items.length > maxVisible && (
          <button
            type="button"
            onClick={onToggleShowAll}
            className="mt-2 text-sm text-purple-600 hover:text-purple-700 font-medium"
          >
            {showAll ? t('show less') : t('view all')}
          </button>
        )}
      </div>
    )
  }
)
ShapeGrid.displayName = 'ShapeGrid'

export { ShapeGrid }
export type { ShapeItem, ShapeGridProps }
