'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { StepperWizard } from '@/components/wizard/StepperWizard'
import { useWizardState, WizardStep } from '@/lib/hooks/useWizardState'
import { useCreateQRCode } from '@/lib/hooks/mutations/useCreateQRCode'
import { useUpdateQRCode } from '@/lib/hooks/mutations/useUpdateQRCode'
import { useTemplates } from '@/lib/hooks/queries/useTemplates'
import Step1TemplateSelection from './Step1TemplateSelection'
import Step2TypeAndData from './Step2TypeAndData'
import Step3Designer from './Step3Designer'
import Step4Settings from './Step4Settings'
import { QRCodeTemplate } from '@/types/entities/template'
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
    id: 'template',
    title: 'Choose Template',
    description: 'Select a template or start from scratch',
    isOptional: true,
  },
  {
    id: 'type-data',
    title: 'Type & Data',
    description: 'Select QR type and enter data',
  },
  {
    id: 'design',
    title: 'Design',
    description: 'Customize appearance',
  },
  {
    id: 'settings',
    title: 'Settings',
    description: 'Configure options',
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
  const { data: templates, isLoading: templatesLoading } = useTemplates()
  const createQRMutation = useCreateQRCode()
  const updateQRMutation = qrcodeId ? useUpdateQRCode(qrcodeId) : null

  // Initialize wizard state
  const wizard = useWizardState({
    steps: WIZARD_STEPS,
    initialStep: initialData?.template ? 1 : 0,
    persistKey: mode === 'create' ? 'qr-wizard-state' : undefined,
    validateStep: async (stepIndex, data) => {
      // Validate each step before proceeding
      switch (stepIndex) {
        case 0: // Template step is optional
          return true
        case 1: // Type & Data step
          return validateTypeAndData(data['type-data'])
        case 2: // Design step is optional
          return true
        case 3: // Settings step
          return validateSettings(data.settings)
        default:
          return true
      }
    },
  })

  // Initialize wizard data from initial data or defaults
  useEffect(() => {
    if (initialData) {
      wizard.setWizardData({
        template: initialData.template,
        'type-data': {
          type: initialData.type || 'url',
          data: initialData.data || {},
        },
        design: initialData.customization || getDefaultDesign(),
        settings: initialData.settings || getDefaultSettings(),
      })
    } else {
      wizard.setWizardData({
        'type-data': {
          type: 'url',
          data: {},
        },
        design: getDefaultDesign(),
        settings: getDefaultSettings(),
      })
    }
  }, [initialData])

  // Handle template selection
  const handleTemplateSelect = (template: QRCodeTemplate) => {
    wizard.updateData('template', template)
    wizard.updateData('type-data', {
      type: template.type || 'url',
      data: template.data || {},
    })
    wizard.updateData('design', template.design || getDefaultDesign())
    // Auto-advance to next step
    wizard.nextStep()
  }

  // Handle skip template
  const handleSkipTemplate = () => {
    wizard.updateData('template', null)
    wizard.nextStep()
  }

  // Handle type and data changes
  const handleTypeDataChange = (field: string, value: any) => {
    const currentData = wizard.wizardData['type-data'] || {}
    wizard.updateData('type-data', {
      ...currentData,
      [field]: value,
    })
  }

  // Handle design changes
  const handleDesignChange = (design: any) => {
    wizard.updateData('design', design)
  }

  // Handle settings changes
  const handleSettingsChange = (settings: any) => {
    wizard.updateData('settings', settings)
  }

  // Submit wizard
  const handleSubmit = async () => {
    try {
      const wizardData = wizard.wizardData
      const typeData = wizardData['type-data']
      const design = wizardData.design
      const settings = wizardData.settings

      const payload = {
        name: settings.name,
        type: typeData.type,
        data: typeData.data,
        customization: design,
        folderId: settings.folderId || null,
        pinProtected: settings.pinProtected || false,
        pin: settings.pin || null,
        expiresAt: settings.hasExpiration ? settings.expiresAt : null,
        tags: settings.tags || [],
        defaultSize: settings.defaultSize || '500',
        defaultFormat: settings.defaultFormat || 'png',
      }

      let result
      if (mode === 'edit' && updateQRMutation) {
        result = await updateQRMutation.mutateAsync(payload)
        toast.success('QR Code Updated', {
          description: 'Your QR code has been updated successfully',
          icon: <CheckCircle2 className="w-5 h-5 text-green-600" />,
        })
      } else {
        result = await createQRMutation.mutateAsync(payload)
        toast.success('QR Code Created', {
          description: 'Your QR code has been created successfully',
          icon: <CheckCircle2 className="w-5 h-5 text-green-600" />,
        })
      }

      // Clear wizard state
      wizard.reset()

      // Call success callback or navigate
      if (onSuccess) {
        onSuccess(result)
      } else {
        router.push(`/qrcodes/${result.id}`)
      }
    } catch (error: any) {
      console.error('Failed to save QR code:', error)
      toast.error('Error', {
        description: error.message || 'Failed to save QR code',
        icon: <AlertCircle className="w-5 h-5 text-red-600" />,
      })
    }
  }

  // Render current step content
  const renderStepContent = () => {
    const currentStepId = WIZARD_STEPS[wizard.currentStep]?.id ?? 'template'

    switch (currentStepId) {
      case 'template':
        return (
          <Step1TemplateSelection
            templates={templates || []}
            selectedTemplateId={wizard.wizardData.template?.id}
            onTemplateSelect={handleTemplateSelect}
            onSkip={handleSkipTemplate}
            isLoading={templatesLoading}
          />
        )

      case 'type-data':
        return (
          <Step2TypeAndData
            qrType={wizard.wizardData['type-data']?.type || 'url'}
            onChange={handleTypeDataChange}
            formData={wizard.wizardData['type-data'] || {}}
            showPreview={true}
          />
        )

      case 'design':
        return (
          <Step3Designer
            design={wizard.wizardData.design || getDefaultDesign()}
            onChange={handleDesignChange}
            qrData={wizard.wizardData['type-data']?.data || {}}
            qrType={wizard.wizardData['type-data']?.type || 'url'}
          />
        )

      case 'settings':
        return (
          <Step4Settings
            settings={wizard.wizardData.settings || getDefaultSettings()}
            onChange={handleSettingsChange}
            folders={[]} // TODO: Load folders from API
          />
        )

      default:
        return null
    }
  }

  const isSubmitting =
    createQRMutation.isPending || updateQRMutation?.isPending || false

  return (
    <div className="h-screen flex flex-col">
      <StepperWizard
        steps={WIZARD_STEPS}
        currentStep={wizard.currentStep}
        onStepChange={(step) => wizard.goToStep(step)}
        onBack={wizard.previousStep}
        onNext={wizard.nextStep}
        onSubmit={handleSubmit}
        canGoBack={wizard.canGoBack}
        canGoNext={wizard.canGoNext}
        isSubmitting={isSubmitting}
        isValidating={wizard.isValidating}
        showProgress={true}
        allowStepClick={true}
      >
        {renderStepContent()}
      </StepperWizard>
    </div>
  )
}

// Helper functions
function getDefaultDesign() {
  return {
    foregroundColor: '#000000',
    backgroundColor: '#FFFFFF',
    style: 'squares',
    size: 500,
  }
}

function getDefaultSettings() {
  return {
    name: '',
    folderId: null,
    pinProtected: false,
    pin: null,
    hasExpiration: false,
    expiresAt: null,
    tags: [],
    defaultSize: '500',
    defaultFormat: 'png',
  }
}

function validateTypeAndData(data: any): boolean {
  if (!data?.type) {
    toast.error('Validation Error', {
      description: 'Please select a QR code type',
    })
    return false
  }

  if (!data?.data || Object.keys(data.data).length === 0) {
    toast.error('Validation Error', {
      description: 'Please enter QR code data',
    })
    return false
  }

  // Type-specific validation
  switch (data.type) {
    case 'url':
      if (!data.data.url) {
        toast.error('Validation Error', {
          description: 'Please enter a URL',
        })
        return false
      }
      break
    case 'vcard':
      if (!data.data.firstName && !data.data.lastName) {
        toast.error('Validation Error', {
          description: 'Please enter at least a name',
        })
        return false
      }
      break
    // Add more type-specific validations as needed
  }

  return true
}

function validateSettings(settings: any): boolean {
  if (!settings?.name || settings.name.trim() === '') {
    toast.error('Validation Error', {
      description: 'Please enter a name for your QR code',
    })
    return false
  }

  if (settings.pinProtected && !settings.pin) {
    toast.error('Validation Error', {
      description: 'Please enter a PIN or disable PIN protection',
    })
    return false
  }

  if (settings.hasExpiration && !settings.expiresAt) {
    toast.error('Validation Error', {
      description: 'Please select an expiration date or disable expiration',
    })
    return false
  }

  return true
}
