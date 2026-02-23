'use client'

import { useState, useCallback } from 'react'

export interface Checkpoint {
  id: string
  text: string
  available: boolean
}

interface PlanCheckpointsProps {
  checkpoints: Checkpoint[]
  onChange: (checkpoints: Checkpoint[]) => void
}

function generateId() {
  return 'cp-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7)
}

export function PlanCheckpoints({ checkpoints, onChange }: PlanCheckpointsProps) {
  const [newText, setNewText] = useState('')
  const [newAvailable, setNewAvailable] = useState(true)

  const addCheckpoint = useCallback(() => {
    const trimmed = newText.trim()
    if (!trimmed) return
    onChange([...checkpoints, { id: generateId(), text: trimmed, available: newAvailable }])
    setNewText('')
    setNewAvailable(true)
  }, [newText, newAvailable, checkpoints, onChange])

  const removeCheckpoint = useCallback(
    (id: string) => {
      onChange(checkpoints.filter((cp) => cp.id !== id))
    },
    [checkpoints, onChange]
  )

  const toggleAvailable = useCallback(
    (id: string) => {
      onChange(
        checkpoints.map((cp) =>
          cp.id === id ? { ...cp, available: !cp.available } : cp
        )
      )
    },
    [checkpoints, onChange]
  )

  const updateText = useCallback(
    (id: string, text: string) => {
      onChange(checkpoints.map((cp) => (cp.id === id ? { ...cp, text } : cp)))
    },
    [checkpoints, onChange]
  )

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addCheckpoint()
    }
  }

  return (
    <div className="space-y-3">
      {/* Visual timeline */}
      {checkpoints.length > 0 && (
        <div className="relative space-y-0">
          {checkpoints.map((cp, index) => (
            <div key={cp.id} className="flex items-start gap-3 group">
              {/* Timeline indicator */}
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 ${
                    cp.available
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-300 bg-gray-50'
                  }`}
                >
                  {cp.available ? (
                    <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                </div>
                {index < checkpoints.length - 1 && (
                  <div className="w-0.5 h-6 bg-gray-200" />
                )}
              </div>

              {/* Content */}
              <div className="flex flex-1 items-center gap-2 pb-4 min-w-0">
                <label className="flex cursor-pointer items-center gap-1 text-xs text-gray-500 shrink-0">
                  <input
                    type="checkbox"
                    checked={cp.available}
                    onChange={() => toggleAvailable(cp.id)}
                    className="h-3.5 w-3.5 rounded border-gray-300 text-green-600"
                  />
                  Avail
                </label>
                <input
                  type="text"
                  value={cp.text}
                  onChange={(e) => updateText(cp.id, e.target.value)}
                  className="flex-1 rounded border border-gray-200 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => removeCheckpoint(cp.id)}
                  className="rounded p-1 text-red-400 opacity-0 group-hover:opacity-100 hover:bg-red-50 transition-opacity"
                  title="Remove"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add checkpoint input */}
      <div className="flex items-center gap-2">
        <label className="flex cursor-pointer items-center gap-1 text-xs text-gray-500 shrink-0">
          <input
            type="checkbox"
            checked={newAvailable}
            onChange={(e) => setNewAvailable(e.target.checked)}
            className="h-3.5 w-3.5 rounded border-gray-300 text-green-600"
          />
          Avail
        </label>
        <input
          type="text"
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add new checkpoint (e.g. QR Limit: 10)"
          className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
        />
        <button
          type="button"
          onClick={addCheckpoint}
          disabled={!newText.trim()}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Add
        </button>
      </div>

      {checkpoints.length === 0 && (
        <p className="text-xs text-gray-400">
          No checkpoints added yet. Checkpoints are displayed on the pricing page as plan milestones.
        </p>
      )}
    </div>
  )
}
