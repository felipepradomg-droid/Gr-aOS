'use server'

import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

async function getUserId() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) redirect('/login')
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  })
  if (!user) redirect('/login')
  return user.id
}

export async function getBookings(month?: string) {
  const userId = await getUserId()

  const where: Record<string, unknown> = { userId }

  if (month) {
    const [year, m] = month.split('-').map(Number)
    const start = new Date(year, m - 1, 1)
    const end = new Date(year, m, 0, 23, 59, 59)
    where.OR = [
      { startDate: { gte: start, lte: end } },
      { endDate: { gte: start, lte: end } },
      { AND: [{ startDate: { lte: start } }, { endDate: { gte: end } }] },
    ]
  }

  return prisma.booking.findMany({
    where,
    include: {
      equipment: { select: { id: true, name: true, type: true } },
    },
    orderBy: { startDate: 'asc' },
  })
}

export async function getBookingsByEquipment(equipmentId: string) {
  const userId = await getUserId()
  return prisma.booking.findMany({
    where: { userId, equipmentId },
    orderBy: { startDate: 'desc' },
    take: 20,
  })
}

export async function createBooking(formData: FormData) {
  const userId = await getUserId()

  const equipmentId = formData.get('equipment_id') as string
  const startDate = new Date(formData.get('start_date') as string)
  const endDate = new Date(formData.get('end_date') as string)

  // Verificar conflito
  const conflict = await prisma.booking.findFirst({
    where: {
      userId,
      equipmentId,
      bookingType: { not: 'blocked' },
      AND: [
        { startDate: { lte: endDate } },
        { endDate: { gte: startDate } },
      ],
    },
  })

  if (conflict) {
    return { error: 'Equipamento já agendado neste período' }
  }

  const booking = await prisma.booking.create({
    data: {
      userId,
      equipmentId,
      title: formData.get('title') as string,
      startDate,
      endDate,
      bookingType: (formData.get('booking_type') as string) || 'confirmed',
      clientName: (formData.get('client_name') as string) || null,
      notes: (formData.get('notes') as string) || null,
    },
  })

  revalidatePath('/agenda')
  return { data: booking }
}

export async function deleteBooking(id: string) {
  const userId = await getUserId()
  await prisma.booking.deleteMany({ where: { id, userId } })
  revalidatePath('/agenda')
  return { success: true }
}
