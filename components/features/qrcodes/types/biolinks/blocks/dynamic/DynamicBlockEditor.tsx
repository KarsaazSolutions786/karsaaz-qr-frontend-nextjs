'use client'

import React from 'react'
import {
  DynamicBlockDefinition,
  DynamicBlockField,
  DynamicBlockData,
} from '@/types/entities/dynamic-blocks'

interface DynamicBlockEditorProps {
  definition: DynamicBlockDefinition
  block: DynamicBlockData
  onChange: (block: DynamicBlockData) => void
}

export function DynamicBlockEditor({ definition, block, onChange }: DynamicBlockEditorProps) {
  const sortedFields = [...definition.fields].sort((a, b) => a.sort_order - b.sort_order)

  const updateFieldValue = (fieldName: string, value: string) => {
    onChange({
      ...block,
      field_values: {
        ...block.field_values,
        [fieldName]: value,
      },
    })
  }

  const updateStyle = (styleName: string, value: string) => {
    onChange({
      ...block,
      styles: {
        ...block.styles,
        [styleName]: value,
      },
    })
  }

  const renderField = (field: DynamicBlockField) => {
    const value = block.field_values[field.name] || ''
    const label = field.label || field.name

    switch (field.type) {
      case 'text':
        return (
          <div key={field.id} className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              {label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              type="text"
              value={value}
              onChange={e => updateFieldValue(field.name, e.target.value)}
              placeholder={field.placeholder}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        )

      case 'textarea':
        return (
          <div key={field.id} className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              {label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <textarea
              value={value}
              onChange={e => updateFieldValue(field.name, e.target.value)}
              placeholder={field.placeholder}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        )

      case 'number':
        return (
          <div key={field.id} className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              {label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              type="number"
              value={value}
              onChange={e => updateFieldValue(field.name, e.target.value)}
              placeholder={field.placeholder}
              min={field.validation?.min}
              max={field.validation?.max}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        )

      case 'url':
        return (
          <div key={field.id} className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              {label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              type="url"
              value={value}
              onChange={e => updateFieldValue(field.name, e.target.value)}
              placeholder={field.placeholder || 'https://'}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        )

      case 'email':
        return (
          <div key={field.id} className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              {label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              type="email"
              value={value}
              onChange={e => updateFieldValue(field.name, e.target.value)}
              placeholder={field.placeholder || 'email@example.com'}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        )

      case 'color':
        return (
          <div key={field.id} className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              {label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="flex gap-2">
              <input
                type="color"
                value={value || '#000000'}
                onChange={e => updateFieldValue(field.name, e.target.value)}
                className="h-10 w-16 rounded border cursor-pointer"
              />
              <input
                type="text"
                value={value}
                onChange={e => updateFieldValue(field.name, e.target.value)}
                placeholder="#000000"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
        )

      case 'image':
        return (
          <div key={field.id} className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              {label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              type="url"
              value={value}
              onChange={e => updateFieldValue(field.name, e.target.value)}
              placeholder="Image URL or upload"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {value && (
              <img
                src={value}
                alt="Preview"
                className="mt-2 max-h-32 rounded-lg object-contain"
                onError={e => {
                  ;(e.target as HTMLImageElement).style.display = 'none'
                }}
              />
            )}
          </div>
        )

      case 'custom-code':
        return (
          <div key={field.id} className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              {label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <textarea
              value={value}
              onChange={e => updateFieldValue(field.name, e.target.value)}
              placeholder={field.placeholder || 'Enter HTML/CSS code'}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
            />
          </div>
        )

      default:
        return (
          <div key={field.id} className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">{label}</label>
            <input
              type="text"
              value={value}
              onChange={e => updateFieldValue(field.name, e.target.value)}
              placeholder={field.placeholder}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        )
    }
  }

  return (
    <div className="space-y-4">
      {/* Custom Fields */}
      <div className="space-y-4">{sortedFields.map(field => renderField(field))}</div>

      {/* Style Options */}
      <div className="border-t pt-4 mt-4 space-y-4">
        <h4 className="font-medium text-gray-900">Style Options</h4>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Text Color</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={block.styles.text_color || '#000000'}
                onChange={e => updateStyle('text_color', e.target.value)}
                className="h-10 w-12 rounded border cursor-pointer"
              />
              <input
                type="text"
                value={block.styles.text_color || ''}
                onChange={e => updateStyle('text_color', e.target.value)}
                placeholder="#000000"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Background Color</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={block.styles.background_color || '#ffffff'}
                onChange={e => updateStyle('background_color', e.target.value)}
                className="h-10 w-12 rounded border cursor-pointer"
              />
              <input
                type="text"
                value={block.styles.background_color || ''}
                onChange={e => updateStyle('background_color', e.target.value)}
                placeholder="#ffffff"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DynamicBlockEditor
