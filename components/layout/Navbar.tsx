kj'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Menu, X, LayoutDashboard, LogOut } from 'lucide-react'
import clsx from 'clsx'
import { createClient } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'
import toast from 'react-hot-toast'

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Programs', href: '/#programs' },
  { label: 'Events', href: '/events' },
  { label: 'Gallery', href: '/#gallery' },
  { label: 'About', href: '/#about' },
  { label: 'Contact', href: '/#contact' },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  // Check auth state on mount and listen for changes
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
    toast.success('Signed out')
    router.push('/')
    setIsOpen(false)
  }

  return (
    <nav
      className={clsx(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-court-dark/95 backdrop-blur-sm border-b border-court-border'
          : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-10 h-10 bg-flame flex items-center justify-center">
                <span className="text-white font-display font-bold text-lg">B</span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gold flex items-center justify-center">
                <span className="text-court-dark font-display font-bold text-[8px]">B</span>
              </div>
            </div>
            <div className="hidden sm:block">
              <p className="font-display font-bold text-chalk text-lg leading-none tracking-wide">
                BOOKS <span className="text-flame">&</span> BALL
              </p>
              <p className="text-chalk-dim text-[10px] tracking-[0.25em] uppercase font-body">
                Academy
              </p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={clsx(
                  'font-body text-sm tracking-wide animated-underline transition-colors',
                  pathname === link.href ? 'text-flame' : 'text-chalk-muted hover:text-chalk'
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="btn-ghost text-xs flex items-center gap-1.5"
                >
                  <LayoutDashboard size={14} />
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-4 py-2 border border-court-border text-chalk-muted hover:text-red-400 hover:border-red-400/40 text-xs font-body transition-colors"
                >
                  <LogOut size={13} />
                  Sign Out
                </button>
              </>
            ) : (
              <Link href="/login" className="btn-ghost text-xs">
                Admin
              </Link>
            )}
            <Link href="/#contact" className="btn-primary text-xs px-5 py-2.5">
              Join Now
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-chalk-muted hover:text-chalk"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={clsx(
          'md:hidden transition-all duration-300 overflow-hidden bg-court-dark border-b border-court-border',
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <div className="px-4 py-4 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={clsx(
                'block py-3 px-4 font-body text-sm border-b border-court-border/50 transition-colors',
                pathname === link.href ? 'text-flame' : 'text-chalk-muted hover:text-chalk'
              )}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-4 pb-2 flex gap-3">
              {user ? (
                <>
                  <Link
                    href="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="btn-outline flex-1 justify-center text-xs py-2 flex items-center gap-1.5"
                  >
                    <LayoutDashboard size={13} /> Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex-1 flex items-center justify-center gap-1.5 border border-red-400/30 text-red-400 text-xs font-body py-2 hover:bg-red-400/10 transition-colors"
                  >
                    <LogOut size={13} /> Sign Out
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="btn-outline flex-1 justify-center text-xs py-2"
                >
                  Admin Login
                </Link>
              )}
              <Link href="/#contact" onClick={() => setIsOpen(false)} className="btn-primary flex-1 justify-center text-xs py-2">
                Join Now
              </Link>
            </div>
        </div>
      </div>
    </nav>
  )
}
