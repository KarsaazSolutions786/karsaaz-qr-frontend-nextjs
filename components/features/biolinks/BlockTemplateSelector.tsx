'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { type BioLinkTemplate, BIOLINK_TEMPLATES } from '@/lib/constants/biolink-templates'

interface BlockTemplateSelectorProps {
  onSelect: (blocks: BioLinkTemplate['blocks']) => void
  className?: string
}

const CATEGORIES = [
  { value: 'all', label: 'All' },
  { value: 'personal', label: 'Personal' },
  { value: 'business', label: 'Business' },
  { value: 'creator', label: 'Creator' },
  { value: 'event', label: 'Event' },
] as const

type CategoryFilter = 'all' | BioLinkTemplate['category']

export default function BlockTemplateSelector({ onSelect, className }: BlockTemplateSelectorProps) {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all')

  const filtered =
    activeCategory === 'all'
      ? BIOLINK_TEMPLATES
      : BIOLINK_TEMPLATES.filter((t) => t.category === activeCategory)

  return (
    <div className={cn('space-y-4', className)}>
      {/* Category filter tabs */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <Button
            key={cat.value}
            variant={activeCategory === cat.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveCategory(cat.value as CategoryFilter)}
          >
            {cat.label}
          </Button>
        ))}
      </div>

      {/* Template grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((template) => (
          <Card
            key={template.id}
            className="flex flex-col transition-shadow hover:shadow-md dark:hover:shadow-lg dark:hover:shadow-primary/5"
          >
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl" role="img" aria-label={template.name}>
                  {template.icon}
                </span>
                <div className="min-w-0 flex-1">
                  <CardTitle className="text-base">{template.name}</CardTitle>
                </div>
              </div>
              <CardDescription className="mt-1 line-clamp-2">{template.description}</CardDescription>
            </CardHeader>
            <CardContent className="mt-auto flex items-center justify-between pt-2">
              <Badge variant="secondary">
                {template.blocks.length} {template.blocks.length === 1 ? 'block' : 'blocks'}
              </Badge>
              <Button size="sm" onClick={() => onSelect(template.blocks)}>
                Use Template
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
