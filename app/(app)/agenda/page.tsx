import { getBookings } from '@/lib/actions/bookings'
import { getEquipment } from '@/lib/actions/equipment'
import { GanttCalendar } from '@/components/schedule/gantt-calendar'
import { BookingLegend } from '@/components/schedule/booking-legend'
import { Plus } from 'lucide-react'
import Link from 'next/link'

export default async function AgendaPage({
  searchParams,
}: {
  searchParams: { month?: string }
}) {
  const now = new Date()
  const month =
    searchParams.month ??
    `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`

  const [bookings, equipment] = await Promise.all([
    getBookings(month),
    getEquipment(),
  ])

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Agenda</h1>
          <p className="text-sm text-gray-500 mt-1">
            Disponibilidade e agendamentos da frota
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

      <BookingLegend />

      <GanttCalendar
        bookings={bookings}
        equipment={equipment}
        month={month}
      />
    </div>
  )
}
