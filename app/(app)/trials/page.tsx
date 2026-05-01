'use client'

import { useEffect, useState } from 'react'

interface Trial {
  id: string
  customerName: string
  customerEmail: string
  hasCard: boolean
  cardBrand: string | null
  cardLast4: string | null
  trialEnd: string | null
  daysLeft: number | null
}

export default function TrialsPage() {
  const [trials, setTrials] = useState<Trial[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/stripe/trials')
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setError(data.error)
        else setTrials(data.trials)
      })
      .catch(() => setError('Erro ao carregar dados'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="p-6 text-center text-gray-500">Carregando trials...</div>
  )

  if (error) return (
    <div className="p-6 text-center text-red-500">{error}</div>
  )

  const comCartao = trials.filter((t) => t.hasCard)
  const semCartao = trials.filter((t) => !t.hasCard)

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-1">Trials em andamento</h1>
      <p className="text-gray-500 mb-4 text-sm">
        {trials.length} clientes no trial •{' '}
        <span className="text-green-600">{comCartao.length} com cartão</span> •{' '}
        <span className="text-red-500">{semCartao.length} sem cartão</span>
      </p>

      {trials.length === 0 && (
        <p className="text-gray-400 text-center mt-10">Nenhum trial ativo no momento.</p>
      )}

      <div className="space-y-3">
        {trials
          .sort((a, b) => (a.daysLeft ?? 99) - (b.daysLeft ?? 99))
          .map((t) => (
            <div
              key={t.id}
              className={`rounded-xl border p-4 ${
                t.hasCard ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-gray-800">{t.customerName}</p>
                  <p className="text-sm text-gray-500">{t.customerEmail}</p>
                </div>
                <span
                  className={`text-xs font-bold px-2 py-1 rounded-full ${
                    t.hasCard
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-600'
                  }`}
                >
                  {t.hasCard ? '✓ Com cartão' : '✗ Sem cartão'}
                </span>
              </div>

              <div className="mt-2 flex gap-4 text-sm text-gray-600">
                <span>
                  ⏱{' '}
                  {t.daysLeft !== null
                    ? t.daysLeft <= 0
                      ? 'Expira hoje'
                      : `${t.daysLeft} dia${t.daysLeft > 1 ? 's' : ''} restante${t.daysLeft > 1 ? 's' : ''}`
                    : 'Sem data'}
                </span>
                {t.hasCard && t.cardLast4 && (
                  <span>
                    💳 {t.cardBrand} •••• {t.cardLast4}
                  </span>
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}
