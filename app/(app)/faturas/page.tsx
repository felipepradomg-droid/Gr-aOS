import { getInvoices } from '@/lib/actions/invoices'
import { InvoiceList } from '@/components/invoices/invoice-list'
import { formatCurrency } from '@/lib/utils'
import { Plus } from 'lucide-react'
import Link from 'next/link'

export default async function FaturasPage({
  searchParams,
}: {
  searchParams: { status?: string }
}) {
  const invoices = await getInvoices(searchParams.status)

  const stats = {
    invoiced: invoices.reduce((s, i) => s + (i.totalAmount ?? 0), 0),
    paid: invoices
      .filter((i) => i.status === 'paid')
      .reduce((s, i) => s + (i.totalAmount ?? 0), 0),
    pending: invoices
      .filter((i) => i.status === 'sent')
      .reduce((s, i) => s + (i.totalAmount ?? 0), 0),
    overdue: invoices
      .filter(
        (i) => i.status === 'sent' && new Date(i.dueDate) < new Date()
      )
      .reduce((s, i) => s + (i.totalAmount ?? 0), 0),
  }

  const STATUS_FILTERS = [
    { value: '', label: 'Todas' },
    { value: 'draft', label: '📝 Rascunho' },
    { value: 'sent', label: '📤 Enviadas' },
    { value: 'paid', label: '✅ Pagas' },
    { value: 'overdue', label: '⚠️ Vencidas' },
  ]

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Faturas</h1>
          <p className="text-sm text-gray-500 mt-1">
            Controle financeiro e cobranças
          </p>
        </div>
        <Link href="/faturas/nova">
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Nova Fatura</span>
            <span className="sm:hidden">+</span>
          </button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wide">
            Total Faturado
          </p>
          <p className="text-xl font-bold text-gray-900 mt-1">
            {formatCurrency(stats.invoiced)}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-green-200 p-4">
          <p className="text-xs text-green-600 uppercase tracking-wide">
            Recebido
          </p>
          <p className="text-xl font-bold text-green-700 mt-1">
            {formatCurrency(stats.paid)}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-blue-200 p-4">
          <p className="text-xs text-blue-600 uppercase tracking-wide">
            A Receber
          </p>
          <p className="text-xl font-bold text-blue-700 mt-1">
            {formatCurrency(stats.pending)}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-red-200 p-4">
          <p className="text-xs text-red-500 uppercase tracking-wide">
            Vencidas
          </p>
          <p className="text-xl font-bold text-red-600 mt-1">
            {formatCurrency(stats.overdue)}
          </p>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {STATUS_FILTERS.map((opt) => (
          <Link
            key={opt.value}
            href={opt.value ? `/faturas?status=${opt.value}` : '/faturas'}
          >
            <button
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border transition-colors ${
                (searchParams.status ?? '') === opt.value
                  ? 'bg-gray-900 text-white border-gray-900'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
              }`}
            >
              {opt.label}
            </button>
          </Link>
        ))}
      </div>

      <InvoiceList invoices={invoices} />
    </div>
  )
}
