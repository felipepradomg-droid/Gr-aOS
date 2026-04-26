// app/api/contratos/[id]/medicoes/route.ts
// Registra e lista medições de um contrato

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const contrato = await prisma.contract.findFirst({
      where: { id: params.id, userId: session.user.id }
    })

    if (!contrato) {
      return NextResponse.json({ error: 'Contrato não encontrado' }, { status: 404 })
    }

    const medicoes = await prisma.measurement.findMany({
      where: { contractId: params.id, userId: session.user.id },
      orderBy: { measureDate: 'desc' },
    })

    const totalPendente = medicoes
      .filter(m => m.status === 'pending')
      .reduce((s, m) => s + m.amount, 0)

    const totalFaturado = medicoes
      .filter(m => m.status === 'invoiced')
      .reduce((s, m) => s + m.amount, 0)

    return NextResponse.json({ medicoes, totalPendente, totalFaturado })
  } catch (error) {
    console.error('[GET /api/contratos/[id]/medicoes]', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const contrato = await prisma.contract.findFirst({
      where: { id: params.id, userId: session.user.id }
    })

    if (!contrato) {
      return NextResponse.json({ error: 'Contrato não encontrado' }, { status: 404 })
    }

    if (contrato.status !== 'active') {
      return NextResponse.json(
        { error: 'Contrato não está ativo' },
        { status: 400 }
      )
    }

    const body = await req.json()

    // Valida campos por tipo de cobrança
    if (contrato.billingType === 'hourly' && !body.hoursWorked) {
      return NextResponse.json(
        { error: 'hoursWorked é obrigatório para contratos por hora' },
        { status: 400 }
      )
    }

    if (contrato.billingType === 'daily' && !body.daysWorked) {
      return NextResponse.json(
        { error: 'daysWorked é obrigatório para contratos por diária' },
        { status: 400 }
      )
    }

    // Calcula valor automaticamente
    let amount = 0
    if (contrato.billingType === 'hourly' && body.hoursWorked) {
      amount = contrato.rate * body.hoursWorked
    } else if (contrato.billingType === 'daily' && body.daysWorked) {
      amount = contrato.rate * body.daysWorked
    } else if (body.amount) {
      amount = body.amount
    }

    const medicao = await prisma.measurement.create({
      data: {
        userId: session.user.id,
        contractId: params.id,
        measureDate: body.measureDate ? new Date(body.measureDate) : new Date(),
        hoursWorked: body.hoursWorked || null,
        daysWorked: body.daysWorked || null,
        amount,
        operatorName: body.operatorName || contrato.operatorName || null,
        notes: body.notes || null,
        status: 'pending',
      }
    })

    // Monta WhatsApp de confirmação se tiver telefone
    let whatsappUrl = null
    if (contrato.clienteTel) {
      const tel = contrato.clienteTel.replace(/\D/g, '')
      const tipo = contrato.billingType === 'hourly'
        ? `${body.hoursWorked}h trabalhadas`
        : `${body.daysWorked} diária(s)`
      const mensagem = encodeURIComponent(
        `Olá ${contrato.clienteNome}! Medição registrada no contrato ${contrato.contractNumber}.\n\n` +
        `📅 Data: ${new Date(medicao.measureDate).toLocaleDateString('pt-BR')}\n` +
        `⏱️ ${tipo}\n` +
        `💰 Valor: R$ ${amount.toFixed(2)}\n\n` +
        `Este valor será incluído na próxima fatura.`
      )
      whatsappUrl = `https://wa.me/55${tel}?text=${mensagem}`
    }

    return NextResponse.json({ medicao, whatsappUrl, amount }, { status: 201 })
  } catch (error) {
    console.error('[POST /api/contratos/[id]/medicoes]', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
