'use client'

import React from 'react'
import { DynamicBlockDefinition, DynamicBlockData } from '@/types/entities/dynamic-blocks'

interface DynamicBlockPreviewProps {
  definition: DynamicBlockDefinition
  block: DynamicBlockData
}

export function DynamicBlockPreview({ definition, block }: DynamicBlockPreviewProps) {
  const sortedFields = [...definition.fields].sort((a, b) => a.sort_order - b.sort_order)

  const styles: React.CSSProperties = {
    color: block.styles.text_color,
    backgroundColor: block.styles.background_color,
    fontFamily: block.styles.font_family,
    fontSize: block.styles.font_size,
  }

  const renderFieldValue = (field: (typeof sortedFields)[0]) => {
    const value = block.field_values[field.name]
    if (!value) return null

    switch (field.type) {
      case 'image':
        return (
          <img
            src={value}
            alt={field.label || field.name}
            className="w-full h-auto rounded-lg"
            onError={e => {
              ;(e.target as HTMLImageElement).style.display = 'none'
            }}
          />
        )

      case 'url':
        return (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline break-all"
          >
            {value}
          </a>
        )

      case 'email':
        return (
          <a href={`mailto:${value}`} className="text-blue-600 hover:underline">
            {value}
          </a>
        )

      case 'custom-code':
        return (
          <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: value }} />
        )

      case 'textarea':
        return <p className="whitespace-pre-wrap text-sm">{value}</p>

      default:
        return <span className="text-sm">{value}</span>
    }
  }

  // Get the first text field as the primary content
  const primaryField = sortedFields.find(f => f.type === 'text' && block.field_values[f.name])

  return (
    <div className="p-4 rounded-lg" style={styles}>
      {/* Block Icon and Name */}
      <div className="flex items-center gap-2 mb-3">
        {definition.icon_url ? (
          <img src={definition.icon_url} alt={definition.name} className="w-6 h-6 object-contain" />
        ) : definition.icon_emoji ? (
          <span className="text-xl">{definition.icon_emoji}</span>
        ) : (
          <span className="text-xl">📦</span>
        )}
        <span className="font-medium text-sm opacity-60">{definition.name}</span>
      </div>

      {/* Field Values */}
      <div className="space-y-2">
        {sortedFields.map(field => {
          const value = block.field_values[field.name]
          if (!value) return null

          return (
            <div key={field.id}>
              {field.type === 'text' && field === primaryField ? (
                <h4 className="font-semibold">{value}</h4>
              ) : (
                renderFieldValue(field)
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default DynamicBlockPreview
