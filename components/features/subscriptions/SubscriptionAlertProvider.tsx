'use client'

import { useSubscriptionAlerts } from '@/lib/hooks/useSubscriptionAlerts'
import { ExpiringSubscriptionModal } from './ExpiringSubscriptionModal'
import { TrialExpiringModal } from './TrialExpiringModal'
import { UpgradePromptModal } from './UpgradePromptModal'

/**
 * Provider component that renders subscription alert modals.
 *
 * Place this inside the dashboard layout so that subscription state modals
 * auto-trigger based on the user's subscription status. Modals are dismissed
 * per session (sessionStorage) and will not re-appear until the next login.
 *
 * Matches P1's subscription.js hook system which fires localUserReady and
 * routeAfterRender events for each subscription type handler.
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

  return (
    <>
      <ExpiringSubscriptionModal
        open={showExpiringModal}
        daysRemaining={daysRemaining}
        onDismiss={dismissExpiring}
      />

      <TrialExpiringModal
        open={showTrialExpiringModal}
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
