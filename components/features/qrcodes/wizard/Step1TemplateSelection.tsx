'use client'

import { useState, useMemo } from 'react'
import { QRCodeTemplate } from '@/types/entities/template'
import TemplateGrid from '@/components/templates/TemplateGrid'
import { Search, Sparkles } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface Step1TemplateSelectionProps {
  templates: QRCodeTemplate[]
  selectedTemplateId?: string
  onTemplateSelect: (template: QRCodeTemplate) => void
  onSkip: () => void
  isLoading?: boolean
}

export default function Step1TemplateSelection({
  templates,
  selectedTemplateId: _selectedTemplateId,
  onTemplateSelect,
  onSkip,
  isLoading = false,
}: Step1TemplateSelectionProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')

  // Get unique categories
  const categories = useMemo(() => {
    const cats = new Set<string>()
    templates.forEach((t) => {
      if (t.category) cats.add(t.category.name)
    })
    return ['all', ...Array.from(cats)]
  }, [templates])

  // Filter templates
  const filteredTemplates = useMemo(() => {
    return templates.filter((template) => {
      const matchesSearch =
        !searchQuery ||
        template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.description?.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesCategory =
        categoryFilter === 'all' || template.category?.name === categoryFilter

      return matchesSearch && matchesCategory
    })
  }, [templates, searchQuery, categoryFilter])

  const handleTemplateSelect = (template: QRCodeTemplate) => {
    onTemplateSelect(template)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Choose a Template or Start from Scratch
        </h2>
        <p className="text-gray-600">
          Select a pre-designed template to speed up your QR code creation
        </p>
      </div>

      {/* Start from Scratch Button */}
      <div className="flex justify-center">
        <Button
          onClick={onSkip}
          variant="outline"
          size="lg"
          className="gap-2"
        >
          <Sparkles className="w-5 h-5" />
          Start from Scratch
        </Button>
      </div>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">or choose a template</span>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="rounded-md border border-gray-300 px-4 py-2 bg-white text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat === 'all' ? 'All Categories' : cat}
            </option>
          ))}
        </select>
      </div>

      {/* Template Grid */}
      <div>
        <TemplateGrid
          templates={filteredTemplates}
          onUseTemplate={handleTemplateSelect}
          isLoading={isLoading}
          emptyMessage="No templates found matching your criteria"
        />
      </div>

      {/* Help Text */}
      <div className="text-center text-sm text-gray-500">
        <p>
          Templates include pre-configured designs and settings. You can customize them in the next steps.
        </p>
      </div>
    </div>
  )
}
