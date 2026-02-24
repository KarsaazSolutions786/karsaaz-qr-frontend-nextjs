'use client'

import * as React from 'react'
import { CheckIcon, ChevronUpDownIcon, XMarkIcon, PlusIcon } from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'

// Option types
export interface SelectOptionBase {
  value: string
  label: string
  disabled?: boolean
  icon?: React.ReactNode
  description?: string
}

export interface SelectOptionGroup {
  label: string
  options: SelectOptionBase[]
}

export type SelectOption = SelectOptionBase | SelectOptionGroup

function isOptionGroup(option: SelectOption): option is SelectOptionGroup {
  return 'options' in option
}

// Props interface
export interface EnhancedSearchableSelectProps<T extends SelectOptionBase = SelectOptionBase> {
  // Data
  options: T[] | SelectOptionGroup[]
  value?: string | string[]
  onChange?: (value: string | string[]) => void

  // Features
  multiple?: boolean
  searchable?: boolean
  clearable?: boolean
  creatable?: boolean
  onCreateOption?: (value: string) => Promise<T> | T

  // Async
  isLoading?: boolean
  onSearch?: (query: string) => void | Promise<void>
  loadOptions?: (query: string) => Promise<T[]>

  // UI
  placeholder?: string
  searchPlaceholder?: string
  noResultsText?: string
  loadingText?: string
  createLabel?: (value: string) => string
  maxSelectedDisplay?: number

  // Styling
  className?: string
  optionClassName?: string
  selectedClassName?: string
  dropdownClassName?: string

  // State
  disabled?: boolean
  error?: boolean
  required?: boolean

  // Accessibility
  id?: string
  name?: string
  'aria-label'?: string
  'aria-describedby'?: string

  // Custom rendering
  renderOption?: (option: T, isSelected: boolean, isHighlighted: boolean) => React.ReactNode
  renderValue?: (option: T) => React.ReactNode
  renderSelectedTag?: (option: T, onRemove: () => void) => React.ReactNode
}

export function EnhancedSearchableSelect<T extends SelectOptionBase = SelectOptionBase>({
  options,
  value,
  onChange,
  multiple = false,
  searchable = true,
  clearable = true,
  creatable = false,
  onCreateOption,
  isLoading = false,
  onSearch,
  loadOptions,
  placeholder = 'Select...',
  searchPlaceholder = 'Type to search...',
  noResultsText = 'No results found',
  loadingText = 'Loading...',
  createLabel = val => `Create "${val}"`,
  maxSelectedDisplay = 3,
  className,
  optionClassName,
  selectedClassName,
  dropdownClassName,
  disabled = false,
  error = false,
  required = false,
  id,
  name,
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
  renderOption,
  renderValue,
  renderSelectedTag,
}: EnhancedSearchableSelectProps<T>) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [search, setSearch] = React.useState('')
  const [highlightIndex, setHighlightIndex] = React.useState(0)
  const [asyncOptions, setAsyncOptions] = React.useState<T[]>([])
  const [isLoadingAsync, setIsLoadingAsync] = React.useState(false)
  const [isCreating, setIsCreating] = React.useState(false)

  const containerRef = React.useRef<HTMLDivElement>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const listRef = React.useRef<HTMLDivElement>(null)

  // Flatten options for easy access
  const flatOptions = React.useMemo<T[]>(() => {
    const displayOptions = loadOptions ? asyncOptions : (options as T[] | SelectOptionGroup[])
    const result: T[] = []
    displayOptions.forEach(opt => {
      if (isOptionGroup(opt)) {
        result.push(...(opt.options as T[]))
      } else {
        result.push(opt as T)
      }
    })
    return result
  }, [options, asyncOptions, loadOptions])

  // Get selected options
  const selectedOptions = React.useMemo(() => {
    if (!value) return []
    const values = Array.isArray(value) ? value : [value]
    return values.map(v => flatOptions.find(o => o.value === v)).filter(Boolean) as T[]
  }, [value, flatOptions])

  // Filter options based on search
  const filteredOptions = React.useMemo(() => {
    if (!search || !searchable) return flatOptions
    const query = search.toLowerCase()
    return flatOptions.filter(
      o => o.label.toLowerCase().includes(query) || o.description?.toLowerCase().includes(query)
    )
  }, [flatOptions, search, searchable])

  // Check if we can create a new option
  const canCreate = React.useMemo(() => {
    if (!creatable || !search.trim()) return false
    return !flatOptions.some(o => o.label.toLowerCase() === search.toLowerCase())
  }, [creatable, search, flatOptions])

  // Handle click outside
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
        setSearch('')
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Reset highlight on filter change
  React.useEffect(() => {
    setHighlightIndex(0)
  }, [filteredOptions.length])

  // Load async options
  React.useEffect(() => {
    if (!loadOptions || !isOpen) return

    const fetchOptions = async () => {
      setIsLoadingAsync(true)
      try {
        const result = await loadOptions(search)
        setAsyncOptions(result)
      } catch (error) {
        console.error('Failed to load options:', error)
      } finally {
        setIsLoadingAsync(false)
      }
    }

    const debounce = setTimeout(fetchOptions, 300)
    return () => clearTimeout(debounce)
  }, [loadOptions, search, isOpen])

  // Handle search callback
  React.useEffect(() => {
    if (onSearch && isOpen) {
      onSearch(search)
    }
  }, [onSearch, search, isOpen])

  // Scroll highlighted option into view
  React.useEffect(() => {
    if (isOpen && listRef.current) {
      const highlighted = listRef.current.querySelector('[data-highlighted="true"]')
      highlighted?.scrollIntoView({ block: 'nearest' })
    }
  }, [highlightIndex, isOpen])

  const handleSelect = React.useCallback(
    (selectedValue: string) => {
      if (multiple) {
        const current = Array.isArray(value) ? value : value ? [value] : []
        const newValue = current.includes(selectedValue)
          ? current.filter(v => v !== selectedValue)
          : [...current, selectedValue]
        onChange?.(newValue)
      } else {
        onChange?.(selectedValue)
        setIsOpen(false)
        setSearch('')
      }
    },
    [multiple, value, onChange]
  )

  const handleRemove = React.useCallback(
    (removeValue: string) => {
      if (multiple && Array.isArray(value)) {
        onChange?.(value.filter(v => v !== removeValue))
      }
    },
    [multiple, value, onChange]
  )

  const handleClear = React.useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      onChange?.(multiple ? [] : '')
      setSearch('')
    },
    [multiple, onChange]
  )

  const handleCreate = React.useCallback(async () => {
    if (!onCreateOption || !search.trim()) return

    setIsCreating(true)
    try {
      const newOption = await onCreateOption(search)
      handleSelect(newOption.value)
    } catch (error) {
      console.error('Failed to create option:', error)
    } finally {
      setIsCreating(false)
    }
  }, [onCreateOption, search, handleSelect])

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      if (!isOpen) {
        if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          setIsOpen(true)
        }
        return
      }

      const totalItems = filteredOptions.length + (canCreate ? 1 : 0)

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setHighlightIndex(i => Math.min(i + 1, totalItems - 1))
          break
        case 'ArrowUp':
          e.preventDefault()
          setHighlightIndex(i => Math.max(i - 1, 0))
          break
        case 'Enter':
          e.preventDefault()
          if (highlightIndex === filteredOptions.length && canCreate) {
            handleCreate()
          } else if (filteredOptions[highlightIndex]) {
            handleSelect(filteredOptions[highlightIndex].value)
          }
          break
        case 'Escape':
          e.preventDefault()
          setIsOpen(false)
          setSearch('')
          break
        case 'Backspace':
          if (!search && multiple && selectedOptions.length > 0) {
            handleRemove(selectedOptions[selectedOptions.length - 1]!.value)
          }
          break
      }
    },
    [
      isOpen,
      filteredOptions,
      highlightIndex,
      canCreate,
      handleSelect,
      handleCreate,
      handleRemove,
      search,
      multiple,
      selectedOptions,
    ]
  )

  const showLoading = isLoading || isLoadingAsync || isCreating

  const renderDisplayValue = () => {
    if (selectedOptions.length === 0) {
      return (
        <span className="text-gray-400">
          {isOpen && searchable ? searchPlaceholder : placeholder}
        </span>
      )
    }

    if (multiple) {
      if (selectedOptions.length > maxSelectedDisplay) {
        return <span className="text-gray-700">{selectedOptions.length} selected</span>
      }

      return (
        <div className="flex flex-wrap gap-1">
          {selectedOptions.map(opt =>
            renderSelectedTag ? (
              renderSelectedTag(opt, () => handleRemove(opt.value))
            ) : (
              <span
                key={opt.value}
                className={cn(
                  'inline-flex items-center gap-1 rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700',
                  selectedClassName
                )}
              >
                {renderValue ? renderValue(opt) : opt.label}
                <button
                  type="button"
                  onClick={e => {
                    e.stopPropagation()
                    handleRemove(opt.value)
                  }}
                  className="hover:text-blue-900"
                >
                  <XMarkIcon className="h-3 w-3" />
                </button>
              </span>
            )
          )}
        </div>
      )
    }

    const selected = selectedOptions[0]
    return (
      <span className="flex items-center gap-2 text-gray-700">
        {selected?.icon}
        {renderValue ? renderValue(selected as T) : selected?.label}
      </span>
    )
  }

  const renderOptionContent = (opt: T, isSelected: boolean, isHighlighted: boolean) => {
    if (renderOption) {
      return renderOption(opt, isSelected, isHighlighted)
    }

    return (
      <>
        <div className="flex items-center gap-2 flex-1">
          {opt.icon}
          <div>
            <div className="font-medium">{opt.label}</div>
            {opt.description && <div className="text-xs text-gray-500">{opt.description}</div>}
          </div>
        </div>
        {isSelected && <CheckIcon className="h-4 w-4 text-blue-600 flex-shrink-0" />}
      </>
    )
  }

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <div
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={id ? `${id}-listbox` : undefined}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
        aria-required={required}
        aria-invalid={error}
        className={cn(
          'flex min-h-10 w-full items-center rounded-md border bg-white px-3 py-1.5 text-sm shadow-sm transition-colors',
          'focus-within:ring-2 focus-within:ring-offset-0',
          error
            ? 'border-red-300 focus-within:border-red-500 focus-within:ring-red-200'
            : 'border-gray-300 focus-within:border-blue-500 focus-within:ring-blue-200',
          disabled && 'cursor-not-allowed opacity-50 bg-gray-50'
        )}
        onClick={() => {
          if (!disabled) {
            setIsOpen(true)
            inputRef.current?.focus()
          }
        }}
      >
        <div className="flex-1 flex items-center gap-1 flex-wrap">
          {isOpen && searchable ? (
            <input
              ref={inputRef}
              id={id}
              name={name}
              className="flex-1 min-w-[60px] bg-transparent outline-none placeholder:text-gray-400"
              placeholder={selectedOptions.length === 0 ? placeholder : ''}
              value={search}
              disabled={disabled}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={handleKeyDown}
              autoComplete="off"
            />
          ) : (
            renderDisplayValue()
          )}
        </div>

        <div className="flex items-center gap-1 ml-2 flex-shrink-0">
          {showLoading && (
            <svg className="h-4 w-4 animate-spin text-gray-400" fill="none" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          )}

          {clearable && selectedOptions.length > 0 && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="p-0.5 text-gray-400 hover:text-gray-600 rounded"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          )}

          <ChevronUpDownIcon className="h-4 w-4 text-gray-400" />
        </div>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div
          ref={listRef}
          id={id ? `${id}-listbox` : undefined}
          role="listbox"
          aria-multiselectable={multiple}
          className={cn(
            'absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-200 bg-white py-1 shadow-lg',
            dropdownClassName
          )}
        >
          {showLoading && filteredOptions.length === 0 ? (
            <div className="px-3 py-2 text-sm text-gray-400">{loadingText}</div>
          ) : filteredOptions.length === 0 && !canCreate ? (
            <div className="px-3 py-2 text-sm text-gray-400">{noResultsText}</div>
          ) : (
            <>
              {filteredOptions.map((option, i) => {
                const isSelected = selectedOptions.some(o => o.value === option.value)
                const isHighlighted = i === highlightIndex

                return (
                  <div
                    key={option.value}
                    role="option"
                    aria-selected={isSelected}
                    data-highlighted={isHighlighted}
                    className={cn(
                      'flex items-center px-3 py-2 text-sm cursor-pointer',
                      isHighlighted && 'bg-blue-50',
                      isSelected && !isHighlighted && 'bg-blue-50/50',
                      option.disabled && 'opacity-50 cursor-not-allowed',
                      !isHighlighted && !isSelected && 'hover:bg-gray-50',
                      optionClassName
                    )}
                    onMouseEnter={() => !option.disabled && setHighlightIndex(i)}
                    onClick={() => !option.disabled && handleSelect(option.value)}
                  >
                    {renderOptionContent(option, isSelected, isHighlighted)}
                  </div>
                )
              })}

              {/* Create option */}
              {canCreate && (
                <div
                  role="option"
                  data-highlighted={highlightIndex === filteredOptions.length}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 text-sm cursor-pointer border-t border-gray-100',
                    highlightIndex === filteredOptions.length && 'bg-blue-50'
                  )}
                  onMouseEnter={() => setHighlightIndex(filteredOptions.length)}
                  onClick={handleCreate}
                >
                  <PlusIcon className="h-4 w-4 text-blue-600" />
                  <span className="text-blue-600">{createLabel(search)}</span>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default EnhancedSearchableSelect
