'use client'

import Link from 'next/link'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Calendar, MapPin, Wrench } from 'lucide-react'

const COLUMNS = [
  { key: 'pending', label: 'Pendentes', color: 'text-gray-600', bg: 'bg-gray-100' },
  { key: 'confirmed', label: 'Confirmadas', color: 'text-blue-700', bg: 'bg-blue-100' },
  { key: 'in_progress', label: 'Em Execução', color: 'text-green-700', bg: 'bg-green-100' },
  { key: 'completed', label: 'Concluídas', color: 'text-purple-700', bg: 'bg-purple-100' },
]

interface OS {
  id: string
  osNumber: string
  clienteNome: string
  status: string
  startDate: Date | string
  endDate: Date | string
  serviceCity?: string | null
  totalAmount?: number | null
  equipment?: { name: string } | null
}

interface Props {
  grouped: Record<string, OS[]>
}

export function OSKanban({ grouped }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {COLUMNS.map((col) => {
        const orders = grouped[col.key] ?? []
        return (
          <div key={col.key} className="space-y-3">
            <div
              className={`flex items-center justify-between px-3 py-2 rounded-lg ${col.bg}`}
            >
              <span className={`text-sm font-semibold ${col.color}`}>
                {col.label}
              </span>
              <span
                className={`text-xs font-bold ${col.color} bg-white/60 px-2 py-0.5 rounded-full`}
              >
                {orders.length}
              </span>
            </div>

            <div className="space-y-2">
              {orders.length === 0 ? (
                <div className="text-center py-6 text-xs text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
                  Nenhuma OS
                </div>
              ) : (
                orders.map((os) => (
                  <Link key={os.id} href={`/os/${os.id}`}>
                    <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md hover:border-gray-300 transition-all cursor-pointer space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-xs font-bold text-gray-400">
                            {os.osNumber}
                          </p>
                          <p className="text-sm font-semibold text-gray-800 mt-0.5 leading-tight">
                            {os.clienteNome}
                          </p>
                        </div>
                        {os.totalAmount && (
                          <p className="text-sm font-bold text-gray-900 shrink-0">
                            {formatCurrency(os.totalAmount)}
                          </p>
                        )}
                      </div>

                      <div className="space-y-1.5">
                        {os.equipment && (
                          <div className="flex items-center gap-1.5 text-xs text-gray-500">
                            <Wrench className="h-3 w-3 shrink-0" />
                            <span className="truncate">{os.equipment.name}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                          <Calendar className="h-3 w-3 shrink-0" />
                          <span>
                            {formatDate(os.startDate as string)} —{' '}
                            {formatDate(os.endDate as string)}
                          </span>
                        </div>
                        {os.serviceCity && (
                          <div className="flex items-center gap-1.5 text-xs text-gray-500">
                            <MapPin className="h-3 w-3 shrink-0" />
                            <span className="truncate">{os.serviceCity}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
