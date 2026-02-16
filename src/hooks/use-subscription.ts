import { useAuthStore } from '@/store/useAuthStore';
import { usePermission } from '@/hooks/use-permission';

export function useSubscription() {
  const { user } = useAuthStore();
  const { isSuperAdmin } = usePermission();

  /**
   * Helper to get the user's current active plan
   */
  const getActivePlan = () => {
    if (!user) return null;
    
    // Check for explicit latest plan attached to user object
    if (user.latest_subscription_plan) return user.latest_subscription_plan;

    // Search through subscriptions array for an 'active' one
    const activeSub = user.subscriptions?.find((s: any) => 
      s.status === 'active' || 
      (s.statuses && s.statuses[0]?.status === 'active')
    );

    return activeSub?.subscription_plan || null;
  };

  /**
   * Check if a specific feature is allowed under the current plan
   */
  const featureAllowed = (featureSlug: string) => {
    // Super admins are never restricted
    if (isSuperAdmin()) return true;

    const plan = getActivePlan();
    if (!plan) return false;

    // Check plan's features list
    return plan.features?.includes(featureSlug);
  };

  /**
   * Check if a specific QR code type is allowed under the current plan
   */
  const qrTypeAllowed = (qrTypeSlug: string) => {
    if (isSuperAdmin()) return true;

    const plan = getActivePlan();
    if (!plan) return false;

    // Check plan's allowed QR types list
    return plan.qr_types?.includes(qrTypeSlug);
  };

  /**
   * Check if user is within their sub-user limit
   */
  const canAddSubUser = (currentCount: number) => {
    if (isSuperAdmin()) return true;

    const plan = getActivePlan();
    if (!plan) return false;

    if (plan.number_of_users === -1) return true; // Unlimited
    return currentCount < plan.number_of_users;
  };

  return {
    getActivePlan,
    featureAllowed,
    qrTypeAllowed,
    canAddSubUser,
  };
}
