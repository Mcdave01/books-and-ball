// Icon badge: reusable gradient tile for dashboard cards and marketing sections.
import type { ReactNode } from 'react'

type IconBadgeProps = {
  children: ReactNode
  className?: string
  iconClassName?: string
}

export function IconBadge({
  children,
  className = 'from-orange-400 to-red-500',
  iconClassName = 'text-white',
}: IconBadgeProps) {
  return (
    <div className={`flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br ${className}`}>
      <span className={iconClassName}>{children}</span>
    </div>
  )
}
