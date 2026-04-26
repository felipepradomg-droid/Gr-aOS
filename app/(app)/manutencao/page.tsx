import { getMaintenance } from '@/lib/actions/maintenance'
import { MaintenanceTimeline } from '@/components/maintenance/maintenance-timeline'
import { CompleteMaintenance } from '@/components/maintenance/complete-maintenance'
import { MaintenanceAlertCard } from '@/components/MaintenanceAlertCard'
import { MaintenancePlanCard } from '@/components/MaintenancePlanCard'
import { AlertTriangle, Plus } from 'lucide-react'
import Link from 'next/link'
import { formatCurrency } from '@/lib/utils'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export default async function ManutencaoPage({
  searchParams,
}: {
  searchParams: { aba?: string }
}) {
  const session = await getServerSession(authOptions)
  const userId = session!.user.id
  const aba = searchParams.aba ?? 'historico'

  const records = await getMaintenance()
  const active = records.filter(r => r.status === 'scheduled' || r.status === 'in_progress')
  const completed = records.filter(r => r.status === 'completed')
  const totalCost = completed.reduce((s, r) => s + (r.cost ?? 0), 0)

  // Busca alertas preditivos
  const alertas = await prisma.maintenanceAlert.findMany({
    where: { userId, status: { in: ['pending', 'acknowledged'] } },
    include: {
      equipment: { select: { name: true, type: true } },
      plan: { select: { name: true, intervalHours: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  // Busca planos preditivos
  const planosRaw = await prisma.maintenancePlan.findMany({
    where: { userId, status: 'active' },
    include: {
      equipment: { select: { name: true, type: true } },
      alerts: { where: { status: 'pending' }, take: 1 },
    },
    orderBy: { createdAt: 'desc' },
  })

  // Adiciona horasAtuais e statusCalculado
  const planos = await Promise.all(planosRaw.map(async (plano) => {
    const ultimaLeitura = await prisma.hourMeter.findFirst({
      where: { equipmentId: plano.equipmentId, userId },
      orderBy: { readingDate: 'desc' },
    })
    const horasAtuais = ultimaLeitura?.reading ?? 0
    const horasRestantes = plano.nextDueHours
      ? plano.nextDueHours - horasAtuais
      : null
    let statusCalculado = 'ok'
    if (horasRestantes !== null) {
      if (horasRestantes <= 0) statusCalculado = 'overdue'
      else if (horasRestantes <= (plano.intervalHours ?? 250) * 0.1) {
        statusCalculado = 'upcoming'
      }
    }
    return { ...plano, horasAtuais, horasRestantes, statusCalculado }
  }))

  // TCO por equipamento
  const custos = await prisma.equipmentCost.findMany({
    where: { userId },
    include: { equipment: { select: { name: true } } },
    orderBy: { costDate: 'desc' },
  })

  const tcoMap = custos.reduce((acc, c) => {
    if (!acc[c.equipmentId]) {
      acc[c.equipmentId] = { nome: c.equipment.name, total: 0, custos: [] }
    }
    acc[c.equipmentId].total += c.amount
    acc[c.equipmentId].custos.push(c)
    return acc
  }, {} as Record<string, { nome: string; total: number; custos: any[] }>)

  const ABAS = [
    { value: 'historico', label: '📋 Histórico' },
    { value: 'preditiva', label: '🔮 Preditiva' },
    { value: 'alertas', label: `⚠️ Alertas ${alertas.length > 0 ? `(${alertas.length})` : ''}` },
    { value: 'tco', label: '💰 TCO' },
  ]

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manutenção</h1>
          <p className="text-sm text-gray-500 mt-1">Histórico e preditiva</p>
        </div>
        <Link href="/manutencao/nova">
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Registrar</span>
            <span className="sm:hidden">+</span>
          </button>
        </Link>
      </div>

      {/* Alerta de alertas pendentes */}
      {alertas.filter(a => a.alertType === 'overdue').length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center gap-2 text-red-700">
            <AlertTriangle className="h-4 w-4" />
            <span className="font-semibold text-sm">
              {alertas.filter(a => a.alertType === 'overdue').length} manutenção(ões) vencida(s) — equipamentos bloqueados!
            </span>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl border border-amber-200 p-4 text-center">
          <p className="text-2xl font-bold text-amber-600">{active.length}</p>
          <p className="text-xs text-gray-500 mt-1">Em Andamento</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-gray-800">{completed.length}</p>
          <p className="text-xs text-gray-500 mt-1">Concluídas</p>
        </div>
        <div className="bg-white rounded-xl border border-red-200 p-4 text-center">
          <p className="text-2xl font-bold text-red-600">
            {alertas.filter(a => a.status === 'pending').length}
          </p>
          <p className="text-xs text-gray-500 mt-1">Alertas Ativos</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <p className="text-xl font-bold text-gray-800">
            {totalCost > 0 ? formatCurrency(totalCost) : '-'}
          </p>
          <p className="text-xs text-gray-500 mt-1">Custo Total</p>
        </div>
      </div>

      {/* Abas */}
      <div className="flex gap-2 border-b border-gray-200 overflow-x-auto pb-0 scrollbar-none">
        {ABAS.map((a) => (
          <Link key={a.value} href={`/manutencao?aba=${a.value}`}>
            <button className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              aba === a.value
                ? 'border-gray-900 text-gray-900'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}>
              {a.label}
            </button>
          </Link>
        ))}
      </div>

      {/* Aba Histórico */}
      {aba === 'historico' && (
        <div className="space-y-4">
          {active.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-600 mb-3">Em Andamento</h3>
              <div className="space-y-3">
                {active.map((record) => (
                  <div key={record.id} className="bg-white rounded-xl border border-amber-200 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium text-gray-900">{record.equipment?.name}</p>
                        <p className="text-sm text-gray-600 mt-0.5">{record.description}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {record.provider && `${record.provider} · `}
                          Entrada: {new Date(record.startDate).toLocaleDateString('pt-BR')}
                          {record.endDate && ` · Retorno: ${new Date(record.endDate).toLocaleDateString('pt-BR')}`}
                        </p>
                      </div>
                      <form>
                        <CompleteMaintenance id={record.id} />
                      </form>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {completed.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-600 mb-3">Histórico</h3>
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <MaintenanceTimeline records={completed} />
              </div>
            </div>
          )}

          {records.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <p className="text-4xl mb-3">🔧</p>
              <p>Nenhuma manutenção registrada ainda</p>
            </div>
          )}
        </div>
      )}

      {/* Aba Preditiva */}
      {aba === 'preditiva' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">{planos.length} plano(s) ativo(s)</p>
            <Link href="/manutencao/plano/novo">
              <button className="flex items-center gap-1.5 text-xs font-semibold bg-gray-900 text-white px-3 py-1.5 rounded-lg hover:bg-gray-700 transition-colors">
                <Plus className="h-3 w-3" />
                Novo Plano
              </button>
            </Link>
          </div>

          {planos.length === 0 ? (
            <div className="text-center py-12 text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
              <p className="text-3xl mb-3">🔮</p>
              <p className="text-sm">Nenhum plano preditivo criado ainda</p>
              <p className="text-xs mt-1">Crie planos baseados em horímetro para receber alertas automáticos</p>
            </div>
          ) : (
            <div className="space-y-3">
              {planos.map((plano) => (
                <MaintenancePlanCard
                  key={plano.id}
                  plan={plano as any}
                  equipmentId={plano.equipmentId}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Aba Alertas */}
      {aba === 'alertas' && (
        <div className="space-y-3">
          {alertas.length === 0 ? (
            <div className="text-center py-12 text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
              <p className="text-3xl mb-3">✅</p>
              <p className="text-sm">Nenhum alerta pendente</p>
            </div>
          ) : (
            alertas.map((alerta) => (
              <MaintenanceAlertCard
                key={alerta.id}
                alert={alerta as any}
              />
            ))
          )}
        </div>
      )}

      {/* Aba TCO */}
      {aba === 'tco' && (
        <div className="space-y-4">
          {Object.keys(tcoMap).length === 0 ? (
            <div className="text-center py-12 text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
              <p className="text-3xl mb-3">💰</p>
              <p className="text-sm">Nenhum custo registrado ainda</p>
              <p className="text-xs mt-1">Os custos aparecem automaticamente ao resolver alertas</p>
            </div>
          ) : (
            Object.values(tcoMap).map((item, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-gray-800">{item.nome}</p>
                  <p className="text-sm font-bold text-gray-900">{formatCurrency(item.total)}</p>
                </div>
                <div className="space-y-1.5">
                  {item.custos.map((c: any) => (
                    <div key={c.id} className="flex items-center justify-between text-xs text-gray-500">
                      <span>{c.description}</span>
                      <span className="font-medium">{formatCurrency(c.amount)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
