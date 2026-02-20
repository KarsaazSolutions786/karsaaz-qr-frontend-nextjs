'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Loader2, FileCode2, ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTemplates, useTemplateCategories } from '@/lib/hooks/queries/useTemplates'
import type { QRCodeTemplate } from '@/types/entities/template'

interface TemplateSelectionAdapterProps {
  onStartBlank: () => void
  onSelectTemplate?: (template: QRCodeTemplate) => void
}

/**
 * TemplateSelectionAdapter — Replicates the original Lit Element project's
 * qrcg-new-qrcode-form-adapter component.
 * 
 * Shows two options:
 * 1. "Create Using Template" - Links to templates page
 * 2. "Create Blank QR Code" - Starts the wizard without a template
 * 
 * If templates are not available, automatically triggers blank creation.
 */
export function TemplateSelectionAdapter({
  onStartBlank,
  onSelectTemplate,
}: TemplateSelectionAdapterProps) {
  const { data: templates, isLoading: templatesLoading } = useTemplates()
  const { data: categories, isLoading: categoriesLoading } = useTemplateCategories()
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null)

  const isLoading = templatesLoading || categoriesLoading
  const hasTemplates = templates && templates.length >= 2
  const hasCategories = categories && categories.length > 0

  // Sample templates for preview (shuffled first 4)
  const sampleTemplates = useMemo(() => {
    if (!templates || templates.length === 0) return []
    const shuffled = [...templates].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, 4)
  }, [templates])

  // Templates filtered by selected category
  const filteredTemplates = useMemo(() => {
    if (!templates || !selectedCategoryId) return []
    return templates.filter(t => t.category_id === selectedCategoryId)
  }, [templates, selectedCategoryId])

  // If no templates, skip straight to blank creation
  if (!isLoading && !hasTemplates) {
    // Auto-start blank after a brief moment
    setTimeout(() => onStartBlank(), 0)
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    )
  }

  // Show category templates view
  if (selectedCategoryId && hasCategories) {
    const selectedCategory = categories?.find(c => c.id === selectedCategoryId)
    
    return (
      <div className="space-y-6">
        {/* Back button */}
        <button
          onClick={() => setSelectedCategoryId(null)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Back to options</span>
        </button>

        <h2 className="text-2xl font-semibold text-gray-900">
          {selectedCategory?.name || 'Templates'}
        </h2>

        {filteredTemplates.length === 0 ? (
          <p className="text-gray-500">No templates in this category.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredTemplates.map((template) => (
              <button
                key={template.id}
                onClick={() => onSelectTemplate?.(template)}
                className="group relative aspect-square rounded-xl overflow-hidden border-2 border-transparent hover:border-purple-500 transition-all bg-gray-100"
              >
                {template.thumbnail_url ? (
                  <Image
                    src={template.thumbnail_url}
                    alt={template.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100">
                    <FileCode2 className="w-12 h-12 text-purple-400" />
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                  <p className="text-white text-sm font-medium truncate">
                    {template.name}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    )
  }

  // Main selection view: Template vs Blank
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1
          className="text-2xl md:text-4xl font-semibold mb-2"
          style={{
            background:
              'linear-gradient(90.77deg, #b048b0 9.76%, #a550b9 31.16%, #8073e0 98.02%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Create QR Code
        </h1>
        <p className="text-gray-600">Choose how you want to start</p>
      </div>

      {/* Selection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
        {/* Use Template Option */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 flex flex-col items-center text-center hover:shadow-xl transition-shadow">
          {/* Template Preview Grid */}
          <div className="grid grid-cols-2 gap-2 mb-6 w-full max-w-[200px]">
            {sampleTemplates.map((template) => (
              <div
                key={template.id}
                className="aspect-square rounded-lg overflow-hidden bg-gray-100"
              >
                {template.thumbnail_url ? (
                  <Image
                    src={template.thumbnail_url}
                    alt={template.name}
                    width={100}
                    height={100}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100">
                    <FileCode2 className="w-6 h-6 text-purple-400" />
                  </div>
                )}
              </div>
            ))}
          </div>

          <Link href="/qrcode-templates" className="w-full">
            <Button
              variant="default"
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              Create Using Template
            </Button>
          </Link>
        </div>

        {/* Start Blank Option */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 flex flex-col items-center text-center hover:shadow-xl transition-shadow">
          {/* Blank Icon */}
          <div className="w-full max-w-[200px] aspect-square rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center mb-6 border-2 border-dashed border-gray-300">
            <svg
              width="80"
              height="80"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-purple-500"
            >
              <rect x="3" y="3" width="7" height="7" rx="1" fill="currentColor" opacity="0.3" />
              <rect x="14" y="3" width="7" height="7" rx="1" fill="currentColor" opacity="0.3" />
              <rect x="3" y="14" width="7" height="7" rx="1" fill="currentColor" opacity="0.3" />
              <rect x="14" y="14" width="4" height="4" rx="1" fill="currentColor" />
              <rect x="17" y="17" width="4" height="4" rx="1" fill="currentColor" />
              <rect x="14" y="17" width="3" height="3" rx="0.5" fill="currentColor" opacity="0.5" />
            </svg>
          </div>

          <Button
            variant="outline"
            onClick={onStartBlank}
            className="w-full border-purple-500 text-purple-600 hover:bg-purple-50"
          >
            Create Blank QR Code
          </Button>
        </div>
      </div>

      {/* Template Categories (if available) */}
      {hasCategories && (
        <div className="max-w-3xl mx-auto">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Or browse by category
          </h3>
          <div className="flex flex-wrap gap-2">
            {categories?.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategoryId(category.id)}
                className="px-4 py-2 rounded-full bg-gray-100 hover:bg-purple-100 text-gray-700 hover:text-purple-700 transition-colors text-sm"
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
