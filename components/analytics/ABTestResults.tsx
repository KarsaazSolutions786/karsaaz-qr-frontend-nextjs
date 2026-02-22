'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import type { ABTestData } from '@/lib/api/endpoints/analytics'

interface ABTestResultsProps {
  data: ABTestData
  className?: string
}

const statusConfig: Record<ABTestData['status'], { label: string; variant: 'default' | 'secondary' | 'destructive' }> = {
  running: { label: 'Running', variant: 'default' },
  completed: { label: 'Completed', variant: 'secondary' },
  paused: { label: 'Paused', variant: 'destructive' },
}

export default function ABTestResults({ data, className }: ABTestResultsProps) {
  const { name, status, start_date, end_date, variants, winner } = data
  const { label, variant } = statusConfig[status]

  const maxRate = Math.max(...variants.map((v) => v.conversion_rate), 1)

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {name}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {new Date(start_date).toLocaleDateString()}
            {end_date ? ` – ${new Date(end_date).toLocaleDateString()}` : ' – ongoing'}
          </p>
        </div>
        <Badge variant={variant}>{label}</Badge>
      </div>

      {/* Variants table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="py-2 text-left font-medium text-gray-500 dark:text-gray-400">Variant</th>
              <th className="py-2 text-right font-medium text-gray-500 dark:text-gray-400">Visitors</th>
              <th className="py-2 text-right font-medium text-gray-500 dark:text-gray-400">Conversions</th>
              <th className="py-2 text-right font-medium text-gray-500 dark:text-gray-400">Rate</th>
              <th className="py-2 text-right font-medium text-gray-500 dark:text-gray-400">Confidence</th>
              <th className="py-2 pl-4 font-medium text-gray-500 dark:text-gray-400">Progress</th>
            </tr>
          </thead>
          <tbody>
            {variants.map((v) => {
              const isWinner = status === 'completed' && winner === v.id
              return (
                <tr
                  key={v.id}
                  className={cn(
                    'border-b border-gray-100 dark:border-gray-700/50',
                    isWinner && 'bg-green-50 dark:bg-green-900/10'
                  )}
                >
                  <td className="py-3 text-gray-900 dark:text-gray-100">
                    <span className="flex items-center gap-2">
                      {v.name}
                      {v.is_control && (
                        <span className="text-xs text-gray-400 dark:text-gray-500">(control)</span>
                      )}
                      {isWinner && (
                        <span className="text-xs font-semibold text-green-600 dark:text-green-400">
                          ✓ Winner
                        </span>
                      )}
                    </span>
                  </td>
                  <td className="py-3 text-right text-gray-700 dark:text-gray-300">
                    {v.visitors.toLocaleString()}
                  </td>
                  <td className="py-3 text-right text-gray-700 dark:text-gray-300">
                    {v.conversions.toLocaleString()}
                  </td>
                  <td className="py-3 text-right font-medium text-gray-900 dark:text-gray-100">
                    {v.conversion_rate.toFixed(2)}%
                  </td>
                  <td className="py-3 text-right text-gray-700 dark:text-gray-300">
                    {v.confidence_level != null ? `${v.confidence_level.toFixed(1)}%` : '—'}
                  </td>
                  <td className="py-3 pl-4">
                    <div className="h-2 w-24 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                      <div
                        className={cn(
                          'h-full rounded-full transition-all',
                          isWinner
                            ? 'bg-green-500'
                            : 'bg-blue-500 dark:bg-blue-400'
                        )}
                        style={{ width: `${(v.conversion_rate / maxRate) * 100}%` }}
                      />
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
