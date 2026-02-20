'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { TemplateSelectionAdapter } from '@/components/features/qrcodes/TemplateSelectionAdapter'
import { QRWizardContainer } from '@/components/features/qrcodes/wizard'

/**
 * Create QR Code Page - Home Page
 * 
 * Route: /qrcodes/new (Home)
 * 
 * Flow (matching original Lit frontend):
 * 1. Show TemplateSelectionAdapter - choose template or start blank
 * 2. If "Create Blank" clicked, show QRWizardContainer with 4-step flow:
 *    Type → Data → Design → Download
 * 3. If template selected, pre-fill wizard with template data
 */
export default function CreateQRCodePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const typeParam = searchParams?.get('type')
  const blankParam = searchParams?.get('blank')
  
  // If type is in URL (from legacy links or direct navigation), pre-select it
  const [preSelectedType] = useState<string>(typeParam || '')
  const [showWizard, setShowWizard] = useState<boolean>(blankParam === 'true' || !!typeParam)

  function handleStartBlank() {
    setShowWizard(true)
    router.push('/qrcodes/new?blank=true')
  }

  // Show wizard if "Create Blank" was clicked or type is in URL
  if (showWizard) {
    return (
      <div className="relative min-h-screen">
        <div 
          className="absolute inset-0 w-[700px] h-[700px] opacity-40 bg-no-repeat bg-contain bg-left-center pointer-events-none"
          style={{ backgroundImage: `url('/new-login-background.png')` }}
        />
        <div className="relative z-10 px-4 py-4 sm:px-6 lg:px-8">
          <QRWizardContainer 
            mode="create" 
            initialData={{ 
              type: preSelectedType, // Will show Type step if empty 
              data: {} 
            }} 
          />
        </div>
      </div>
    )
  }

  // Default: Show template selection adapter (choose template vs blank)
  return (
    <div className="relative min-h-screen">
      <div 
        className="absolute inset-0 w-[700px] h-[700px] opacity-40 bg-no-repeat bg-contain bg-left-center pointer-events-none"
        style={{ backgroundImage: `url('/new-login-background.png')` }}
      />
      <div className="relative z-10 px-4 py-6 sm:px-6 lg:px-8">
        <TemplateSelectionAdapter onStartBlank={handleStartBlank} />
      </div>
    </div>
  )
}
