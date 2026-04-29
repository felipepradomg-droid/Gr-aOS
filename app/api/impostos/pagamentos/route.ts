import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')
  const competencia = searchParams.get('competencia')
  const vencimentoAte = searchParams.get('vencimentoAte')

  try {
    const where: Record<string, unknown> = {}
    if (status) where.status = status
    if (competencia) where.competencia = competencia
    if (vencimentoAte) where.vencimento = { lte: new Date(vencimentoAte) }

    const pagamentos = await prisma.taxPayment.findMany({
      where,
      orderBy: [{ vencimento: 'asc' }, { competencia: 'desc' }],
    })

    return NextResponse.json(pagamentos)
  } catch (error) {
    console.error('Erro ao buscar pagamentos:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const pagamento = await prisma.taxPayment.create({
      data: {
        apurationId: body.apurationId || null,
        competencia: body.competencia,
        tributo: body.tributo,
        descricao: body.descricao,
        valor: parseFloat(body.valor),
        vencimento: new Date(body.vencimento),
        dataPagamento: body.dataPagamento ? new Date(body.dataPagamento) : null,
        status: body.dataPagamento ? 'PAGO' : 'PENDENTE',
        numeroGuia: body.numeroGuia || null,
        banco: body.banco || null,
        observacoes: body.observacoes || null,
      },
    })

    return NextResponse.json(pagamento, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar pagamento:', error)
    return NextResponse.json({ error: 'Erro ao salvar' }, { status: 500 })
  }
}
