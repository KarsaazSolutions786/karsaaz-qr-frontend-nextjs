'use client'

import { Suspense, useState, useCallback, useEffect, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { QRCodeTypeSelector } from '@/components/features/qrcodes/QRCodeTypeSelector'
import { QRWizardContainer } from '@/components/features/qrcodes/wizard'
import { TemplateSelectionAdapter } from '@/components/features/qrcodes/TemplateSelectionAdapter'
import { useSubscriptionLimits } from '@/lib/hooks/useSubscriptionLimits'
import { useAccountCredit } from '@/lib/hooks/useAccountCredit'
import { useGuest } from '@/lib/hooks/useGuest'
import { UpgradeRequiredModal } from '@/components/subscription/UpgradeRequiredModal'
import { InsufficientCreditsModal } from '@/components/features/payment/InsufficientCreditsModal'
import { useUseTemplate } from '@/lib/hooks/queries/useTemplates'
import { QR_TYPES } from '@/lib/constants/qr-types'
import { useTranslation } from '@/lib/i18n'
import { toast } from 'sonner'
import { LottieLoader } from '@/components/ui/lottie-loader'

/**
 * Purpose: Create QR Code Page Route: /qrcodes/new (Home) Flow (updated to match legacy Lit frontend with template gateway): 1. No params          -> show Template Selection Gateway (choose template vs blank) 2. ?template_id=X     -> apply template, redirect to /qrcodes/{newId}/edit 3. User clicks blank  -> show QR type selector grid 4. User clicks type   -> URL becomes /qrcodes/new?type=url -> wizard opens at Data step 5. Wizard steps: Type -> Data -> Design -> Download On small screens (mobile), the gateway is skippable -- it shows a compact version that still allows both paths. Quota gate: Before entering the wizard, we check the user's subscription limits. If they have reached their dynamic QR code quota, the upgrade modal is shown instead of the wizard. Credit gate: When billing mode is "account_credit", subscription limits are bypassed and instead the user's credit balance is checked against the per-type price. If insufficient, the InsufficientCreditsModal is shown.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

function CreateQRCodeInner() {
  const { t } = useTranslation()
  const router = useRouter()
  const searchParams = useSearchParams()
  const typeParam = searchParams?.get('type') || ''
  const templateIdParam = searchParams?.get('template_id') || ''
  const { isGuest, guestConfig } = useGuest()

  // Filter allowed QR types for guests based on admin config
  const allowedQrTypes = useMemo(() => {
    if (!isGuest || !guestConfig) return undefined // undefined = show all
    let types: string[] = guestConfig.allowed_qr_types ?? []
    // If dynamic QR codes are disabled, filter out dynamic types
    if (!guestConfig.allow_dynamic_qrcodes) {
      types = types.filter(id => {
        const qrType = QR_TYPES.find(t => t.id === id)
        return !qrType || qrType.cat !== 'dynamic'
      })
    }
    return types
  }, [isGuest, guestConfig])

  /**
   * Page mode:
   * - 'gateway'  : Template vs Blank selection (initial landing)
   * - 'blank'    : Type selector -> Wizard flow (existing behavior)
   * - 'applying' : Applying a template (loading state while POST completes)
   */
  const [mode, setMode] = useState<'gateway' | 'blank' | 'applying'>(() => {
    // If ?type= is present, go straight to blank/wizard flow
    if (typeParam) return 'blank'
    // If ?template_id= is present, go to applying mode
    if (templateIdParam) return 'applying'
    // Default: show QR type selector directly (skip template gateway)
    return 'blank'
  })

  // Local state tracks user selection (survives soft navigation)
  const [selectedType, setSelectedType] = useState(typeParam)
  const [showWizard, setShowWizard] = useState(!!typeParam)

  // BUG-42/51: Keep local selection in sync with the URL ?type= param.
  // When the user navigates BACK (browser back or programmatic), the URL
  // param changes but React state was previously initialised only once,
  // leaving the wizard mounted and blocking re-selection of another type.
  // Mirroring the param here returns the user to the type grid so they can
  // freely pick a different QR type after going back.
  useEffect(() => {
    setSelectedType(typeParam)
    setShowWizard(!!typeParam)
    if (typeParam && mode !== 'blank') setMode('blank')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typeParam])

  // Subscription quota check (also handles credit-mode generic check)
  const {
    canCreateQR,
    upgradeReason,
    usage,
    limits,
    showUpgradeModal,
    setShowUpgradeModal,
    isAccountCreditMode,
  } = useSubscriptionLimits()

  // Account credit details (for per-type affordability check)
  const { balance: creditBalance, canAfford, getPrice } = useAccountCredit()

  // Insufficient credits modal state
  const [showCreditsModal, setShowCreditsModal] = useState(false)
  const [creditsModalType, setCreditsModalType] = useState<{
    isDynamic: boolean
    requiredAmount: number
  }>({ isDynamic: true, requiredAmount: 0 })

  // Template application mutation
  const useTemplateMutation = useUseTemplate({
    onSuccess: newQRCode => {
      const qrId = newQRCode?.id || newQRCode?.data?.id
      if (qrId) {
        toast.success(t('Template applied! Redirecting to editor...'))
        router.replace(`/qrcodes/${qrId}/edit`)
      } else {
        toast.error(t('Template applied but could not determine QR code ID.'))
        setMode('blank')
      }
    },
    onError: (error: any) => {
      toast.error(error?.message || t('Failed to apply template. Starting from scratch.'))
      setMode('blank')
    },
  })

  // Handle ?template_id= on mount
  useEffect(() => {
    if (templateIdParam && mode === 'applying' && !useTemplateMutation.isPending) {
      const templateId = parseInt(templateIdParam, 10)
      if (!isNaN(templateId)) {
        useTemplateMutation.mutate({ template_id: templateId })
      } else {
        toast.error(t('Invalid template ID'))
        setMode('gateway')
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [templateIdParam])

  const handleTypeSelect = useCallback(
    (type: string) => {
      // Gate: general creation check (subscription limit or credit minimum)
      if (!canCreateQR) {
        if (isAccountCreditMode) {
          // In credit mode, show the credits modal with the specific type's price
          const typeDef = QR_TYPES.find(t => t.id === type)
          const isDynamic = typeDef?.cat === 'dynamic'
          setCreditsModalType({ isDynamic, requiredAmount: getPrice(isDynamic) })
          setShowCreditsModal(true)
        } else {
          setShowUpgradeModal(true)
        }
        return
      }

      // Gate: per-type credit affordability (only in credit mode)
      if (isAccountCreditMode) {
        const typeDef = QR_TYPES.find(t => t.id === type)
        const isDynamic = typeDef?.cat === 'dynamic'
        if (!canAfford(isDynamic)) {
          setCreditsModalType({ isDynamic, requiredAmount: getPrice(isDynamic) })
          setShowCreditsModal(true)
          return
        }
      }

      setSelectedType(type)
      setShowWizard(true)
      // Update URL so refresh / share links preserve the selected type
      router.replace(`/qrcodes/new?type=${encodeURIComponent(type)}`, { scroll: false })
    },
    [canCreateQR, isAccountCreditMode, canAfford, getPrice, setShowUpgradeModal, router]
  )

  const handleStartBlank = useCallback(() => {
    // Gate: if quota/credit is exceeded, show appropriate modal
    if (!canCreateQR) {
      if (isAccountCreditMode) {
        // Show generic credits modal (using dynamic price as default)
        setCreditsModalType({ isDynamic: true, requiredAmount: getPrice(true) })
        setShowCreditsModal(true)
      } else {
        setShowUpgradeModal(true)
      }
      return
    }
    setMode('blank')
  }, [canCreateQR, isAccountCreditMode, getPrice, setShowUpgradeModal])

  // If user arrives with ?type= param but is over quota, show the type selector
  // with the upgrade modal instead of silently opening the wizard
  const shouldShowWizard = showWizard && selectedType && canCreateQR

  return (
    <div
      className="min-h-full"
      style={{ background: 'linear-gradient(180deg, #ffffff 0%, #f9f9f9 100%)' }}
    >
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        {/* Mode: Applying template (loading) */}
        {mode === 'applying' && (
          <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
            <LottieLoader size={100} />
            <p className="text-lg text-gray-600">{t('Applying template...')}</p>
          </div>
        )}

        {/* Mode: Gateway -- template vs blank selection */}
        {mode === 'gateway' && (
          <TemplateSelectionAdapter
            onStartBlank={handleStartBlank}
            onSelectTemplate={template => {
              // Gate: if quota is exceeded, show appropriate modal
              if (!canCreateQR) {
                if (isAccountCreditMode) {
                  setCreditsModalType({ isDynamic: true, requiredAmount: getPrice(true) })
                  setShowCreditsModal(true)
                } else {
                  setShowUpgradeModal(true)
                }
                return
              }
              // Navigate to same page with template_id -- handled by useEffect
              router.replace(`/qrcodes/new?template_id=${template.id}`)
            }}
          />
        )}

        {/* Mode: Blank -- existing type selector + wizard flow */}
        {mode === 'blank' && (
          <>
            {shouldShowWizard ? (
              <QRWizardContainer mode="create" initialData={{ type: selectedType, data: {} }} />
            ) : (
              <QRCodeTypeSelector
                value={selectedType}
                onChange={handleTypeSelect}
                allowedTypes={allowedQrTypes}
              />
            )}
          </>
        )}
      </div>

      {/* Upgrade modal -- shown when user tries to create a QR code while over subscription quota (not for guests) */}
      {!isGuest && (
        <UpgradeRequiredModal
          open={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
          message={upgradeReason}
          currentUsage={usage.totalQRCodes}
          planLimit={limits.maxQRCodes}
        />
      )}

      {/* Insufficient credits modal -- shown when user in credit mode cannot afford the QR type (not for guests) */}
      {!isGuest && (
        <InsufficientCreditsModal
          open={showCreditsModal}
          onClose={() => setShowCreditsModal(false)}
          balance={creditBalance}
          requiredAmount={creditsModalType.requiredAmount}
          isDynamic={creditsModalType.isDynamic}
        />
      )}
    </div>
  )
}

/**
 * Purpose: Executes CreateQRCodePage functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export default function CreateQRCodePage() {
  return (
    <Suspense fallback={<div className="px-4 py-6 sm:px-6 lg:px-8 animate-pulse">Loading...</div>}>
      <CreateQRCodeInner />
    </Suspense>
  )
}
