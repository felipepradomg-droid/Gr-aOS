'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { completeMaintenance } from '@/lib/actions/maintenance'
import { toast } from 'sonner'

export function CompleteMaintenance({ id }: { id: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleComplete() {
    setLoading(true)
    const result = await completeMaintenance(id)
    setLoading(false)
    if (result?.error) {
      toast.error(result.error as string)
    } else {
      toast.success('Manutenção concluída! Equipamento liberado. ✅')
      router.refresh()
    }
  }

  return (
    <button
      onClick={handleComplete}
      disabled={loading}
      className="px-3 py-1.5 border border-green-200 text-green-700 hover:bg-green-50 rounded-lg text-xs font-medium transition-colors disabled:opacity-50 shrink-0"
    >
      {loading ? '...' : 'Concluir'}
    </button>
  )
}
