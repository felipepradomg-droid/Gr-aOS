'use client'

import { useState } from 'react'
import Link from 'next/link'
import { MapPin, Calendar, Clock, Wrench, ChevronRight, CheckCircle, PauseCircle } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'

interface Contract {
  id: string
  contractNumber: string
  clienteNome: string
  clienteTel?: string | null
  billingType: string
  rate: number
  startDate: Date | string
  endDate?: Date | string | null
  status: string
  siteCity?: string | null
  operatorName?: string | null
  totalMedicoesPendentes: number
  totalMedicoes: number
  equipment: { name: string; type: string }
  invoices: any[]
}

const STATUS_CONFIG: Record<string, {
  label: string
  color: string
  bg: string
  icon: React.ReactNode
}> = {
  active: {
    label: 'Ativo',
    color: 'text-green-700',
    bg: 'bg-green-100',
    icon: <CheckCircle className="h-3 w-3" />,
  },
  paused: {
    label: 'Pausado',
    color: 'text-yellow-700',
    bg: 'bg-yellow-100',
    icon: <PauseCircle className="h-3 w-3" />,
  },
  completed: {
    label: 'Concluído',
    color: 'text-blue-700',
    bg: 'bg-blue-100',
    icon: <CheckCircle className="h-3 w-3" />,
  },
  cancelled: {
    label: 'Cancelado',
    color: 'text-gray-500',
    bg: 'bg-gray-100',
    icon: <PauseCircle className="h-3 w-3" />,
  },
}

const BILLING_LABELS: Record<string, string> = {
  hourly: 'por hora',
  daily: 'por diária',
  monthly: 'por mês',
}

export function ContractCard({ contract }: { contract: Contract }) {
  const status = STATUS_CONFIG[contract.status] ?? STATUS_CONFIG.active

  return (
    <Link href={`/contratos/${contract.id}`}>
      <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md hover:border-gray-300 transition-all space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-xs font-bold text-gray-400">{contract.contractNumber}</p>
            <p className="text-sm font-semibold text-gray-800 mt-0.5 leading-tight">
              {contract.clienteNome}
            </p>
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <span className={`flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${status.bg} ${status.color}`}>
              {status.icon}
              {status.label}
            </span>
          </div>
        </div>

        {/* Equipamento e taxa */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Wrench className="h-3 w-3 shrink-0" />
            <span className="truncate">{contract.equipment.name}</span>
          </div>
          <p className="text-sm font-bold text-gray-900">
            {formatCurrency(contract.rate)}
            <span className="text-xs font-normal text-gray-400 ml-1">
              {BILLING_LABELS[contract.billingType]}
            </span>
          </p>
        </div>

        {/* Detalhes */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Calendar className="h-3 w-3 shrink-0" />
            <span>Início: {formatDate(contract.startDate as string)}</span>
            {contract.endDate && (
              <span>· Fim: {formatDate(contract.endDate as string)}</span>
            )}
          </div>
          {contract.siteCity && (
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <MapPin className="h-3 w-3 shrink-0" />
              <span>{contract.siteCity}</span>
            </div>
          )}
          {contract.operatorName && (
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <Clock className="h-3 w-3 shrink-0" />
              <span>Operador: {contract.operatorName}</span>
            </div>
          )}
        </div>

        {/* Total pendente */}
        {contract.totalMedicoesPendentes > 0 && (
          <div className="flex items-center justify-between bg-orange-50 border border-orange-200 rounded-lg px-3 py-2">
            <p className="text-xs font-semibold text-orange-700">
              {contract.totalMedicoes} medição(ões) a faturar
            </p>
            <p className="text-sm font-bold text-orange-700">
              {formatCurrency(contract.totalMedicoesPendentes)}
            </p>
          </div>
        )}

        {/* Ver detalhes */}
        <div className="flex items-center justify-end gap-1 text-xs text-gray-400">
          <span>Ver detalhes</span>
          <ChevronRight className="h-3 w-3" />
        </div>
      </div>
    </Link>
  )
}
