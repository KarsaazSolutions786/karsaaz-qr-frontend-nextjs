'use client'

import { QRCodeTemplate } from '@/types/entities/template'
import Image from 'next/image'
import { MoreVertical, Eye, Edit, Trash2 } from 'lucide-react'
import { useState } from 'react'

interface TemplateCardProps {
  template: QRCodeTemplate
  onUseTemplate?: (template: QRCodeTemplate) => void
  onView?: (template: QRCodeTemplate) => void
  onEdit?: (template: QRCodeTemplate) => void
  onDelete?: (template: QRCodeTemplate) => void
  showActions?: boolean
}

export default function TemplateCard({
  template,
  onUseTemplate,
  onView,
  onEdit,
  onDelete,
  showActions = false,
}: TemplateCardProps) {
  const [showMenu, setShowMenu] = useState(false)
  const isPrivate = template.template_access_level === 'private'

  return (
    <div className="group relative bg-white rounded-lg border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-primary-400">
      {/* Thumbnail */}
      <div className="relative aspect-square bg-gray-100 overflow-hidden">
        {template.thumbnail_url ? (
          <Image
            src={template.thumbnail_url}
            alt={template.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100">
            <div className="w-24 h-24 bg-primary-200 rounded-lg" />
          </div>
        )}
        
        {/* Type Badge */}
        <div className="absolute top-2 left-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 border border-primary-200">
            {template.type}
          </span>
        </div>

        {/* Category Tag */}
        {template.category && (
          <div className="absolute top-2 right-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white text-gray-700 border border-gray-200">
              {template.category.name}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-base font-semibold text-gray-900 line-clamp-1 flex-1">
            {template.name}
          </h3>
          
          {/* Options Menu for Private Templates */}
          {isPrivate && showActions && (
            <div className="relative ml-2">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1 rounded-md hover:bg-gray-100 transition-colors"
                aria-label="Template options"
              >
                <MoreVertical className="w-4 h-4 text-gray-500" />
              </button>
              
              {showMenu && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowMenu(false)}
                  />
                  <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-20">
                    <div className="py-1">
                      {onView && (
                        <button
                          onClick={() => {
                            onView(template)
                            setShowMenu(false)
                          }}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </button>
                      )}
                      {onEdit && (
                        <button
                          onClick={() => {
                            onEdit(template)
                            setShowMenu(false)
                          }}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => {
                            onDelete(template)
                            setShowMenu(false)
                          }}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {template.description && (
          <p className="text-sm text-gray-600 line-clamp-2 mb-3">
            {template.description}
          </p>
        )}

        {/* Use Template Button */}
        <button
          onClick={() => onUseTemplate?.(template)}
          className="w-full px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-md hover:bg-primary-700 active:bg-primary-800 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        >
          Use Template
        </button>
      </div>
    </div>
  )
}
