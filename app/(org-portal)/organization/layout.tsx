'use client'

import React, { Suspense, useEffect, useState } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'
import { useOrganization } from '@/lib/context/OrganizationContext'
import { LottieLoader } from '@/components/ui/lottie-loader'
import { DashboardHeader } from '@/components/layout/DashboardHeader'
import { OrganizationSidebar } from '@/components/features/organization/OrganizationSidebar'
import { ActAsBanner } from '@/components/common/ActAsBanner'


export default function OrganizationPortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen karsaaz-bg dark:bg-gray-900">
          <div className="flex-1 flex items-center justify-center">
            <LottieLoader size={80} />
          </div>
        </div>
      }
    >
      <OrganizationPortalLayoutInner>{children}</OrganizationPortalLayoutInner>
    </Suspense>
  )
}

function OrganizationPortalLayoutInner({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { user, isLoading, logout } = useAuth()
  const { activeOrganization, organizations, isLoading: isOrgLoading, setActiveOrganization } = useOrganization()
  
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Avoid running on server
  useEffect(() => {
    setMounted(true)
  }, [])

  // Guard: Not logged in
  useEffect(() => {
    if (!isLoading && !user && pathname !== '/organization/login') {
      const returnPath = pathname
        ? `${pathname}${searchParams?.toString() ? `?${searchParams}` : ''}`
        : '/organization/login'
      router.push(`/organization/login?returnUrl=${encodeURIComponent(returnPath)}`)
    }
  }, [user, isLoading, router, pathname, searchParams])

  // Guard: No active organization and not on onboarding
  useEffect(() => {
    if (!isLoading && user && !isOrgLoading && !activeOrganization && pathname !== '/organization/onboarding') {
      if (organizations && organizations.length > 0) {
        setActiveOrganization(organizations[0] || null)
      } else {
        router.push('/organization/onboarding')
      }
    }
  }, [user, isLoading, isOrgLoading, activeOrganization, organizations, pathname, router, setActiveOrganization])

  const handleLogout = async () => {
    if (isLoggingOut) return
    setIsLoggingOut(true)
    try {
      await logout()
    } finally {
      setIsLoggingOut(false)
    }
  }

  if (!mounted || isLoading || (pathname !== '/organization/login' && (isOrgLoading || !user))) {
    return (
      <div className="flex h-screen karsaaz-bg dark:bg-gray-900">
        <div className="flex-1 flex items-center justify-center">
          <LottieLoader size={80} />
        </div>
      </div>
    )
  }

  // If on onboarding or login, we don't need the sidebar
  if (pathname === '/organization/onboarding' || pathname === '/organization/login') {
    return <>{children}</>
  }

  return (
    <div className="flex h-screen karsaaz-bg dark:bg-gray-900">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-900/80 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <OrganizationSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
        isLoggingOut={isLoggingOut}
        handleLogout={handleLogout}
      />

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <ActAsBanner />
        
        <DashboardHeader
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          isAccountCreditMode={false}
        />

        <main
          id="main-content"
          role="main"
          className="flex-1 overflow-y-auto dark:bg-gray-900 dark:text-gray-100 relative"
        >
          {children}
        </main>
      </div>
    </div>
  )
}
