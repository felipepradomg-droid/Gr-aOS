import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const operator = await prisma.operator.findFirst({
      where: { id: params.id, userId: session.user.id },
    })

    if (!operator) {
      return NextResponse.json({ error: 'Operador não encontrado.' }, { status: 404 })
    }

    const logs = await prisma.operatorWorkLog.findMany({
      where: { operatorId: params.id },
      orderBy: { workDate: 'desc' },
    })

    return NextResponse.json(logs)
  } catch (error) {
    console.error('[GET /api/operadores/[id]/worklogs]', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const operator = await prisma.operator.findFirst({
      where: { id: params.id, userId: session.user.id },
    })

    if (!operator) {
      return NextResponse.json({ error: 'Operador não encontrado.' }, { status: 404 })
    }

    const body = await req.json()
    const { workDate, hoursWorked, contractId, equipmentId, notes } = body

    if (!hoursWorked || hoursWorked <= 0) {
      return NextResponse.json({ error: 'Horas trabalhadas inválidas.' }, { status: 400 })
    }

    // Calcula valor a pagar com base no tipo de pagamento do operador
    let amountDue: number | null = null

    if (operator.paymentType === 'hourly' && operator.valorHora) {
      amountDue = hoursWorked * operator.valorHora
    } else if (operator.paymentType === 'daily' && operator.valorDiaria) {
      // Considera 8h = 1 diária
      const dias = hoursWorked / 8
      amountDue = dias * operator.valorDiaria
    } else if (operator.paymentType === 'fixed') {
      // Salário fixo — não gera valor por registro
      amountDue = null
    }

    const log = await prisma.operatorWorkLog.create({
      data: {
        userId: session.user.id,
        operatorId: params.id,
        workDate: new Date(workDate),
        hoursWorked,
        paymentType: operator.paymentType,
        amountDue,
        contractId: contractId || null,
        equipmentId: equipmentId || null,
        notes: notes || null,
      },
    })

    return NextResponse.json(log, { status: 201 })
  } catch (error) {
    console.error('[POST /api/operadores/[id]/worklogs]', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const logId = searchParams.get('logId')

    if (!logId) {
      return NextResponse.json({ error: 'logId é obrigatório.' }, { status: 400 })
    }

    const log = await prisma.operatorWorkLog.findFirst({
      where: { id: logId, userId: session.user.id },
    })

    if (!log) {
      return NextResponse.json({ error: 'Registro não encontrado.' }, { status: 404 })
    }

    await prisma.operatorWorkLog.delete({
      where: { id: logId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[DELETE /api/operadores/[id]/worklogs]', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
