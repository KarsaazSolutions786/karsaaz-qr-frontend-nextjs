'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface MenuItem {
  id: string
  label: string
  children?: MenuItem[]
}

export interface MenuInputProps {
  className?: string
  items?: MenuItem[]
  onChange?: (items: MenuItem[]) => void
  disabled?: boolean
  maxDepth?: number
}

let menuItemCounter = 0
function generateId() {
  return `menu-${Date.now()}-${++menuItemCounter}`
}

interface MenuItemRowProps {
  item: MenuItem
  depth: number
  maxDepth: number
  disabled: boolean
  onUpdate: (id: string, label: string) => void
  onRemove: (id: string) => void
  onAddChild: (parentId: string) => void
  onMoveUp: (id: string) => void
  onMoveDown: (id: string) => void
  isFirst: boolean
  isLast: boolean
}

function MenuItemRow({
  item, depth, maxDepth, disabled, onUpdate, onRemove, onAddChild, onMoveUp, onMoveDown, isFirst, isLast,
}: MenuItemRowProps) {
  return (
    <div>
      <div className="flex items-center gap-1 py-1" style={{ paddingLeft: `${depth * 1.5}rem` }}>
        <div className="flex gap-0.5">
          <button
            type="button"
            disabled={disabled || isFirst}
            className="rounded p-0.5 text-gray-400 hover:text-gray-600 disabled:opacity-30"
            onClick={() => onMoveUp(item.id)}
            title="Move up"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
          </button>
          <button
            type="button"
            disabled={disabled || isLast}
            className="rounded p-0.5 text-gray-400 hover:text-gray-600 disabled:opacity-30"
            onClick={() => onMoveDown(item.id)}
            title="Move down"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </button>
        </div>
        <input
          type="text"
          value={item.label}
          disabled={disabled}
          placeholder="Menu label"
          className={cn(
            'h-8 flex-1 rounded-md border border-gray-300 bg-white px-2 text-sm shadow-sm transition-colors',
            'focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500',
            'disabled:cursor-not-allowed disabled:opacity-50'
          )}
          onChange={(e) => onUpdate(item.id, e.target.value)}
        />
        {depth < maxDepth && (
          <button
            type="button"
            disabled={disabled}
            className="rounded p-1 text-blue-500 hover:bg-blue-50 disabled:opacity-50"
            onClick={() => onAddChild(item.id)}
            title="Add sub-item"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          </button>
        )}
        <button
          type="button"
          disabled={disabled}
          className="rounded p-1 text-red-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
          onClick={() => onRemove(item.id)}
          title="Remove"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>
      {item.children?.map((child, i) => (
        <MenuItemRow
          key={child.id}
          item={child}
          depth={depth + 1}
          maxDepth={maxDepth}
          disabled={disabled}
          onUpdate={onUpdate}
          onRemove={onRemove}
          onAddChild={onAddChild}
          onMoveUp={onMoveUp}
          onMoveDown={onMoveDown}
          isFirst={i === 0}
          isLast={i === (item.children?.length ?? 1) - 1}
        />
      ))}
    </div>
  )
}

const MenuInput = React.forwardRef<HTMLDivElement, MenuInputProps>(
  ({ className, items: controlledItems, onChange, disabled = false, maxDepth = 3 }, ref) => {
    const [internalItems, setInternalItems] = React.useState<MenuItem[]>(controlledItems || [])
    const items = controlledItems !== undefined ? controlledItems : internalItems

    const emit = React.useCallback(
      (newItems: MenuItem[]) => {
        if (controlledItems === undefined) setInternalItems(newItems)
        onChange?.(newItems)
      },
      [controlledItems, onChange]
    )

    const deepUpdate = (list: MenuItem[], id: string, label: string): MenuItem[] =>
      list.map((item) =>
        item.id === id
          ? { ...item, label }
          : item.children
          ? { ...item, children: deepUpdate(item.children, id, label) }
          : item
      )

    const deepRemove = (list: MenuItem[], id: string): MenuItem[] =>
      list.filter((item) => item.id !== id).map((item) =>
        item.children ? { ...item, children: deepRemove(item.children, id) } : item
      )

    const deepAddChild = (list: MenuItem[], parentId: string): MenuItem[] =>
      list.map((item) =>
        item.id === parentId
          ? { ...item, children: [...(item.children || []), { id: generateId(), label: '', children: [] }] }
          : item.children
          ? { ...item, children: deepAddChild(item.children, parentId) }
          : item
      )

    const deepSwap = (list: MenuItem[], id: string, direction: -1 | 1): MenuItem[] => {
      const idx = list.findIndex((item) => item.id === id)
      if (idx >= 0) {
        const newIdx = idx + direction
        if (newIdx < 0 || newIdx >= list.length) return list
        const copy = [...list]
        const temp = copy[idx]!
        copy[idx] = copy[newIdx]!
        copy[newIdx] = temp
        return copy
      }
      return list.map((item) =>
        item.children ? { ...item, children: deepSwap(item.children, id, direction) } : item
      )
    }

    return (
      <div ref={ref} className={cn('space-y-1 rounded-md border border-gray-300 bg-white p-3 shadow-sm', className)}>
        {items.length === 0 && (
          <p className="py-2 text-center text-sm text-gray-400">No menu items. Click + to add one.</p>
        )}
        {items.map((item, i) => (
          <MenuItemRow
            key={item.id}
            item={item}
            depth={0}
            maxDepth={maxDepth}
            disabled={disabled}
            onUpdate={(id, label) => emit(deepUpdate(items, id, label))}
            onRemove={(id) => emit(deepRemove(items, id))}
            onAddChild={(parentId) => emit(deepAddChild(items, parentId))}
            onMoveUp={(id) => emit(deepSwap(items, id, -1))}
            onMoveDown={(id) => emit(deepSwap(items, id, 1))}
            isFirst={i === 0}
            isLast={i === items.length - 1}
          />
        ))}
        <button
          type="button"
          disabled={disabled}
          className={cn(
            'mt-2 flex w-full items-center justify-center gap-1 rounded-md border border-dashed border-gray-300 py-2 text-sm text-gray-500 transition-colors',
            'hover:border-blue-400 hover:text-blue-600',
            'disabled:cursor-not-allowed disabled:opacity-50'
          )}
          onClick={() => emit([...items, { id: generateId(), label: '', children: [] }])}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Add item
        </button>
      </div>
    )
  }
)
MenuInput.displayName = 'MenuInput'

export { MenuInput }
