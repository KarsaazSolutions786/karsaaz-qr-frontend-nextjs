'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { 
  UsersIcon,
  KeyIcon,
  CreditCardIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'
import { OrganizationSwitcher } from './OrganizationSwitcher'
import { useTranslation } from '@/lib/i18n'

interface OrganizationSidebarProps {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  sidebarCollapsed: boolean
  setSidebarCollapsed: React.Dispatch<React.SetStateAction<boolean>>
  isLoggingOut: boolean
  handleLogout: () => void
}

const ORG_NAV_ITEMS = [
  { name: 'Dashboard', href: '/organization/dashboard', icon: ChartBarIcon },
  { name: 'Members', href: '/organization/members', icon: UsersIcon },
  { name: 'API Keys', href: '/organization/api-keys', icon: KeyIcon },
  { name: 'Billing & Plans', href: '/organization/billing', icon: CreditCardIcon },
  { name: 'Settings', href: '/organization/settings', icon: Cog6ToothIcon },
]

export function OrganizationSidebar({
  sidebarOpen,
  setSidebarOpen,
  sidebarCollapsed,
  setSidebarCollapsed,
  isLoggingOut,
  handleLogout,
}: OrganizationSidebarProps) {
  const pathname = usePathname()
  const { t } = useTranslation()

  const isItemActive = (href: string) => {
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  return (
    <aside
      className={`
        fixed inset-y-0 left-0 z-50 flex flex-col overflow-hidden
        backdrop-blur-[25px] bg-white/90 border-r-2 border-white
        transition-all duration-300 ease-in-out transform
        lg:translate-x-0 lg:static lg:inset-auto
        ${sidebarCollapsed ? 'w-[115px]' : 'w-[264px]'}
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}
    >
      {/* Decorative QR watermark */}
      <div
        className="pointer-events-none absolute bottom-[-20px] left-[10px] right-[-20px] flex items-center justify-center"
        aria-hidden="true"
      >
        <Image
          src="/sidebar-assets/qr-watermark.svg"
          alt=""
          width={188}
          height={188}
          priority
          className="rotate-[23.5deg] opacity-100"
        />
      </div>

      <div className="relative shrink-0 flex items-center px-4" style={{ height: sidebarCollapsed ? '120px' : '154px' }}>
        <Link
          href="/organization/dashboard"
          className={`absolute flex items-center ${sidebarCollapsed ? 'left-1/2 top-[40px] -translate-x-1/2' : 'left-5 top-[72px]'}`}
          onClick={() => setSidebarOpen(false)}
        >
          {sidebarCollapsed ? (
            <Image
              src="/sidebar-assets/qr-bracket-icon.svg"
              alt="Karsaaz QR"
              width={40}
              height={40}
            />
          ) : (
            <span className="flex items-center gap-0.5">
              <Image
                src="/sidebar-assets/sidebar-logo.svg"
                alt="Karsaaz"
                width={160}
                height={32}
                priority
              />
              <Image src="/sidebar-assets/qr-bracket-icon.svg" alt="QR" width={30} height={30} />
            </span>
          )}
        </Link>

        {/* Desktop Collapse Toggle */}
        <button
          type="button"
          onClick={() => setSidebarCollapsed(prev => !prev)}
          className={`hidden lg:flex absolute items-center justify-center transition-colors ${
            sidebarCollapsed
              ? 'left-1/2 ml-6 top-[45px] h-[30px] w-[26px] rounded-[5px]'
              : 'right-5 top-[77px] h-[30px] w-[26px] rounded-[5px]'
          }`}
          aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <Image
            src={
              sidebarCollapsed
                ? '/sidebar-assets/expand-toggle.svg'
                : '/sidebar-assets/collapse-toggle.svg'
            }
            alt=""
            width={26}
            height={30}
          />
        </button>

        {/* Close button for mobile */}
        <button
          type="button"
          className="lg:hidden absolute right-5 top-[77px] text-[#6d6d6d] hover:text-[#1b1b1b]"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close sidebar"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
      </div>

      <div className="px-4 mb-4 relative z-10">
        {!sidebarCollapsed && <OrganizationSwitcher />}
      </div>

      <nav aria-label="Main navigation" className="relative z-10 flex-1 overflow-y-auto px-2 pb-4">
        {sidebarCollapsed ? (
          <div className="flex flex-col items-center gap-[20px] pt-0">
            {ORG_NAV_ITEMS.map(item => {
              const active = isItemActive(item.href)
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center justify-center transition-colors
                    ${
                      active
                        ? 'h-[50px] w-[72px] rounded-[8px] bg-[radial-gradient(ellipse_at_center,_#E889FF_0%,_#B36AC5_100%)] text-white'
                        : 'h-[25.54px] w-[25.54px] rounded-[6px] text-[#9b6fb5] hover:bg-[#f7f1fb]'
                    }
                  `}
                  title={item.name}
                >
                  <item.icon className={active ? 'h-5 w-5' : 'h-[22px] w-[22px]'} />
                </Link>
              )
            })}
          </div>
        ) : (
          <div className="space-y-1 px-2">
            {ORG_NAV_ITEMS.map(item => {
              const active = isItemActive(item.href)
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex h-[52px] items-center gap-3 px-4 text-[14px] font-medium transition-colors
                    ${
                      active
                        ? 'rounded-[12px] bg-[radial-gradient(ellipse_at_center,_#E889FF_0%,_#B36AC5_100%)] text-white'
                        : 'rounded-[26px] text-[#6d6d6d] hover:bg-[#f7f1fb]'
                    }
                  `}
                >
                  <div
                    className={`flex h-7 w-7 items-center justify-center rounded-[6px] ${active ? 'bg-white text-[#8f55a6]' : 'text-[#9b6fb5]'}`}
                  >
                    <item.icon className="h-4 w-4" />
                  </div>
                  <span className="truncate">{item.name}</span>
                </Link>
              )
            })}
          </div>
        )}
      </nav>

      {/* Footer Actions */}
      <div className="shrink-0 p-4 relative z-10 border-t border-[#f3e8f8]">
        {/* Upgrade Button */}
        <Link
          href="/for-organizations#plans"
          className={`
            group mb-2 flex w-full items-center text-[14px] font-medium transition-colors
            ${sidebarCollapsed ? 'justify-center h-[50px]' : 'h-[52px] gap-3 px-4 rounded-[26px] text-[#8f55a6] hover:bg-[#f5e7fb] bg-white border border-[#E889FF]/30 shadow-sm'}
          `}
          title={sidebarCollapsed ? 'Upgrade organization' : undefined}
        >
          {sidebarCollapsed ? (
             <SparklesIcon className="h-[22px] w-[22px] text-[#E889FF] group-hover:text-[#B36AC5]" />
          ) : (
            <>
              <div className="flex h-7 w-7 items-center justify-center rounded-[6px] text-[#E889FF]">
                <SparklesIcon className="h-5 w-5" />
              </div>
              <span className="truncate font-semibold bg-clip-text text-transparent bg-[radial-gradient(ellipse_at_center,_#B36AC5_0%,_#E889FF_100%)]">{t('Upgrade plan')}</span>
            </>
          )}
        </Link>

        {/* Log Out Button */}
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className={`
            group flex w-full items-center text-[14px] font-medium transition-colors
            ${sidebarCollapsed ? 'justify-center h-[50px]' : 'h-[52px] gap-3 px-4 rounded-[26px] text-[#6d6d6d] hover:bg-[#f7f1fb]'}
          `}
          title={sidebarCollapsed ? 'Log Out' : undefined}
        >
          {sidebarCollapsed ? (
             <ArrowLeftOnRectangleIcon className="h-[22px] w-[22px] text-[#9b6fb5] group-hover:text-[#8f55a6]" />
          ) : (
            <>
              <div className="flex h-7 w-7 items-center justify-center rounded-[6px] text-[#9b6fb5]">
                <ArrowLeftOnRectangleIcon className="h-4 w-4" />
              </div>
              <span>{t('Log Out')}</span>
            </>
          )}
        </button>
      </div>
    </aside>
  )
}
