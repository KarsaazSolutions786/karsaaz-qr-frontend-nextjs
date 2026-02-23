'use client'

import { useMemo } from 'react'
import { cn } from '@/lib/utils'
import { Smartphone } from 'lucide-react'

export interface DeviceBrandData {
  brand: string
  count: number
}

interface ScansPerDeviceBrandProps {
  data: DeviceBrandData[]
  className?: string
}

export function ScansPerDeviceBrand({ data, className }: ScansPerDeviceBrandProps) {
  const sorted = useMemo(() => [...data].sort((a, b) => b.count - a.count), [data])
  const maxCount = sorted[0]?.count ?? 1

  if (data.length === 0) {
    return (
      <div className={cn('rounded-lg border border-gray-200 bg-white p-6 text-center', className)}>
        <Smartphone className="mx-auto h-12 w-12 text-gray-300" />
        <p className="mt-3 text-sm text-gray-500">No device brand data available</p>
      </div>
    )
  }

  return (
    <div className={cn('rounded-lg border border-gray-200 bg-white p-6', className)}>
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
          <Smartphone className="h-5 w-5 text-purple-600" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">Scans by Device Brand</h3>
          <p className="text-sm text-gray-500">{data.length} brands detected</p>
        </div>
      </div>

      <div className="space-y-3">
        {sorted.map(({ brand, count }) => (
          <div key={brand} className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-gray-700">{brand}</span>
              <span className="text-gray-500">{count.toLocaleString()}</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-purple-500 transition-all"
                style={{ width: `${(count / maxCount) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
