'use client'

import { QRCodeTemplate } from '@/types/entities/template'
import TemplateCard from './TemplateCard'
import { FileQuestion } from 'lucide-react'

interface TemplateGridProps {
  templates: QRCodeTemplate[]
  onUseTemplate?: (template: QRCodeTemplate) => void
  onView?: (template: QRCodeTemplate) => void
  onEdit?: (template: QRCodeTemplate) => void
  onDelete?: (template: QRCodeTemplate) => void
  showActions?: boolean
  isLoading?: boolean
  emptyMessage?: string
}

export default function TemplateGrid({
  templates,
  onUseTemplate,
  onView,
  onEdit,
  onDelete,
  showActions = false,
  isLoading = false,
  emptyMessage = 'No templates found',
}: TemplateGridProps) {
  // Loading Skeleton
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-lg border border-gray-200 overflow-hidden animate-pulse"
          >
            {/* Thumbnail skeleton */}
            <div className="aspect-square bg-gray-200" />
            
            {/* Content skeleton */}
            <div className="p-4 space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gray-200 rounded w-full" />
              <div className="h-3 bg-gray-200 rounded w-2/3" />
              <div className="h-10 bg-gray-200 rounded" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  // Empty State
  if (templates.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <FileQuestion className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No templates available
        </h3>
        <p className="text-sm text-gray-600 text-center max-w-md">
          {emptyMessage}
        </p>
      </div>
    )
  }

  // Template Grid
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {templates.map((template) => (
        <TemplateCard
          key={template.id}
          template={template}
          onUseTemplate={onUseTemplate}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
          showActions={showActions}
        />
      ))}
    </div>
  )
}
