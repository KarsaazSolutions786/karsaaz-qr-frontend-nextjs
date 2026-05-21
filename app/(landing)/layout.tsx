import LandingNavbar from '@/components/landing/LandingNavbar'
import LandingFooter from '@/components/landing/LandingFooter'

/**
 * Purpose: Executes LandingLayout functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: April 2026
 */
export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <LandingNavbar />
      <main className="flex-grow">{children}</main>
      <LandingFooter />
    </div>
  )
}
