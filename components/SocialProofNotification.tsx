'use client'

import { useState, useEffect } from 'react'

const NOTIFICATIONS = [
  { name: 'Locadora Paulista', city: 'São Paulo - SP', action: 'acabou de assinar o plano Pro' },
  { name: 'Guindastes Norte', city: 'Manaus - AM', action: 'iniciou o teste grátis' },
  { name: 'JB Locações', city: 'Belo Horizonte - MG', action: 'acabou de assinar o plano Starter' },
  { name: 'Içamento Total', city: 'Curitiba - PR', action: 'cadastrou 5 guindastes na frota' },
  { name: 'Grua Sul', city: 'Porto Alegre - RS', action: 'acabou de assinar o plano Pro' },
  { name: 'Locadora Central', city: 'Goiânia - GO', action: 'iniciou o teste grátis' },
  { name: 'MG Guindastes', city: 'Uberlândia - MG', action: 'acabou de assinar o plano Business' },
  { name: 'Top Içamento', city: 'Salvador - BA', action: 'iniciou o teste grátis' },
  { name: 'Grua Norte', city: 'Belém - PA', action: 'acabou de assinar o plano Pro' },
  { name: 'RS Locações', city: 'Caxias do Sul - RS', action: 'cadastrou 3 guindastes na frota' },
  { name: 'Capital Guindastes', city: 'Brasília - DF', action: 'acabou de assinar o plano Starter' },
  { name: 'Içamento Express', city: 'Recife - PE', action: 'iniciou o teste grátis' },
  { name: 'Locações Silva', city: 'Campinas - SP', action: 'acabou de assinar o plano Pro' },
  { name: 'Guindaste Forte', city: 'Fortaleza - CE', action: 'iniciou o teste grátis' },
  { name: 'SP Içamentos', city: 'Santos - SP', action: 'acabou de assinar o plano Business' },
]

function getRandomTime() {
  const options = [
    'agora mesmo',
    'há 1 minuto',
    'há 2 minutos',
    'há 3 minutos',
    'há 5 minutos',
    'há 8 minutos',
    'há 12 minutos',
  ]
  return options[Math.floor(Math.random() * options.length)]
}

export default function SocialProofNotification() {
  const [visible, setVisible] = useState(false)
  const [current, setCurrent] = useState(0)
  const [timeText, setTimeText] = useState('agora mesmo')

  useEffect(() => {
    // Primeira notificação aparece após 3 segundos
    const firstTimer = setTimeout(() => {
      setTimeText(getRandomTime())
      setVisible(true)

      // Some após 5 segundos
      setTimeout(() => setVisible(false), 5000)
    }, 3000)

    return () => clearTimeout(firstTimer)
  }, [])

  useEffect(() => {
    if (!visible) {
      // Próxima notificação aparece entre 15 e 25 segundos depois
      const delay = Math.floor(Math.random() * 10000) + 15000

      const timer = setTimeout(() => {
        setCurrent((prev) => (prev + 1) % NOTIFICATIONS.length)
        setTimeText(getRandomTime())
        setVisible(true)

        // Some após 5 segundos
        setTimeout(() => setVisible(false), 5000)
      }, delay)

      return () => clearTimeout(timer)
    }
  }, [visible])

  const notification = NOTIFICATIONS[current]

  if (!visible) return null

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'calc(100% - 48px)',
        maxWidth: '400px',
        background: '#111',
        border: '1px solid #1f1f1f',
        borderLeft: '4px solid #f97316',
        borderRadius: '12px',
        padding: '14px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        zIndex: 9999,
        boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
        animation: 'slideUp 0.4s ease',
      }}
    >
      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }
      `}</style>

      {/* Ícone */}
      <div style={{
        width: 40,
        height: 40,
        background: '#1a2744',
        borderRadius: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.2rem',
        flexShrink: 0,
      }}>
        🏗️
      </div>

      {/* Texto */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{
          margin: 0,
          fontSize: '0.8rem',
          fontWeight: 700,
          color: '#f5f5f5',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}>
          {notification.name}
        </p>
        <p style={{
          margin: '2px 0 0',
          fontSize: '0.75rem',
          color: '#a3a3a3',
          lineHeight: 1.4,
        }}>
          {notification.action}
        </p>
        <p style={{
          margin: '2px 0 0',
          fontSize: '0.7rem',
          color: '#525252',
        }}>
          📍 {notification.city} · {timeText}
        </p>
      </div>

      {/* Badge verde */}
      <div style={{
        width: 8,
        height: 8,
        background: '#22c55e',
        borderRadius: '50%',
        flexShrink: 0,
        boxShadow: '0 0 6px #22c55e',
      }} />
    </div>
  )
}
