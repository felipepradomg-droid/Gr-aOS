'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createInvoiceFromOS } from '@/lib/actions/invoices'
import { FileText } from 'lucide-react'
import { toast } from 'sonner'

export function CreateInvoiceFromOS({ osId }: { osId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleCreate() {
    setLoading(true)
    const result = await createInvoiceFromOS(osId)
    setLoading(false)
    if (result?.error) {
      toast.error(result.error)
    } else {
      toast.success('Fatura criada!')
      router.push(`/faturas/${result.data?.id}`)
    }
  }

  return (
    <button
      onClick={handleCreate}
      disabled={loading}
      className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium disabled:opacity-50"
    >
      <FileText className="h-4 w-4" />
      {loading ? 'Gerando fatura...' : 'Gerar Fatura desta OS'}
    </button>
  )
}
