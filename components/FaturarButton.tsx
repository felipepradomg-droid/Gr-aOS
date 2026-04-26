'use client'

import { useState } from 'react'
import { Send } from 'lucide-react'

interface Props {
  contratoId: string
}

export function FaturarButton({ contratoId }: Props) {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  async function handleFaturar() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`/api/contratos/${contratoId}/faturar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Erro ao gerar fatura')
        return
      }

      setSuccess(true)

      if (data.whatsappUrl) {
        window.open(data.whatsappUrl, '_blank')
      }

      // Recarrega a página para mostrar a fatura gerada
      setTimeout(() => window.location.reload(), 1000)
    } catch {
      setError('Erro de conexão. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="w-full py-3 bg-green-500 text-white rounded-lg text-sm font-semibold flex items-center justify-center gap-2">
        ✅ Fatura gerada com sucesso!
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <button
        onClick={handleFaturar}
        disabled={loading}
        className="w-full py-3 bg-gray-900 text-white rounded-lg text-sm font-semibold hover:bg-gray-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
      >
        <Send className="h-4 w-4" />
        {loading ? 'Gerando fatura...' : 'Gerar Fatura do Período'}
      </button>
      {error && (
        <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {error}
        </p>
      )}
    </div>
  )
}
