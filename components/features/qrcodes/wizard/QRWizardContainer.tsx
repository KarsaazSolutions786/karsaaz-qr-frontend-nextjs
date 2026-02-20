'use client'

import { useState, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { StepperWizard } from '@/components/wizard/StepperWizard'
import { useWizardState, WizardStep } from '@/lib/hooks/useWizardState'
import { qrcodesAPI } from '@/lib/api/endpoints/qrcodes'
import { DEFAULT_DESIGNER_CONFIG, DesignerConfig } from '@/types/entities/designer'
import { QRCodeTypeSelector } from '@/components/features/qrcodes/QRCodeTypeSelector'
import Step1DataEntry from './Step1DataEntry'
import Step2Designer from './Step2Designer'
import Step3Download from './Step3Download'
import { toast } from 'sonner'
import { CheckCircle2, AlertCircle } from 'lucide-react'
import { transformDesignToBackend, transformDesignFromBackend } from '@/lib/qr/design-transformer'

interface QRWizardContainerProps {
  mode?: 'create' | 'edit'
  qrcodeId?: string
  initialData?: any
  onSuccess?: (qrcode: any) => void
  onCancel?: () => void
}

// Steps for CREATE mode: Type → Data → Design → Download (4 steps)
const CREATE_WIZARD_STEPS: WizardStep[] = [
  {
    id: 'type',
    title: 'Type',
    description: 'Select QR code type',
  },
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

// Steps for EDIT mode: Data → Design → Download (3 steps, no type change)
const EDIT_WIZARD_STEPS: WizardStep[] = [
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

  // Determine wizard steps based on mode
  const WIZARD_STEPS = useMemo(() => {
    return mode === 'create' ? CREATE_WIZARD_STEPS : EDIT_WIZARD_STEPS
  }, [mode])

  // QR type: state variable that can be changed in Type step (create mode)
  const [qrType, setQrType] = useState<string>(initialData?.type || '')

  // Form data state
  const [formData, setFormData] = useState<Record<string, any>>(
    initialData?.data || {}
  )

  // Design state — use real DesignerConfig
  // Transform from backend format when loading existing QR code
  const [design, setDesign] = useState<Partial<DesignerConfig>>(() => {
    const backendDesign = initialData?.designerConfig || initialData?.customization
    if (backendDesign) {
      // Backend uses format like fillType, module, finder — transform to React format
      return {
        ...DEFAULT_DESIGNER_CONFIG,
        ...transformDesignFromBackend(backendDesign),
      }
    }
    return { ...DEFAULT_DESIGNER_CONFIG }
  })

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
      const currentStepId = WIZARD_STEPS[stepIndex]?.id

      // Type step (create mode) — ensure a type is selected
      if (currentStepId === 'type') {
        if (!qrType) {
          toast.error('Validation Error', {
            description: 'Please select a QR code type before continuing.',
          })
          return false
        }
        return true
      }

      // Data step — ensure at least some data is entered
      if (currentStepId === 'data') {
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
  // On first save: creates QR, sets ID, and redirects to /qrcodes/:id/edit
  // On subsequent saves: updates existing QR
  // ------------------------------------------------------------------
  const saveQRCode = useCallback(async (shouldRedirect: boolean = false) => {
    // Transform React DesignerConfig to backend-expected format
    const backendDesign = transformDesignToBackend(design)
    
    const payload = {
      type: qrType,
      name: settings.name || `${qrType} QR Code`,
      data: formData,
      design: backendDesign, // Backend fillable expects 'design', not 'designerConfig'
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
      const newId = result.id
      setSavedQRId(newId)
      
      // Redirect to edit URL after first save (matches original Lit flow)
      if (shouldRedirect && mode === 'create') {
        router.replace(`/qrcodes/${newId}/edit`)
      }
      return result
    }
  }, [qrType, formData, design, settings, savedQRId, mode, router])

  // ------------------------------------------------------------------
  // Navigation handlers - Save on every step change (like original Lit)
  // ------------------------------------------------------------------

  /** Custom "Next" handler — auto-saves on every step change (except Type step) */
  const handleNext = useCallback(async () => {
    const currentStepId = WIZARD_STEPS[wizard.currentStep]?.id
    
    // Type step — no save needed, just advance
    if (currentStepId === 'type') {
      wizard.nextStep()
      return
    }
    
    // For all other steps, save when navigating forward
    setIsSaving(true)
    try {
      // First save redirects to /edit/:id, subsequent saves stay on current page
      const isFirstSave = !savedQRId
      await saveQRCode(isFirstSave)
      setIsSaved(true)
      
      // Only show toast on Design → Download transition
      if (currentStepId === 'design') {
        toast.success('QR Code Saved', {
          description: 'Your QR code has been saved. You can now download it.',
          icon: <CheckCircle2 className="w-5 h-5 text-green-600" />,
        })
      }
    } catch (error: any) {
      toast.error('Save Failed', {
        description: error?.message || 'Failed to save QR code. Please try again.',
        icon: <AlertCircle className="w-5 h-5 text-red-600" />,
      })
      setIsSaving(false)
      return // don't advance
    }
    setIsSaving(false)

    wizard.nextStep()
  }, [wizard, saveQRCode, savedQRId, WIZARD_STEPS])

  /** "Done" / Submit handler — finishes and navigates away */
  const handleSubmit = useCallback(async () => {
    // Ensure QR is saved before finishing
    if (!isSaved) {
      setIsSaving(true)
      try {
        // Don't redirect on submit - we'll navigate to detail page instead
        const result = await saveQRCode(false)
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

  const handleTypeChange = useCallback((type: string) => {
    setQrType(type)
    // Reset form data when type changes (different types have different data structures)
    setFormData({})
    setIsSaved(false)
  }, [])

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
      case 'type':
        return (
          <div className="py-4">
            <QRCodeTypeSelector
              value={qrType}
              onChange={handleTypeChange}
              showSearch={true}
            />
          </div>
        )

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
    <div>
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
