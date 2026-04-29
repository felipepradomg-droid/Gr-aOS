import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { id } = params

    const pagamento = await prisma.taxPayment.update({
      where: { id },
      data: {
        dataPagamento: body.dataPagamento ? new Date(body.dataPagamento) : undefined,
        status: body.status,
        numeroGuia: body.numeroGuia,
        banco: body.banco,
        observacoes: body.observacoes,
        valor: body.valor ? parseFloat(body.valor) : undefined,
      },
    })

    if (pagamento.apurationId) {
      const allPagamentos = await prisma.taxPayment.findMany({
        where: { apurationId: pagamento.apurationId },
      })

      const totalPago = allPagamentos
        .filter((p) => p.status === 'PAGO')
        .reduce((sum, p) => sum + Number(p.valor), 0)

      const apuration = await prisma.taxApuration.findUnique({
        where: { id: pagamento.apurationId },
      })

      if (apuration) {
        const totalImpostos = Number(apuration.totalImpostos)
        const totalPendente = Math.max(0, totalImpostos - totalPago)
        let status = 'APURADO'
        if (totalPago >= totalImpostos) status = 'QUITADO'
        else if (totalPago > 0) status = 'PARCIALMENTE_PAGO'

        await prisma.taxApuration.update({
          where: { id: pagamento.apurationId },
          data: { totalPago, totalPendente, status },
        })
      }
    }

    return NextResponse.json(pagamento)
  } catch (error) {
    console.error('Erro ao atualizar pagamento:', error)
    return NextResponse.json({ error: 'Erro ao atualizar' }, { status: 500 })
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.taxPayment.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao deletar pagamento:', error)
    return NextResponse.json({ error: 'Erro ao deletar' }, { status: 500 })
  }
}
