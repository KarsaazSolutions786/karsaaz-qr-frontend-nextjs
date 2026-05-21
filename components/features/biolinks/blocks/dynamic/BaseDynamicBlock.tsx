'use client'

import type { ComponentType } from 'react'
import { useTranslation } from '@/lib/i18n'
import type { BlockData } from '@/types/entities/biolink'

interface BaseDynamicBlockProps {
  block: BlockData
  isEditing?: boolean
  onUpdate?: (data: any) => void
  registry: Record<string, ComponentType<any>>
}

/**
 * Purpose: BaseDynamicBlock renders a block by looking up its type in a component registry. Falls back to an "unsupported" placeholder if the block type is not registered.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

export default function BaseDynamicBlock({
  block,
  isEditing,
  onUpdate,
  registry,
}: BaseDynamicBlockProps) {
  const { t } = useTranslation();
  const Component = registry[block.type]

  if (!Component) {
    return (
      <div className="rounded-lg border-2 border-dashed border-yellow-300 bg-yellow-50 p-4 text-center">
        <p className="text-sm text-yellow-700">
          {t('Unsupported block type:')} <code className="font-mono">{block.type}</code>
        </p>
      </div>
    )
  }

  return <Component block={block} isEditing={isEditing} onUpdate={onUpdate} />
}
