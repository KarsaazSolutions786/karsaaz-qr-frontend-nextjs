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

const steps: Step[] = [
  { id: 'intro', title: 'Welcome', description: 'Introduction' },
  { id: 'database', title: 'Database', description: 'Configure DB' },
  { id: 'mail', title: 'Mail', description: 'SMTP settings' },
  { id: 'license', title: 'License', description: 'Validate license' },
  { id: 'superuser', title: 'Admin', description: 'Create admin' },
  { id: 'app-details', title: 'App Details', description: 'App config' },
  { id: 'complete', title: 'Complete', description: 'All done!' },
]

export default function InstallPage() {
  const [currentStep, setCurrentStep] = useState(0)
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

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((s) => s + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1)
    }
  }

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
