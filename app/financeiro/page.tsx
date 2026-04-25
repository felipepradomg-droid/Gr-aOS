import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { ReceivableCard } from '@/components/ReceivableCard'
import { BankReconciliation } from '@/components/BankReconciliation'
import { formatCurrency } from '@/lib/utils'
import { Plus } from 'lucide-react'
import Link from 'next/link'

export default async function FinanceiroPage({
  searchParams,
}: {
  searchParams: { aba?: string; status?: string }
}) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) redirect('/login')

  const aba = searchParams.aba ?? 'cobrancas'

  // Busca cobranças
  const receivables = await prisma.receivable.findMany({
    where: {
      userId: session.user.id,
      ...(searchParams.status ? { status: searchParams.status } : {}),
    },
    include: {
      invoice: {
        select: { invoiceNumber: true, totalAmount: true }
      },
      bankAccount: {
        select: { bankName: true }
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  // Busca transações bancárias
  const transactions = await prisma.bankTransaction.findMany({
    where: { userId: session.user.id },
    include: {
      receivable: {
        select: {
          id: true,
          clienteNome: true,
          amount: true,
          paymentMethod: true,
        }
      },
    },
    orderBy: { transactionDate: 'desc' },
    take: 100,
  })

  // Stats financeiros
  const stats = {
    aReceber: receivables
      .filter(r => r.status === 'pending' || r.status === 'sent')
      .reduce((s, r) => s + r.amount, 0),
    recebido: receivables
      .filter(r => r.status === 'paid')
      .reduce((s, r) => s + (r.paidAmount ?? r.amount), 0),
    vencido: receivables
      .filter(r => r.status === 'overdue')
      .reduce((s, r) => s + r.amount, 0),
    pendenteConciliacao: transactions
      .filter(t => t.reconciliationStatus === 'pending').length,
  }

  const STATUS_FILTERS = [
    { value: '', label: 'Todas' },
    { value: 'pending', label: '⏳ Aguardando' },
    { value: 'paid', label: '✅ Pagas' },
    { value: 'overdue', label: '⚠️ Vencidas' },
    { value: 'cancelled', label: '❌ Canceladas' },
  ]

  const ABAS = [
    { value: 'cobrancas', label: 'Cobranças' },
    { value: 'conciliacao', label: 'Conciliação Bancária' },
  ]

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Financeiro</h1>
          <p className="text-sm text-gray-500 mt-1">
            Cobranças, boletos, PIX e conciliação
          </p>
        </div>
        <Link href="/financeiro/nova">
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Nova Cobrança</span>
            <span className="sm:hidden">+</span>
          </button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl border border-blue-200 p-4">
          <p className="text-xs text-blue-600 uppercase tracking-wide">
            A Receber
          </p>
          <p className="text-xl font-bold text-blue-700 mt-1">
            {formatCurrency(stats.aReceber)}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-green-200 p-4">
          <p className="text-xs text-green-600 uppercase tracking-wide">
            Recebido
          </p>
          <p className="text-xl font-bold text-green-700 mt-1">
            {formatCurrency(stats.recebido)}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-red-200 p-4">
          <p className="text-xs text-red-500 uppercase tracking-wide">
            Vencido
          </p>
          <p className="text-xl font-bold text-red-600 mt-1">
            {formatCurrency(stats.vencido)}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-yellow-200 p-4">
          <p className="text-xs text-yellow-600 uppercase tracking-wide">
            Pendente Conciliação
          </p>
          <p className="text-xl font-bold text-yellow-700 mt-1">
            {stats.pendenteConciliacao}
          </p>
        </div>
      </div>

      {/* Abas */}
      <div className="flex gap-2 border-b border-gray-200">
        {ABAS.map((a) => (
          <Link
            key={a.value}
            href={`/financeiro?aba=${a.value}`}
          >
            <button
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                aba === a.value
                  ? 'border-gray-900 text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {a.label}
            </button>
          </Link>
        ))}
      </div>

      {/* Aba Cobranças */}
      {aba === 'cobrancas' && (
        <div className="space-y-4">
          {/* Filtros */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {STATUS_FILTERS.map((opt) => (
              <Link
                key={opt.value}
                href={
                  opt.value
                    ? `/financeiro?aba=cobrancas&status=${opt.value}`
                    : '/financeiro?aba=cobrancas'
                }
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

          {receivables.length === 0 ? (
            <div className="text-center py-12 text-sm text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
              Nenhuma cobrança encontrada
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {receivables.map((r) => (
                <ReceivableCard key={r.id} receivable={r} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Aba Conciliação */}
      {aba === 'conciliacao' && (
        <BankReconciliation transactions={transactions} />
      )}
    </div>
  )
}
