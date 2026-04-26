// app/api/contratos/route.ts
// Lista e cria contratos de locação

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
    const status = searchParams.get('status')

    const contratos = await prisma.contract.findMany({
      where: {
        userId: session.user.id,
        ...(status ? { status } : {}),
      },
      include: {
        equipment: { select: { name: true, type: true } },
        measurements: {
          where: { status: 'pending' },
          orderBy: { measureDate: 'desc' },
        },
        invoices: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    // Adiciona totais calculados
    const contratosComTotais = contratos.map(c => {
      const totalMedicoesPendentes = c.measurements.reduce(
        (s, m) => s + m.amount, 0
      )
      const totalMedicoes = c.measurements.length
      return { ...c, totalMedicoesPendentes, totalMedicoes }
    })

    return NextResponse.json(contratosComTotais)
  } catch (error) {
    console.error('[GET /api/contratos]', error)
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

    if (!body.equipmentId || !body.clienteNome || !body.rate || !body.startDate) {
      return NextResponse.json(
        { error: 'equipmentId, clienteNome, rate e startDate são obrigatórios' },
        { status: 400 }
      )
    }

    // Verifica se equipamento pertence ao usuário
    const equipment = await prisma.equipment.findFirst({
      where: { id: body.equipmentId, userId: session.user.id }
    })

    if (!equipment) {
      return NextResponse.json({ error: 'Equipamento não encontrado' }, { status: 404 })
    }

    // Gera número do contrato automaticamente
    const count = await prisma.contract.count({
      where: { userId: session.user.id }
    })
    const contractNumber = `CTR-${String(count + 1).padStart(4, '0')}`

    const contrato = await prisma.contract.create({
      data: {
        userId: session.user.id,
        equipmentId: body.equipmentId,
        contractNumber,
        clienteNome: body.clienteNome,
        clienteTel: body.clienteTel || null,
        clienteEmail: body.clienteEmail || null,
        clienteCnpjCpf: body.clienteCnpjCpf || null,
        billingType: body.billingType || 'daily',
        rate: body.rate,
        startDate: new Date(body.startDate),
        endDate: body.endDate ? new Date(body.endDate) : null,
        siteAddress: body.siteAddress || null,
        siteCity: body.siteCity || null,
        operatorName: body.operatorName || null,
        notes: body.notes || null,
        status: 'active',
      },
      include: {
        equipment: { select: { name: true, type: true } }
      }
    })

    // Atualiza status do equipamento para em uso
    await prisma.equipment.update({
      where: { id: body.equipmentId },
      data: { status: 'in_use' }
    })

    return NextResponse.json(contrato, { status: 201 })
  } catch (error) {
    console.error('[POST /api/contratos]', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
