'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { QRCodeTypeSelector } from '@/components/features/qrcodes/QRCodeTypeSelector'
import { QRWizardContainer } from '@/components/features/qrcodes/wizard'

/**
 * Create QR Code Page - Home Page
 * 
 * Route: /qrcodes/new (Home)
 * 
 * Shows the QR type selector bento grid. When a type is selected,
 * transitions to the wizard with that type pre-selected.
 */
export default function CreateQRCodePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const typeParam = searchParams?.get('type')
  const [selectedType, setSelectedType] = useState<string>(typeParam || '')

  function handleTypeSelect(type: string) {
    setSelectedType(type)
    // Navigate to wizard with type pre-selected
    router.push(`/qrcodes/new?type=${type}`)
  }

  // If a type is selected (via click or URL param), show the wizard
  if (selectedType) {
    return (
      <div className="relative min-h-screen">
        <div 
          className="absolute inset-0 w-[700px] h-[700px] opacity-40 bg-no-repeat bg-contain bg-left-center pointer-events-none"
          style={{ backgroundImage: `url('/new-login-background.png')` }}
        />
        <div className="relative z-10 px-4 py-4 sm:px-6 lg:px-8">
          <QRWizardContainer mode="create" initialData={{ type: selectedType, data: {} }} />
        </div>
      </div>
    )
  }

  // Default: Show QR type selector grid
  return (
    <div className="relative min-h-screen">
      <div 
        className="absolute inset-0 w-[700px] h-[700px] opacity-40 bg-no-repeat bg-contain bg-left-center pointer-events-none"
        style={{ backgroundImage: `url('/new-login-background.png')` }}
      />
      <div className="relative z-10 px-4 py-6 sm:px-6 lg:px-8">
        <QRCodeTypeSelector
          value=""
          onChange={handleTypeSelect}
        />
      </div>
    </div>
  )
}
