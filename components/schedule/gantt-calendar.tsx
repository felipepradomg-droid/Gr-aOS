'use client'

import { useRouter } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const BOOKING_COLORS: Record<string, string> = {
  confirmed: 'bg-blue-500 text-white',
  tentative: 'bg-yellow-400 text-yellow-900',
  maintenance: 'bg-red-500 text-white',
  blocked: 'bg-gray-400 text-white',
}

interface Booking {
  id: string
  equipmentId: string
  title: string
  startDate: Date | string
  endDate: Date | string
  bookingType: string
  clientName?: string | null
}

interface Equipment {
  id: string
  name: string
  brand?: string | null
}

interface Props {
  bookings: Booking[]
  equipment: Equipment[]
  month: string
}

export function GanttCalendar({ bookings, equipment, month }: Props) {
  const router = useRouter()
  const [year, monthNum] = month.split('-').map(Number)
  const daysInMonth = new Date(year, monthNum, 0).getDate()
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)

  const today = new Date()
  const todayDay =
    today.getFullYear() === year && today.getMonth() + 1 === monthNum
      ? today.getDate()
      : null

  function navigate(dir: 'prev' | 'next') {
    const d = new Date(year, monthNum - 1 + (dir === 'next' ? 1 : -1), 1)
    const m = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    router.push(`/agenda?month=${m}`)
  }

  function toDateStr(d: Date | string) {
    const date = typeof d === 'string' ? new Date(d) : d
    return date.toISOString().split('T')[0]
  }

  function getDayStr(day: number) {
    return `${year}-${String(monthNum).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  }

  function getBookingForDay(equipmentId: string, day: number) {
    const dayStr = getDayStr(day)
    return bookings.find(
      (b) =>
        b.equipmentId === equipmentId &&
        toDateStr(b.startDate) <= dayStr &&
        toDateStr(b.endDate) >= dayStr
    )
  }

  function isStart(booking: Booking, day: number) {
    return toDateStr(booking.startDate) === getDayStr(day)
  }

  function getSpan(booking: Booking, day: number) {
    const endDay = Math.min(
      parseInt(toDateStr(booking.endDate).split('-')[2]),
      daysInMonth
    )
    return endDay - day + 1
  }

  const monthName = new Date(year, monthNum - 1, 1).toLocaleDateString(
    'pt-BR',
    { month: 'long', year: 'numeric' }
  )

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <button
          onClick={() => navigate('prev')}
          className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ChevronLeft className="h-4 w-4 text-gray-600" />
        </button>
        <h2 className="font-semibold text-gray-800 capitalize">{monthName}</h2>
        <button
          onClick={() => navigate('next')}
          className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ChevronRight className="h-4 w-4 text-gray-600" />
        </button>
      </div>

      {/* Gantt */}
      <div className="overflow-x-auto">
        <table
          className="w-full text-xs"
          style={{ minWidth: `${daysInMonth * 32 + 160}px` }}
        >
          <thead>
            <tr className="bg-gray-50">
              <th className="sticky left-0 bg-gray-50 z-10 w-40 text-left px-4 py-2 font-medium text-gray-500 border-r border-gray-100">
                Equipamento
              </th>
              {days.map((d) => (
                <th
                  key={d}
                  className={`w-8 text-center py-2 font-medium border-r border-gray-100 last:border-r-0 ${
                    d === todayDay
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-400'
                  }`}
                >
                  {d}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {equipment.length === 0 ? (
              <tr>
                <td
                  colSpan={daysInMonth + 1}
                  className="text-center py-10 text-gray-400"
                >
                  Nenhum equipamento cadastrado ainda.
                </td>
              </tr>
            ) : (
              equipment.map((eq, idx) => (
                <tr key={eq.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                  <td
                    className="sticky left-0 z-10 border-r border-gray-100 px-4 py-2 font-medium text-gray-700"
                    style={{
                      backgroundColor: idx % 2 === 0 ? 'white' : 'rgb(249 250 251 / 0.5)',
                    }}
                  >
                    <div className="truncate max-w-[140px]">{eq.name}</div>
                    {eq.brand && (
                      <div className="text-gray-400 font-normal text-xs truncate">
                        {eq.brand}
                      </div>
                    )}
                  </td>

                  {days.map((day) => {
                    const booking = getBookingForDay(eq.id, day)

                    if (booking && isStart(booking, day)) {
                      const span = getSpan(booking, day)
                      return (
                        <td key={day} colSpan={span} className="py-1 px-0.5">
                          <div
                            className={`h-7 rounded text-xs font-medium flex items-center px-2 overflow-hidden cursor-pointer hover:opacity-80 transition-opacity ${
                              BOOKING_COLORS[booking.bookingType] ??
                              'bg-blue-500 text-white'
                            }`}
                            title={booking.title}
                          >
                            <span className="truncate">{booking.title}</span>
                          </div>
                        </td>
                      )
                    }

                    if (booking && !isStart(booking, day)) return null

                    return (
                      <td
                        key={day}
                        className={`border-r border-gray-100 last:border-r-0 ${
                          day === todayDay ? 'bg-blue-50' : ''
                        }`}
                      />
                    )
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
