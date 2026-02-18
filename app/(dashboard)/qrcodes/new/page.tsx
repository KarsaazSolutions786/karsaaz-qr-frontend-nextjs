'use client'

import { QRWizardContainer } from '@/components/features/qrcodes/wizard'

/**
 * Create QR Code Page - Now uses multi-step wizard
 * 
 * Features:
 * - Step 1: Template selection or start from scratch
 * - Step 2: QR type and data entry
 * - Step 3: Advanced design customization
 * - Step 4: Settings and options
 * 
 * The wizard handles:
 * - Form validation
 * - State persistence
 * - Live preview
 * - Template integration
 */
export default function CreateQRCodePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <QRWizardContainer mode="create" />
    </div>
  )
}
