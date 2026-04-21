export function BookingLegend() {
  const items = [
    { color: 'bg-blue-500', label: 'Confirmado' },
    { color: 'bg-yellow-400', label: 'Tentativo' },
    { color: 'bg-red-500', label: 'Manutenção' },
    { color: 'bg-gray-400', label: 'Bloqueado' },
  ]

  return (
    <div className="flex gap-4 flex-wrap">
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-1.5">
          <div className={`w-3 h-3 rounded-sm ${item.color}`} />
          <span className="text-xs text-gray-600">{item.label}</span>
        </div>
      ))}
    </div>
  )
}
