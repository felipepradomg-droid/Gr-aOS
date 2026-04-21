import { cn } from '@/lib/utils'

const CONFIG: Record<string, { label: string; className: string }> = {
  available: {
    label: 'Disponível',
    className: 'bg-green-100 text-green-700 border border-green-200',
  },
  in_use: {
    label: 'Em Operação',
    className: 'bg-blue-100 text-blue-700 border border-blue-200',
  },
  maintenance: {
    label: 'Manutenção',
    className: 'bg-amber-100 text-amber-700 border border-amber-200',
  },
  inactive: {
    label: 'Inativo',
    className: 'bg-gray-100 text-gray-500 border border-gray-200',
  },
}

export function StatusBadge({ status }: { status: string }) {
  const config = CONFIG[status] ?? CONFIG.inactive
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
        config.className
      )}
    >
      {config.label}
    </span>
  )
}
