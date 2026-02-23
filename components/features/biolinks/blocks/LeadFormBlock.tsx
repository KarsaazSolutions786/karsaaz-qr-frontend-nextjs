'use client'

import { useState } from 'react'
import type { LeadFormBlockData } from '@/types/entities/biolink'

interface LeadFormBlockProps {
  block: LeadFormBlockData
  isEditing?: boolean
  onUpdate?: (data: LeadFormBlockData['data']) => void
}

export default function LeadFormBlock({ block, isEditing, onUpdate }: LeadFormBlockProps) {
  const { title, fields, buttonText = 'Submit', apiEndpoint } = block.data
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)

  if (isEditing) {
    const addField = () => {
      onUpdate?.({
        ...block.data,
        fields: [...fields, { name: '', label: '', type: 'text', required: false }],
      })
    }

    const removeField = (index: number) => {
      onUpdate?.({ ...block.data, fields: fields.filter((_, i) => i !== index) })
    }

    const updateField = (index: number, key: string, value: string | boolean) => {
      const newFields = [...fields]
      newFields[index] = { ...newFields[index], [key]: value } as LeadFormBlockData['data']['fields'][number]
      onUpdate?.({ ...block.data, fields: newFields })
    }

    return (
      <div className="space-y-3 rounded-lg border border-gray-200 bg-white p-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Form Title</label>
          <input
            type="text"
            value={title || ''}
            onChange={(e) => onUpdate?.({ ...block.data, title: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700">Fields</label>
          <button type="button" onClick={addField} className="text-sm text-blue-600 hover:text-blue-700">
            + Add Field
          </button>
        </div>
        {fields.map((field, index) => (
          <div key={index} className="flex flex-wrap gap-2 rounded border border-gray-100 p-2">
            <input
              type="text"
              value={field.label}
              onChange={(e) => updateField(index, 'label', e.target.value)}
              placeholder="Label"
              className="block flex-1 rounded-md border-gray-300 text-sm shadow-sm"
            />
            <input
              type="text"
              value={field.name}
              onChange={(e) => updateField(index, 'name', e.target.value)}
              placeholder="Field name"
              className="block w-28 rounded-md border-gray-300 text-sm shadow-sm"
            />
            <select
              value={field.type}
              onChange={(e) => updateField(index, 'type', e.target.value)}
              className="block w-24 rounded-md border-gray-300 text-sm shadow-sm"
            >
              <option value="text">Text</option>
              <option value="email">Email</option>
              <option value="phone">Phone</option>
              <option value="textarea">Textarea</option>
            </select>
            <button type="button" onClick={() => removeField(index)} className="text-red-600 hover:text-red-700">
              ✕
            </button>
          </div>
        ))}
        <div>
          <label className="block text-sm font-medium text-gray-700">Button Text</label>
          <input
            type="text"
            value={buttonText}
            onChange={(e) => onUpdate?.({ ...block.data, buttonText: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">API Endpoint (optional)</label>
          <input
            type="url"
            value={apiEndpoint || ''}
            onChange={(e) => onUpdate?.({ ...block.data, apiEndpoint: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="rounded-lg bg-green-50 p-6 text-center">
        <p className="font-medium text-green-800">✓ Thank you for your submission!</p>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (apiEndpoint) {
      try {
        await fetch(apiEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        })
      } catch {
        // Silently fail
      }
    }
    setSubmitted(true)
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5">
      {title && <h3 className="mb-4 text-center text-lg font-semibold text-gray-900">{title}</h3>}
      <form onSubmit={handleSubmit} className="space-y-3">
        {fields.map((field) => (
          <div key={field.name}>
            <label className="block text-sm font-medium text-gray-700">{field.label}</label>
            {field.type === 'textarea' ? (
              <textarea
                value={formData[field.name] || ''}
                onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                required={field.required}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            ) : (
              <input
                type={field.type}
                value={formData[field.name] || ''}
                onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                required={field.required}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            )}
          </div>
        ))}
        <button
          type="submit"
          className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          {buttonText}
        </button>
      </form>
    </div>
  )
}
