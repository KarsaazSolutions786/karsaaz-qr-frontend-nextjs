'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { QRCodeTypeSelector } from '@/components/features/qrcodes/QRCodeTypeSelector'
import { QRWizardContainer } from '@/components/features/qrcodes/wizard'

/**
 * Create QR Code Page
 *
 * Route: /qrcodes/new (Home)
 *
 * Flow (matching legacy Lit frontend):
 * 1. No ?type param → show QR type selector grid
 * 2. User clicks a type → URL becomes /qrcodes/new?type=url → wizard opens at Data step
 * 3. Wizard steps: Type → Data → Design → Download  (Type step = back to selector)
 */
function CreateQRCodeInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const typeParam = searchParams?.get('type') || ''

  // Local state tracks user selection (survives soft navigation)
  const [selectedType, setSelectedType] = useState(typeParam)
  const [showWizard, setShowWizard] = useState(!!typeParam)

  function handleTypeSelect(type: string) {
    setSelectedType(type)
    setShowWizard(true)
    // Update URL so refresh / share links preserve the selected type
    router.replace(`/qrcodes/new?type=${encodeURIComponent(type)}`, { scroll: false })
  }

  if (showWizard && selectedType) {
    return (
      <div className="px-4 py-4 sm:px-6 lg:px-8">
        <QRWizardContainer mode="create" initialData={{ type: selectedType, data: {} }} />
      </div>
    )
  }

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <QRCodeTypeSelector value={selectedType} onChange={handleTypeSelect} />
    </div>
  )
}

export default function CreateQRCodePage() {
  return (
    <Suspense fallback={<div className="px-4 py-6 sm:px-6 lg:px-8 animate-pulse">Loading…</div>}>
      <CreateQRCodeInner />
    </Suspense>
  )
}
