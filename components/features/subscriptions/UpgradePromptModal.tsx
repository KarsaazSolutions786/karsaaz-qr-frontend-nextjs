'use client'

import Link from 'next/link'
import { ArrowUpCircle, Check, Lock } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'
import { useSubscription } from '@/lib/hooks/useSubscription'
import { usePlans } from '@/lib/hooks/queries/usePlans'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface UpgradePromptModalProps {
  open: boolean
  /** The feature that triggered the upgrade prompt */
  feature: string
  /** Title for the modal */
  title: string
  /** Description explaining what the user needs */
  description: string
  onDismiss: () => void
}

/**
 * Map of feature keys to the plan features that include them.
 * Used to determine which plans to highlight in the comparison.
 */
const FEATURE_TO_PLAN_FEATURE: Record<string, string> = {
  svg_download: 'svg-download',
  pdf_download: 'pdf-download',
  eps_download: 'eps-download',
  bulk_operations: 'bulk-qrcode-creation',
  bulk_qr: 'bulk-qrcode-creation',
  advanced_analytics: 'advanced_analytics',
  custom_domain: 'custom_domain',
  api_access: 'api_access',
  white_label: 'white_label',
  templates: 'templates',
  ai_design: 'ai_design',
}

/**
 * Purpose: Generic upgrade prompt modal with plan comparison. Shows a feature-specific message with an overview of plans that include the required feature. Follows P1 PlanEnforcement pattern but adapted to Next.js with shadcn/ui Dialog. Use via useSubscriptionAlerts().promptFeatureUpgrade() or useSubscription().openUpgradeModal() for simpler cases.
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */

export function UpgradePromptModal({
  open,
  feature,
  title,
  description,
  onDismiss,
}: UpgradePromptModalProps) {
  const { t } = useTranslation()
  const { plan: currentPlan } = useSubscription()
  const { data: plansData } = usePlans()

  const plans = plansData?.data ?? []

  // Find plans that include the requested feature
  const planFeatureKey = FEATURE_TO_PLAN_FEATURE[feature] ?? feature
  const availablePlans = plans.filter((p: any) => {
    if (p.is_hidden) return false
    const features: string[] = p.features ?? p.qr_types ?? []
    return features.includes(planFeatureKey)
  })

  // Determine current plan name for "you are here" indicator
  const currentPlanName = currentPlan?.name ?? 'Free'

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) onDismiss() }}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
            <Lock className="h-6 w-6 text-purple-600" />
          </div>
          <DialogTitle className="text-center">{title}</DialogTitle>
          <DialogDescription className="text-center">
            {description}
          </DialogDescription>
        </DialogHeader>

        {/* Current plan indicator */}
        <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
          <p className="text-xs text-muted-foreground">
            {t('Current Plan')}
          </p>
          <p className="text-sm font-semibold text-gray-900">{currentPlanName}</p>
        </div>

        {/* Plans that include this feature */}
        {availablePlans.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">
              {t('Available with these plans:')}
            </p>
            <div className="space-y-2">
              {availablePlans.slice(0, 3).map((plan: any) => (
                <div
                  key={plan.id}
                  className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3"
                >
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{plan.name}</p>
                      {plan.monthly_price && (
                        <p className="text-xs text-muted-foreground">
                          ${parseFloat(plan.monthly_price).toFixed(2)}/{t('mo')}
                        </p>
                      )}
                    </div>
                  </div>
                  {plan.is_popular && (
                    <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                      {t('Popular')}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <DialogFooter className="flex-col gap-2 sm:flex-col">
          <Button asChild className="w-full">
            <Link href="/pricing">
              <ArrowUpCircle className="mr-2 h-4 w-4" />
              {t('View Plans & Upgrade')}
            </Link>
          </Button>
          <Button
            variant="ghost"
            className="w-full text-muted-foreground"
            onClick={onDismiss}
          >
            {t('Maybe Later')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
