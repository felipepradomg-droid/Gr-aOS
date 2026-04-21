import { getServiceOrders } from '@/lib/actions/service-orders'
import { OSKanban } from '@/components/os/os-kanban'
import { Plus } from 'lucide-react'
import Link from 'next/link'

export default async function OSPage() {
  const orders = await getServiceOrders()

  const grouped = {
    pending: orders.filter((o) => o.status === 'pending'),
    confirmed: orders.filter((o) => o.status === 'confirmed'),
    in_progress: orders.filter((o) => o.status === 'in_progress'),
    completed: orders.filter((o) => o.status === 'completed'),
  }

  const activeCount = orders.filter(
    (o) => o.status !== 'cancelled' && o.status !== 'completed'
  ).length

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Ordens de Serviço
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {activeCount} OS ativa{activeCount !== 1 ? 's' : ''}
          </p>
        </div>
        <Link href="/os/nova">
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Nova OS</span>
            <span className="sm:hidden">Nova</span>
          </button>
        </Link>
      </div>

      <OSKanban grouped={grouped} />
    </div>
  )
}
