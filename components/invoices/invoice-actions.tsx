'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { markInvoicePaid, markInvoiceSent } from '@/lib/actions/invoices'
import { CheckCircle, Send } from 'lucide-react'
import { toast } from 'sonner'

interface Props {
  invoiceId: string
  status: string
}

export function InvoiceActions({ invoiceId, status }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleMarkPaid() {
    setLoading(true)
    const result = await markInvoicePaid(invoiceId)
    setLoading(false)
    if (result?.error) toast.error(result.error as string)
    else { toast.success('Fatura marcada como paga! 🎉'); router.refresh() }
  }

  async function handleMarkSent() {
    setLoading(true)
    const result = await markInvoiceSent(invoiceId)
    setLoading(false)
    if (result?.error) toast.error(result.error as string)
    else { toast.success('Fatura marcada como enviada!'); router.refresh() }
  }

  if (status === 'paid' || status === 'cancelled') return null

  return (
    <div className="flex flex-col gap-2">
      {status === 'draft' && (
        <button
          onClick={handleMarkSent}
          disabled={loading}
          className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium disabled:opacity-50"
        >
          <Send className="h-4 w-4" />
          Marcar como Enviada
        </button>
      )}
      {(status === 'draft' || status === 'sent' || status === 'overdue') && (
        <button
          onClick={handleMarkPaid}
          disabled={loading}
          className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg bg-green-600 hover:bg-green-700 text-white transition-colors text-sm font-medium disabled:opacity-50"
        >
          <CheckCircle className="h-4 w-4" />
          {loading ? 'Salvando...' : 'Marcar como Paga'}
        </button>
      )}
    </div>
  )
}
