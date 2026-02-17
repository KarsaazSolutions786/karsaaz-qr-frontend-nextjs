'use client'

import React from 'react'
import { format } from 'date-fns'
import type { ScanEvent } from '@/types/entities/analytics'

interface ActivityFeedProps {
  scans: ScanEvent[]
  isLoading?: boolean
}

export default function ActivityFeed({ scans, isLoading }: ActivityFeedProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 animate-pulse rounded-lg bg-gray-100" />
        ))}
      </div>
    )
  }

  if (!scans || scans.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center">
        <p className="text-sm text-gray-500">No recent activity</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {scans.map((scan) => (
        <div
          key={scan.id}
          className="flex items-start justify-between rounded-lg border border-gray-200 bg-white p-4 hover:bg-gray-50"
        >
          <div className="flex-1">
            <p className="font-medium text-gray-900">{scan.qrcodeName}</p>
            <div className="mt-1 flex items-center gap-4 text-sm text-gray-500">
              <span>{scan.location?.country || 'Unknown location'}</span>
              <span>•</span>
              <span>{scan.device.type || 'Unknown device'}</span>
              {scan.browser && (
                <>
                  <span>•</span>
                  <span>{scan.browser}</span>
                </>
              )}
            </div>
          </div>
          <div className="text-right text-sm text-gray-500">
            <p>{format(new Date(scan.timestamp), 'MMM d, yyyy')}</p>
            <p className="mt-1">{format(new Date(scan.timestamp), 'h:mm a')}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
