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
      where: {
        id: params.id,
        userId: session.user.id,
      },
      include: {
        operatorAssignments: {
          include: {
            equipment: {
              select: { id: true, name: true, type: true },
            },
            contract: {
              select: { id: true, contractNumber: true, clienteNome: true },
            },
          },
          orderBy: { startDate: 'desc' },
        },
        workLogs: {
          orderBy: { workDate: 'desc' },
        },
      },
    })

    if (!operator) {
      return NextResponse.json({ error: 'Operador não encontrado.' }, { status: 404 })
    }

    return NextResponse.json(operator)
  } catch (error) {
    console.error('[GET /api/operadores/[id]]', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const existing = await prisma.operator.findFirst({
      where: { id: params.id, userId: session.user.id },
    })

    if (!existing) {
      return NextResponse.json({ error: 'Operador não encontrado.' }, { status: 404 })
    }

    const body = await req.json()

    const {
      nome,
      cpf,
      rg,
      telefone,
      email,
      endereco,
      cidade,
      estado,
      cep,
      cnhNumero,
      cnhCategoria,
      cnhValidade,
      paymentType,
      salarioFixo,
      valorDiaria,
      valorHora,
      status,
      notes,
    } = body

    if (!nome) {
      return NextResponse.json({ error: 'Nome é obrigatório.' }, { status: 400 })
    }

    const updated = await prisma.operator.update({
      where: { id: params.id },
      data: {
        nome,
        cpf: cpf || null,
        rg: rg || null,
        telefone: telefone || null,
        email: email || null,
        endereco: endereco || null,
        cidade: cidade || null,
        estado: estado || null,
        cep: cep || null,
        cnhNumero: cnhNumero || null,
        cnhCategoria: cnhCategoria || null,
        cnhValidade: cnhValidade ? new Date(cnhValidade) : null,
        paymentType: paymentType || 'daily',
        salarioFixo: salarioFixo ?? null,
        valorDiaria: valorDiaria ?? null,
        valorHora: valorHora ?? null,
        status: status || 'active',
        notes: notes || null,
      },
      include: {
        operatorAssignments: {
          include: {
            equipment: {
              select: { id: true, name: true, type: true },
            },
            contract: {
              select: { id: true, contractNumber: true, clienteNome: true },
            },
          },
          orderBy: { startDate: 'desc' },
        },
        workLogs: {
          orderBy: { workDate: 'desc' },
        },
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('[PUT /api/operadores/[id]]', error)
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

    const existing = await prisma.operator.findFirst({
      where: { id: params.id, userId: session.user.id },
    })

    if (!existing) {
      return NextResponse.json({ error: 'Operador não encontrado.' }, { status: 404 })
    }

    await prisma.operator.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[DELETE /api/operadores/[id]]', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
