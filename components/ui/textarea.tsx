'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  showCount?: boolean
  autoResize?: boolean
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, showCount = false, autoResize = false, maxLength, onChange, ...props }, ref) => {
    const [count, setCount] = React.useState(0)
    const innerRef = React.useRef<HTMLTextAreaElement>(null)
    const combinedRef = React.useCallback(
      (node: HTMLTextAreaElement | null) => {
        (innerRef as React.MutableRefObject<HTMLTextAreaElement | null>).current = node
        if (typeof ref === 'function') ref(node)
        else if (ref) (ref as React.MutableRefObject<HTMLTextAreaElement | null>).current = node
      },
      [ref]
    )

    const resize = React.useCallback(() => {
      if (autoResize && innerRef.current) {
        innerRef.current.style.height = 'auto'
        innerRef.current.style.height = `${innerRef.current.scrollHeight}px`
      }
    }, [autoResize])

    React.useEffect(() => {
      resize()
    }, [resize])

    const handleChange = React.useCallback(
      (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setCount(e.target.value.length)
        resize()
        onChange?.(e)
      },
      [onChange, resize]
    )

    return (
      <div className="relative">
        <textarea
          ref={combinedRef}
          className={cn(
            'flex min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm transition-colors',
            'placeholder:text-gray-400',
            'focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500',
            'disabled:cursor-not-allowed disabled:opacity-50',
            autoResize && 'resize-none overflow-hidden',
            className
          )}
          maxLength={maxLength}
          onChange={handleChange}
          {...props}
        />
        {showCount && (
          <span className="absolute bottom-2 right-3 text-xs text-gray-400">
            {count}{maxLength ? `/${maxLength}` : ''}
          </span>
        )}
      </div>
    )
  }
)
Textarea.displayName = 'Textarea'

export { Textarea }
