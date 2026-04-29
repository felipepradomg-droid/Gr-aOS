// app/api/contratos/[id]/medicoes/route.ts

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

    // Totais de diárias paradas
    const totalDiariasParadas = medicoes.reduce((s, m) => s + (m.daysIdle || 0), 0)
    const totalCustoDiariasParadas = medicoes.reduce((s, m) => {
      if (!m.daysIdle || !m.idleRate) return s
      return s + m.daysIdle * m.idleRate
    }, 0)

    return NextResponse.json({
      medicoes,
      totalPendente,
      totalFaturado,
      totalDiariasParadas,
      totalCustoDiariasParadas,
    })
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

    // Validações por tipo de cobrança
    if (contrato.billingType === 'hourly' && !body.hoursWorked) {
      return NextResponse.json(
        { error: 'hoursWorked é obrigatório para contratos por hora' },
        { status: 400 }
      )
    }

    if (contrato.billingType === 'daily' && !body.daysWorked && !body.daysIdle) {
      return NextResponse.json(
        { error: 'Informe ao menos diárias trabalhadas ou paradas.' },
        { status: 400 }
      )
    }

    if (contrato.billingType === 'fixed' && !body.amount) {
      return NextResponse.json(
        { error: 'Informe o valor da medição para contratos por obra.' },
        { status: 400 }
      )
    }

    // Calcula valor das diárias trabalhadas
    let amountWorked = 0
    if (contrato.billingType === 'hourly' && body.hoursWorked) {
      amountWorked = contrato.rate * body.hoursWorked
    } else if (contrato.billingType === 'daily' && body.daysWorked) {
      amountWorked = contrato.rate * body.daysWorked
    } else if (contrato.billingType === 'monthly') {
      amountWorked = body.amount || contrato.rate
    } else if (contrato.billingType === 'fixed') {
      amountWorked = body.amount || 0
    }

    // Calcula valor das diárias paradas
    const daysIdle = body.daysIdle || 0
    const idleRate = body.idleRate || 0
    const amountIdle = daysIdle * idleRate

    const amount = amountWorked + amountIdle

    const medicao = await prisma.measurement.create({
      data: {
        userId:      session.user.id,
        contractId:  params.id,
        measureDate: body.measureDate ? new Date(body.measureDate) : new Date(),
        hoursWorked: body.hoursWorked || null,
        daysWorked:  body.daysWorked  || null,
        daysIdle:    daysIdle > 0 ? daysIdle : null,
        idleRate:    idleRate > 0 ? idleRate : null,
        amount,
        operatorName: body.operatorName || contrato.operatorName || null,
        notes:        body.notes || null,
        status:       'pending',
      }
    })

    // WhatsApp de confirmação
    let whatsappUrl = null
    if (contrato.clienteTel) {
      const tel = contrato.clienteTel.replace(/\D/g, '')
      let detalhes = ''
      if (contrato.billingType === 'hourly') {
        detalhes = `⏱️ ${body.hoursWorked}h trabalhadas`
      } else if (contrato.billingType === 'daily') {
        detalhes = `📅 ${body.daysWorked || 0} diária(s) trabalhada(s)`
        if (daysIdle > 0) {
          detalhes += `\n⏸️ ${daysIdle} diária(s) parada(s) — R$ ${amountIdle.toFixed(2)}`
        }
      } else if (contrato.billingType === 'fixed') {
        detalhes = `🏗️ Medição de obra`
      }

      const mensagem = encodeURIComponent(
        `Olá ${contrato.clienteNome}! Medição registrada no contrato ${contrato.contractNumber}.\n\n` +
        `📅 Data: ${new Date(medicao.measureDate).toLocaleDateString('pt-BR')}\n` +
        `${detalhes}\n` +
        `💰 Valor total: R$ ${amount.toFixed(2)}\n\n` +
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
