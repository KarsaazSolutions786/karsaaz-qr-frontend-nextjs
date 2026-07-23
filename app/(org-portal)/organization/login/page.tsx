import { Metadata } from 'next'
import { OrgLoginContent } from '@/components/features/auth/OrgLoginContent'

export const metadata: Metadata = {
  title: 'Organization Portal Login | Karsaaz QR',
  description: 'Sign in to manage your Karsaaz QR organization.',
}

export default function OrgLoginPage() {
  return (
    <div className="fixed inset-0 flex flex-col justify-center overflow-hidden bg-gradient-to-br from-[#B36AC5] to-[#8073E0]">
      {/* Background concentric circles */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-0 mix-blend-screen opacity-50">
        <div className="relative flex h-[1000px] w-[1000px] items-center justify-center">
          <div className="absolute inset-0 rounded-full border-[1px] border-white/20"></div>
          <div className="absolute inset-[150px] rounded-full border-[1px] border-white/30"></div>
          <div className="absolute inset-[300px] rounded-full border-[1px] border-white/40"></div>
        </div>
      </div>

      <div className="relative z-10 flex w-full items-center justify-center min-h-[543px]">
        <OrgLoginContent />
      </div>
    </div>
  )
}
