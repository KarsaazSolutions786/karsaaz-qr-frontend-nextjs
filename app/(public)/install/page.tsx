'use client'

import React, { useState } from 'react'
import { StepperWizard, type Step } from '@/components/wizard/StepperWizard'
import { IntroductionStep } from '@/components/features/install/IntroductionStep'
import { DatabaseStep } from '@/components/features/install/DatabaseStep'
import { MailStep } from '@/components/features/install/MailStep'
import { LicenseStep } from '@/components/features/install/LicenseStep'
import { SuperUserStep } from '@/components/features/install/SuperUserStep'
import { AppDetailsStep } from '@/components/features/install/AppDetailsStep'
import { CompleteStep } from '@/components/features/install/CompleteStep'
import apiClient from '@/lib/api/client'
import { useTranslation } from '@/lib/i18n'

/**
 * Purpose: Executes InstallPage functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export default function InstallPage() {
  const { t } = useTranslation()
  const [currentStep, setCurrentStep] = useState(0)

  const steps: Step[] = [
    { id: 'intro', title: t('Welcome'), description: t('Introduction') },
    { id: 'database', title: t('Database'), description: t('Configure DB') },
    { id: 'mail', title: t('Mail'), description: t('SMTP settings') },
    { id: 'license', title: t('License'), description: t('Validate license') },
    { id: 'superuser', title: t('Admin'), description: t('Create admin') },
    { id: 'app-details', title: t('App Details'), description: t('App config') },
    { id: 'complete', title: t('Complete'), description: t('All done!') },
  ]
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [dbConfig, setDbConfig] = useState({
    host: 'localhost',
    port: '3306',
    database: '',
    username: '',
    password: '',
  })

  const [mailConfig, setMailConfig] = useState<{
    host: string
    port: string
    username: string
    password: string
    encryption: 'tls' | 'ssl' | 'none'
    fromAddress: string
    fromName: string
  }>({
    host: '',
    port: '587',
    username: '',
    password: '',
    encryption: 'tls',
    fromAddress: '',
    fromName: '',
  })

  const [purchaseCode, setPurchaseCode] = useState('')

  const [superUser, setSuperUser] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const [appDetails, setAppDetails] = useState({
    appName: 'Karsaaz QR',
    appUrl: '',
    description: '',
    timezone: 'UTC',
    defaultLanguage: 'en',
  })

  /**
   * Purpose: Executes handleNext functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((s) => s + 1)
    }
  }

  /**
   * Purpose: Executes handleBack functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1)
    }
  }

  /**
   * Purpose: Executes handleSubmit functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      await apiClient.post('/install/complete', {
        database: dbConfig,
        mail: mailConfig,
        purchaseCode,
        admin: { name: superUser.name, email: superUser.email, password: superUser.password },
        app: appDetails,
      })
      setCurrentStep(steps.length - 1)
    } catch (error) {
      console.error('Installation failed:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const isLastContentStep = currentStep === steps.length - 2
  const isCompleteStep = currentStep === steps.length - 1

  /**
   * Purpose: Executes renderStep functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  const renderStep = () => {
    switch (currentStep) {
      case 0: return <IntroductionStep />
      case 1: return <DatabaseStep config={dbConfig} onChange={setDbConfig} />
      case 2: return <MailStep config={mailConfig} onChange={setMailConfig} />
      case 3: return <LicenseStep purchaseCode={purchaseCode} onChange={setPurchaseCode} />
      case 4: return <SuperUserStep config={superUser} onChange={setSuperUser} />
      case 5: return <AppDetailsStep config={appDetails} onChange={setAppDetails} />
      case 6: return <CompleteStep />
      default: return null
    }
  }

  return (
    <StepperWizard
      steps={steps}
      currentStep={currentStep}
      onStepChange={setCurrentStep}
      onBack={handleBack}
      onNext={isLastContentStep ? handleSubmit : handleNext}
      onSubmit={handleSubmit}
      canGoBack={currentStep > 0 && !isCompleteStep}
      canGoNext={!isCompleteStep}
      isSubmitting={isSubmitting}
      allowStepClick={!isCompleteStep}
    >
      {renderStep()}
    </StepperWizard>
  )
}
