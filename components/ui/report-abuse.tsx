'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Flag } from 'lucide-react'

interface ReportAbuseProps {
  qrId: string
  className?: string
}

export function ReportAbuse({ qrId, className }: ReportAbuseProps) {
  const [state, setState] = useState<'idle' | 'confirm' | 'sending' | 'done' | 'error'>('idle')

  const handleReport = async () => {
    setState('sending')
    try {
      const res = await fetch('/api/report-abuse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ qrId }),
      })
      setState(res.ok ? 'done' : 'error')
    } catch {
      setState('error')
    }
  }

  if (state === 'done') {
    return <p className={cn('text-sm text-green-600', className)}>Report submitted. Thank you.</p>
  }

  if (state === 'confirm' || state === 'sending') {
    return (
      <div className={cn('flex items-center gap-2 text-sm', className)}>
        <span className="text-gray-600">Report this QR code?</span>
        <button
          type="button"
          onClick={handleReport}
          disabled={state === 'sending'}
          className="font-medium text-red-600 hover:underline disabled:opacity-50"
        >
          {state === 'sending' ? 'Sending…' : 'Yes, report'}
        </button>
        <button
          type="button"
          onClick={() => setState('idle')}
          className="font-medium text-gray-500 hover:underline"
        >
          Cancel
        </button>
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={() => setState('confirm')}
      className={cn(
        'inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-600 transition-colors',
        className
      )}
    >
      <Flag className="h-4 w-4" />
      {state === 'error' ? 'Failed — try again' : 'Report abuse'}
    </button>
  )
}
