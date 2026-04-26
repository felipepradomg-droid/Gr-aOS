// app/api/horimetro/route.ts
// Registra e lista leituras do horímetro de um equipamento

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

    const readings = await prisma.hourMeter.findMany({
      where: {
        userId: session.user.id,
        ...(equipmentId ? { equipmentId } : {}),
      },
      include: {
        equipment: { select: { name: true, type: true } }
      },
      orderBy: { readingDate: 'desc' },
      take: 50,
    })

    return NextResponse.json(readings)
  } catch (error) {
    console.error('[GET /api/horimetro]', error)
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

    if (!body.equipmentId || body.reading === undefined) {
      return NextResponse.json(
        { error: 'equipmentId e reading são obrigatórios' },
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

    // Registra a leitura
    const reading = await prisma.hourMeter.create({
      data: {
        userId: session.user.id,
        equipmentId: body.equipmentId,
        reading: body.reading,
        readingDate: body.readingDate ? new Date(body.readingDate) : new Date(),
        recordedBy: body.recordedBy || null,
        notes: body.notes || null,
      }
    })

    // Verifica planos de manutenção ativos para este equipamento
    const planos = await prisma.maintenancePlan.findMany({
      where: {
        equipmentId: body.equipmentId,
        userId: session.user.id,
        status: 'active',
        triggerType: { in: ['hours', 'both'] },
        nextDueHours: { not: null },
      }
    })

    const alertasCriados = []

    for (const plano of planos) {
      if (!plano.nextDueHours) continue

      const horasRestantes = plano.nextDueHours - body.reading
      const percentual = horasRestantes / (plano.intervalHours ?? 250)

      // Alerta quando faltam menos de 10% das horas ou já passou
      if (horasRestantes <= 0) {
        // Manutenção vencida — bloqueia locação
        const alertaExistente = await prisma.maintenanceAlert.findFirst({
          where: {
            planId: plano.id,
            status: 'pending',
            alertType: 'overdue',
          }
        })

        if (!alertaExistente) {
          const alerta = await prisma.maintenanceAlert.create({
            data: {
              userId: session.user.id,
              equipmentId: body.equipmentId,
              planId: plano.id,
              alertType: 'overdue',
              message: `${plano.name} está VENCIDA! Horímetro atual: ${body.reading}h. Prevista para: ${plano.nextDueHours}h.`,
              triggeredAt: body.reading,
              status: 'pending',
              blocksBooking: true,
            }
          })
          alertasCriados.push(alerta)

          // Bloqueia o equipamento
          await prisma.equipment.update({
            where: { id: body.equipmentId },
            data: { status: 'maintenance' }
          })
        }
      } else if (percentual <= 0.1) {
        // Manutenção próxima — aviso
        const alertaExistente = await prisma.maintenanceAlert.findFirst({
          where: {
            planId: plano.id,
            status: 'pending',
            alertType: 'upcoming',
          }
        })

        if (!alertaExistente) {
          const alerta = await prisma.maintenanceAlert.create({
            data: {
              userId: session.user.id,
              equipmentId: body.equipmentId,
              planId: plano.id,
              alertType: 'upcoming',
              message: `${plano.name} vence em ${Math.ceil(horasRestantes)}h. Horímetro atual: ${body.reading}h.`,
              triggeredAt: body.reading,
              status: 'pending',
              blocksBooking: false,
            }
          })
          alertasCriados.push(alerta)
        }
      }
    }

    return NextResponse.json({
      reading,
      alertas: alertasCriados,
      message: alertasCriados.length > 0
        ? `${alertasCriados.length} alerta(s) gerado(s)`
        : 'Leitura registrada com sucesso'
    }, { status: 201 })
  } catch (error) {
    console.error('[POST /api/horimetro]', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
