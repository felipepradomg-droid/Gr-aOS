import { getEquipment } from '@/lib/actions/equipment'
import { EquipmentCard } from '@/components/equipment/equipment-card'
import { EquipmentFilters } from '@/components/equipment/equipment-filters'
import { FleetStats } from '@/components/equipment/fleet-stats'
import { Plus } from 'lucide-react'
import Link from 'next/link'

export default async function FrotaPage({
  searchParams,
}: {
  searchParams: { status?: string; q?: string }
}) {
  const equipment = await getEquipment()

  const filtered = equipment.filter((e) => {
    if (searchParams.status && e.status !== searchParams.status) return false
    if (searchParams.q) {
      const q = searchParams.q.toLowerCase()
      if (
        !e.name.toLowerCase().includes(q) &&
        !(e.brand ?? '').toLowerCase().includes(q) &&
        !(e.model ?? '').toLowerCase().includes(q)
      )
        return false
    }
    return true
  })

  const stats = {
    total: equipment.length,
    available: equipment.filter((e) => e.status === 'available').length,
    in_use: equipment.filter((e) => e.status === 'in_use').length,
    maintenance: equipment.filter((e) => e.status === 'maintenance').length,
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Frota</h1>
          <p className="text-sm text-gray-500 mt-1">
            {equipment.length} equipamento{equipment.length !== 1 ? 's' : ''} cadastrado{equipment.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Link href="/frota/novo">
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Novo Equipamento</span>
            <span className="sm:hidden">Novo</span>
          </button>
        </Link>
      </div>

      <FleetStats stats={stats} />
      <EquipmentFilters />

      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">🏗️</div>
          <h3 className="text-lg font-semibold text-gray-700">
            {equipment.length === 0
              ? 'Nenhum equipamento cadastrado'
              : 'Nenhum resultado encontrado'}
          </h3>
          <p className="text-sm text-gray-500 mt-2">
            {equipment.length === 0
              ? 'Comece adicionando seu primeiro guindaste ou equipamento'
              : 'Tente ajustar os filtros'}
          </p>
          {equipment.length === 0 && (
            <Link href="/frota/novo">
              <button className="mt-4 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors">
                Cadastrar primeiro equipamento
              </button>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((eq) => (
            <EquipmentCard key={eq.id} equipment={eq} />
          ))}
        </div>
      )}
    </div>
  )
}
