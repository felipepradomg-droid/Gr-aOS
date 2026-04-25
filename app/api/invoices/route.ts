// app/api/invoices/route.ts
// Lista e cria faturas

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const invoices = await prisma.invoice.findMany({
      where: { userId: session.user.id },
      include: {
        serviceOrder: {
          select: { osNumber: true, equipmentId: true }
        },
        receivable: true,
        municipalityConfig: {
          select: { cityName: true, state: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(invoices)
  } catch (error) {
    console.error('[GET /api/invoices]', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const body = await req.json()

    // Gera número da fatura automaticamente
    const count = await prisma.invoice.count({
      where: { userId: session.user.id }
    })
    const invoiceNumber = `INV-${String(count + 1).padStart(5, '0')}`

    const invoice = await prisma.invoice.create({
      data: {
        userId: session.user.id,
        invoiceNumber,
        serviceOrderId: body.serviceOrderId || null,
        clienteNome: body.clienteNome,
        clienteEmail: body.clienteEmail || null,
        clienteTel: body.clienteTel || null,
        clienteCnpjCpf: body.clienteCnpjCpf || null,
        dueDate: new Date(body.dueDate),
        amount: body.amount,
        taxAmount: body.taxAmount || 0,
        totalAmount: body.totalAmount || body.amount,
        paymentMethod: body.paymentMethod || null,
        notes: body.notes || null,
        municipalityConfigId: body.municipalityConfigId || null,
        status: 'draft',
      }
    })

    return NextResponse.json(invoice, { status: 201 })
  } catch (error) {
    console.error('[POST /api/invoices]', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
