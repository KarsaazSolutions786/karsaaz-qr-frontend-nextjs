import { Metadata } from 'next'
import { OrganizationUpgradeContent } from '@/components/features/organization/OrganizationUpgradeContent'

export const metadata: Metadata = {
  title: 'Upgrade Organization Plan | Karsaaz QR',
  description: 'Upgrade your organization plan to unlock more features and higher limits',
}

export default function OrganizationUpgradePage() {
  return <OrganizationUpgradeContent />
}
