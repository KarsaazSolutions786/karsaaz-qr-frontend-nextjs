'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface Column<T = any> {
  key: string
  header: string
  sortable?: boolean
  render?: (value: any, row: T) => React.ReactNode
}

export interface DataTableProps<T = any> {
  columns: Column<T>[]
  data: T[]
  isLoading?: boolean
  onRowSelect?: (selectedRows: T[]) => void
  sortable?: boolean
  className?: string
}

type SortDirection = 'asc' | 'desc' | null

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  isLoading = false,
  onRowSelect,
  sortable = false,
  className,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = React.useState<string | null>(null)
  const [sortDir, setSortDir] = React.useState<SortDirection>(null)
  const [selected, setSelected] = React.useState<Set<number>>(new Set())

  const handleSort = (key: string) => {
    if (!sortable) return
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : sortDir === 'desc' ? null : 'asc')
      if (sortDir === 'desc') setSortKey(null)
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  const sortedData = React.useMemo(() => {
    if (!sortKey || !sortDir) return data
    return [...data].sort((a, b) => {
      const aVal = a[sortKey]
      const bVal = b[sortKey]
      if (aVal == null) return 1
      if (bVal == null) return -1
      const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0
      return sortDir === 'asc' ? cmp : -cmp
    })
  }, [data, sortKey, sortDir])

  const toggleRow = (idx: number) => {
    const next = new Set(selected)
    next.has(idx) ? next.delete(idx) : next.add(idx)
    setSelected(next)
    onRowSelect?.(sortedData.filter((_, i) => next.has(i)))
  }

  const toggleAll = () => {
    if (selected.size === sortedData.length) {
      setSelected(new Set())
      onRowSelect?.([])
    } else {
      const all = new Set(sortedData.map((_, i) => i))
      setSelected(all)
      onRowSelect?.([...sortedData])
    }
  }

  const SortIcon = ({ col }: { col: string }) => {
    if (sortKey !== col || !sortDir) return <span className="ml-1 text-gray-300">↕</span>
    return <span className="ml-1">{sortDir === 'asc' ? '↑' : '↓'}</span>
  }

  if (isLoading) {
    return (
      <div className={cn('w-full overflow-auto rounded-lg border border-gray-200', className)}>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-gray-50">
              {onRowSelect && <th className="w-10 px-4 py-3" />}
              {columns.map((col) => (
                <th key={col.key} className="px-4 py-3 text-left font-medium text-gray-500">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, i) => (
              <tr key={i} className="border-b">
                {onRowSelect && (
                  <td className="px-4 py-3">
                    <div className="h-4 w-4 animate-pulse rounded bg-gray-200" />
                  </td>
                )}
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3">
                    <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <div className={cn('w-full overflow-auto rounded-lg border border-gray-200', className)}>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-gray-50">
            {onRowSelect && (
              <th className="w-10 px-4 py-3">
                <input
                  type="checkbox"
                  checked={selected.size === sortedData.length && sortedData.length > 0}
                  onChange={toggleAll}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </th>
            )}
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn(
                  'px-4 py-3 text-left font-medium text-gray-500',
                  sortable && col.sortable !== false && 'cursor-pointer select-none hover:text-gray-700'
                )}
                onClick={() => sortable && col.sortable !== false && handleSort(col.key)}
              >
                {col.header}
                {sortable && col.sortable !== false && <SortIcon col={col.key} />}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length + (onRowSelect ? 1 : 0)}
                className="px-4 py-8 text-center text-gray-400"
              >
                No data available
              </td>
            </tr>
          ) : (
            sortedData.map((row, idx) => (
              <tr
                key={idx}
                className={cn(
                  'border-b transition-colors hover:bg-gray-50',
                  selected.has(idx) && 'bg-blue-50'
                )}
              >
                {onRowSelect && (
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selected.has(idx)}
                      onChange={() => toggleRow(idx)}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                )}
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3 text-gray-700">
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
