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

export async function getEquipment() {
  const userId = await getUserId()
  return prisma.equipment.findMany({
    where: { userId },
    include: {
      photos: { orderBy: { isCover: 'desc' } },
      specs: true,
    },
    orderBy: { name: 'asc' },
  })
}

export async function getEquipmentById(id: string) {
  const userId = await getUserId()
  return prisma.equipment.findFirst({
    where: { id, userId },
    include: {
      photos: { orderBy: { isCover: 'desc' } },
      documents: { orderBy: { createdAt: 'desc' } },
      specs: true,
    },
  })
}

export async function getEquipmentForSelect() {
  const userId = await getUserId()
  return prisma.equipment.findMany({
    where: { userId },
    select: { id: true, name: true, status: true, dailyRate: true },
    orderBy: { name: 'asc' },
  })
}

export async function createEquipment(formData: FormData) {
  const userId = await getUserId()

  const specsRaw = formData.get('specs') as string
  const specs = specsRaw ? JSON.parse(specsRaw) : []

  const equipment = await prisma.equipment.create({
    data: {
      userId,
      name: formData.get('name') as string,
      type: formData.get('type') as string,
      brand: (formData.get('brand') as string) || null,
      model: (formData.get('model') as string) || null,
      year: formData.get('year') ? parseInt(formData.get('year') as string) : null,
      plate: (formData.get('plate') as string) || null,
      serialNumber: (formData.get('serialNumber') as string) || null,
      capacityTons: formData.get('capacityTons')
        ? parseFloat(formData.get('capacityTons') as string)
        : null,
      dailyRate: formData.get('dailyRate')
        ? parseFloat(formData.get('dailyRate') as string)
        : null,
      hourlyRate: formData.get('hourlyRate')
        ? parseFloat(formData.get('hourlyRate') as string)
        : null,
      notes: (formData.get('notes') as string) || null,
      specs: {
        create: specs
          .filter((s: { key: string; value: string }) => s.key && s.value)
          .map((s: { key: string; value: string; unit?: string }) => ({
            key: s.key,
            value: s.value,
            unit: s.unit || null,
          })),
      },
    },
  })

  revalidatePath('/frota')
  return { data: equipment }
}

export async function updateEquipmentStatus(id: string, status: string) {
  const userId = await getUserId()
  await prisma.equipment.updateMany({
    where: { id, userId },
    data: { status },
  })
  revalidatePath('/frota')
  revalidatePath(`/frota/${id}`)
  return { success: true }
}

export async function deleteEquipment(id: string) {
  const userId = await getUserId()
  await prisma.equipment.deleteMany({ where: { id, userId } })
  revalidatePath('/frota')
  redirect('/frota')
}
