/**
 * TemplateFiltersModal Component
 * 
 * Modal for filtering QR code templates.
 */

'use client'

import React, { useState, useEffect } from 'react'
import { X, Filter, RotateCcw } from 'lucide-react'
import { TemplateFilters, TemplateCategory } from '@/types/entities/template'

export interface TemplateFiltersModalProps {
  isOpen: boolean
  onClose: () => void
  filters: TemplateFilters
  onApplyFilters: (filters: TemplateFilters) => void
  categories: TemplateCategory[]
}

const QR_TYPES = [
  { value: '', label: 'All Types' },
  { value: 'url', label: 'URL' },
  { value: 'text', label: 'Text' },
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Phone' },
  { value: 'sms', label: 'SMS' },
  { value: 'wifi', label: 'WiFi' },
  { value: 'vcard', label: 'vCard' },
  { value: 'location', label: 'Location' },
]

const ACCESS_LEVELS = [
  { value: 'all', label: 'All Templates' },
  { value: 'public', label: 'Public Only' },
  { value: 'private', label: 'Private Only' },
]

export default function TemplateFiltersModal({
  isOpen,
  onClose,
  filters,
  onApplyFilters,
  categories,
}: TemplateFiltersModalProps) {
  const [localFilters, setLocalFilters] = useState<TemplateFilters>(filters)

  useEffect(() => {
    if (isOpen) {
      setLocalFilters(filters)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen, filters])

  if (!isOpen) return null

  const handleApply = () => {
    onApplyFilters(localFilters)
    onClose()
  }

  const handleClearFilters = () => {
    const clearedFilters: TemplateFilters = {
      category_id: undefined,
      type: undefined,
      access_level: 'all',
      search: '',
    }
    setLocalFilters(clearedFilters)
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose()
    }
  }

  useEffect(() => {
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown)
      return () => window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="filter-modal-title"
    >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-primary-600" />
            <h2 id="filter-modal-title" className="text-lg font-semibold text-gray-900">
              Filter Templates
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-gray-100 transition-colors"
            aria-label="Close filters"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-4 space-y-4 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Category Filter */}
          <div>
            <label
              htmlFor="category-filter"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Category
            </label>
            <select
              id="category-filter"
              value={localFilters.category_id || ''}
              onChange={(e) =>
                setLocalFilters({
                  ...localFilters,
                  category_id: e.target.value ? Number(e.target.value) : undefined,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* QR Type Filter */}
          <div>
            <label
              htmlFor="type-filter"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              QR Code Type
            </label>
            <select
              id="type-filter"
              value={localFilters.type || ''}
              onChange={(e) =>
                setLocalFilters({
                  ...localFilters,
                  type: e.target.value || undefined,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              {QR_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Access Level Filter */}
          <div>
            <label
              htmlFor="access-filter"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Access Level
            </label>
            <div className="space-y-2">
              {ACCESS_LEVELS.map((level) => (
                <label
                  key={level.value}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="access-level"
                    value={level.value}
                    checked={localFilters.access_level === level.value}
                    onChange={(e) =>
                      setLocalFilters({
                        ...localFilters,
                        access_level: e.target.value as 'public' | 'private' | 'all',
                      })
                    }
                    className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700">{level.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={handleClearFilters}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Clear Filters
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
