'use client'

// Header layout: renders brand navigation, active links, WhatsApp CTA, and login.

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MessageCircle, Menu, X } from 'lucide-react'
import { siteConfig } from '@/config/site'
import { WhatsAppButton } from '@/components/ui/WhatsAppButton'

export function Header() {
  const pathname = usePathname()
  const whatsappUrl = `https://wa.me/${siteConfig.contact.phone}?text=${encodeURIComponent(siteConfig.contact.message)}`

  // ── FIX 1: Track mobile menu open/closed state ──
  const [menuOpen, setMenuOpen] = useState(false)

  // ── FIX 2: Close menu on route change (user tapped a link) ──
  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  // ── FIX 3: Prevent body scroll while mobile menu is open ──
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-orange-200/70 bg-white/95 shadow-sm backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between sm:h-20">

            {/* Brand */}
            <Link href="/" className="flex items-center gap-2.5 sm:gap-3" onClick={() => setMenuOpen(false)}>
              <Image
                src={siteConfig.logo}
                alt={`${siteConfig.fullName} Logo`}
                width={44}
                height={44}
                className="rounded-full border-2 border-orange-300 sm:h-[52px] sm:w-[52px]"
              />
              <div>
                {/* ── FIX 4: Slightly smaller brand text on mobile so it doesn't crowd the right-side buttons ── */}
                <h1 className="text-base font-black leading-tight text-gray-950 sm:text-sm">{siteConfig.name}</h1>
                <p className="text-xs font-semibold text-orange-600 sm:text-sm">Basketball Academy</p>
              </div>
            </Link>

            {/* Desktop nav — unchanged, still hidden below md */}
            <nav className="hidden items-center gap-7 md:flex">
              {siteConfig.navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-sm font-bold transition-colors duration-200 ${
                    pathname === item.href
                      ? 'text-orange-600'
                      : 'text-gray-700 hover:text-orange-600'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Right-side actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* WhatsApp — full button on sm+, icon-only on xs */}
              <WhatsAppButton
                phoneNumber={siteConfig.contact.phone}
                message={siteConfig.contact.message}
                className="hidden sm:flex"
              />
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-600 text-white transition hover:bg-green-700 sm:hidden"
                title="Contact via WhatsApp"
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
              </a>

              {/* Login — hidden on mobile to save space; accessible from the mobile menu */}
              <Link
                href="/login"
                className="hidden rounded-lg bg-gradient-to-r from-orange-500 to-red-500 px-5 py-2 font-bold text-white shadow-md transition-all duration-300 hover:scale-105 hover:from-orange-600 hover:to-red-600 sm:inline-flex"
              >
                Login
              </Link>

              {/* ── FIX 5: Hamburger button — only visible below md ── */}
              <button
                onClick={() => setMenuOpen((prev) => !prev)}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-700 transition hover:bg-gray-100 md:hidden"
                aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={menuOpen}
              >
                {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── FIX 6: Mobile slide-down menu — renders below header, above all other content ──
            Only visible on mobile (md:hidden). Contains all nav links + Login.
            Backdrop overlay closes the menu when tapped outside. ── */}
      {menuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm md:hidden"
            onClick={() => setMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer */}
          <div className="fixed left-0 right-0 top-16 z-40 border-b border-orange-100 bg-white shadow-xl md:hidden">
            <nav className="mx-auto max-w-7xl px-4 py-4">
              <ul className="flex flex-col gap-1">
                {siteConfig.navigation.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      className={`flex w-full items-center rounded-xl px-4 py-3.5 text-sm font-bold transition-colors ${
                        pathname === item.href
                          ? 'bg-orange-50 text-orange-600'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-orange-600'
                      }`}
                    >
                      {item.name}
                      {pathname === item.href && (
                        <span className="ml-auto h-2 w-2 rounded-full bg-orange-500" />
                      )}
                    </Link>
                  </li>
                ))}

                {/* Login inside mobile menu */}
                <li className="mt-3 border-t border-gray-100 pt-3">
                  <Link
                    href="/login"
                    onClick={() => setMenuOpen(false)}
                    className="flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-orange-500 to-red-500 px-4 py-3.5 text-sm font-bold text-white shadow-sm transition hover:from-orange-600 hover:to-red-600"
                  >
                    Login
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </>
      )}
    </>
  )
}
