'use client'

import { Skeleton } from '@/components/common/Skeleton'

export function WizardFormSkeleton() {
  return (
    <div className="space-y-5" aria-busy="true" aria-label="Loading form">
      <Skeleton height={20} width="35%" />
      <Skeleton height={44} className="rounded-xl" />
      <Skeleton height={20} width="28%" />
      <Skeleton height={44} className="rounded-xl" />
      <Skeleton height={20} width="40%" />
      <Skeleton height={44} className="rounded-xl" />
      <Skeleton height={80} className="rounded-xl" />
    </div>
  )
}

export function WizardDesignSkeleton() {
  return (
    <div
      className="grid grid-cols-1 gap-6 lg:grid-cols-5"
      aria-busy="true"
      aria-label="Loading designer"
    >
      <div className="space-y-4 lg:col-span-3">
        <Skeleton height={220} className="rounded-xl" />
        <Skeleton height={180} className="rounded-xl" />
        <Skeleton height={160} className="rounded-xl" />
      </div>
      <div className="lg:col-span-2">
        <Skeleton height={360} className="rounded-xl" />
      </div>
    </div>
  )
}

export function WizardDesignPanelSkeleton() {
  return <Skeleton height={200} className="rounded-xl" />
}
