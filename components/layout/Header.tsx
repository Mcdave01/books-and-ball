'use client'

// Header layout: renders brand navigation, active links, WhatsApp CTA, and login.

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MessageCircle } from 'lucide-react'
import { siteConfig } from '@/config/site'
import { WhatsAppButton } from '@/components/ui/WhatsAppButton'

export function Header() {
  const pathname = usePathname()
  const whatsappUrl = `https://wa.me/${siteConfig.contact.phone}?text=${encodeURIComponent(siteConfig.contact.message)}`

  return (
    <header className="sticky top-0 z-50 border-b border-orange-200/70 bg-white/95 shadow-sm backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Brand mark links visitors back to the homepage. */}
          <Link href="/" className="flex items-center gap-3">
            <Image
              src={siteConfig.logo}
              alt={`${siteConfig.fullName} Logo`}
              width={52}
              height={52}
              className="rounded-full border-2 border-orange-300"
            />
            <div>
              <h1 className="text-xl font-black leading-tight text-gray-950">{siteConfig.name}</h1>
              <p className="text-sm font-semibold text-orange-600">Basketball Academy</p>
            </div>
          </Link>

          {/* Desktop navigation highlights the active route. */}
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

          {/* Contact and login actions stay visible without crowding mobile. */}
          <div className="flex items-center gap-3">
            <WhatsAppButton
              phoneNumber={siteConfig.contact.phone}
              message={siteConfig.contact.message}
              className="hidden sm:flex"
            />
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-600 text-white transition hover:bg-green-700 sm:hidden"
              title="Contact via WhatsApp"
            >
              <MessageCircle className="h-5 w-5" aria-hidden="true" />
            </a>
            <Link
              href="/login"
              className="rounded-lg bg-gradient-to-r from-orange-500 to-red-500 px-5 py-2 font-bold text-white shadow-md transition-all duration-300 hover:scale-105 hover:from-orange-600 hover:to-red-600"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
