'use client'

import type { ComponentType } from 'react'
import type { BlockData } from '@/types/entities/biolink'

interface BaseDynamicBlockProps {
  block: BlockData
  isEditing?: boolean
  onUpdate?: (data: any) => void
  registry: Record<string, ComponentType<any>>
}

/**
 * BaseDynamicBlock renders a block by looking up its type in a component registry.
 * Falls back to an "unsupported" placeholder if the block type is not registered.
 */
export default function BaseDynamicBlock({
  block,
  isEditing,
  onUpdate,
  registry,
}: BaseDynamicBlockProps) {
  const Component = registry[block.type]

  if (!Component) {
    return (
      <div className="rounded-lg border-2 border-dashed border-yellow-300 bg-yellow-50 p-4 text-center">
        <p className="text-sm text-yellow-700">
          Unsupported block type: <code className="font-mono">{block.type}</code>
        </p>
      </div>
    )
  }

  return <Component block={block} isEditing={isEditing} onUpdate={onUpdate} />
}
