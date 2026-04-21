import { getEquipmentById } from '@/lib/actions/equipment'
import { getMaintenanceByEquipment } from '@/lib/actions/maintenance'
import { getBookingsByEquipment } from '@/lib/actions/bookings'
import { StatusBadge } from '@/components/equipment/status-badge'
import { MaintenanceTimeline } from '@/components/maintenance/maintenance-timeline'
import { notFound } from 'next/navigation'
import { formatCurrency, formatDate } from '@/lib/utils'
import { ChevronLeft, Calendar, Wrench, DollarSign } from 'lucide-react'
import Link from 'next/link'

const TYPE_LABELS: Record<string, string> = {
  crane: '🏗️ Guindaste',
  forklift: '🦺 Empilhadeira',
  truck: '🚛 Caminhão',
  platform: '🔧 Plataforma',
  other: '📦 Outro',
}

export default async function EquipmentDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const [equipment, maintenance, bookings] = await Promise.all([
    getEquipmentById(params.id),
    getMaintenanceByEquipment(params.id),
    getBookingsByEquipment(params.id),
  ])

  if (!equipment) notFound()

  const now = new Date()
  const activeBooking = bookings.find(
    (b) =>
      b.bookingType === 'confirmed' &&
      new Date(b.startDate) <= now &&
      new Date(b.endDate) >= now
  )

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-6 space-y-5">
      {/* Header */}
      <div className="flex items-start gap-3">
        <Link href="/frota">
          <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors mt-0.5">
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </button>
        </Link>
        <div className="flex-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                {equipment.name}
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">
                {TYPE_LABELS[equipment.type] || equipment.type}
                {equipment.capacityTons && ` · ${equipment.capacityTons}t`}
                {equipment.year && ` · ${equipment.year}`}
              </p>
            </div>
            <StatusBadge status={equipment.status} />
          </div>
        </div>
      </div>

      {/* Foto cover */}
      {equipment.photos && equipment.photos.length > 0 && (
        <div className="relative h-52 rounded-xl overflow-hidden bg-gray-100">
          <img
            src={equipment.photos[0].url}
            alt={equipment.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Valores */}
      {(equipment.dailyRate || equipment.hourlyRate) && (
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Valores de Locação
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {equipment.dailyRate && (
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide">
                  Diária
                </p>
                <p className="text-xl font-bold text-gray-900 mt-1">
                  {formatCurrency(equipment.dailyRate)}
                </p>
              </div>
            )}
            {equipment.hourlyRate && (
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide">
                  Hora Extra
                </p>
                <p className="text-xl font-bold text-gray-900 mt-1">
                  {formatCurrency(equipment.hourlyRate)}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Agendamento ativo */}
      {activeBooking && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-center gap-2 text-blue-700">
            <Calendar className="h-4 w-4" />
            <span className="font-semibold text-sm">Em operação agora</span>
          </div>
          <p className="text-sm text-blue-600 mt-1">{activeBooking.title}</p>
          <p className="text-xs text-blue-500 mt-0.5">
            {formatDate(activeBooking.startDate as unknown as string)} —{' '}
{formatDate(activeBooking.endDate as unknown as string)}

          </p>
        </div>
      )}

      {/* Especificações */}
      {equipment.specs && equipment.specs.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-semibold text-gray-700 mb-3">
            Especificações Técnicas
          </h2>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-3">
            {equipment.specs.map((spec) => (
              <div key={spec.id}>
                <dt className="text-xs text-gray-400 uppercase tracking-wide">
                  {spec.key}
                </dt>
                <dd className="text-sm font-medium text-gray-800 mt-0.5">
                  {spec.value}
                  {spec.unit ? ` ${spec.unit}` : ''}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      )}

      {/* Observações */}
      {equipment.notes && (
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-semibold text-gray-700 mb-2">Observações</h2>
          <p className="text-sm text-gray-600">{equipment.notes}</p>
        </div>
      )}

      {/* Manutenção */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-700 flex items-center gap-2">
            <Wrench className="h-4 w-4" />
            Manutenções
          </h2>
          <Link href={`/manutencao/nova?equipmentId=${equipment.id}`}>
            <button className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors">
              Registrar
            </button>
          </Link>
        </div>
        <MaintenanceTimeline records={maintenance} />
      </div>

      {/* Ações */}
      <div className="flex flex-col gap-2">
        <Link href={`/agenda?equipmentId=${equipment.id}`}>
          <button className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium">
            <Calendar className="h-4 w-4" />
            Ver na Agenda
          </button>
        </Link>
        <Link href={`/os/nova?equipmentId=${equipment.id}`}>
          <button className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg bg-gray-900 text-white hover:bg-gray-700 transition-colors text-sm font-medium">
            Criar OS para este equipamento
          </button>
        </Link>
      </div>
    </div>
  )
}
