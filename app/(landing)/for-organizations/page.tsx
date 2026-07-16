import { Metadata } from 'next'
import { generateOGMetadata } from '@/lib/utils/og-metadata'
import { OrganizationPlansContent } from '@/components/features/organization/OrganizationPlansContent'

export const metadata: Metadata = {
  ...generateOGMetadata(
    'For Organizations - Karsaaz QR',
    'API access, team roles, webhooks, and usage-based billing for organizations. See plans and everything the Karsaaz QR organization platform provides.',
    undefined,
    '/for-organizations'
  ),
}

/**
 * Purpose: Public marketing/pricing page for the organization platform -- distinct
 * from /pricing (individual-user SubscriptionPlan catalog). Pulls live org_plans
 * data from the now-public GET /api/org-plans endpoint.
 * Owner/Author: Claude Code
 * Created/Updated: 2026-07-15
 */
export default function ForOrganizationsPage() {
  return <OrganizationPlansContent />
}
