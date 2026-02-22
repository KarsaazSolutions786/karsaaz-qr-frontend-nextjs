'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface StickerText {
  text: string
  fontSize: number
  color: string
  alignment: 'left' | 'center' | 'right'
}

const DEFAULT_VALUE: StickerText = { text: '', fontSize: 16, color: '#000000', alignment: 'center' }

interface StickerTextInputProps {
  value?: StickerText
  onChange: (value: StickerText) => void
  className?: string
}

export function StickerTextInput({ value, onChange, className }: StickerTextInputProps) {
  const current = value || DEFAULT_VALUE
  const [modalOpen, setModalOpen] = React.useState(false)
  const [draft, setDraft] = React.useState<StickerText>(current)

  const openModal = () => {
    setDraft(current)
    setModalOpen(true)
  }

  const apply = () => {
    onChange(draft)
    setModalOpen(false)
  }

  return (
    <div className={cn('space-y-1', className)}>
      <div className="flex gap-2">
        <input
          type="text"
          value={current.text}
          onChange={(e) => onChange({ ...current, text: e.target.value })}
          placeholder="Sticker text…"
          className={cn(
            'flex h-10 flex-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm',
            'focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
          )}
        />
        <button
          type="button"
          onClick={openModal}
          className={cn(
            'flex h-10 items-center gap-1 rounded-md border border-gray-300 bg-white px-3 text-sm shadow-sm',
            'hover:bg-gray-50 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
          )}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Style
        </button>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setModalOpen(false)}>
          <div className="w-full max-w-md rounded-lg border border-gray-300 bg-white p-5 shadow-lg" onClick={(e) => e.stopPropagation()}>
            <h3 className="mb-4 text-sm font-semibold">Sticker Text Style</h3>
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-700">Text</label>
                <input
                  type="text"
                  value={draft.text}
                  onChange={(e) => setDraft({ ...draft, text: e.target.value })}
                  className={cn(
                    'flex h-9 w-full rounded-md border border-gray-300 bg-white px-3 py-1 text-sm',
                    'focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
                  )}
                />
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="mb-1 block text-xs font-medium text-gray-700">Font Size</label>
                  <input
                    type="number"
                    min={8}
                    max={72}
                    value={draft.fontSize}
                    onChange={(e) => setDraft({ ...draft, fontSize: Number(e.target.value) })}
                    className={cn(
                      'flex h-9 w-full rounded-md border border-gray-300 bg-white px-3 py-1 text-sm',
                      'focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
                    )}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-700">Color</label>
                  <input
                    type="color"
                    value={draft.color}
                    onChange={(e) => setDraft({ ...draft, color: e.target.value })}
                    className="h-9 w-12 cursor-pointer rounded-md border border-gray-300"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-700">Alignment</label>
                <div className="flex gap-1">
                  {(['left', 'center', 'right'] as const).map((a) => (
                    <button
                      key={a}
                      type="button"
                      onClick={() => setDraft({ ...draft, alignment: a })}
                      className={cn(
                        'flex h-9 flex-1 items-center justify-center rounded-md border text-sm',
                        draft.alignment === a
                          ? 'border-blue-500 bg-blue-50 text-blue-600'
                          : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                      )}
                    >
                      {a.charAt(0).toUpperCase() + a.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              {/* Preview */}
              <div className="rounded-md border border-gray-200 bg-gray-50 p-3">
                <p
                  style={{ fontSize: draft.fontSize, color: draft.color, textAlign: draft.alignment }}
                  className="min-h-[2rem] break-words"
                >
                  {draft.text || 'Preview'}
                </p>
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="h-9 rounded-md border border-gray-300 px-4 text-sm hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={apply}
                className="h-9 rounded-md bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
