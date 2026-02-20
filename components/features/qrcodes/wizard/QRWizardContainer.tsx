'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { StepperWizard } from '@/components/wizard/StepperWizard'
import { useWizardState, WizardStep } from '@/lib/hooks/useWizardState'
import { qrcodesAPI } from '@/lib/api/endpoints/qrcodes'
import { DEFAULT_DESIGNER_CONFIG, DesignerConfig } from '@/types/entities/designer'
import Step1DataEntry from './Step1DataEntry'
import Step2Designer from './Step2Designer'
import Step3Download from './Step3Download'
import { toast } from 'sonner'
import { CheckCircle2, AlertCircle } from 'lucide-react'

interface QRWizardContainerProps {
  mode?: 'create' | 'edit'
  qrcodeId?: string
  initialData?: any
  onSuccess?: (qrcode: any) => void
  onCancel?: () => void
}

const WIZARD_STEPS: WizardStep[] = [
  {
    id: 'data',
    title: 'Enter Data',
    description: 'Fill in your QR code content',
  },
  {
    id: 'design',
    title: 'Design',
    description: 'Customize the appearance',
  },
  {
    id: 'download',
    title: 'Download',
    description: 'Save and download your QR code',
  },
]

export default function QRWizardContainer({
  mode = 'create',
  qrcodeId,
  initialData,
  onSuccess,
  onCancel: _onCancel,
}: QRWizardContainerProps) {
  const router = useRouter()

  // QR type: from page selection (create) or existing QR (edit)
  const qrType = initialData?.type || 'url'

  // Form data state
  const [formData, setFormData] = useState<Record<string, any>>(
    initialData?.data || {}
  )

  // Design state — use real DesignerConfig
  const [design, setDesign] = useState<Partial<DesignerConfig>>(
    initialData?.designerConfig || initialData?.customization || {
      ...DEFAULT_DESIGNER_CONFIG,
    }
  )

  // Settings state (name, folder, pin, expiration, tags)
  const [settings, setSettings] = useState({
    name: initialData?.name || '',
    folderId: (initialData?.folderId as string | null) ?? null,
    pinProtected: !!initialData?.password,
    pin: (initialData?.password as string | null) ?? null,
    hasExpiration: !!initialData?.expiresAt,
    expiresAt: (initialData?.expiresAt as string | null) ?? null,
    tags: (initialData?.tags as string[]) ?? [],
  })

  // Saved state tracking
  const [savedQRId, setSavedQRId] = useState<string | null>(qrcodeId || null)
  const [isSaved, setIsSaved] = useState(mode === 'edit')
  const [isSaving, setIsSaving] = useState(false)

  // Wizard state
  const wizard = useWizardState({
    steps: WIZARD_STEPS,
    initialStep: 0,
    validateStep: async (stepIndex) => {
      if (stepIndex === 0) {
        // Data step — ensure at least some data is entered
        if (!formData || Object.keys(formData).length === 0) {
          toast.error('Validation Error', {
            description: 'Please enter the QR code data before continuing.',
          })
          return false
        }
        return true
      }
      return true
    },
  })

  // ------------------------------------------------------------------
  // Save QR code to backend (called directly, NOT via redirect hooks)
  // ------------------------------------------------------------------
  const saveQRCode = useCallback(async () => {
    const payload = {
      type: qrType,
      name: settings.name || `${qrType} QR Code`,
      data: formData,
      designerConfig: design,
      folderId: settings.folderId || null,
      tags: settings.tags,
      password: settings.pinProtected ? settings.pin || undefined : undefined,
    }

    if (savedQRId) {
      // Already exists — update
      const result = await qrcodesAPI.update(savedQRId, payload)
      return result
    } else {
      // First save — create
      const result = await qrcodesAPI.create(payload)
      setSavedQRId(result.id)
      return result
    }
  }, [qrType, formData, design, settings, savedQRId])

  // ------------------------------------------------------------------
  // Navigation handlers
  // ------------------------------------------------------------------

  /** Custom "Next" handler — auto-saves when moving from Design → Download */
  const handleNext = useCallback(async () => {
    // Moving from Design (step 1) to Download (step 2) → auto-save
    if (wizard.currentStep === 1) {
      setIsSaving(true)
      try {
        await saveQRCode()
        setIsSaved(true)
        toast.success('QR Code Saved', {
          description: 'Your QR code has been saved. You can now download it.',
          icon: <CheckCircle2 className="w-5 h-5 text-green-600" />,
        })
      } catch (error: any) {
        toast.error('Save Failed', {
          description: error?.message || 'Failed to save QR code. Please try again.',
          icon: <AlertCircle className="w-5 h-5 text-red-600" />,
        })
        setIsSaving(false)
        return // don't advance
      }
      setIsSaving(false)
    }

    wizard.nextStep()
  }, [wizard, saveQRCode])

  /** "Done" / Submit handler — finishes and navigates away */
  const handleSubmit = useCallback(async () => {
    // Ensure QR is saved before finishing
    if (!isSaved) {
      setIsSaving(true)
      try {
        const result = await saveQRCode()
        setIsSaved(true)
        wizard.reset()
        if (onSuccess) {
          onSuccess(result)
        } else {
          router.push(`/qrcodes/${result.id || savedQRId}`)
        }
      } catch (error: any) {
        toast.error('Save Failed', {
          description: error?.message || 'Failed to save QR code.',
          icon: <AlertCircle className="w-5 h-5 text-red-600" />,
        })
      }
      setIsSaving(false)
      return
    }

    // Already saved — just navigate
    wizard.reset()
    if (onSuccess) {
      onSuccess({ id: savedQRId })
    } else {
      router.push(`/qrcodes/${savedQRId}`)
    }
  }, [isSaved, savedQRId, saveQRCode, wizard, router, onSuccess])

  // ------------------------------------------------------------------
  // Data-change handlers (mark unsaved on any change)
  // ------------------------------------------------------------------

  const handleDataChange = useCallback((data: Record<string, any>) => {
    setFormData(data)
    setIsSaved(false)
  }, [])

  const handleDesignChange = useCallback(
    (newDesign: Partial<DesignerConfig>) => {
      setDesign(newDesign)
      setIsSaved(false)
    },
    []
  )

  const handleSettingsChange = useCallback((newSettings: any) => {
    setSettings((prev) => ({ ...prev, ...newSettings }))
    setIsSaved(false)
  }, [])

  // ------------------------------------------------------------------
  // Render current step
  // ------------------------------------------------------------------

  const renderStepContent = () => {
    const currentStepId = WIZARD_STEPS[wizard.currentStep]?.id ?? 'data'

    switch (currentStepId) {
      case 'data':
        return (
          <Step1DataEntry
            qrType={qrType}
            data={formData}
            onChange={handleDataChange}
          />
        )

      case 'design':
        return (
          <Step2Designer
            design={design}
            onChange={handleDesignChange}
            qrType={qrType}
            qrData={formData}
          />
        )

      case 'download':
        return (
          <Step3Download
            qrType={qrType}
            qrData={formData}
            design={design}
            settings={settings}
            onSettingsChange={handleSettingsChange}
            isSubmitting={isSaving}
            isSaved={isSaved}
          />
        )

      default:
        return null
    }
  }

  return (
    <div className="h-screen flex flex-col">
      <StepperWizard
        steps={WIZARD_STEPS}
        currentStep={wizard.currentStep}
        onStepChange={(step) => wizard.goToStep(step)}
        onBack={wizard.previousStep}
        onNext={handleNext}
        onSubmit={handleSubmit}
        canGoBack={wizard.canGoBack}
        canGoNext={wizard.canGoNext}
        isSubmitting={isSaving}
        isValidating={wizard.isValidating}
        showProgress={true}
        allowStepClick={true}
      >
        {renderStepContent()}
      </StepperWizard>
    </div>
  )
}
