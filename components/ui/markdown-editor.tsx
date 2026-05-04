'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/lib/i18n'
import {
  Bold,
  Italic,
  Heading1,
  Heading2,
  Heading3,
  Link2,
  Image,
  List,
  ListOrdered,
  Code,
  Quote,
  Minus,
  Eye,
  PencilLine,
  Columns2,
} from 'lucide-react'

export interface MarkdownEditorProps {
  className?: string
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  placeholder?: string
  disabled?: boolean
  minHeight?: number
}

type ViewMode = 'edit' | 'preview' | 'split'

interface ToolbarAction {
  icon: React.ReactNode
  label: string
  prefix: string
  suffix: string
  block?: boolean
}

/**
 * SECURITY: Validate that a URL uses only safe schemes (http/https).
 * Blocks javascript: and data: URIs that could execute arbitrary code
 * when injected into href= or src= attributes.
 */
function isSafeUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    return parsed.protocol === 'https:' || parsed.protocol === 'http:'
  } catch {
    // Relative URLs (no scheme) are safe — they resolve against the current origin.
    return !url.includes(':')
  }
}

function renderMarkdown(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    // Headings
    .replace(/^### (.+)$/gm, '<h3 class="text-base font-semibold mt-3 mb-1">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-lg font-semibold mt-4 mb-1">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-xl font-bold mt-4 mb-2">$1</h1>')
    // Bold & italic
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Inline code
    .replace(/`(.+?)`/g, '<code class="rounded bg-gray-100 px-1 py-0.5 text-sm font-mono">$1</code>')
    // Code blocks
    .replace(
      /```([\s\S]*?)```/g,
      '<pre class="rounded bg-gray-100 p-3 text-sm font-mono overflow-x-auto my-2">$1</pre>'
    )
    // Blockquote
    .replace(
      /^&gt; (.+)$/gm,
      '<blockquote class="border-l-4 border-gray-300 pl-4 italic text-gray-600 my-2">$1</blockquote>'
    )
    // Horizontal rule
    .replace(/^---$/gm, '<hr class="my-4 border-gray-300" />')
    // Images (must come before links)
    // SECURITY: Reject javascript: and data: src values to block XSS via image injection.
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_match, alt, src) => {
      if (!isSafeUrl(src)) return `[image blocked: unsafe URL]`
      return `<img src="${src}" alt="${alt}" class="max-w-full rounded my-2" />`
    })
    // Links
    // SECURITY: Reject javascript: href values to block XSS via link injection.
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_match, label, href) => {
      if (!isSafeUrl(href)) return label
      return `<a href="${href}" class="text-blue-600 underline hover:text-blue-800" target="_blank" rel="noopener noreferrer">${label}</a>`
    })
    // Lists
    .replace(/^\d+\. (.+)$/gm, '<li class="ml-6 list-decimal">$1</li>')
    .replace(/^- (.+)$/gm, '<li class="ml-4 list-disc">$1</li>')
    // Line breaks
    .replace(/\n/g, '<br/>')
}

const MarkdownEditor = React.forwardRef<HTMLDivElement, MarkdownEditorProps>(
  (
    {
      className,
      value,
      defaultValue = '',
      onChange,
      placeholder,
      disabled = false,
      minHeight = 150,
    },
    ref
  ) => {
    const { t } = useTranslation()
    const [mode, setMode] = React.useState<ViewMode>('edit')
    const [internalValue, setInternalValue] = React.useState(defaultValue)
    const textareaRef = React.useRef<HTMLTextAreaElement>(null)
    const currentValue = value !== undefined ? value : internalValue

    const handleChange = React.useCallback(
      (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const val = e.target.value
        if (value === undefined) setInternalValue(val)
        onChange?.(val)
      },
      [value, onChange]
    )

    const insertFormatting = React.useCallback(
      (action: ToolbarAction) => {
        const textarea = textareaRef.current
        if (!textarea) return

        const start = textarea.selectionStart
        const end = textarea.selectionEnd
        const text = currentValue
        const selectedText = text.slice(start, end)

        let newText: string
        let newCursorStart: number
        let newCursorEnd: number

        if (action.block) {
          // Block-level formatting: insert at line start
          const lineStart = text.lastIndexOf('\n', start - 1) + 1
          const before = text.slice(0, lineStart)
          const after = text.slice(end)
          const selected = selectedText || t('text')
          newText = before + action.prefix + selected + action.suffix + after
          newCursorStart = lineStart + action.prefix.length
          newCursorEnd = newCursorStart + selected.length
        } else {
          // Inline formatting: wrap selection
          const before = text.slice(0, start)
          const after = text.slice(end)
          const selected = selectedText || t('text')
          newText = before + action.prefix + selected + action.suffix + after
          newCursorStart = start + action.prefix.length
          newCursorEnd = newCursorStart + selected.length
        }

        if (value === undefined) setInternalValue(newText)
        onChange?.(newText)

        // Restore cursor position
        requestAnimationFrame(() => {
          textarea.focus()
          textarea.setSelectionRange(newCursorStart, newCursorEnd)
        })
      },
      [currentValue, value, onChange, t]
    )

    const toolbarActions: ToolbarAction[] = [
      { icon: <Bold className="h-4 w-4" />, label: t('Bold'), prefix: '**', suffix: '**' },
      { icon: <Italic className="h-4 w-4" />, label: t('Italic'), prefix: '*', suffix: '*' },
      { icon: <Heading1 className="h-4 w-4" />, label: t('Heading 1'), prefix: '# ', suffix: '', block: true },
      { icon: <Heading2 className="h-4 w-4" />, label: t('Heading 2'), prefix: '## ', suffix: '', block: true },
      { icon: <Heading3 className="h-4 w-4" />, label: t('Heading 3'), prefix: '### ', suffix: '', block: true },
      { icon: <Link2 className="h-4 w-4" />, label: t('Link'), prefix: '[', suffix: '](url)' },
      { icon: <Image className="h-4 w-4" />, label: t('Image'), prefix: '![alt](', suffix: ')' },
      { icon: <List className="h-4 w-4" />, label: t('Unordered List'), prefix: '- ', suffix: '', block: true },
      { icon: <ListOrdered className="h-4 w-4" />, label: t('Ordered List'), prefix: '1. ', suffix: '', block: true },
      { icon: <Code className="h-4 w-4" />, label: t('Inline Code'), prefix: '`', suffix: '`' },
      { icon: <Quote className="h-4 w-4" />, label: t('Blockquote'), prefix: '> ', suffix: '', block: true },
      { icon: <Minus className="h-4 w-4" />, label: t('Horizontal Rule'), prefix: '\n---\n', suffix: '', block: true },
    ]

    const modeButtons: { mode: ViewMode; icon: React.ReactNode; label: string }[] = [
      { mode: 'edit', icon: <PencilLine className="h-3.5 w-3.5" />, label: t('Edit') },
      { mode: 'split', icon: <Columns2 className="h-3.5 w-3.5" />, label: t('Split') },
      { mode: 'preview', icon: <Eye className="h-3.5 w-3.5" />, label: t('Preview') },
    ]

    const renderTextarea = () => (
      <textarea
        ref={textareaRef}
        className={cn(
          'w-full resize-y bg-white px-3 py-2 text-sm font-mono',
          'outline-none placeholder:text-gray-400',
          'disabled:cursor-not-allowed disabled:opacity-50'
        )}
        style={{ minHeight: `${minHeight}px` }}
        value={currentValue}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
      />
    )

    const renderPreview = () => (
      <div
        className="prose prose-sm max-w-none px-3 py-2 text-sm overflow-auto"
        style={{ minHeight: `${minHeight}px` }}
        dangerouslySetInnerHTML={{
          __html: currentValue ? renderMarkdown(currentValue) : `<p class="text-gray-400">${t('Nothing to preview')}</p>`,
        }}
      />
    )

    return (
      <div ref={ref} className={cn('rounded-md border border-gray-300 shadow-sm', className)}>
        {/* Toolbar */}
        <div className="flex items-center border-b border-gray-200 px-1">
          {/* Formatting buttons */}
          <div className="flex flex-1 flex-wrap items-center gap-0.5 py-1">
            {toolbarActions.map((action, index) => (
              <button
                key={index}
                type="button"
                onClick={() => insertFormatting(action)}
                disabled={disabled || mode === 'preview'}
                title={action.label}
                className={cn(
                  'rounded p-1.5 text-gray-500 transition-colors',
                  'hover:bg-gray-100 hover:text-gray-700',
                  'disabled:opacity-40 disabled:cursor-not-allowed'
                )}
              >
                {action.icon}
              </button>
            ))}
          </div>

          {/* View mode toggle */}
          <div className="flex items-center border-l border-gray-200 pl-1">
            {modeButtons.map((btn) => (
              <button
                key={btn.mode}
                type="button"
                onClick={() => setMode(btn.mode)}
                className={cn(
                  'inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-medium transition-colors',
                  mode === btn.mode
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                )}
              >
                {btn.icon}
                <span className="hidden sm:inline">{btn.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content area */}
        {mode === 'edit' && renderTextarea()}
        {mode === 'preview' && renderPreview()}
        {mode === 'split' && (
          <div className="grid grid-cols-2 divide-x divide-gray-200">
            <div>{renderTextarea()}</div>
            <div>{renderPreview()}</div>
          </div>
        )}
      </div>
    )
  }
)
MarkdownEditor.displayName = 'MarkdownEditor'

export { MarkdownEditor }
