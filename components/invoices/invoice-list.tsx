'use client'

import Link from 'next/link'
import { formatCurrency } from '@/lib/utils'
import { ChevronRight } from 'lucide-react'

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  draft: { label: 'Rascunho', color: 'bg-gray-100 text-gray-600' },
  sent: { label: 'Enviada', color: 'bg-blue-100 text-blue-700' },
  paid: { label: 'Paga ✅', color: 'bg-green-100 text-green-700' },
  overdue: { label: 'Vencida ⚠️', color: 'bg-red-100 text-red-600' },
  cancelled: { label: 'Cancelada', color: 'bg-gray-100 text-gray-400' },
}

interface Invoice {
  id: string
  invoiceNumber: string
  clienteNome: string
  status: string
  dueDate: Date | string
  totalAmount: number
}

export function InvoiceList({ invoices }: { invoices: Invoice[] }) {
  if (invoices.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p className="text-4xl mb-3">💰</p>
        <p>Nenhuma fatura encontrada</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {invoices.map((invoice) => {
        const dueDate = new Date(invoice.dueDate)
        const isOverdue =
          invoice.status === 'sent' && dueDate < new Date()
        const statusConfig = STATUS_CONFIG[invoice.status] ?? STATUS_CONFIG.draft

        return (
          <Link key={invoice.id} href={`/faturas/${invoice.id}`}>
            <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-sm hover:border-gray-300 transition-all flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-xs font-bold text-gray-400">
                    {invoice.invoiceNumber}
                  </p>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      isOverdue
                        ? 'bg-red-100 text-red-600'
                        : statusConfig.color
                    }`}
                  >
                    {isOverdue ? 'Vencida ⚠️' : statusConfig.label}
                  </span>
                </div>
                <p className="font-medium text-gray-900 mt-0.5 truncate">
                  {invoice.clienteNome}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Venc: {dueDate.toLocaleDateString('pt-BR')}
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <p className="font-bold text-gray-900 text-lg">
                  {formatCurrency(invoice.totalAmount)}
                </p>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </Link>
        )
      })}
    </div>
  )
}
