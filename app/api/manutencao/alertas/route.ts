// app/api/manutencao/alertas/route.ts
// Lista e resolve alertas de manutenção preditiva

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
    const status = searchParams.get('status') || 'pending'

    const alertas = await prisma.maintenanceAlert.findMany({
      where: {
        userId: session.user.id,
        status,
        ...(equipmentId ? { equipmentId } : {}),
      },
      include: {
        equipment: { select: { name: true, type: true } },
        plan: { select: { name: true, intervalHours: true } },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(alertas)
  } catch (error) {
    console.error('[GET /api/manutencao/alertas]', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const body = await req.json()

    if (!body.id || !body.action) {
      return NextResponse.json(
        { error: 'id e action são obrigatórios' },
        { status: 400 }
      )
    }

    const alerta = await prisma.maintenanceAlert.findFirst({
      where: { id: body.id, userId: session.user.id },
      include: { plan: true }
    })

    if (!alerta) {
      return NextResponse.json({ error: 'Alerta não encontrado' }, { status: 404 })
    }

    // acknowledge — apenas marca como visto
    if (body.action === 'acknowledge') {
      const atualizado = await prisma.maintenanceAlert.update({
        where: { id: body.id },
        data: { status: 'acknowledged' }
      })
      return NextResponse.json(atualizado)
    }

    // resolve — marca como resolvido e atualiza o plano
    if (body.action === 'resolve') {
      const horasAtuais = body.horasAtuais ?? alerta.triggeredAt ?? 0

      await prisma.maintenanceAlert.update({
        where: { id: body.id },
        data: {
          status: 'resolved',
          resolvedAt: new Date(),
          blocksBooking: false,
        }
      })

      // Atualiza o plano com a nova data/hora de conclusão
      if (alerta.planId) {
        const plano = alerta.plan!
        const nextDueHours = plano.intervalHours
          ? horasAtuais + plano.intervalHours
          : null
        const nextDueAt = plano.intervalDays
          ? new Date(Date.now() + plano.intervalDays * 24 * 60 * 60 * 1000)
          : null

        await prisma.maintenancePlan.update({
          where: { id: alerta.planId },
          data: {
            lastDoneAt: new Date(),
            lastDoneHours: horasAtuais,
            nextDueHours,
            nextDueAt,
          }
        })
      }

      // Registra o custo se informado
      if (body.custo) {
        await prisma.equipmentCost.create({
          data: {
            userId: session.user.id,
            equipmentId: alerta.equipmentId,
            costType: 'maintenance',
            description: body.descricao || alerta.plan?.name || 'Manutenção',
            amount: body.custo,
            costDate: new Date(),
          }
        })
      }

      // Libera o equipamento se estava bloqueado
      if (alerta.blocksBooking) {
        const outrosAlertosBloqueantes = await prisma.maintenanceAlert.count({
          where: {
            equipmentId: alerta.equipmentId,
            blocksBooking: true,
            status: 'pending',
            id: { not: body.id },
          }
        })

        if (outrosAlertosBloqueantes === 0) {
          await prisma.equipment.update({
            where: { id: alerta.equipmentId },
            data: { status: 'available' }
          })
        }
      }

      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'Action inválida' }, { status: 400 })
  } catch (error) {
    console.error('[PATCH /api/manutencao/alertas]', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
