'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Filter, Grid3x3, LayoutList } from 'lucide-react'
import { useTemplates, useTemplateCategories } from '@/lib/hooks/queries/useTemplates'
import TemplateGrid from '@/components/templates/TemplateGrid'
import TemplateList from '@/components/templates/TemplateList'
import TemplateFiltersModal from '@/components/templates/TemplateFiltersModal'
import TemplateCategoryFilter from '@/components/templates/TemplateCategoryFilter'
import { DebouncedSearch } from '@/components/common/DebouncedSearch'
import type { TemplateFilters } from '@/types/entities/template'

export default function QRCodeTemplatesPage() {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState<TemplateFilters>({
    access_level: 'all',
  })
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFiltersModal, setShowFiltersModal] = useState(false)

  const { data: templates, isLoading, error } = useTemplates({
    ...filters,
    search: search || undefined,
  })

  const { data: categories } = useTemplateCategories()

  const handleCategoryChange = (categoryId?: number) => {
    setFilters((prev) => ({
      ...prev,
      category_id: categoryId || undefined,
    }))
  }

  const handleUseTemplate = (template: { id: number }) => {
    router.push(`/qrcodes/new?template_id=${template.id}`)
  }

  const publicTemplates = templates?.filter(
    (t) => t.template_access_level === 'public'
  )
  const privateTemplates = templates?.filter(
    (t) => t.template_access_level === 'private'
  )

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">QR Code Templates</h1>
        <p className="mt-2 text-sm text-gray-600">
          Choose a template to quickly create professional QR codes
        </p>
      </div>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1 max-w-md">
          <DebouncedSearch
            onSearch={setSearch}
            placeholder="Search templates..."
            delay={300}
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFiltersModal(true)}
            className="inline-flex items-center rounded-md bg-white border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </button>

          <div className="inline-flex rounded-md shadow-sm">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-2 text-sm font-medium rounded-l-md border ${
                viewMode === 'grid'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Grid3x3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-2 text-sm font-medium rounded-r-md border-t border-r border-b ${
                viewMode === 'list'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              <LayoutList className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex gap-6">
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
            <TemplateCategoryFilter
              categories={categories || []}
              selectedCategoryId={filters.category_id}
              onCategoryChange={handleCategoryChange}
            />
          </div>
        </aside>

        <div className="flex-1">
          {isLoading && (
            <div className="text-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]" />
              <p className="mt-4 text-gray-600">Loading templates...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <p className="text-red-800">Failed to load templates</p>
            </div>
          )}

          {!isLoading && !error && templates?.length === 0 && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
              <p className="text-gray-600 mb-4">No templates found</p>
              <p className="text-sm text-gray-500">
                Try adjusting your search or filters
              </p>
            </div>
          )}

          {!isLoading && !error && templates && templates.length > 0 && (
            <div className="space-y-8">
              {privateTemplates && privateTemplates.length > 0 && (
                <section>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    My Templates ({privateTemplates.length})
                  </h2>
                  {viewMode === 'grid' ? (
                    <TemplateGrid
                      templates={privateTemplates}
                      onUseTemplate={handleUseTemplate}
                    />
                  ) : (
                    <TemplateList
                      templates={privateTemplates}
                      onUseTemplate={handleUseTemplate}
                    />
                  )}
                </section>
              )}

              {publicTemplates && publicTemplates.length > 0 && (
                <section>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Public Templates ({publicTemplates.length})
                  </h2>
                  {viewMode === 'grid' ? (
                    <TemplateGrid
                      templates={publicTemplates}
                      onUseTemplate={handleUseTemplate}
                    />
                  ) : (
                    <TemplateList
                      templates={publicTemplates}
                      onUseTemplate={handleUseTemplate}
                    />
                  )}
                </section>
              )}
            </div>
          )}

          {!isLoading && templates && templates.length > 0 && (
            <div className="mt-6 text-sm text-gray-600 text-center">
              Showing {templates.length} template{templates.length !== 1 ? 's' : ''}
            </div>
          )}
        </div>
      </div>

      <TemplateFiltersModal
        isOpen={showFiltersModal}
        onClose={() => setShowFiltersModal(false)}
        filters={filters}
        onApplyFilters={(newFilters) => {
          setFilters(newFilters)
          setShowFiltersModal(false)
        }}
        categories={categories || []}
      />
    </div>
  )
}
