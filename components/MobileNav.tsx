'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { X } from 'lucide-react'

const MAIN_ITEMS = [
  { href: '/dashboard',  icon: '📊', label: 'Início' },
  { href: '/os',         icon: '📝', label: 'OS' },
  { href: '/frota',      icon: '🏗️', label: 'Frota' },
  { href: '/financeiro', icon: '🏦', label: 'Financeiro' },
]

const ALL_ITEMS = [
  { group: 'Principal', items: [
    { href: '/dashboard',   icon: '📊', label: 'Dashboard' },
    { href: '/cotacoes',    icon: '📋', label: 'Cotações' },
    { href: '/bi',          icon: '🧠', label: 'Inteligência' },
  ]},
  { group: 'Operação', items: [
    { href: '/frota',          icon: '🏗️', label: 'Frota' },
    { href: '/agenda',         icon: '📅', label: 'Agenda' },
    { href: '/os',             icon: '📝', label: 'OS' },
    { href: '/contratos',      icon: '📃', label: 'Contratos' },
    { href: '/manutencao',     icon: '🔧', label: 'Manutenção' },
    { href: '/abastecimentos', icon: '⛽', label: 'Abastecimentos' },
  ]},
  { group: 'Financeiro', items: [
    { href: '/faturas',     icon: '💰', label: 'Faturas' },
    { href: '/financeiro',  icon: '🏦', label: 'Cobranças' },
    { href: '/fiscal',      icon: '🧾', label: 'Fiscal' },
    { href: '/impostos',    icon: '📑', label: 'Impostos' },
  ]},
  { group: 'Gestão', items: [
    { href: '/configuracoes', icon: '⚙️', label: 'Config.' },
  ]},
]

export function MobileNav() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      {/* Drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <div
            className="absolute inset-0 bg-black/70"
            onClick={() => setMenuOpen(false)}
          />
          <div
            className="relative z-10 rounded-t-2xl overflow-y-auto"
            style={{
              background: 'var(--bg-2)',
              borderTop: '1px solid var(--border)',
              padding: '20px 16px 40px',
              maxHeight: '85vh',
            }}
          >
            {/* Header do drawer */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text)' }}>
                GrúaOS
              </span>
              <button
                onClick={() => setMenuOpen(false)}
                style={{
                  background: 'var(--bg-3)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  padding: '6px',
                  color: 'var(--text-2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Grupos */}
            {ALL_ITEMS.map((group) => (
              <div key={group.group} style={{ marginBottom: '16px' }}>
                <p style={{
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: 'var(--text-3)',
                  marginBottom: '8px',
                  paddingLeft: '4px',
                }}>
                  {group.group}
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                  {group.items.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMenuOpen(false)}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '12px 4px',
                          borderRadius: '12px',
                          border: `1px solid ${isActive ? 'rgba(249,115,22,0.4)' : 'var(--border)'}`,
                          background: isActive ? 'rgba(249,115,22,0.1)' : 'var(--bg-3)',
                          textDecoration: 'none',
                        }}
                      >
                        <span style={{ fontSize: '1.4rem' }}>{item.icon}</span>
                        <span style={{
                          fontSize: '0.65rem',
                          fontWeight: 600,
                          color: isActive ? 'var(--brand)' : 'var(--text-2)',
                          textAlign: 'center',
                          lineHeight: 1.2,
                        }}>
                          {item.label}
                        </span>
                      </Link>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Barra inferior */}
      <nav className="mobile-nav">
        {MAIN_ITEMS.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
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

        <button
          onClick={() => setMenuOpen(true)}
          className="mobile-nav-item"
        >
          <span className="mobile-nav-icon">☰</span>
          Mais
        </button>
      </nav>
    </>
  )
}
