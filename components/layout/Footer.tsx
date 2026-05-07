// Footer layout: renders brand links, programs, social links, and copyright.
import Link from 'next/link'
import { Goal } from 'lucide-react'
import { IconBadge } from '@/components/common/IconBadge'
import { siteConfig } from '@/config/site'

export function Footer() {
  // Keeps the footer current without manually editing the year.
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gradient-to-r from-blue-950 via-indigo-950 to-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          {/* Brand summary and social links. */}
          <div className="md:col-span-2">
            <div className="mb-4 flex items-center gap-3">
              <IconBadge>
                <Goal className="h-6 w-6" aria-hidden="true" />
              </IconBadge>
              <div>
                <h3 className="text-lg font-black">{siteConfig.name}</h3>
                <p className="text-sm font-semibold text-orange-300">Basketball Academy</p>
              </div>
            </div>
            <p className="mb-5 max-w-xl leading-relaxed text-blue-100">
              {siteConfig.description} Join our elite training programs and become part of the winning tradition.
            </p>
            <div className="flex gap-4">
              {siteConfig.socials.map((social) => {
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-200 transition-colors hover:text-orange-300"
                  >
                    <span className="sr-only">{social.name}</span>
                    <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/10 text-sm font-black">
                      {social.name[0]}
                    </span>
                  </a>
                )
              })}
            </div>
          </div>

          {/* Internal site navigation. */}
          <div>
            <h4 className="mb-4 text-lg font-bold text-orange-300">Quick Links</h4>
            <ul className="space-y-2">
              {siteConfig.navigation.slice(1).map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-blue-100 transition-colors hover:text-orange-300">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Program list shown as quick informational links. */}
          <div>
            <h4 className="mb-4 text-lg font-bold text-orange-300">Programs</h4>
            <ul className="space-y-2">
              {siteConfig.programs.map((program) => (
                <li key={program}>
                  <span className="text-blue-100">{program}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright line uses the generated current year. */}
        <div className="mt-8 border-t border-blue-800 pt-8 text-center">
          <p className="text-sm text-blue-200">
            &copy; {currentYear} {siteConfig.fullName}. All rights reserved. | Building Champions Since 2010
          </p>
        </div>
      </div>
    </footer>
  )
}
