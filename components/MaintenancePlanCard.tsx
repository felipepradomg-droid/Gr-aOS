'use client'

import { useState } from 'react'
import { Wrench, Clock, AlertTriangle, CheckCircle, ChevronDown, ChevronUp, Plus } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

interface MaintenancePlan {
  id: string
  name: string
  triggerType: string
  intervalHours?: number | null
  intervalDays?: number | null
  lastDoneAt?: Date | string | null
  lastDoneHours?: number | null
  nextDueAt?: Date | string | null
  nextDueHours?: number | null
  estimatedCost?: number | null
  status: string
  horasAtuais: number
  horasRestantes?: number | null
  statusCalculado: string
  equipment: { name: string; type: string }
  alerts: any[]
}

interface Props {
  plan: MaintenancePlan
  onRegistrarHoras?: (equipmentId: string, horas: number) => Promise<void>
  equipmentId: string
}

const STATUS_CONFIG: Record<string, {
  label: string
  color: string
  bg: string
  icon: React.ReactNode
}> = {
  ok: {
    label: 'Em dia',
    color: 'text-green-700',
    bg: 'bg-green-100',
    icon: <CheckCircle className="h-3 w-3" />,
  },
  upcoming: {
    label: 'Próxima',
    color: 'text-yellow-700',
    bg: 'bg-yellow-100',
    icon: <Clock className="h-3 w-3" />,
  },
  overdue: {
    label: 'Vencida',
    color: 'text-red-700',
    bg: 'bg-red-100',
    icon: <AlertTriangle className="h-3 w-3" />,
  },
}

function ProgressBar({ percent, status }: { percent: number; status: string }) {
  const color =
    status === 'overdue' ? 'bg-red-500' :
    status === 'upcoming' ? 'bg-yellow-500' :
    'bg-green-500'

  return (
    <div className="w-full bg-gray-200 rounded-full h-1.5">
      <div
        className={`h-1.5 rounded-full transition-all ${color}`}
        style={{ width: `${Math.min(100, Math.max(0, percent))}%` }}
      />
    </div>
  )
}

export function MaintenancePlanCard({ plan, onRegistrarHoras, equipmentId }: Props) {
  const [expanded, setExpanded] = useState(false)
  const [showHoras, setShowHoras] = useState(false)
  const [horas, setHoras] = useState('')
  const [loading, setLoading] = useState(false)

  const status = STATUS_CONFIG[plan.statusCalculado] ?? STATUS_CONFIG.ok

  // Calcula percentual de uso desde última manutenção
  const horasUsadas = plan.intervalHours
    ? plan.intervalHours - (plan.horasRestantes ?? plan.intervalHours)
    : 0
  const percentUsado = plan.intervalHours
    ? (horasUsadas / plan.intervalHours) * 100
    : 0

  async function handleRegistrarHoras() {
    if (!onRegistrarHoras || !horas) return
    setLoading(true)
    try {
      await onRegistrarHoras(equipmentId, parseFloat(horas))
      setHoras('')
      setShowHoras(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div
        className="flex items-center justify-between gap-3 p-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className={`p-2 rounded-lg ${status.bg}`}>
            <Wrench className={`h-4 w-4 ${status.color}`} />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-800 truncate">{plan.name}</p>
            <p className="text-xs text-gray-400 mt-0.5">{plan.equipment.name}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className={`flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${status.bg} ${status.color}`}>
            {status.icon}
            {status.label}
          </span>
          {expanded
            ? <ChevronUp className="h-4 w-4 text-gray-400" />
            : <ChevronDown className="h-4 w-4 text-gray-400" />
          }
        </div>
      </div>

      {/* Barra de progresso */}
      <div className="px-4 pb-3">
        <ProgressBar percent={percentUsado} status={plan.statusCalculado} />
        <div className="flex justify-between mt-1">
          <span className="text-xs text-gray-400">
            Horímetro: {plan.horasAtuais}h
          </span>
          {plan.nextDueHours && (
            <span className="text-xs text-gray-400">
              Próxima: {plan.nextDueHours}h
            </span>
          )}
        </div>
      </div>

      {/* Expandido */}
      {expanded && (
        <div className="border-t border-gray-100 p-4 space-y-3 bg-gray-50">
          {/* Detalhes */}
          <div className="grid grid-cols-2 gap-3">
            {plan.intervalHours && (
              <div className="bg-white rounded-lg border border-gray-200 p-3">
                <p className="text-xs text-gray-400">Intervalo</p>
                <p className="text-sm font-bold text-gray-800 mt-0.5">
                  A cada {plan.intervalHours}h
                </p>
              </div>
            )}
            {plan.horasRestantes !== null && plan.horasRestantes !== undefined && (
              <div className="bg-white rounded-lg border border-gray-200 p-3">
                <p className="text-xs text-gray-400">Horas restantes</p>
                <p className={`text-sm font-bold mt-0.5 ${
                  plan.horasRestantes <= 0 ? 'text-red-600' : 'text-gray-800'
                }`}>
                  {plan.horasRestantes <= 0
                    ? `${Math.abs(plan.horasRestantes)}h atrasada`
                    : `${plan.horasRestantes}h`
                  }
                </p>
              </div>
            )}
            {plan.estimatedCost && (
              <div className="bg-white rounded-lg border border-gray-200 p-3">
                <p className="text-xs text-gray-400">Custo estimado</p>
                <p className="text-sm font-bold text-gray-800 mt-0.5">
                  {formatCurrency(plan.estimatedCost)}
                </p>
              </div>
            )}
            {plan.lastDoneAt && (
              <div className="bg-white rounded-lg border border-gray-200 p-3">
                <p className="text-xs text-gray-400">Última vez</p>
                <p className="text-sm font-bold text-gray-800 mt-0.5">
                  {new Date(plan.lastDoneAt).toLocaleDateString('pt-BR')}
                  {plan.lastDoneHours && ` · ${plan.lastDoneHours}h`}
                </p>
              </div>
            )}
          </div>

          {/* Registrar horímetro */}
          {showHoras ? (
            <div className="bg-white rounded-lg border border-gray-200 p-3 space-y-2">
              <p className="text-xs font-semibold text-gray-700">
                Registrar leitura do horímetro
              </p>
              <input
                type="number"
                value={horas}
                onChange={e => setHoras(e.target.value)}
                placeholder="Ex: 1250 (horas totais)"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleRegistrarHoras}
                  disabled={loading || !horas}
                  className="flex-1 py-2 bg-gray-900 text-white text-xs font-semibold rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Salvando...' : 'Salvar Leitura'}
                </button>
                <button
                  onClick={() => setShowHoras(false)}
                  className="px-3 py-2 text-xs text-gray-500 border border-gray-200 bg-white rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowHoras(true)}
              className="flex items-center gap-1.5 text-xs font-medium text-gray-600 border border-gray-200 bg-white px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors w-full justify-center"
            >
              <Plus className="h-3 w-3" />
              Registrar Horímetro
            </button>
          )}
        </div>
      )}
    </div>
  )
}
