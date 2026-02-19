'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Filter, Grid3x3, LayoutList } from 'lucide-react'
import { useTemplates, useTemplateCategories } from '@/lib/hooks/queries/useTemplates'
import TemplateGrid from '@/components/templates/TemplateGrid'
import TemplateList from '@/components/templates/TemplateList'
import TemplateFiltersModal from '@/components/templates/TemplateFiltersModal'
import TemplateCategoryFilter from '@/components/templates/TemplateCategoryFilter'
import { DebouncedSearch } from '@/components/common/DebouncedSearch'
import { Pagination } from '@/components/common/Pagination'
import type { TemplateFilters } from '@/types/entities/template'

export default function QRCodeTemplatesPage() {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState<TemplateFilters>({
    access_level: 'all',
  })
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFiltersModal, setShowFiltersModal] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(12)

  const { data: templates, isLoading, error } = useTemplates({
    ...filters,
    search: search || undefined,
  })

  const { data: categories } = useTemplateCategories()

  // Reset to page 1 when filters, category, or search changes
  useEffect(() => {
    setCurrentPage(1)
  }, [filters, search])

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

  // Calculate pagination for the combined templates (shown on the same page)
  const allDisplayedTemplates = [
    ...(privateTemplates || []),
    ...(publicTemplates || []),
  ]
  const totalItems = allDisplayedTemplates.length
  const totalPages = Math.ceil(totalItems / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize
  const paginatedTemplates = allDisplayedTemplates.slice(startIndex, endIndex)

  // Separate paginated templates back into public and private
  const paginatedPrivateTemplates = paginatedTemplates.filter(
    (t) => t.template_access_level === 'private'
  )
  const paginatedPublicTemplates = paginatedTemplates.filter(
    (t) => t.template_access_level === 'public'
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
            <>
              <div className="space-y-8">
                {paginatedPrivateTemplates && paginatedPrivateTemplates.length > 0 && (
                  <section>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                      My Templates ({privateTemplates?.length || 0})
                    </h2>
                    {viewMode === 'grid' ? (
                      <TemplateGrid
                        templates={paginatedPrivateTemplates}
                        onUseTemplate={handleUseTemplate}
                      />
                    ) : (
                      <TemplateList
                        templates={paginatedPrivateTemplates}
                        onUseTemplate={handleUseTemplate}
                      />
                    )}
                  </section>
                )}

                {paginatedPublicTemplates && paginatedPublicTemplates.length > 0 && (
                  <section>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                      Public Templates ({publicTemplates?.length || 0})
                    </h2>
                    {viewMode === 'grid' ? (
                      <TemplateGrid
                        templates={paginatedPublicTemplates}
                        onUseTemplate={handleUseTemplate}
                      />
                    ) : (
                      <TemplateList
                        templates={paginatedPublicTemplates}
                        onUseTemplate={handleUseTemplate}
                      />
                    )}
                  </section>
                )}
              </div>

              {totalPages > 1 && (
                <div className="mt-8">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={totalItems}
                    pageSize={pageSize}
                    onPageChange={setCurrentPage}
                    onPageSizeChange={(newPageSize) => {
                      setPageSize(newPageSize)
                      setCurrentPage(1)
                    }}
                    pageSizeOptions={[12, 24, 36, 48]}
                    showFirstLast={true}
                    showPageNumbers={true}
                    showTotalItems={true}
                    showPageSize={true}
                  />
                </div>
              )}
            </>
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
