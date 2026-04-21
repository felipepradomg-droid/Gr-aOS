import { getMaintenance } from '@/lib/actions/maintenance'
import { MaintenanceTimeline } from '@/components/maintenance/maintenance-timeline'
import { AlertTriangle, Plus } from 'lucide-react'
import Link from 'next/link'
import { formatCurrency } from '@/lib/utils'

export default async function ManutencaoPage() {
  const records = await getMaintenance()

  const active = records.filter(
    (r) => r.status === 'scheduled' || r.status === 'in_progress'
  )
  const completed = records.filter((r) => r.status === 'completed')

  const totalCost = completed.reduce((s, r) => s + (r.cost ?? 0), 0)

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manutenção</h1>
          <p className="text-sm text-gray-500 mt-1">
            Histórico e agendamentos
          </p>
        </div>
        <Link href="/manutencao/nova">
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Registrar</span>
            <span className="sm:hidden">+</span>
          </button>
        </Link>
      </div>

      {/* Alerta */}
      {active.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="flex items-center gap-2 text-amber-700">
            <AlertTriangle className="h-4 w-4" />
            <span className="font-semibold text-sm">
              {active.length} equipamento{active.length > 1 ? 's' : ''} em
              manutenção
            </span>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-amber-600">{active.length}</p>
          <p className="text-xs text-gray-500 mt-1">Em Andamento</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-gray-800">{completed.length}</p>
          <p className="text-xs text-gray-500 mt-1">Concluídas</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-gray-800">
            {totalCost > 0 ? formatCurrency(totalCost) : '-'}
          </p>
          <p className="text-xs text-gray-500 mt-1">Custo Total</p>
        </div>
      </div>

      {/* Ativas */}
      {active.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-600 mb-3">
            Em Andamento / Agendadas
          </h3>
          <ActiveMaintenanceList records={active} />
        </div>
      )}

      {/* Histórico */}
      {completed.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-600 mb-3">
            Histórico
          </h3>
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
  )
}

function ActiveMaintenanceList({
  records,
}: {
  records: ReturnType<typeof getMaintenance> extends Promise<infer T> ? T : never
}) {
  return (
    <div className="space-y-3">
      {(records as any[]).map((record) => (
        <div
          key={record.id}
          className="bg-white rounded-xl border border-amber-200 p-4"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-medium text-gray-900">
                {record.equipment?.name}
              </p>
              <p className="text-sm text-gray-600 mt-0.5">
                {record.description}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {record.provider && `${record.provider} · `}
                Entrada:{' '}
                {new Date(record.startDate).toLocaleDateString('pt-BR')}
                {record.endDate &&
                  ` · Retorno: ${new Date(record.endDate).toLocaleDateString('pt-BR')}`}
              </p>
            </div>
            <CompleteButton id={record.id} />
          </div>
        </div>
      ))}
    </div>
  )
}

function CompleteButton({ id }: { id: string }) {
  return (
    <form>
      <CompleteMaintenanceButton id={id} />
    </form>
  )
}

import { CompleteMaintenance } from '@/components/maintenance/complete-maintenance'

function CompleteMaintenanceButton({ id }: { id: string }) {
  return <CompleteMaintenance id={id} />
}
