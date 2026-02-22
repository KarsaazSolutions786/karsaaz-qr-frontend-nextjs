'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import type { FunnelData } from '@/lib/api/endpoints/analytics'

interface ConversionFunnelProps {
  data: FunnelData
  className?: string
}

const stepColors = [
  'bg-purple-600 dark:bg-purple-500',
  'bg-purple-500 dark:bg-purple-400',
  'bg-purple-400 dark:bg-purple-300',
  'bg-violet-400 dark:bg-violet-300',
  'bg-violet-300 dark:bg-violet-200',
  'bg-fuchsia-300 dark:bg-fuchsia-200',
]

export default function ConversionFunnel({ data, className }: ConversionFunnelProps) {
  const { steps, conversion_rate, total_entered, total_converted } = data

  return (
    <div className={cn('space-y-4', className)}>
      {/* Summary header */}
      <div className="flex items-center justify-between rounded-lg bg-purple-50 p-4 dark:bg-purple-900/20">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {data.name}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {total_entered.toLocaleString()} entered · {total_converted.toLocaleString()} converted
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">
            {conversion_rate.toFixed(1)}%
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Overall conversion</p>
        </div>
      </div>

      {/* Funnel steps */}
      <div className="space-y-2">
        {steps.map((step, index) => {
          const widthPercent = steps.length > 1
            ? 100 - (index / (steps.length - 1)) * 40
            : 100
          const prevStep = steps[index - 1]
          const dropOff =
            index > 0 && prevStep
              ? (((prevStep.count - step.count) / prevStep.count) * 100)
              : 0
          const colorClass = stepColors[index % stepColors.length]

          return (
            <div key={step.name} className="flex items-center gap-3">
              <div className="flex-1">
                <div
                  className={cn(
                    'relative mx-auto flex items-center justify-between rounded-md px-4 py-3 text-white transition-all',
                    colorClass
                  )}
                  style={{ width: `${widthPercent}%` }}
                >
                  <span className="text-sm font-medium truncate">{step.name}</span>
                  <span className="text-sm font-bold">{step.count.toLocaleString()}</span>
                </div>
              </div>
              <div className="w-20 text-right">
                {index > 0 ? (
                  <span className="text-xs font-medium text-red-500 dark:text-red-400">
                    −{dropOff.toFixed(1)}%
                  </span>
                ) : (
                  <span className="text-xs font-medium text-gray-400 dark:text-gray-500">
                    {step.percentage.toFixed(0)}%
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
