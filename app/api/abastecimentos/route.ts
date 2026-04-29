// app/api/abastecimentos/route.ts

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
    const from = searchParams.get('from')
    const to = searchParams.get('to')

    const abastecimentos = await prisma.fuelSupply.findMany({
      where: {
        userId: session.user.id,
        ...(equipmentId ? { equipmentId } : {}),
        ...(from || to ? {
          supplyDate: {
            ...(from ? { gte: new Date(from) } : {}),
            ...(to   ? { lte: new Date(to)   } : {}),
          }
        } : {}),
      },
      include: {
        equipment: { select: { name: true, type: true } },
      },
      orderBy: { supplyDate: 'desc' },
    })

    // Totais agregados
    const totalLitros = abastecimentos.reduce((s, a) => s + a.liters, 0)
    const totalCusto  = abastecimentos.reduce((s, a) => s + a.totalCost, 0)

    return NextResponse.json({ abastecimentos, totalLitros, totalCusto })
  } catch (error) {
    console.error('[GET /api/abastecimentos]', error)
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

    if (!body.equipmentId || !body.liters || !body.pricePerLiter) {
      return NextResponse.json(
        { error: 'equipmentId, liters e pricePerLiter são obrigatórios' },
        { status: 400 }
      )
    }

    // Verifica se equipamento pertence ao usuário
    const equipment = await prisma.equipment.findFirst({
      where: { id: body.equipmentId, userId: session.user.id },
    })
    if (!equipment) {
      return NextResponse.json({ error: 'Equipamento não encontrado' }, { status: 404 })
    }

    const totalCost = body.liters * body.pricePerLiter

    const abastecimento = await prisma.fuelSupply.create({
      data: {
        userId:        session.user.id,
        equipmentId:   body.equipmentId,
        supplyDate:    body.supplyDate ? new Date(body.supplyDate) : new Date(),
        fuelType:      body.fuelType      || 'diesel',
        liters:        body.liters,
        pricePerLiter: body.pricePerLiter,
        totalCost,
        meterType:     body.meterType     || 'hourmeter',
        meterReading:  body.meterReading  ?? null,
        supplier:      body.supplier      || null,
        invoiceNumber: body.invoiceNumber || null,
        operatorName:  body.operatorName  || null,
        notes:         body.notes         || null,
      },
      include: {
        equipment: { select: { name: true, type: true } },
      },
    })

    // Registra também como custo do equipamento
    await prisma.equipmentCost.create({
      data: {
        userId:      session.user.id,
        equipmentId: body.equipmentId,
        costType:    'fuel',
        description: `Abastecimento ${abastecimento.fuelType} — ${body.liters}L`,
        amount:      totalCost,
        costDate:    abastecimento.supplyDate,
      },
    })

    return NextResponse.json(abastecimento, { status: 201 })
  } catch (error) {
    console.error('[POST /api/abastecimentos]', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
