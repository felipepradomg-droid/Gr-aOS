import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { ContractCard } from '@/components/ContractCard'
import { formatCurrency } from '@/lib/utils'
import { Plus } from 'lucide-react'
import Link from 'next/link'

export default async function ContratosPage({
  searchParams,
}: {
  searchParams: { status?: string }
}) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) redirect('/login')

  const contratos = await prisma.contract.findMany({
    where: {
      userId: session.user.id,
      ...(searchParams.status ? { status: searchParams.status } : {}),
    },
    include: {
      equipment: { select: { name: true, type: true } },
      measurements: {
        where: { status: 'pending' },
        orderBy: { measureDate: 'desc' },
      },
      invoices: {
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  const contratosComTotais = contratos.map(c => ({
    ...c,
    totalMedicoesPendentes: c.measurements.reduce((s, m) => s + m.amount, 0),
    totalMedicoes: c.measurements.length,
  }))

  const stats = {
    ativos: contratos.filter(c => c.status === 'active').length,
    pendente: contratosComTotais.reduce((s, c) => s + c.totalMedicoesPendentes, 0),
    concluidos: contratos.filter(c => c.status === 'completed').length,
    total: contratos.length,
  }

  const STATUS_FILTERS = [
    { value: '', label: 'Todos' },
    { value: 'active', label: '✅ Ativos' },
    { value: 'paused', label: '⏸️ Pausados' },
    { value: 'completed', label: '🏁 Concluídos' },
    { value: 'cancelled', label: '❌ Cancelados' },
  ]

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contratos</h1>
          <p className="text-sm text-gray-500 mt-1">
            Locações de longo prazo e medições
          </p>
        </div>
        <Link href="/contratos/novo">
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Novo Contrato</span>
            <span className="sm:hidden">+</span>
          </button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl border border-green-200 p-4">
          <p className="text-xs text-green-600 uppercase tracking-wide">Ativos</p>
          <p className="text-2xl font-bold text-green-700 mt-1">{stats.ativos}</p>
        </div>
        <div className="bg-white rounded-xl border border-orange-200 p-4">
          <p className="text-xs text-orange-600 uppercase tracking-wide">A Faturar</p>
          <p className="text-xl font-bold text-orange-700 mt-1">
            {formatCurrency(stats.pendente)}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-blue-200 p-4">
          <p className="text-xs text-blue-600 uppercase tracking-wide">Concluídos</p>
          <p className="text-2xl font-bold text-blue-700 mt-1">{stats.concluidos}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Total</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {STATUS_FILTERS.map((opt) => (
          <Link
            key={opt.value}
            href={opt.value ? `/contratos?status=${opt.value}` : '/contratos'}
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
      {contratosComTotais.length === 0 ? (
        <div className="text-center py-12 text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
          <p className="text-4xl mb-3">📋</p>
          <p className="text-sm">Nenhum contrato encontrado</p>
          <p className="text-xs mt-1">Crie contratos para locações de longo prazo com medições mensais</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {contratosComTotais.map((contrato) => (
            <ContractCard key={contrato.id} contract={contrato as any} />
          ))}
        </div>
      )}
    </div>
  )
}
