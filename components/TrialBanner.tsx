'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'

export default function TrialBanner() {
  const { data: session } = useSession()

  if (!session?.user) return null

  // Se tem plano pago, não mostra o banner
  const isPago = session.user.plan && session.user.plan !== 'free'
  if (isPago) return null

  // Calcular dias restantes
  const trialEndsAt = session.user.trialEndsAt
    ? new Date(session.user.trialEndsAt)
    : null

  if (!trialEndsAt) return null

  const now = new Date()
  const diffMs = trialEndsAt.getTime() - now.getTime()
  const diasRestantes = Math.ceil(diffMs / (1000 * 60 * 60 * 24))

  // Se trial expirou, não mostra (middleware já redireciona)
  if (diasRestantes <= 0) return null

  const isUrgente = diasRestantes <= 2
  const isAviso = diasRestantes <= 5

  return (
    <div style={{
      background: isUrgente ? '#fef2f2' : isAviso ? '#fffbeb' : '#eff6ff',
      border: `1px solid ${isUrgente ? '#fecaca' : isAviso ? '#fde68a' : '#bfdbfe'}`,
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
        <span style={{ fontSize: '1.1rem' }}>
          {isUrgente ? '🚨' : isAviso ? '⚠️' : '⏳'}
        </span>
        <span style={{
          fontSize: '0.875rem',
          fontWeight: 600,
          color: isUrgente ? '#dc2626' : isAviso ? '#92400e' : '#1e40af',
        }}>
          {diasRestantes === 1
            ? 'Último dia do seu período de teste!'
            : `Você tem ${diasRestantes} dias restantes no seu teste grátis`}
        </span>
      </div>
      <Link
        href="/checkout?plan=pro"
        style={{
          background: isUrgente ? '#dc2626' : isAviso ? '#f97316' : '#2563eb',
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
        Assinar agora
      </Link>
    </div>
  )
}
