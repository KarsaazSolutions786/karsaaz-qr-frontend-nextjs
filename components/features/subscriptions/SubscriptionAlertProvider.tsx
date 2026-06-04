'use client'

import { usePathname } from 'next/navigation'
import { useSubscriptionAlerts } from '@/lib/hooks/useSubscriptionAlerts'
import { ExpiringSubscriptionModal } from './ExpiringSubscriptionModal'
import { TrialExpiringModal } from './TrialExpiringModal'
import { UpgradePromptModal } from './UpgradePromptModal'

/**
 * Routes where the auto-triggered "expiring" / "trial expiring" modals must NOT
 * pop over the screen, because they would block/interrupt an active flow.
 * (QR-09) The non-blocking SubscriptionBanner still keeps the user informed.
 */
function isCreationFlowRoute(pathname: string | null): boolean {
  if (!pathname) return false
  return (
    pathname.startsWith('/qrcodes/new') ||
    pathname.startsWith('/qrcodes/bulk-create') ||
    /^\/qrcodes\/[^/]+\/edit/.test(pathname) ||
    pathname.startsWith('/guest/create')
  )
}

/**
 * Purpose: Provider component that renders subscription alert modals. Place this inside the dashboard layout so that subscription state modals auto-trigger based on the user's subscription status. Modals are dismissed per session (sessionStorage) and will not re-appear until the next login. Matches P1's subscription.js hook system which fires localUserReady and routeAfterRender events for each subscription type handler.
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */

export function SubscriptionAlertProvider() {
  const {
    showExpiringModal,
    showTrialExpiringModal,
    showFeatureUpgradeModal,
    featureUpgradeContext,
    daysRemaining,
    dismissExpiring,
    dismissTrialExpiring,
    dismissFeatureUpgrade,
  } = useSubscriptionAlerts()

  const pathname = usePathname()
  // QR-09: don't let the expiry modals block the QR creation flow.
  const suppressBlockingModals = isCreationFlowRoute(pathname)

  return (
    <>
      <ExpiringSubscriptionModal
        open={showExpiringModal && !suppressBlockingModals}
        daysRemaining={daysRemaining}
        onDismiss={dismissExpiring}
      />

      <TrialExpiringModal
        open={showTrialExpiringModal && !suppressBlockingModals}
        daysRemaining={daysRemaining}
        onDismiss={dismissTrialExpiring}
      />

      {featureUpgradeContext && (
        <UpgradePromptModal
          open={showFeatureUpgradeModal}
          feature={featureUpgradeContext.feature}
          title={featureUpgradeContext.title}
          description={featureUpgradeContext.description}
          onDismiss={dismissFeatureUpgrade}
        />
      )}
    </>
  )
}
