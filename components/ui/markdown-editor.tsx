'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface MarkdownEditorProps {
  className?: string
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  placeholder?: string
  disabled?: boolean
}

function renderMarkdown(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/^### (.+)$/gm, '<h3 class="text-base font-semibold mt-3 mb-1">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-lg font-semibold mt-4 mb-1">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-xl font-bold mt-4 mb-2">$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code class="rounded bg-gray-100 px-1 py-0.5 text-sm">$1</code>')
    .replace(/^- (.+)$/gm, '<li class="ml-4 list-disc">$1</li>')
    .replace(/\n/g, '<br/>')
}

const MarkdownEditor = React.forwardRef<HTMLDivElement, MarkdownEditorProps>(
  ({ className, value, defaultValue = '', onChange, placeholder, disabled = false }, ref) => {
    const [mode, setMode] = React.useState<'edit' | 'preview'>('edit')
    const [internalValue, setInternalValue] = React.useState(defaultValue)
    const currentValue = value !== undefined ? value : internalValue

    const handleChange = React.useCallback(
      (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const val = e.target.value
        if (value === undefined) setInternalValue(val)
        onChange?.(val)
      },
      [value, onChange]
    )

    return (
      <div ref={ref} className={cn('rounded-md border border-gray-300 shadow-sm', className)}>
        <div className="flex border-b border-gray-200">
          <button
            type="button"
            className={cn(
              'px-4 py-2 text-sm font-medium transition-colors',
              mode === 'edit' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'
            )}
            onClick={() => setMode('edit')}
          >
            Edit
          </button>
          <button
            type="button"
            className={cn(
              'px-4 py-2 text-sm font-medium transition-colors',
              mode === 'preview' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'
            )}
            onClick={() => setMode('preview')}
          >
            Preview
          </button>
        </div>
        {mode === 'edit' ? (
          <textarea
            className={cn(
              'w-full resize-y rounded-b-md bg-white px-3 py-2 text-sm',
              'min-h-[150px] outline-none placeholder:text-gray-400',
              'disabled:cursor-not-allowed disabled:opacity-50'
            )}
            value={currentValue}
            onChange={handleChange}
            placeholder={placeholder}
            disabled={disabled}
          />
        ) : (
          <div
            className="prose prose-sm min-h-[150px] max-w-none px-3 py-2 text-sm"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(currentValue) }}
          />
        )}
      </div>
    )
  }
)
MarkdownEditor.displayName = 'MarkdownEditor'

export { MarkdownEditor }
