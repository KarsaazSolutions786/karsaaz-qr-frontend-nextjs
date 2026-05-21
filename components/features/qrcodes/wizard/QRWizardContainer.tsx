'use client'

import { useState, useCallback, useMemo, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { StepperWizard, Step } from '@/components/wizard/StepperWizard'
import { qrcodesAPI } from '@/lib/api/endpoints/qrcodes'
import { guestAPI } from '@/lib/api/endpoints/guest'
import { useGuest } from '@/lib/hooks/useGuest'
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

/**
 * Purpose: Executes QRWizardContainer functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export default function QRWizardContainer({
  mode = 'create',
  qrcodeId,
  initialData,
  onSuccess,
  onCancel: _onCancel,
}: QRWizardContainerProps) {
  const { t } = useTranslation()
  const router = useRouter()
  const { isGuest, incrementActionCount, refreshSession } = useGuest()

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
  const savedQRIdRef = useRef<string | null>(qrcodeId || null) // sync ref to avoid stale closures
  const isCreatingRef = useRef(false) // guard against concurrent create calls
  const isSavingRef = useRef(false)   // sync guard for handleNext (state lags one render)
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

      // Use ref for synchronous ID check (avoids stale closure from setState)
      const currentId = savedQRIdRef.current

      if (currentId) {
        // Already exists — update (guests can't update, only authenticated users)
        if (isGuest) return { id: currentId }
        const result = await qrcodesAPI.update(currentId, payload)
        return result
      } else {
        // Guard: prevent concurrent create calls (double-click, fast step transitions)
        if (isCreatingRef.current) {
          // A create is already in flight — wait for it by returning a pending promise
          // that resolves once the ref is set
          return new Promise<any>(resolve => {
            const check = setInterval(() => {
              if (savedQRIdRef.current) {
                clearInterval(check)
                resolve({ id: savedQRIdRef.current })
              }
            }, 100)
            // Safety timeout after 10s
            setTimeout(() => {
              clearInterval(check)
              resolve({ id: savedQRIdRef.current })
            }, 10000)
          })
        }

        isCreatingRef.current = true
        try {
          let result: any

          if (isGuest) {
            // Guest mode — use guest API endpoint
            result = await guestAPI.createQrcode({
              name: payload.name,
              type: payload.type,
              data: payload.data,
              design: payload.design,
              is_static: true,
            })
            // Track guest action for signup prompt
            incrementActionCount()
            // Refresh session limits
            refreshSession()
          } else {
            // Authenticated mode — use regular API endpoint
            result = await qrcodesAPI.create(payload)
          }
          const newId = result.id
          savedQRIdRef.current = newId // update ref synchronously
          setSavedQRId(newId)

          // Update browser URL without triggering a navigation/re-render (skip for guests)
          if (mode === 'create' && typeof window !== 'undefined' && !isGuest) {
            window.history.replaceState(null, '', `/qrcodes/${newId}/edit`)
          }

          // Full redirect only when explicitly requested (e.g. from handleSubmit)
          if (shouldRedirect && mode === 'create' && !isGuest) {
            router.replace(`/qrcodes/${newId}/edit`)
          }
          return result
        } finally {
          isCreatingRef.current = false
        }
      }
    },
    [
      qrType,
      formData,
      design,
      settings,
      webpageDesign,
      mode,
      router,
      isGuest,
      incrementActionCount,
      refreshSession,
    ]
  )

  // ------------------------------------------------------------------
  // Navigation handlers - Save on every step change (like original Lit)
  // ------------------------------------------------------------------

  /** Custom "Next" handler — auto-saves on every step change (except Type step) */
  const handleNext = useCallback(async () => {
    // Sync guard: isSaving state lags one render cycle; ref is synchronous.
    if (isSavingRef.current) return
    const currentStepId = WIZARD_STEPS[wizard.currentStep]?.id

    // Type step — no save needed, just advance
    if (currentStepId === 'type') {
      wizard.nextStep()
      return
    }

    // For all other steps, save when navigating forward
    isSavingRef.current = true
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
      isSavingRef.current = false
      setIsSaving(false)
      return // don't advance
    }
    isSavingRef.current = false
    setIsSaving(false)

    wizard.nextStep()
  }, [wizard, saveQRCode, WIZARD_STEPS])

  /** "Done" / Submit handler — finishes and navigates away */
  const handleSubmit = useCallback(async () => {
    // Use ref for current saved ID (avoids stale closure)
    const currentId = savedQRIdRef.current

    // Ensure QR is saved before finishing
    if (!currentId) {
      setIsSaving(true)
      try {
        // Don't redirect on submit - we'll navigate to detail page instead
        const result = await saveQRCode(false)
        setIsSaved(true)
        wizard.reset()
        if (onSuccess) {
          onSuccess(result)
        } else if (isGuest) {
          // Guests stay on creation page — reset wizard for new QR
          toast.success(t('QR Code Created!'), {
            description: t('Your QR code is ready. Create another or sign up to save permanently.'),
            icon: <CheckCircle2 className="w-5 h-5 text-green-600" />,
          })
          router.push('/qrcodes/new')
        } else {
          router.push(`/qrcodes/${result.id || savedQRIdRef.current}`)
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
      onSuccess({ id: currentId })
    } else if (isGuest) {
      toast.success(t('QR Code Created!'), {
        description: t('Your QR code is ready. Create another or sign up to save permanently.'),
        icon: <CheckCircle2 className="w-5 h-5 text-green-600" />,
      })
      router.push('/qrcodes/new')
    } else {
      router.push(`/qrcodes/${currentId}`)
    }
  }, [saveQRCode, wizard, router, onSuccess, isGuest, t])

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

  /**
   * Purpose: Executes renderStepContent functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
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
        showHeader={false}
        allowStepClick={true}
      >
        {renderStepContent()}
      </StepperWizard>
    </div>
  )
}
