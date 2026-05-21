import { LanguagePicker } from '@/components/common/LanguagePicker'

/**
 * Purpose: Executes PublicLayout functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */
export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Floating language picker for public pages */}
      <div className="fixed top-4 right-4 rtl:right-auto rtl:left-4 z-50">
        <LanguagePicker variant="light" />
      </div>
      {children}
    </>
  )
}
