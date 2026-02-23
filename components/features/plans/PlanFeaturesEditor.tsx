'use client'

import { useState, useCallback } from 'react'

interface PlanFeaturesEditorProps {
  features: string[]
  onChange: (features: string[]) => void
}

export function PlanFeaturesEditor({ features, onChange }: PlanFeaturesEditorProps) {
  const [newFeature, setNewFeature] = useState('')
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editValue, setEditValue] = useState('')

  const addFeature = useCallback(() => {
    const trimmed = newFeature.trim()
    if (!trimmed) return
    onChange([...features, trimmed])
    setNewFeature('')
  }, [newFeature, features, onChange])

  const removeFeature = useCallback((index: number) => {
    onChange(features.filter((_, i) => i !== index))
    if (editingIndex === index) setEditingIndex(null)
  }, [features, onChange, editingIndex])

  const startEdit = useCallback((index: number) => {
    setEditingIndex(index)
    setEditValue(features[index] ?? '')
  }, [features])

  const saveEdit = useCallback((index: number) => {
    const trimmed = editValue.trim()
    if (!trimmed) return
    const updated = [...features]
    updated[index] = trimmed
    onChange(updated)
    setEditingIndex(null)
  }, [editValue, features, onChange])

  const moveFeature = useCallback((index: number, direction: -1 | 1) => {
    const target = index + direction
    if (target < 0 || target >= features.length) return
    const updated = [...features]
    const temp = updated[index]!
    updated[index] = updated[target]!
    updated[target] = temp
    onChange(updated)
    if (editingIndex === index) setEditingIndex(target)
    else if (editingIndex === target) setEditingIndex(index)
  }, [features, onChange, editingIndex])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addFeature()
    }
  }

  return (
    <div className="space-y-3">
      {/* Add feature input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={newFeature}
          onChange={(e) => setNewFeature(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="e.g. Unlimited scans"
          className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
        />
        <button
          type="button"
          onClick={addFeature}
          disabled={!newFeature.trim()}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Add
        </button>
      </div>

      {/* Feature list */}
      {features.length > 0 && (
        <ul className="divide-y divide-gray-200 rounded-md border border-gray-200">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-2 px-3 py-2">
              {/* Reorder buttons */}
              <div className="flex flex-col">
                <button
                  type="button"
                  onClick={() => moveFeature(index, -1)}
                  disabled={index === 0}
                  className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                  title="Move up"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => moveFeature(index, 1)}
                  disabled={index === features.length - 1}
                  className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                  title="Move down"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>

              {/* Feature text / edit input */}
              <div className="flex-1 min-w-0">
                {editingIndex === index ? (
                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') { e.preventDefault(); saveEdit(index) }
                      if (e.key === 'Escape') setEditingIndex(null)
                    }}
                    autoFocus
                    className="w-full rounded border border-blue-300 px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                ) : (
                  <span className="text-sm text-gray-800 truncate block">{feature}</span>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-1">
                {editingIndex === index ? (
                  <>
                    <button
                      type="button"
                      onClick={() => saveEdit(index)}
                      className="rounded p-1 text-green-600 hover:bg-green-50"
                      title="Save"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingIndex(null)}
                      className="rounded p-1 text-gray-500 hover:bg-gray-100"
                      title="Cancel"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => startEdit(index)}
                    className="rounded p-1 text-gray-500 hover:bg-gray-100"
                    title="Edit"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => removeFeature(index)}
                  className="rounded p-1 text-red-500 hover:bg-red-50"
                  title="Delete"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {features.length === 0 && (
        <p className="text-xs text-gray-400">No features added yet. Add features that will be displayed on the pricing page.</p>
      )}
    </div>
  )
}
