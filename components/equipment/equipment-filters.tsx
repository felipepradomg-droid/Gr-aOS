'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'
import { Search, X } from 'lucide-react'

const STATUS_OPTIONS = [
  { value: '', label: 'Todos' },
  { value: 'available', label: '🟢 Disponíveis' },
  { value: 'in_use', label: '🔵 Em Operação' },
  { value: 'maintenance', label: '🟡 Manutenção' },
  { value: 'inactive', label: '⚫ Inativos' },
]

export function EquipmentFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const createQueryString = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString())
      Object.entries(updates).forEach(([key, value]) => {
        if (value) params.set(key, value)
        else params.delete(key)
      })
      return params.toString()
    },
    [searchParams]
  )

  const hasFilters =
    searchParams.has('status') || searchParams.has('q')

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          placeholder="Buscar equipamento..."
          defaultValue={searchParams.get('q') ?? ''}
          onChange={(e) => {
            router.push(`/frota?${createQueryString({ q: e.target.value })}`)
          }}
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {STATUS_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() =>
              router.push(
                `/frota?${createQueryString({ status: opt.value })}`
              )
            }
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border transition-colors ${
              (searchParams.get('status') ?? '') === opt.value
                ? 'bg-gray-900 text-white border-gray-900'
                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {hasFilters && (
        <button
          onClick={() => router.push('/frota')}
          className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700"
        >
          <X className="h-3 w-3" />
          Limpar filtros
        </button>
      )}
    </div>
  )
}
