// app/api/manutencao/planos/route.ts
// Cria e lista planos de manutenção preditiva

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

    const { searchParams } = new URL(req.url)
    const equipmentId = searchParams.get('equipmentId')

    const planos = await prisma.maintenancePlan.findMany({
      where: {
        userId: session.user.id,
        ...(equipmentId ? { equipmentId } : {}),
      },
      include: {
        equipment: { select: { name: true, type: true } },
        alerts: {
          where: { status: 'pending' },
          orderBy: { createdAt: 'desc' },
          take: 1,
        }
      },
      orderBy: { createdAt: 'desc' },
    })

    // Busca última leitura do horímetro por equipamento
    const equipmentIds = [...new Set(planos.map(p => p.equipmentId))]
    const ultimasLeituras = await Promise.all(
      equipmentIds.map(id =>
        prisma.hourMeter.findFirst({
          where: { equipmentId: id, userId: session.user.id },
          orderBy: { readingDate: 'desc' },
        })
      )
    )

    const leituraMap = Object.fromEntries(
      equipmentIds.map((id, i) => [id, ultimasLeituras[i]])
    )

    // Adiciona horas atuais e status de cada plano
    const planosComStatus = planos.map(plano => {
      const horasAtuais = leituraMap[plano.equipmentId]?.reading ?? 0
      const horasRestantes = plano.nextDueHours
        ? plano.nextDueHours - horasAtuais
        : null

      let statusCalculado = 'ok'
      if (horasRestantes !== null) {
        if (horasRestantes <= 0) statusCalculado = 'overdue'
        else if (horasRestantes <= (plano.intervalHours ?? 250) * 0.1) {
          statusCalculado = 'upcoming'
        }
      }

      return {
        ...plano,
        horasAtuais,
        horasRestantes,
        statusCalculado,
      }
    })

    return NextResponse.json(planosComStatus)
  } catch (error) {
    console.error('[GET /api/manutencao/planos]', error)
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

    if (!body.equipmentId || !body.name) {
      return NextResponse.json(
        { error: 'equipmentId e name são obrigatórios' },
        { status: 400 }
      )
    }

    // Verifica se o equipamento pertence ao usuário
    const equipment = await prisma.equipment.findFirst({
      where: { id: body.equipmentId, userId: session.user.id }
    })

    if (!equipment) {
      return NextResponse.json({ error: 'Equipamento não encontrado' }, { status: 404 })
    }

    // Busca horímetro atual
    const ultimaLeitura = await prisma.hourMeter.findFirst({
      where: { equipmentId: body.equipmentId, userId: session.user.id },
      orderBy: { readingDate: 'desc' },
    })

    const horasAtuais = ultimaLeitura?.reading ?? 0

    // Calcula próxima manutenção
    const nextDueHours = body.intervalHours
      ? horasAtuais + body.intervalHours
      : null

    const nextDueAt = body.intervalDays
      ? new Date(Date.now() + body.intervalDays * 24 * 60 * 60 * 1000)
      : null

    const plano = await prisma.maintenancePlan.create({
      data: {
        userId: session.user.id,
        equipmentId: body.equipmentId,
        name: body.name,
        triggerType: body.triggerType || 'hours',
        intervalHours: body.intervalHours || null,
        intervalDays: body.intervalDays || null,
        estimatedCost: body.estimatedCost || null,
        nextDueHours,
        nextDueAt,
        status: 'active',
      },
      include: {
        equipment: { select: { name: true } }
      }
    })

    return NextResponse.json(plano, { status: 201 })
  } catch (error) {
    console.error('[POST /api/manutencao/planos]', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
