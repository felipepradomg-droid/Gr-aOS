import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { InvoiceCard } from '@/components/InvoiceCard'
import { formatCurrency } from '@/lib/utils'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { revalidatePath } from 'next/cache'

export default async function FiscalPage({
  searchParams,
}: {
  searchParams: { status?: string }
}) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) redirect('/login')

  const where = {
    userId: session.user.id,
    ...(searchParams.status ? { status: searchParams.status } : {}),
  }

  const invoices = await prisma.invoice.findMany({
    where,
    include: {
      municipalityConfig: {
        select: { cityName: true, state: true }
      },
      receivable: true,
    },
    orderBy: { createdAt: 'desc' },
  })

  const stats = {
    total: invoices.reduce((s, i) => s + (i.totalAmount ?? 0), 0),
    emitidas: invoices.filter(i => i.status === 'emitted' || i.status === 'paid').length,
    pendentes: invoices.filter(i => i.status === 'draft').length,
    erros: invoices.filter(i => i.status === 'error').length,
  }

  const STATUS_FILTERS = [
    { value: '', label: 'Todas' },
    { value: 'draft', label: '📝 Rascunho' },
    { value: 'emitted', label: '✅ Emitidas' },
    { value: 'paid', label: '💰 Pagas' },
    { value: 'error', label: '⚠️ Com Erro' },
    { value: 'cancelled', label: '❌ Canceladas' },
  ]

  async function emitirNfse(id: string) {
    'use server'
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return { error: 'Não autorizado' }

    const res = await fetch(
      `${process.env.NEXTAUTH_URL}/api/invoices/${id}/emit`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: session.user.id }),
      }
    )
    const data = await res.json()
    revalidatePath('/fiscal')
    return data
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Fiscal</h1>
          <p className="text-sm text-gray-500 mt-1">
            Emissão de NFS-e e notas fiscais
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
            Total
          </p>
          <p className="text-xl font-bold text-gray-900 mt-1">
            {formatCurrency(stats.total)}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-green-200 p-4">
          <p className="text-xs text-green-600 uppercase tracking-wide">
            NFS-e Emitidas
          </p>
          <p className="text-xl font-bold text-green-700 mt-1">
            {stats.emitidas}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-yellow-200 p-4">
          <p className="text-xs text-yellow-600 uppercase tracking-wide">
            Pendentes
          </p>
          <p className="text-xl font-bold text-yellow-700 mt-1">
            {stats.pendentes}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-red-200 p-4">
          <p className="text-xs text-red-500 uppercase tracking-wide">
            Com Erro
          </p>
          <p className="text-xl font-bold text-red-600 mt-1">
            {stats.erros}
          </p>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {STATUS_FILTERS.map((opt) => (
          <Link
            key={opt.value}
            href={opt.value ? `/fiscal?status=${opt.value}` : '/fiscal'}
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

      {/* Lista */}
      {invoices.length === 0 ? (
        <div className="text-center py-12 text-sm text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
          Nenhuma fatura encontrada
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {invoices.map((invoice) => (
            <InvoiceCard
              key={invoice.id}
              invoice={invoice}
              onEmitir={emitirNfse}
            />
          ))}
        </div>
      )}
    </div>
  )
}
