/**
 * TemplateCategoryFilter Component
 * 
 * Sidebar category filter for templates.
 */

'use client'

import React from 'react'
import { TemplateCategory } from '@/types/entities/template'
import { Folder } from 'lucide-react'

export interface TemplateCategoryFilterProps {
  categories: TemplateCategory[]
  selectedCategoryId?: number
  onCategoryChange: (categoryId?: number) => void
  templateCounts?: Record<number, number>
}

export default function TemplateCategoryFilter({
  categories,
  selectedCategoryId,
  onCategoryChange,
  templateCounts = {},
}: TemplateCategoryFilterProps) {
  const totalCount = Object.values(templateCounts).reduce((sum, count) => sum + count, 0)
  const isAllSelected = selectedCategoryId === undefined

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
        <h3 className="text-sm font-semibold text-gray-900">Categories</h3>
      </div>

      {/* Categories List */}
      <div className="divide-y divide-gray-100">
        {/* All Categories Option */}
        <button
          onClick={() => onCategoryChange(undefined)}
          className={`w-full flex items-center justify-between px-4 py-3 text-left transition-colors ${
            isAllSelected
              ? 'bg-primary-50 text-primary-700 hover:bg-primary-100'
              : 'text-gray-700 hover:bg-gray-50'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`flex-shrink-0 w-8 h-8 rounded-md flex items-center justify-center ${
                isAllSelected ? 'bg-primary-100' : 'bg-gray-100'
              }`}
            >
              <Folder
                className={`w-4 h-4 ${isAllSelected ? 'text-primary-600' : 'text-gray-500'}`}
              />
            </div>
            <span className={`text-sm font-medium ${isAllSelected ? 'text-primary-900' : ''}`}>
              All Categories
            </span>
          </div>
          {totalCount > 0 && (
            <span
              className={`flex-shrink-0 inline-flex items-center justify-center min-w-[24px] h-6 px-2 rounded-full text-xs font-medium ${
                isAllSelected
                  ? 'bg-primary-200 text-primary-800'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              {totalCount}
            </span>
          )}
        </button>

        {/* Individual Categories */}
        {categories.map((category) => {
          const isSelected = selectedCategoryId === category.id
          const count = templateCounts[category.id] || 0

          return (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={`w-full flex items-center justify-between px-4 py-3 text-left transition-colors ${
                isSelected
                  ? 'bg-primary-50 text-primary-700 hover:bg-primary-100'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {category.icon ? (
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-md flex items-center justify-center ${
                      isSelected ? 'bg-primary-100' : 'bg-gray-100'
                    }`}
                  >
                    <span className="text-lg">{category.icon}</span>
                  </div>
                ) : (
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-md flex items-center justify-center ${
                      isSelected ? 'bg-primary-100' : 'bg-gray-100'
                    }`}
                  >
                    <Folder
                      className={`w-4 h-4 ${isSelected ? 'text-primary-600' : 'text-gray-500'}`}
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm font-medium truncate ${
                      isSelected ? 'text-primary-900' : ''
                    }`}
                  >
                    {category.name}
                  </p>
                  {category.description && (
                    <p className="text-xs text-gray-500 truncate mt-0.5">
                      {category.description}
                    </p>
                  )}
                </div>
              </div>
              {count > 0 && (
                <span
                  className={`flex-shrink-0 inline-flex items-center justify-center min-w-[24px] h-6 px-2 rounded-full text-xs font-medium ml-2 ${
                    isSelected
                      ? 'bg-primary-200 text-primary-800'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Empty State */}
      {categories.length === 0 && (
        <div className="px-4 py-8 text-center">
          <Folder className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-500">No categories available</p>
        </div>
      )}
    </div>
  )
}
