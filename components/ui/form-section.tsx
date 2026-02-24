'use client'

import React, { useState, useRef, useEffect } from 'react'
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'

interface FormSectionProps {
  title: string
  description?: string
  icon?: React.ReactNode
  children: React.ReactNode
  defaultExpanded?: boolean
  collapsible?: boolean
  className?: string
  headerClassName?: string
  contentClassName?: string
  badge?: string | number
  required?: boolean
}

export function FormSection({
  title,
  description,
  icon,
  children,
  defaultExpanded = true,
  collapsible = true,
  className,
  headerClassName,
  contentClassName,
  badge,
  required,
}: FormSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)
  const contentRef = useRef<HTMLDivElement>(null)
  const [contentHeight, setContentHeight] = useState<number | 'auto'>('auto')

  useEffect(() => {
    if (contentRef.current) {
      if (isExpanded) {
        setContentHeight(contentRef.current.scrollHeight)
        // After transition, set to auto for dynamic content
        const timer = setTimeout(() => setContentHeight('auto'), 300)
        return () => clearTimeout(timer)
      } else {
        setContentHeight(contentRef.current.scrollHeight)
        // Force reflow
        contentRef.current.offsetHeight
        setContentHeight(0)
      }
    }
  }, [isExpanded])

  const handleToggle = () => {
    if (collapsible) {
      setIsExpanded(!isExpanded)
    }
  }

  return (
    <div className={cn('border border-gray-200 rounded-lg overflow-hidden bg-white', className)}>
      {/* Header */}
      <div
        className={cn(
          'flex items-center justify-between px-4 py-3 bg-gray-50',
          collapsible && 'cursor-pointer hover:bg-gray-100 transition-colors',
          headerClassName
        )}
        onClick={handleToggle}
      >
        <div className="flex items-center gap-3">
          {icon && <span className="text-gray-500">{icon}</span>}
          <div>
            <h3 className="font-medium text-gray-900">
              {title}
              {required && <span className="text-red-500 ml-1">*</span>}
              {badge !== undefined && (
                <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                  {badge}
                </span>
              )}
            </h3>
            {description && <p className="text-sm text-gray-500 mt-0.5">{description}</p>}
          </div>
        </div>
        {collapsible && (
          <button
            type="button"
            className="p-1 hover:bg-gray-200 rounded transition-colors"
            aria-expanded={isExpanded}
            aria-label={isExpanded ? 'Collapse section' : 'Expand section'}
          >
            {isExpanded ? (
              <ChevronUpIcon className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronDownIcon className="h-5 w-5 text-gray-500" />
            )}
          </button>
        )}
      </div>

      {/* Content */}
      <div
        ref={contentRef}
        className={cn(
          'transition-all duration-300 ease-in-out overflow-hidden',
          !isExpanded && 'opacity-0'
        )}
        style={{
          height: typeof contentHeight === 'number' ? `${contentHeight}px` : contentHeight,
        }}
      >
        <div className={cn('p-4', contentClassName)}>{children}</div>
      </div>
    </div>
  )
}

interface FormFieldProps {
  label?: string
  htmlFor?: string
  description?: string
  error?: string
  required?: boolean
  children: React.ReactNode
  className?: string
}

export function FormField({
  label,
  htmlFor,
  description,
  error,
  required,
  children,
  className,
}: FormFieldProps) {
  return (
    <div className={cn('space-y-1', className)}>
      {label && (
        <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      {description && <p className="text-sm text-gray-500">{description}</p>}
      {children}
      {error && (
        <p className="text-sm text-red-600 flex items-center gap-1">
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </p>
      )}
    </div>
  )
}

interface FormGroupProps {
  children: React.ReactNode
  columns?: 1 | 2 | 3 | 4
  gap?: 'sm' | 'md' | 'lg'
  className?: string
}

export function FormGroup({ children, columns = 1, gap = 'md', className }: FormGroupProps) {
  const gapClasses = {
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
  }

  const columnClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  }

  return (
    <div className={cn('grid', columnClasses[columns], gapClasses[gap], className)}>{children}</div>
  )
}

interface InputErrorsProps {
  errors?: string | string[] | null
  className?: string
}

export function InputErrors({ errors, className }: InputErrorsProps) {
  if (!errors) return null

  const errorList = Array.isArray(errors) ? errors : [errors]

  if (errorList.length === 0) return null

  return (
    <div className={cn('space-y-1', className)}>
      {errorList.map((error, index) => (
        <p key={index} className="text-sm text-red-600 flex items-center gap-1">
          <svg className="h-4 w-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </p>
      ))}
    </div>
  )
}

interface FormCommentProps {
  children: React.ReactNode
  type?: 'info' | 'warning' | 'success' | 'error'
  className?: string
}

export function FormComment({ children, type = 'info', className }: FormCommentProps) {
  const typeClasses = {
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
  }

  const iconByType = {
    info: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
          clipRule="evenodd"
        />
      </svg>
    ),
    warning: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
          clipRule="evenodd"
        />
      </svg>
    ),
    success: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
          clipRule="evenodd"
        />
      </svg>
    ),
    error: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
          clipRule="evenodd"
        />
      </svg>
    ),
  }

  return (
    <div
      className={cn('flex items-start gap-3 p-4 border rounded-lg', typeClasses[type], className)}
    >
      <span className="flex-shrink-0">{iconByType[type]}</span>
      <div className="text-sm">{children}</div>
    </div>
  )
}

export default FormSection
