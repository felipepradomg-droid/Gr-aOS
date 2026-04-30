import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const operadores = await prisma.operator.findMany({
      where: { userId: session.user.id },
      orderBy: { nome: 'asc' },
      include: {
        _count: {
          select: {
            operatorAssignments: true,
            workLogs: true,
          },
        },
      },
    })

    return NextResponse.json(operadores)
  } catch (error) {
    console.error('[GET /api/operadores]', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
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

    const operator = await prisma.operator.create({
      data: {
        userId: session.user.id,
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
    })

    return NextResponse.json(operator, { status: 201 })
  } catch (error) {
    console.error('[POST /api/operadores]', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
