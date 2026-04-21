interface Props {
  stats: {
    total: number
    available: number
    in_use: number
    maintenance: number
  }
}

export function FleetStats({ stats }: Props) {
  const cards = [
    {
      label: 'Total',
      value: stats.total,
      color: 'text-gray-800',
      bg: 'bg-gray-50 border-gray-200',
    },
    {
      label: 'Disponíveis',
      value: stats.available,
      color: 'text-green-700',
      bg: 'bg-green-50 border-green-200',
    },
    {
      label: 'Em Operação',
      value: stats.in_use,
      color: 'text-blue-700',
      bg: 'bg-blue-50 border-blue-200',
    },
    {
      label: 'Manutenção',
      value: stats.maintenance,
      color: 'text-amber-700',
      bg: 'bg-amber-50 border-amber-200',
    },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {cards.map((card) => (
        <div key={card.label} className={`rounded-xl border p-4 ${card.bg}`}>
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
            {card.label}
          </p>
          <p className={`text-3xl font-bold mt-1 ${card.color}`}>
            {card.value}
          </p>
        </div>
      ))}
    </div>
  )
}
