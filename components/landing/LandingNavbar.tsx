'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

const navLinks = [
  { name: 'Home', href: '/', hash: '#home' },
  { name: 'How to', href: '/', hash: '#how-to' },
  { name: 'FAQ', href: '/', hash: '#faq' },
  { name: 'Pricing', href: '/', hash: '#pricing' },
  { name: 'Contact', href: '/', hash: '#contact' },
]

/**
 * Purpose: Executes Navbar functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: April 2026
 */
export default function Navbar() {
  const [activeLink, setActiveLink] = useState('Home')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  // Handle navigation - works from any page
  /**
   * Purpose: Executes handleNavClick functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: April 2026
   */
  const handleNavClick = (
    e: React.MouseEvent,
    link: { name: string; href: string; hash: string }
  ) => {
    e.preventDefault()
    setActiveLink(link.name)
    setIsMobileMenuOpen(false)

    const hash = link.hash

    // If we're on the home page, just scroll
    if (pathname === '/') {
      const targetElement = document.querySelector(hash)
      if (targetElement) {
        const headerOffset = 100
        const elementPosition =
          (targetElement as HTMLElement).getBoundingClientRect().top + window.scrollY
        const offsetPosition = elementPosition - headerOffset
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        })
      }
    } else {
      // Navigate to home page with hash
      router.push('/' + hash)
    }
  }

  // Update active link based on scroll position (only on home page)
  useEffect(() => {
    if (pathname !== '/') return

    /**
     * Purpose: Executes handleScroll functionality.
     * Owner/Author: Syed Ashhad
     * Created/Updated: April 2026
     */
    const handleScroll = () => {
      const sections = navLinks.map(link => ({
        name: link.name,
        element: document.querySelector(link.hash),
      }))

      const scrollPosition = window.scrollY + 150

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i]
        if (
          section?.element &&
          (section.element as HTMLElement).getBoundingClientRect().top + window.scrollY <=
            scrollPosition
        ) {
          setActiveLink(section.name)
          break
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [pathname])

  // Handle hash scroll after navigation
  useEffect(() => {
    if (pathname === '/' && window.location.hash) {
      const hash = window.location.hash
      setTimeout(() => {
        const targetElement = document.querySelector(hash)
        if (targetElement) {
          const headerOffset = 100
          const elementPosition =
            (targetElement as HTMLElement).getBoundingClientRect().top + window.scrollY
          const offsetPosition = elementPosition - headerOffset
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth',
          })
        }
      }, 100)
    }
  }, [pathname])

  return (
    <div className="sticky top-4 z-50 px-4">
      <header className="max-w-7xl mx-auto rounded-2xl bg-white/60 backdrop-blur-md border border-purple-200 shadow-lg">
        <div className="px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/">
                <Image
                  src="/img/logo.png"
                  alt="Main QR Code"
                  width={140}
                  height={140}
                  priority
                  className="object-contain cursor-pointer"
                />
              </Link>
            </div>

            {/* Nav Links - Desktop */}
            <div className="hidden md:flex items-end space-x-10">
              {navLinks.map(link => (
                <a
                  key={link.name}
                  href={link.hash}
                  onClick={e => handleNavClick(e, link)}
                  className={`relative text-base font-medium transition-colors duration-200 pb-2 cursor-pointer
                  ${
                    activeLink === link.name
                      ? 'text-purple-600'
                      : 'text-gray-500 hover:text-purple-600'
                  }
                `}
                >
                  {link.name}
                  {activeLink === link.name && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-600 transition-all duration-300"></span>
                  )}
                </a>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-500 hover:text-purple-600 transition-colors p-2"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMobileMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>

            {/* Login Button - Desktop Only */}
            <div className="hidden md:flex items-center gap-3">
              <Link
                href="/qrcodes/new"
                className="flex items-center rounded-full px-7 py-3 text-white font-medium text-base transition-all duration-200 hover:opacity-90 hover:shadow-lg"
                style={{
                  background:
                    'radial-gradient(ellipse at 50% 30%, #a49de0 0%, #7c72cc 50%, #6358b8 100%)',
                  boxShadow: '0 4px 15px rgba(107, 88, 200, 0.35)',
                }}
              >
                Continue Free
              </Link>
              <Link
                href="/login"
                className="flex items-center bg-white rounded-full shadow-md px-6 py-3 space-x-3 border border-gray-200 hover:shadow-lg transition-shadow"
              >
                <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center bg-gray-100">
                  <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="text-gray-800 font-semibold text-base">Login</span>
              </Link>
            </div>
          </nav>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-2 bg-white/90 backdrop-blur-md border border-purple-200 rounded-2xl shadow-lg overflow-hidden">
            <div className="px-4 py-2 space-y-1">
              {navLinks.map(link => (
                <a
                  key={link.name}
                  href={link.hash}
                  onClick={e => handleNavClick(e, link)}
                  className={`block px-4 py-3 text-base font-medium transition-colors duration-200 rounded-lg cursor-pointer
                  ${
                    activeLink === link.name
                      ? 'text-purple-600 bg-purple-50'
                      : 'text-gray-500 hover:text-purple-600 hover:bg-purple-50'
                  }
                `}
                >
                  {link.name}
                </a>
              ))}

              {/* Mobile Continue Free Button */}
              <Link
                href="/qrcodes/new"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full flex items-center justify-center rounded-full px-4 py-3 text-white font-medium text-base transition-all duration-200 hover:opacity-90 mt-2"
                style={{
                  background:
                    'radial-gradient(ellipse at 50% 30%, #a49de0 0%, #7c72cc 50%, #6358b8 100%)',
                  boxShadow: '0 4px 15px rgba(107, 88, 200, 0.35)',
                }}
              >
                Continue Free
              </Link>

              {/* Mobile Login Button */}
              <Link
                href="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full flex items-center justify-center bg-purple-600 hover:bg-purple-700 text-white rounded-lg px-4 py-3 space-x-2 transition-colors duration-200 mt-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-semibold text-base">Login</span>
              </Link>
            </div>
          </div>
        )}
      </header>
    </div>
  )
}
