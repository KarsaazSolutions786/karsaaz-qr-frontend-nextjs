'use client'

import { cn } from '@/lib/utils'
import { Sparkles } from 'lucide-react'

interface FreeTrialButtonProps {
  planId: string
  trialDays: number
  onClick: (planId: string) => void
  className?: string
  disabled?: boolean
}

export function FreeTrialButton({
  planId,
  trialDays,
  onClick,
  className,
  disabled = false,
}: FreeTrialButtonProps) {
  return (
    <button
      type="button"
      onClick={() => onClick(planId)}
      disabled={disabled}
      className={cn(
        'relative inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition-all hover:from-purple-700 hover:to-indigo-700 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
    >
      <Sparkles className="h-4 w-4" />
      <span>Start {trialDays}-Day Free Trial</span>
      <span className="ml-1 rounded-full bg-white/20 px-2 py-0.5 text-xs font-bold">
        FREE
      </span>
    </button>
  )
}
