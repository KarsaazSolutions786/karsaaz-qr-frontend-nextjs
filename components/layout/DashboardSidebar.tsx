'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { useTranslation } from '@/lib/i18n'
import type { NavItem, FigmaNavItem, FigmaNavSection } from '@/lib/config/nav-config'
import { ChevronRightIcon, ArrowRightOnRectangleIcon } from '@/lib/config/nav-config'

interface DashboardSidebarProps {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  sidebarCollapsed: boolean
  setSidebarCollapsed: React.Dispatch<React.SetStateAction<boolean>>
  expandedSections: Record<string, boolean>
  toggleSection: (sectionKey: string) => void
  effectivePrimaryNav: FigmaNavItem[]
  allSectionNav: FigmaNavSection[]
  collapsedNavItems: NavItem[]
  isItemActive: (href: string) => boolean
  isLoggingOut: boolean
  handleLogout: () => void
}

export function DashboardSidebar({
  sidebarOpen,
  setSidebarOpen,
  sidebarCollapsed,
  setSidebarCollapsed,
  expandedSections,
  toggleSection,
  effectivePrimaryNav,
  allSectionNav,
  collapsedNavItems,
  isItemActive,
  isLoggingOut,
  handleLogout,
}: DashboardSidebarProps) {
  const { t } = useTranslation()

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

      <div className="relative shrink-0" style={{ height: sidebarCollapsed ? '120px' : '154px' }}>
        <Link
          href="/qrcodes/new"
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

        <button
          type="button"
          onClick={() => setSidebarCollapsed(prev => !prev)}
          className={`hidden lg:flex absolute items-center justify-center transition-colors ${
            sidebarCollapsed
              ? 'left-1/2 -translate-x-1/2 top-[88px] h-[30px] w-[26px] rounded-[5px]'
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

        <button
          type="button"
          className="lg:hidden absolute right-5 top-[77px] text-[#6d6d6d] hover:text-[#1b1b1b]"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close sidebar"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
      </div>

      <nav aria-label="Main navigation" className="relative z-10 flex-1 overflow-y-auto px-2 pb-4">
        {sidebarCollapsed ? (
          <div className="flex flex-col items-center gap-[20px] pt-0">
            {collapsedNavItems.map(item => {
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
            {effectivePrimaryNav.map(item => {
              const active = isItemActive(item.href)
              return (
                <Link
                  key={item.key}
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
                  <span className="truncate">{t(item.label)}</span>
                </Link>
              )
            })}

            {allSectionNav.map(item => {
              const sectionActive = item.items.some(sectionItem => isItemActive(sectionItem.href))
              const expanded = expandedSections[item.key] || false
              return (
                <div key={item.key}>
                  <button
                    type="button"
                    onClick={() => toggleSection(item.key)}
                    className={`
                    w-full flex h-[52px] items-center gap-3 rounded-[26px] px-4 text-[14px] font-medium transition-colors
                    ${sectionActive ? 'bg-[#f5e7fb] text-[#1b1b1b]' : 'text-[#6d6d6d] hover:bg-[#f7f1fb]'}
                  `}
                  >
                    <item.icon
                      className={`h-5 w-5 ${sectionActive ? 'text-[#8f55a6]' : 'text-[#9b6fb5]'}`}
                    />
                    <span className="flex-1 truncate text-left">{t(item.label)}</span>
                    <ChevronRightIcon
                      className={`h-3.5 w-3.5 transition-transform ${expanded ? 'rotate-90' : ''}`}
                    />
                  </button>

                  {expanded && (
                    <div className="ml-6 mt-1 space-y-1 border-l border-[#d9d9d9] pl-3">
                      {item.items.map(sectionItem => {
                        const childActive = isItemActive(sectionItem.href)
                        return (
                          <Link
                            key={sectionItem.href}
                            href={sectionItem.href}
                            onClick={() => setSidebarOpen(false)}
                            className={`
                              block rounded-[10px] px-3 py-2 text-[11px] transition-colors
                              ${childActive ? 'bg-[#f5e7fb] text-[#1b1b1b] font-medium' : 'text-[#6d6d6d] hover:bg-[#f7f1fb]'}
                            `}
                          >
                            {t(sectionItem.name)}
                          </Link>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </nav>

      <div
        className={`relative z-10 ${sidebarCollapsed ? 'px-3 pb-3 flex items-center justify-center gap-2' : 'px-5 pb-3 flex items-center justify-between gap-1'}`}
      >
        {sidebarCollapsed ? (
          <>
            <div className="flex h-[35px] w-[31px] items-center justify-center rounded-[4px] border border-[#1b1b1b0a] bg-white">
              <Image src="/sidebar-assets/apple.svg" alt="App Store" width={16} height={16} />
            </div>
            <div className="flex h-[35px] w-[35px] items-center justify-center rounded-[4px] border border-[#1b1b1b0a] bg-white">
              <Image
                src="/sidebar-assets/google-play.svg"
                alt="Google Play"
                width={16}
                height={16}
              />
            </div>
          </>
        ) : (
          <>
            <div className="flex h-[35px] w-[109px] items-center gap-2 rounded-[4px] border border-[#1b1b1b0a] bg-white px-2">
              <Image src="/sidebar-assets/apple.svg" alt="App Store" width={16} height={16} />
              <div className="leading-none text-black">
                <p className="text-[7px] font-normal">{t('Download on the')}</p>
                <p className="text-[10px] font-medium">{t('App Store')}</p>
              </div>
            </div>
            <div className="flex h-[35px] w-[109px] items-center gap-2 rounded-[4px] border border-[#1b1b1b0a] bg-white px-2">
              <Image
                src="/sidebar-assets/google-play.svg"
                alt="Google Play"
                width={16}
                height={16}
              />
              <div className="leading-none text-black">
                <p className="text-[7px] font-normal uppercase">{t('Get it on')}</p>
                <p className="text-[10px] font-medium">{t('Google Play')}</p>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="relative z-10 px-3 pb-4">
        <button
          type="button"
          onClick={handleLogout}
          disabled={isLoggingOut}
          className={`
            flex h-[50px] w-full items-center rounded-[12px] border border-[#bd6bff52]
            backdrop-blur-[1.6px] bg-white text-[#6d6d6d]
            transition-colors hover:bg-[#f7f1fb] disabled:opacity-60
            ${sidebarCollapsed ? 'justify-center px-0' : 'justify-start gap-3 px-4'}
          `}
        >
          <ArrowRightOnRectangleIcon className="h-5 w-5 text-[#e04f6b]" />
          {!sidebarCollapsed && (
            <span className="text-[16px] font-medium">
              {isLoggingOut ? t('Logging out...') : t('Logout')}
            </span>
          )}
        </button>
      </div>
    </aside>
  )
}
