'use client'

import { useState } from 'react'
import { AlertTriangle, CheckCircle, Clock, Wrench, Send } from 'lucide-react'

interface MaintenanceAlert {
  id: string
  alertType: string
  message: string
  triggeredAt?: number | null
  status: string
  blocksBooking: boolean
  createdAt: Date | string
  equipment: { name: string; type: string }
  plan?: { name: string; intervalHours?: number | null } | null
}

interface Props {
  alert: MaintenanceAlert
  onResolve?: (id: string, custo?: number) => Promise<void>
  onAcknowledge?: (id: string) => Promise<void>
}

const ALERT_CONFIG: Record<string, {
  label: string
  color: string
  bg: string
  border: string
  icon: React.ReactNode
}> = {
  overdue: {
    label: 'Manutenção Vencida',
    color: 'text-red-700',
    bg: 'bg-red-50',
    border: 'border-red-200',
    icon: <AlertTriangle className="h-4 w-4" />,
  },
  upcoming: {
    label: 'Manutenção Próxima',
    color: 'text-yellow-700',
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    icon: <Clock className="h-4 w-4" />,
  },
  blocked: {
    label: 'Equipamento Bloqueado',
    color: 'text-red-700',
    bg: 'bg-red-50',
    border: 'border-red-200',
    icon: <AlertTriangle className="h-4 w-4" />,
  },
}

export function MaintenanceAlertCard({ alert, onResolve, onAcknowledge }: Props) {
  const [loading, setLoading] = useState(false)
  const [showResolve, setShowResolve] = useState(false)
  const [custo, setCusto] = useState('')

  const config = ALERT_CONFIG[alert.alertType] ?? ALERT_CONFIG.upcoming
  const isPending = alert.status === 'pending'

  async function handleResolve() {
    if (!onResolve) return
    setLoading(true)
    try {
      await onResolve(alert.id, custo ? parseFloat(custo) : undefined)
    } finally {
      setLoading(false)
      setShowResolve(false)
    }
  }

  async function handleAcknowledge() {
    if (!onAcknowledge) return
    setLoading(true)
    try {
      await onAcknowledge(alert.id)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`rounded-xl border p-4 space-y-3 ${config.bg} ${config.border}`}>
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className={config.color}>{config.icon}</span>
          <div>
            <p className={`text-xs font-bold uppercase tracking-wide ${config.color}`}>
              {config.label}
            </p>
            <p className="text-sm font-semibold text-gray-800 mt-0.5">
              {alert.equipment.name}
            </p>
          </div>
        </div>
        {alert.blocksBooking && (
          <span className="text-xs font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded-full shrink-0">
            🔒 Bloqueado
          </span>
        )}
      </div>

      {/* Mensagem */}
      <p className="text-xs text-gray-600 leading-relaxed">{alert.message}</p>

      {/* Info do plano */}
      {alert.plan && (
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <Wrench className="h-3 w-3 shrink-0" />
          <span>{alert.plan.name}</span>
          {alert.plan.intervalHours && (
            <span>· a cada {alert.plan.intervalHours}h</span>
          )}
        </div>
      )}

      {/* Campo de custo ao resolver */}
      {showResolve && (
        <div className="bg-white rounded-lg border border-gray-200 p-3 space-y-2">
          <p className="text-xs font-semibold text-gray-700">Registrar custo da manutenção</p>
          <input
            type="number"
            value={custo}
            onChange={e => setCusto(e.target.value)}
            placeholder="R$ 0,00 (opcional)"
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400"
          />
        </div>
      )}

      {/* Ações */}
      {isPending && (
        <div className="flex items-center gap-2 flex-wrap">
          {!showResolve ? (
            <>
              <button
                onClick={() => setShowResolve(true)}
                disabled={loading}
                className="flex items-center gap-1.5 text-xs font-semibold bg-gray-900 text-white px-3 py-1.5 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
              >
                <CheckCircle className="h-3 w-3" />
                Marcar como Resolvida
              </button>
              {alert.alertType === 'upcoming' && (
                <button
                  onClick={handleAcknowledge}
                  disabled={loading}
                  className="flex items-center gap-1.5 text-xs font-medium text-gray-500 border border-gray-200 bg-white px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Ciente
                </button>
              )}
            </>
          ) : (
            <>
              <button
                onClick={handleResolve}
                disabled={loading}
                className="flex items-center gap-1.5 text-xs font-semibold bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                <CheckCircle className="h-3 w-3" />
                {loading ? 'Salvando...' : 'Confirmar'}
              </button>
              <button
                onClick={() => setShowResolve(false)}
                className="text-xs font-medium text-gray-500 border border-gray-200 bg-white px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
            </>
          )}
        </div>
      )}

      {/* Resolvido */}
      {alert.status === 'resolved' && (
        <div className="flex items-center gap-1.5 text-xs text-green-600 font-medium">
          <CheckCircle className="h-3 w-3" />
          Resolvida
        </div>
      )}
    </div>
  )
}
