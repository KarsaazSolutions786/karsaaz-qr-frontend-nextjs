import { Metadata } from 'next'
import { OrgLoginContent } from '@/components/features/auth/OrgLoginContent'

export const metadata: Metadata = {
  title: 'Organization Login | Karsaaz QR',
  description: 'Login to your organization portal',
}

export default function OrganizationLoginPage() {
  return (
    <div className="flex w-full items-center justify-center p-4">
      <OrgLoginContent />
    </div>
  )
}
