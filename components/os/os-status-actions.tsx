'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { updateOSStatus } from '@/lib/actions/service-orders'
import { CheckCircle, Play, XCircle } from 'lucide-react'
import { toast } from 'sonner'

const TRANSITIONS: Record<
  string,
  { next: string; label: string; style: string }[]
> = {
  pending: [
    { next: 'confirmed', label: 'Confirmar OS', style: 'bg-blue-600 hover:bg-blue-700 text-white' },
    { next: 'cancelled', label: 'Cancelar', style: 'bg-red-50 hover:bg-red-100 text-red-600 border border-red-200' },
  ],
  confirmed: [
    { next: 'in_progress', label: 'Iniciar Execução', style: 'bg-green-600 hover:bg-green-700 text-white' },
    { next: 'cancelled', label: 'Cancelar', style: 'bg-red-50 hover:bg-red-100 text-red-600 border border-red-200' },
  ],
  in_progress: [
    { next: 'completed', label: 'Concluir OS', style: 'bg-purple-600 hover:bg-purple-700 text-white' },
  ],
}

interface Props {
  osId: string
  currentStatus: string
}

export function OSStatusActions({ osId, currentStatus }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)
  const transitions = TRANSITIONS[currentStatus] ?? []

  if (transitions.length === 0) return null

  async function handleTransition(nextStatus: string) {
    setLoading(nextStatus)
    const result = await updateOSStatus(osId, nextStatus)
    setLoading(null)
    if (result?.error) {
      toast.error(result.error as string)
    } else {
      toast.success('Status atualizado!')
      router.refresh()
    }
  }

  return (
    <div className="flex gap-2 flex-wrap">
      {transitions.map((t) => (
        <button
          key={t.next}
          disabled={loading === t.next}
          onClick={() => handleTransition(t.next)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 ${t.style}`}
        >
          {t.next === 'completed' && <CheckCircle className="h-4 w-4" />}
          {t.next === 'in_progress' && <Play className="h-4 w-4" />}
          {t.next === 'cancelled' && <XCircle className="h-4 w-4" />}
          {loading === t.next ? 'Atualizando...' : t.label}
        </button>
      ))}
    </div>
  )
}
