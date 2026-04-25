'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const ITEMS = [
  { href: '/dashboard',   icon: '📊', label: 'Início' },
  { href: '/os',          icon: '📝', label: 'OS' },
  { href: '/frota',       icon: '🏗️', label: 'Frota' },
  { href: '/financeiro',  icon: '🏦', label: 'Financeiro' },
  { href: '/fiscal',      icon: '🧾', label: 'Fiscal' },
]

export function MobileNav() {
  const pathname = usePathname()

  return (
    <nav className="mobile-nav">
      {ITEMS.map((item) => {
        const isActive = pathname === item.href ||
          pathname.startsWith(item.href + '/')
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`mobile-nav-item ${isActive ? 'active' : ''}`}
          >
            <span className="mobile-nav-icon">{item.icon}</span>
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
