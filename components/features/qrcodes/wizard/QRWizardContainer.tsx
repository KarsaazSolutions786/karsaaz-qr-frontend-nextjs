'use client'

import { useState, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { StepperWizard, Step } from '@/components/wizard/StepperWizard'
import { qrcodesAPI } from '@/lib/api/endpoints/qrcodes'
import { DEFAULT_DESIGNER_CONFIG, DesignerConfig } from '@/types/entities/designer'
import { QRCodeTypeSelector } from '@/components/features/qrcodes/QRCodeTypeSelector'
import Step1DataEntry from './Step1DataEntry'
import QRDesignStudio from './QRDesignStudio'
import Step4Download from './Step4Download'
import { toast } from 'sonner'
import { CheckCircle2, AlertCircle } from 'lucide-react'
import { transformDesignToBackend, transformDesignFromBackend } from '@/lib/qr/design-transformer'
import { useTranslation } from '@/lib/i18n'

interface QRWizardContainerProps {
  mode?: 'create' | 'edit'
  qrcodeId?: string
  initialData?: any
  onSuccess?: (qrcode: any) => void
  onCancel?: () => void
}

export default function QRWizardContainer({
  mode = 'create',
  qrcodeId,
  initialData,
  onSuccess,
  onCancel: _onCancel,
}: QRWizardContainerProps) {
  const { t } = useTranslation()
  const router = useRouter()

  // Determine wizard steps based on mode
  const WIZARD_STEPS = useMemo(() => {
    const createSteps: Step[] = [
      { id: 'type', title: t('Type'), description: t('Select QR code type') },
      { id: 'data', title: t('Enter Data'), description: t('Fill in your QR code content') },
      { id: 'design', title: t('Design'), description: t('Customize your QR code') },
      { id: 'download', title: t('Download'), description: t('Download your QR code') },
    ]
    const editSteps: Step[] = [
      { id: 'data', title: t('Enter Data'), description: t('Fill in your QR code content') },
      { id: 'design', title: t('Design'), description: t('Customize your QR code') },
      { id: 'download', title: t('Download'), description: t('Download your QR code') },
    ]
    return mode === 'create' ? createSteps : editSteps
  }, [mode, t])

  // QR type: state variable that can be changed in Type step (create mode)
  const [qrType, setQrType] = useState<string>(initialData?.type || '')

  // Form data state
  const [formData, setFormData] = useState<Record<string, any>>(initialData?.data || {})

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

  // Webpage design state (for dynamic types with landing pages)
  const [webpageDesign, setWebpageDesign] = useState(
    initialData?.webpageDesign || {
      backgroundColor: '#FFFFFF',
      fontFamily: 'Raleway',
      headerImageUrl: '',
    }
  )

  // Saved state tracking
  const [savedQRId, setSavedQRId] = useState<string | null>(qrcodeId || null)
  const [isSaved, setIsSaved] = useState(mode === 'edit')
  const [isSaving, setIsSaving] = useState(false)

  // Wizard navigation state (inline — replaces old useWizardState hook)
  const hasPreselectedType = !!initialData?.type
  const initialStepIndex = mode === 'create' && hasPreselectedType ? 1 : 0
  const [wizardStep, setWizardStep] = useState(initialStepIndex)
  const [isValidating, setIsValidating] = useState(false)

  const canGoBack = wizardStep > 0
  const canGoNext = wizardStep < WIZARD_STEPS.length - 1

  /** Validate a step before advancing past it */
  const validateStep = useCallback(
    async (stepIndex: number): Promise<boolean> => {
      const currentStepId = WIZARD_STEPS[stepIndex]?.id

      // Type step (create mode) -- ensure a type is selected
      if (currentStepId === 'type') {
        if (!qrType) {
          toast.error(t('Validation Error'), {
            description: t('Please select a QR code type before continuing.'),
          })
          return false
        }
        return true
      }

      // Data step -- ensure at least some data is entered with non-empty values
      if (currentStepId === 'data') {
        const hasData =
          formData &&
          Object.keys(formData).length > 0 &&
          Object.values(formData).some(v => v !== '' && v !== null && v !== undefined)
        if (!hasData) {
          toast.error(t('Validation Error'), {
            description: t('Please enter the QR code data before continuing.'),
          })
          return false
        }
        return true
      }
      return true
    },
    [WIZARD_STEPS, qrType, formData]
  )

  /** Navigate to a specific step (validates if moving forward) */
  const goToStep = useCallback(
    async (stepIndex: number) => {
      if (stepIndex < 0 || stepIndex >= WIZARD_STEPS.length) return false
      if (stepIndex > wizardStep) {
        setIsValidating(true)
        try {
          const isValid = await validateStep(wizardStep)
          if (!isValid) {
            setIsValidating(false)
            return false
          }
        } catch {
          setIsValidating(false)
          return false
        }
        setIsValidating(false)
      }
      setWizardStep(stepIndex)
      return true
    },
    [WIZARD_STEPS.length, wizardStep, validateStep]
  )

  const nextStep = useCallback(async () => {
    if (wizardStep < WIZARD_STEPS.length - 1) {
      return await goToStep(wizardStep + 1)
    }
    return false
  }, [wizardStep, WIZARD_STEPS.length, goToStep])

  const previousStep = useCallback(() => {
    if (wizardStep > 0) {
      setWizardStep(wizardStep - 1)
      return true
    }
    return false
  }, [wizardStep])

  const resetWizard = useCallback(() => {
    setWizardStep(initialStepIndex)
  }, [initialStepIndex])

  // Convenience object matching the old wizard API shape
  const wizard = useMemo(
    () => ({
      currentStep: wizardStep,
      canGoBack,
      canGoNext,
      isValidating,
      nextStep,
      previousStep,
      goToStep,
      reset: resetWizard,
    }),
    [wizardStep, canGoBack, canGoNext, isValidating, nextStep, previousStep, goToStep, resetWizard]
  )

  // ------------------------------------------------------------------
  // Save QR code to backend (called directly, NOT via redirect hooks)
  // On first save: creates QR, sets ID, and redirects to /qrcodes/:id/edit
  // On subsequent saves: updates existing QR
  // ------------------------------------------------------------------
  const saveQRCode = useCallback(
    async (shouldRedirect: boolean = false) => {
      // Transform React DesignerConfig to backend-expected format
      const backendDesign = transformDesignToBackend(design)

      const payload = {
        type: qrType,
        name: settings.name || `${qrType} QR Code`,
        data: formData,
        design: backendDesign, // Backend fillable expects 'design', not 'designerConfig'
        folder_id: settings.folderId || null, // Backend fillable uses snake_case
        tags: settings.tags,
        password: settings.pinProtected ? settings.pin || undefined : undefined,
        webpage_design: webpageDesign, // Landing page design for dynamic types
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

        // Update browser URL without triggering a navigation/re-render
        if (mode === 'create' && typeof window !== 'undefined') {
          window.history.replaceState(null, '', `/qrcodes/${newId}/edit`)
        }

        // Full redirect only when explicitly requested (e.g. from handleSubmit)
        if (shouldRedirect && mode === 'create') {
          router.replace(`/qrcodes/${newId}/edit`)
        }
        return result
      }
    },
    [qrType, formData, design, settings, webpageDesign, savedQRId, mode, router]
  )

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
      // First save: create QR and track ID, but DON'T redirect yet
      // (redirect happens only in handleSubmit when wizard completes)
      await saveQRCode(false) // never redirect mid-wizard — breaks step state
      setIsSaved(true)

      // Only show toast on Design → Download transition
      if (currentStepId === 'design') {
        toast.success(t('QR Code Saved'), {
          description: t('Your QR code has been saved. You can now download it.'),
          icon: <CheckCircle2 className="w-5 h-5 text-green-600" />,
        })
      }
    } catch (error: any) {
      toast.error(t('Save Failed'), {
        description: error?.message || t('Failed to save QR code. Please try again.'),
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
        toast.error(t('Save Failed'), {
          description: error?.message || t('Failed to save QR code.'),
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

  const handleDesignChange = useCallback((newDesign: Partial<DesignerConfig>) => {
    setDesign(newDesign)
    setIsSaved(false)
  }, [])

  const handleWebpageDesignChange = useCallback((newWebpageDesign: any) => {
    setWebpageDesign(newWebpageDesign)
    setIsSaved(false)
  }, [])

  const handleSettingsChange = useCallback((newSettings: any) => {
    setSettings(prev => ({ ...prev, ...newSettings }))
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
            <QRCodeTypeSelector value={qrType} onChange={handleTypeChange} showSearch={true} />
          </div>
        )

      case 'data':
        return <Step1DataEntry qrType={qrType} data={formData} onChange={handleDataChange} />

      case 'design':
        return (
          <QRDesignStudio
            qrType={qrType}
            qrTypeLabel={qrType.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
            qrData={formData}
            design={design}
            onChange={handleDesignChange}
            settings={settings}
            onSettingsChange={handleSettingsChange}
            onBack={() => wizard.previousStep()}
            isSaving={isSaving}
            isSaved={isSaved}
            savedQRId={savedQRId}
            webpageDesign={webpageDesign}
            onWebpageDesignChange={handleWebpageDesignChange}
          />
        )

      case 'download':
        return (
          <Step4Download
            qrType={qrType}
            qrData={formData}
            design={design}
            settings={settings}
            onSettingsChange={(newSettings: any) => handleSettingsChange(newSettings)}
            savedQRId={savedQRId}
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
        onStepChange={step => wizard.goToStep(step)}
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
