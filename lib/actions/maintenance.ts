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

export async function getMaintenance() {
  const userId = await getUserId()
  return prisma.maintenanceRecord.findMany({
    where: { userId },
    include: {
      equipment: { select: { id: true, name: true, type: true } },
    },
    orderBy: { startDate: 'desc' },
  })
}

export async function getMaintenanceByEquipment(equipmentId: string) {
  const userId = await getUserId()
  return prisma.maintenanceRecord.findMany({
    where: { userId, equipmentId },
    orderBy: { startDate: 'desc' },
    take: 10,
  })
}

export async function createMaintenance(formData: FormData) {
  try {
    const userId = await getUserId()

    const equipmentId = formData.get('equipmentId') as string
    const startDate = new Date(formData.get('startDate') as string)
    const endDateRaw = formData.get('endDate') as string
    const endDate = endDateRaw ? new Date(endDateRaw) : null

    const status =
      endDate && endDate < new Date() ? 'completed' : 'scheduled'

    const record = await prisma.maintenanceRecord.create({
      data: {
        userId,
        equipmentId,
        maintenanceType: formData.get('maintenanceType') as string,
        description: formData.get('description') as string,
        provider: (formData.get('provider') as string) || null,
        cost: formData.get('cost')
          ? parseFloat(formData.get('cost') as string)
          : null,
        startDate,
        endDate,
        hoursAtService: formData.get('hoursAtService')
          ? parseFloat(formData.get('hoursAtService') as string)
          : null,
        status,
        notes: (formData.get('notes') as string) || null,
      },
    })

    // Se manutenção começa hoje ou já começou, marcar equipamento
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const start = new Date(startDate)
    start.setHours(0, 0, 0, 0)

    if (start <= today && status !== 'completed') {
      await prisma.equipment.update({
        where: { id: equipmentId },
        data: { status: 'maintenance' },
      })
    }

    revalidatePath('/manutencao')
    revalidatePath(`/frota/${equipmentId}`)
    return { data: record, error: null }
  } catch (e) {
    return { data: null, error: 'Erro ao registrar manutenção' }
  }
}

export async function completeMaintenance(id: string) {
  try {
    const userId = await getUserId()

    const record = await prisma.maintenanceRecord.findFirst({
      where: { id, userId },
      select: { equipmentId: true },
    })

    await prisma.maintenanceRecord.updateMany({
      where: { id, userId },
      data: {
        status: 'completed',
        endDate: new Date(),
      },
    })

    if (record) {
      await prisma.equipment.update({
        where: { id: record.equipmentId },
        data: { status: 'available' },
      })
    }

    revalidatePath('/manutencao')
    revalidatePath('/frota')
    return { success: true, error: null }
  } catch (e) {
    return { success: false, error: 'Erro ao concluir manutenção' }
  }
}
