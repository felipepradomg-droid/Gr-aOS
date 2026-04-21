import Link from 'next/link'
import Image from 'next/image'
import { StatusBadge } from './status-badge'
import { formatCurrency } from '@/lib/utils'

const TYPE_ICONS: Record<string, string> = {
  crane: '🏗️',
  forklift: '🦺',
  truck: '🚛',
  platform: '🔧',
  other: '📦',
}

interface Props {
  equipment: {
    id: string
    name: string
    type: string
    brand?: string | null
    model?: string | null
    capacityTons?: number | null
    status: string
    dailyRate?: number | null
    photos?: Array<{ url: string; isCover: boolean }>
  }
}

export function EquipmentCard({ equipment }: Props) {
  const cover =
    equipment.photos?.find((p) => p.isCover) ?? equipment.photos?.[0]

  return (
    <Link href={`/frota/${equipment.id}`}>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md hover:border-gray-300 transition-all cursor-pointer group">
        {/* Foto */}
        <div className="relative h-40 bg-gray-100">
          {cover ? (
            <Image
              src={cover.url}
              alt={equipment.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-5xl opacity-30">
              {TYPE_ICONS[equipment.type] ?? '📦'}
            </div>
          )}
          <div className="absolute top-2 right-2">
            <StatusBadge status={equipment.status} />
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="font-semibold text-gray-900 truncate">
                {equipment.name}
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                {equipment.brand && `${equipment.brand} `}
                {equipment.model && `${equipment.model}`}
                {equipment.capacityTons && ` · ${equipment.capacityTons}t`}
              </p>
            </div>
            <span className="text-2xl shrink-0">
              {TYPE_ICONS[equipment.type] ?? '📦'}
            </span>
          </div>

          {equipment.dailyRate && (
            <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs text-gray-500">Diária</span>
              <span className="font-bold text-gray-800">
                {formatCurrency(equipment.dailyRate)}
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
