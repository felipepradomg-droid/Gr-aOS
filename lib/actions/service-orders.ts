'use server'

import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { generateOsNumber } from '@/lib/utils'

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

export async function getServiceOrders(status?: string) {
  const userId = await getUserId()
  return prisma.serviceOrder.findMany({
    where: {
      userId,
      ...(status ? { status } : {}),
    },
    include: {
      equipment: { select: { id: true, name: true, type: true } },
    },
    orderBy: { createdAt: 'desc' },
  })
}

export async function getServiceOrderById(id: string) {
  const userId = await getUserId()
  return prisma.serviceOrder.findFirst({
    where: { id, userId },
    include: {
      equipment: {
        include: { photos: { where: { isCover: true }, take: 1 } },
      },
      cotacao: { select: { id: true, descricao: true } },
      invoice: { select: { id: true, invoiceNumber: true, status: true } },
    },
  })
}

export async function createServiceOrderFromCotacao(cotacaoId: string) {
  try {
    const userId = await getUserId()

    const cotacao = await prisma.cotacao.findFirst({
      where: { id: cotacaoId, userId },
    })

    if (!cotacao) return { data: null, error: 'Cotação não encontrada' }
    if (!cotacao.equipmentId) return { data: null, error: 'Cotação sem equipamento vinculado' }

    const existing = await prisma.serviceOrder.findFirst({
      where: { cotacaoId },
    })
    if (existing) return { data: null, error: 'Já existe uma OS para esta cotação' }

    const count = await prisma.serviceOrder.count({ where: { userId } })
    const osNumber = generateOsNumber(count + 1)

    const today = new Date()

    const os = await prisma.serviceOrder.create({
      data: {
        userId,
        osNumber,
        cotacaoId,
        equipmentId: cotacao.equipmentId,
        clienteNome: cotacao.clienteNome,
        clienteTel: cotacao.clienteTel || null,
        status: 'pending',
        startDate: today,
        endDate: today,
        totalAmount: cotacao.valor || null,
      },
    })

    await prisma.cotacao.update({
      where: { id: cotacaoId },
      data: { status: 'aprovada' },
    })

    revalidatePath('/os')
    revalidatePath('/cotacoes')
    return { data: os, error: null }
  } catch (e) {
    return { data: null, error: 'Erro ao criar OS' }
  }
}

export async function createServiceOrder(formData: FormData) {
  try {
    const userId = await getUserId()

    const count = await prisma.serviceOrder.count({ where: { userId } })
    const osNumber = generateOsNumber(count + 1)

    const startDate = new Date(formData.get('startDate') as string)
    const endDate = new Date(formData.get('endDate') as string)
    const dailyRate = parseFloat(formData.get('dailyRate') as string) || 0
    const totalDays =
      Math.ceil(
        (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
      ) + 1

    const equipmentId = formData.get('equipmentId') as string

    const os = await prisma.serviceOrder.create({
      data: {
        userId,
        osNumber,
        equipmentId,
        clienteNome: formData.get('clienteNome') as string,
        clienteTel: (formData.get('clienteTel') as string) || null,
        operatorName: (formData.get('operatorName') as string) || null,
        status: 'pending',
        startDate,
        endDate,
        serviceAddress: (formData.get('serviceAddress') as string) || null,
        serviceCity: (formData.get('serviceCity') as string) || null,
        serviceNotes: (formData.get('serviceNotes') as string) || null,
        totalDays,
        dailyRate,
        totalAmount: totalDays * dailyRate,
      },
    })

    // Criar booking automático
    await prisma.booking.create({
      data: {
        userId,
        equipmentId,
        title: `OS ${osNumber} — ${formData.get('clienteNome')}`,
        startDate,
        endDate,
        bookingType: 'confirmed',
        clientName: formData.get('clienteNome') as string,
      },
    })

    // Marcar equipamento como em uso
    await prisma.equipment.update({
      where: { id: equipmentId },
      data: { status: 'in_use' },
    })

    revalidatePath('/os')
    revalidatePath('/agenda')
    return { data: os, error: null }
  } catch (e) {
    return { data: null, error: 'Erro ao criar OS' }
  }
}

export async function updateOSStatus(id: string, status: string) {
  try {
    const userId = await getUserId()

    const updates: Record<string, unknown> = { status }

    if (status === 'in_progress') {
      updates.actualStart = new Date()
    }

    if (status === 'completed') {
      updates.actualEnd = new Date()
      const os = await prisma.serviceOrder.findFirst({
        where: { id, userId },
        select: { equipmentId: true },
      })
      if (os) {
        await prisma.equipment.update({
          where: { id: os.equipmentId },
          data: { status: 'available' },
        })
      }
    }

    await prisma.serviceOrder.updateMany({
      where: { id, userId },
      data: updates,
    })

    revalidatePath('/os')
    revalidatePath(`/os/${id}`)
    return { success: true, error: null }
  } catch (e) {
    return { success: false, error: 'Erro ao atualizar status' }
  }
}
