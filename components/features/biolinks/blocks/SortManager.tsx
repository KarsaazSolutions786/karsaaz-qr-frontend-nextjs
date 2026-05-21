'use client'

import { useTranslation } from '@/lib/i18n'
import type { BlockData } from '@/types/entities/biolink'

interface SortManagerProps {
  blocks: BlockData[]
  onReorder: (reorderedBlocks: BlockData[]) => void
  children?: (props: {
    items: BlockData[]
    moveUp: (index: number) => void
    moveDown: (index: number) => void
  }) => React.ReactNode
}

/**
 * Purpose: SortManager provides block reordering functionality. Uses manual move up/down as a baseline. Can be extended with @dnd-kit for full drag-and-drop support.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

export default function SortManager({ blocks, onReorder, children }: SortManagerProps) {
  const { t } = useTranslation();
  /**
   * Purpose: Executes moveUp functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  const moveUp = (index: number) => {
    if (index <= 0) return
    const updated = [...blocks]
    const a = updated[index - 1]!
    const b = updated[index]!
    updated[index - 1] = b
    updated[index] = a
    onReorder(updated.map((b, i) => ({ ...b, order: i })))
  }

  /**
   * Purpose: Executes moveDown functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  const moveDown = (index: number) => {
    if (index >= blocks.length - 1) return
    const updated = [...blocks]
    const a = updated[index + 1]!
    const b = updated[index]!
    updated[index + 1] = b
    updated[index] = a
    onReorder(updated.map((b, i) => ({ ...b, order: i })))
  }

  if (children) {
    return <>{children({ items: blocks, moveUp, moveDown })}</>
  }

  return (
    <div className="space-y-2">
      {blocks.map((block, index) => (
        <div
          key={block.id}
          className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white p-3"
        >
          <div className="flex flex-col gap-1">
            <button
              onClick={() => moveUp(index)}
              disabled={index === 0}
              className="text-xs text-gray-400 hover:text-gray-700 disabled:opacity-30"
              title={t('Move up')}
            >
              ▲
            </button>
            <button
              onClick={() => moveDown(index)}
              disabled={index === blocks.length - 1}
              className="text-xs text-gray-400 hover:text-gray-700 disabled:opacity-30"
              title={t('Move down')}
            >
              ▼
            </button>
          </div>
          <span className="flex-1 text-sm text-gray-700 truncate">
            {block.type} — {block.id}
          </span>
          <span className="text-xs text-gray-400">#{block.order}</span>
        </div>
      ))}
    </div>
  )
}
