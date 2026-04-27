'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'

export default function TrialBanner() {
  const { data: session } = useSession()

  if (!session?.user) return null

  // Se tem plano pago, não mostra o banner
  const isPago = session.user.plan && session.user.plan !== 'free'
  if (isPago) return null

  return (
    <div style={{
      background: '#eff6ff',
      border: '1px solid #bfdbfe',
      borderRadius: '10px',
      padding: '12px 16px',
      marginBottom: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '12px',
      flexWrap: 'wrap',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '1.1rem' }}>🎁</span>
        <span style={{
          fontSize: '0.875rem',
          fontWeight: 600,
          color: '#1e40af',
        }}>
          Experimente o Pro por 7 dias grátis — cartão obrigatório, sem cobrança agora
        </span>
      </div>
      <Link
        href="/planos"
        style={{
          background: '#f97316',
          color: 'white',
          padding: '6px 16px',
          borderRadius: '8px',
          textDecoration: 'none',
          fontSize: '0.8rem',
          fontWeight: 700,
          whiteSpace: 'nowrap',
          flexShrink: 0,
        }}
      >
        Ver planos →
      </Link>
    </div>
  )
}
