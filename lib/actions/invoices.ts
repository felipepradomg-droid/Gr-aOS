'use server'

import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { generateInvoiceNumber } from '@/lib/utils'

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

export async function getInvoices(status?: string) {
  const userId = await getUserId()
  return prisma.invoice.findMany({
    where: {
      userId,
      ...(status ? { status } : {}),
    },
    include: {
      serviceOrder: {
        select: { osNumber: true, equipment: { select: { name: true } } },
      },
    },
    orderBy: { createdAt: 'desc' },
  })
}

export async function getInvoiceById(id: string) {
  const userId = await getUserId()
  return prisma.invoice.findFirst({
    where: { id, userId },
    include: {
      serviceOrder: {
        include: {
          equipment: { select: { name: true } },
        },
      },
    },
  })
}

export async function createInvoiceFromOS(serviceOrderId: string) {
  try {
    const userId = await getUserId()

    const os = await prisma.serviceOrder.findFirst({
      where: { id: serviceOrderId, userId },
    })

    if (!os) return { data: null, error: 'OS não encontrada' }

    const existing = await prisma.invoice.findFirst({
      where: { serviceOrderId },
    })
    if (existing) return { data: null, error: 'Já existe uma fatura para esta OS' }

    const count = await prisma.invoice.count({ where: { userId } })
    const invoiceNumber = generateInvoiceNumber(count + 1)

    const dueDate = new Date()
    dueDate.setDate(dueDate.getDate() + 30)

    const amount = os.totalAmount ?? 0

    const invoice = await prisma.invoice.create({
      data: {
        userId,
        invoiceNumber,
        serviceOrderId,
        clienteNome: os.clienteNome,
        clienteTel: os.clienteTel || null,
        status: 'draft',
        dueDate,
        amount,
        taxAmount: 0,
        totalAmount: amount,
      },
    })

    revalidatePath('/faturas')
    revalidatePath(`/os/${serviceOrderId}`)
    return { data: invoice, error: null }
  } catch (e) {
    return { data: null, error: 'Erro ao criar fatura' }
  }
}

export async function createInvoice(formData: FormData) {
  try {
    const userId = await getUserId()

    const count = await prisma.invoice.count({ where: { userId } })
    const invoiceNumber = generateInvoiceNumber(count + 1)

    const amount = parseFloat(formData.get('amount') as string)
    const taxAmount = parseFloat(formData.get('taxAmount') as string) || 0

    const invoice = await prisma.invoice.create({
      data: {
        userId,
        invoiceNumber,
        clienteNome: formData.get('clienteNome') as string,
        clienteTel: (formData.get('clienteTel') as string) || null,
        clienteEmail: (formData.get('clienteEmail') as string) || null,
        status: 'draft',
        issueDate: new Date(formData.get('issueDate') as string),
        dueDate: new Date(formData.get('dueDate') as string),
        amount,
        taxAmount,
        totalAmount: amount + taxAmount,
        paymentMethod: (formData.get('paymentMethod') as string) || null,
        notes: (formData.get('notes') as string) || null,
      },
    })

    revalidatePath('/faturas')
    return { data: invoice, error: null }
  } catch (e) {
    return { data: null, error: 'Erro ao criar fatura' }
  }
}

export async function markInvoicePaid(id: string) {
  try {
    const userId = await getUserId()
    await prisma.invoice.updateMany({
      where: { id, userId },
      data: { status: 'paid', paidAt: new Date() },
    })
    revalidatePath('/faturas')
    revalidatePath(`/faturas/${id}`)
    return { success: true, error: null }
  } catch (e) {
    return { success: false, error: 'Erro ao atualizar fatura' }
  }
}

export async function markInvoiceSent(id: string) {
  try {
    const userId = await getUserId()
    await prisma.invoice.updateMany({
      where: { id, userId },
      data: { status: 'sent' },
    })
    revalidatePath('/faturas')
    revalidatePath(`/faturas/${id}`)
    return { success: true, error: null }
  } catch (e) {
    return { success: false, error: 'Erro ao atualizar fatura' }
  }
}

export async function getDashboardData() {
  const userId = await getUserId()

  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0)

  const [
    fleet,
    activeOS,
    completedOS,
    invoices,
    overdueInvoices,
    recentOS,
    maintenanceAlerts,
  ] = await Promise.all([
    prisma.equipment.findMany({
      where: { userId },
      select: { status: true },
    }),
    prisma.serviceOrder.count({
      where: { userId, status: 'in_progress' },
    }),
    prisma.serviceOrder.count({
      where: {
        userId,
        status: 'completed',
        updatedAt: { gte: monthStart, lte: monthEnd },
      },
    }),
    prisma.invoice.findMany({
      where: {
        userId,
        issueDate: { gte: monthStart, lte: monthEnd },
      },
      select: { status: true, totalAmount: true },
    }),
    prisma.invoice.findMany({
      where: {
        userId,
        status: 'sent',
        dueDate: { lt: now },
      },
      select: {
        id: true,
        invoiceNumber: true,
        totalAmount: true,
        dueDate: true,
        clienteNome: true,
      },
      take: 5,
    }),
    prisma.serviceOrder.findMany({
      where: { userId },
      include: {
        equipment: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
    prisma.maintenanceRecord.findMany({
      where: {
        userId,
        status: { in: ['scheduled', 'in_progress'] },
      },
      include: {
        equipment: { select: { name: true } },
      },
      take: 5,
    }),
  ])

  const fleetStats = {
    total: fleet.length,
    available: fleet.filter((e) => e.status === 'available').length,
    in_use: fleet.filter((e) => e.status === 'in_use').length,
    maintenance: fleet.filter((e) => e.status === 'maintenance').length,
    utilization:
      fleet.length > 0
        ? Math.round(
            (fleet.filter((e) => e.status === 'in_use').length /
              fleet.length) *
              100
          )
        : 0,
  }

  const financialStats = {
    invoiced: invoices.reduce((s, i) => s + (i.totalAmount ?? 0), 0),
    received: invoices
      .filter((i) => i.status === 'paid')
      .reduce((s, i) => s + (i.totalAmount ?? 0), 0),
    pending: invoices
      .filter((i) => i.status === 'sent')
      .reduce((s, i) => s + (i.totalAmount ?? 0), 0),
  }

  return {
    fleetStats,
    osStats: { active: activeOS, completed: completedOS },
    financialStats,
    overdueInvoices,
    recentOS,
    maintenanceAlerts,
  }
}

export async function getMonthlyRevenue() {
  const userId = await getUserId()

  const sixMonthsAgo = new Date()
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

  const invoices = await prisma.invoice.findMany({
    where: {
      userId,
      issueDate: { gte: sixMonthsAgo },
    },
    select: { totalAmount: true, status: true, issueDate: true },
    orderBy: { issueDate: 'asc' },
  })

  const grouped: Record<
    string,
    { month: string; invoiced: number; received: number }
  > = {}

  invoices.forEach((inv) => {
    const key = inv.issueDate.toISOString().substring(0, 7)
    if (!grouped[key]) {
      grouped[key] = { month: key, invoiced: 0, received: 0 }
    }
    grouped[key].invoiced += inv.totalAmount ?? 0
    if (inv.status === 'paid') {
      grouped[key].received += inv.totalAmount ?? 0
    }
  })

  return Object.values(grouped).sort((a, b) =>
    a.month.localeCompare(b.month)
  )
}
