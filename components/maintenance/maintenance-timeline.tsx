import { ElementType } from 'react'
import { formatDate, formatCurrency } from '@/lib/utils'
import { Wrench, AlertTriangle, CheckCircle } from 'lucide-react'

const TYPE_CONFIG: Record<string, {
  label: string
  Icon: ElementType
  color: string
  bg: string
}> = {
  preventive: {
    label: 'Preventiva',
    Icon: Wrench,
    color: 'text-blue-600',
    bg: 'bg-blue-100',
  },
  corrective: {
    label: 'Corretiva',
    Icon: AlertTriangle,
    color: 'text-red-600',
    bg: 'bg-red-100',
  },
  inspection: {
    label: 'Inspeção',
    Icon: CheckCircle,
    color: 'text-green-600',
    bg: 'bg-green-100',
  },
}

interface MaintenanceItem {
  id: string
  maintenanceType: string
  description: string
  provider?: string | null
  cost?: number | null
  startDate: Date | string
  status: string
}

export function MaintenanceTimeline({
  records,
}: {
  records: MaintenanceItem[]
}) {
  if (records.length === 0) {
    return (
      <p className="text-sm text-gray-400 text-center py-4">
        Nenhuma manutenção registrada
      </p>
    )
  }

  return (
    <div className="space-y-3">
      {records.map((record) => {
        const config = TYPE_CONFIG[record.maintenanceType] ?? TYPE_CONFIG.preventive
        const { Icon } = config
        return (
          <div key={record.id} className="flex gap-3">
            <div className={`mt-0.5 p-1.5 rounded-lg ${config.bg} shrink-0`}>
              <Icon className={`h-3.5 w-3.5 ${config.color}`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    {record.description}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {config.label} ·{' '}
                    {formatDate(record.startDate as string)}
                    {record.provider && ` · ${record.provider}`}
                  </p>
                </div>
                {record.cost && (
                  <span className="text-xs font-medium text-gray-600 shrink-0">
                    {formatCurrency(record.cost)}
                  </span>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
