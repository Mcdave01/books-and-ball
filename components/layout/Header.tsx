'use client'

// Header layout: renders brand navigation, active links, and login.

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { siteConfig } from '@/config/site'

export function Header() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => { setMenuOpen(false) }, [pathname])

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
                <h1 className="text-base font-black leading-tight text-gray-950 sm:text-xl">{siteConfig.name}</h1>
                <p className="text-xs font-semibold text-orange-600 sm:text-sm">Basketball Academy</p>
              </div>
            </Link>

            {/* Desktop nav */}
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

            {/* Right side: Login + hamburger */}
            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                href="/login"
                className="rounded-lg bg-gradient-to-r from-orange-500 to-red-500 px-4 py-2 text-sm font-bold text-white shadow-md transition-all duration-300 hover:scale-105 hover:from-orange-600 hover:to-red-600 sm:px-5"
              >
                Login
              </Link>

              {/* Hamburger — mobile only */}
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

      {/* Mobile menu */}
      {menuOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm md:hidden"
            onClick={() => setMenuOpen(false)}
            aria-hidden="true"
          />
          <div className="fixed left-0 right-0 top-16 z-50 border-b border-orange-100 bg-white shadow-xl md:hidden sm:top-20">
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
