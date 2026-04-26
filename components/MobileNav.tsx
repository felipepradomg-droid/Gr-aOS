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
  { href: '/dashboard',   icon: '📊', label: 'Dashboard' },
  { href: '/cotacoes',    icon: '📋', label: 'Cotações' },
  { href: '/os',          icon: '📝', label: 'Ordens de Serviço' },
  { href: '/frota',       icon: '🏗️', label: 'Frota' },
  { href: '/agenda',      icon: '📅', label: 'Agenda' },
  { href: '/contratos',   icon: '📃', label: 'Contratos' },
  { href: '/manutencao',  icon: '🔧', label: 'Manutenção' },
  { href: '/faturas',     icon: '💰', label: 'Faturas' },
  { href: '/financeiro',  icon: '🏦', label: 'Cobranças e PIX' },
  { href: '/fiscal',      icon: '🧾', label: 'Notas Fiscais' },
  { href: '/clientes',    icon: '👥', label: 'Clientes' },
  { href: '/relatorios',  icon: '📈', label: 'Relatórios' },
  { href: '/configuracoes', icon: '⚙️', label: 'Configurações' },
]

export function MobileNav() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      {/* Menu completo — drawer de baixo para cima */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setMenuOpen(false)}
          />

          {/* Drawer */}
          <div className="relative bg-[#111] border-t border-[#2A2A2A] rounded-t-2xl p-5 pb-10 z-10">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-bold text-white">Menu</p>
              <button
                onClick={() => setMenuOpen(false)}
                className="p-1.5 rounded-lg bg-[#1A1A1A] text-gray-400"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {ALL_ITEMS.map((item) => {
                const isActive = pathname === item.href ||
                  pathname.startsWith(item.href + '/')
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-colors ${
                      isActive
                        ? 'bg-orange-500/10 border-orange-500/30 text-orange-500'
                        : 'bg-[#1A1A1A] border-[#2A2A2A] text-gray-400'
                    }`}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span className="text-xs font-medium text-center leading-tight">
                      {item.label}
                    </span>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Barra inferior */}
      <nav className="mobile-nav">
        {MAIN_ITEMS.map((item) => {
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

        {/* Botão Mais */}
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
