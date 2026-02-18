'use client'

import { QRCodeTemplate } from '@/types/entities/template'
import Image from 'next/image'
import { useState } from 'react'
import { 
  ArrowUpDown, 
  Eye, 
  Edit, 
  Trash2, 
  MoreVertical,
  FileQuestion 
} from 'lucide-react'

interface TemplateListProps {
  templates: QRCodeTemplate[]
  onUseTemplate?: (template: QRCodeTemplate) => void
  onView?: (template: QRCodeTemplate) => void
  onEdit?: (template: QRCodeTemplate) => void
  onDelete?: (template: QRCodeTemplate) => void
  showActions?: boolean
  isLoading?: boolean
  emptyMessage?: string
}

type SortField = 'name' | 'type' | 'category' | 'created_at'
type SortDirection = 'asc' | 'desc'

export default function TemplateList({
  templates,
  onUseTemplate,
  onView,
  onEdit,
  onDelete,
  showActions = false,
  isLoading = false,
  emptyMessage = 'No templates found',
}: TemplateListProps) {
  const [sortField, setSortField] = useState<SortField>('created_at')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [activeMenu, setActiveMenu] = useState<number | null>(null)

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const sortedTemplates = [...templates].sort((a, b) => {
    let aValue: any
    let bValue: any

    switch (sortField) {
      case 'name':
        aValue = a.name.toLowerCase()
        bValue = b.name.toLowerCase()
        break
      case 'type':
        aValue = a.type.toLowerCase()
        bValue = b.type.toLowerCase()
        break
      case 'category':
        aValue = a.category?.name.toLowerCase() || ''
        bValue = b.category?.name.toLowerCase() || ''
        break
      case 'created_at':
        aValue = new Date(a.created_at).getTime()
        bValue = new Date(b.created_at).getTime()
        break
      default:
        return 0
    }

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
    return 0
  })

  // Loading Skeleton
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Template
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden md:table-cell">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden lg:table-cell">
                  Category
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {Array.from({ length: 5 }).map((_, index) => (
                <tr key={index} className="animate-pulse">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gray-200 rounded" />
                      <div className="ml-4 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-32" />
                        <div className="h-3 bg-gray-200 rounded w-48 hidden sm:block" />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                    <div className="h-4 bg-gray-200 rounded w-20" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                    <div className="h-4 bg-gray-200 rounded w-24" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="h-8 bg-gray-200 rounded w-24 ml-auto" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  // Empty State
  if (templates.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200">
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
      </div>
    )
  }

  const SortButton = ({ field, label }: { field: SortField; label: string }) => (
    <button
      onClick={() => handleSort(field)}
      className="group inline-flex items-center space-x-1 hover:text-gray-900 transition-colors"
    >
      <span>{label}</span>
      <ArrowUpDown 
        className={`w-4 h-4 transition-transform ${
          sortField === field 
            ? sortDirection === 'asc' 
              ? 'rotate-180 text-primary-600' 
              : 'text-primary-600'
            : 'opacity-0 group-hover:opacity-50'
        }`}
      />
    </button>
  )

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <SortButton field="name" label="Template" />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <SortButton field="type" label="Type" />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                <SortButton field="category" label="Category" />
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedTemplates.map((template) => {
              const isPrivate = template.template_access_level === 'private'
              
              return (
                <tr
                  key={template.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="relative w-12 h-12 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                        {template.thumbnail_url ? (
                          <Image
                            src={template.thumbnail_url}
                            alt={template.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center">
                            <div className="w-6 h-6 bg-primary-200 rounded" />
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {template.name}
                        </div>
                        {template.description && (
                          <div className="text-sm text-gray-500 line-clamp-1 max-w-md">
                            {template.description}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 border border-primary-200">
                      {template.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                    {template.category ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                        {template.category.name}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => onUseTemplate?.(template)}
                        className="px-3 py-1.5 bg-primary-600 text-white text-xs font-medium rounded hover:bg-primary-700 transition-colors"
                      >
                        Use
                      </button>
                      
                      {isPrivate && showActions && (
                        <div className="relative">
                          <button
                            onClick={() => setActiveMenu(activeMenu === template.id ? null : template.id)}
                            className="p-1.5 rounded hover:bg-gray-100 transition-colors"
                          >
                            <MoreVertical className="w-4 h-4 text-gray-500" />
                          </button>
                          
                          {activeMenu === template.id && (
                            <>
                              <div
                                className="fixed inset-0 z-10"
                                onClick={() => setActiveMenu(null)}
                              />
                              <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-20">
                                <div className="py-1">
                                  {onView && (
                                    <button
                                      onClick={() => {
                                        onView(template)
                                        setActiveMenu(null)
                                      }}
                                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                    >
                                      <Eye className="w-4 h-4 mr-2" />
                                      View
                                    </button>
                                  )}
                                  {onEdit && (
                                    <button
                                      onClick={() => {
                                        onEdit(template)
                                        setActiveMenu(null)
                                      }}
                                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                    >
                                      <Edit className="w-4 h-4 mr-2" />
                                      Edit
                                    </button>
                                  )}
                                  {onDelete && (
                                    <button
                                      onClick={() => {
                                        onDelete(template)
                                        setActiveMenu(null)
                                      }}
                                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
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
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden divide-y divide-gray-200">
        {sortedTemplates.map((template) => {
          const isPrivate = template.template_access_level === 'private'
          
          return (
            <div key={template.id} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start space-x-3">
                <div className="relative w-16 h-16 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                  {template.thumbnail_url ? (
                    <Image
                      src={template.thumbnail_url}
                      alt={template.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center">
                      <div className="w-8 h-8 bg-primary-200 rounded" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900 mb-1">
                    {template.name}
                  </h4>
                  {template.description && (
                    <p className="text-xs text-gray-500 line-clamp-2 mb-2">
                      {template.description}
                    </p>
                  )}
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary-100 text-primary-800">
                      {template.type}
                    </span>
                    {template.category && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700">
                        {template.category.name}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onUseTemplate?.(template)}
                      className="flex-1 px-3 py-1.5 bg-primary-600 text-white text-xs font-medium rounded hover:bg-primary-700 transition-colors"
                    >
                      Use Template
                    </button>
                    
                    {isPrivate && showActions && (
                      <div className="relative">
                        <button
                          onClick={() => setActiveMenu(activeMenu === template.id ? null : template.id)}
                          className="p-1.5 rounded hover:bg-gray-100 transition-colors"
                        >
                          <MoreVertical className="w-4 h-4 text-gray-500" />
                        </button>
                        
                        {activeMenu === template.id && (
                          <>
                            <div
                              className="fixed inset-0 z-10"
                              onClick={() => setActiveMenu(null)}
                            />
                            <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-20">
                              <div className="py-1">
                                {onView && (
                                  <button
                                    onClick={() => {
                                      onView(template)
                                      setActiveMenu(null)
                                    }}
                                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                  >
                                    <Eye className="w-4 h-4 mr-2" />
                                    View
                                  </button>
                                )}
                                {onEdit && (
                                  <button
                                    onClick={() => {
                                      onEdit(template)
                                      setActiveMenu(null)
                                    }}
                                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                  >
                                    <Edit className="w-4 h-4 mr-2" />
                                    Edit
                                  </button>
                                )}
                                {onDelete && (
                                  <button
                                    onClick={() => {
                                      onDelete(template)
                                      setActiveMenu(null)
                                    }}
                                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
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
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
