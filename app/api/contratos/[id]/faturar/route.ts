// app/api/contratos/[id]/faturar/route.ts
// Gera fatura consolidada das medições pendentes do contrato

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const contrato = await prisma.contract.findFirst({
      where: { id: params.id, userId: session.user.id },
      include: {
        equipment: { select: { name: true } }
      }
    })

    if (!contrato) {
      return NextResponse.json({ error: 'Contrato não encontrado' }, { status: 404 })
    }

    // Busca medições pendentes
    const medicoesPendentes = await prisma.measurement.findMany({
      where: {
        contractId: params.id,
        userId: session.user.id,
        status: 'pending',
      },
      orderBy: { measureDate: 'asc' },
    })

    if (medicoesPendentes.length === 0) {
      return NextResponse.json(
        { error: 'Nenhuma medição pendente para faturar' },
        { status: 400 }
      )
    }

    const body = await req.json()

    // Calcula totais
    const totalAmount = medicoesPendentes.reduce((s, m) => s + m.amount, 0)
    const totalHoras = medicoesPendentes.reduce((s, m) => s + (m.hoursWorked ?? 0), 0)
    const totalDias = medicoesPendentes.reduce((s, m) => s + (m.daysWorked ?? 0), 0)
    const periodStart = medicoesPendentes[0].measureDate
    const periodEnd = medicoesPendentes[medicoesPendentes.length - 1].measureDate

    // Gera número da fatura
    const count = await prisma.invoice.count({
      where: { userId: session.user.id }
    })
    const invoiceNumber = `INV-${String(count + 1).padStart(5, '0')}`

    // Cria a fatura
    const invoice = await prisma.invoice.create({
      data: {
        userId: session.user.id,
        invoiceNumber,
        clienteNome: contrato.clienteNome,
        clienteEmail: contrato.clienteEmail || null,
        clienteTel: contrato.clienteTel || null,
        clienteCnpjCpf: contrato.clienteCnpjCpf || null,
        dueDate: body.dueDate ? new Date(body.dueDate) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        amount: totalAmount,
        taxAmount: 0,
        totalAmount,
        notes: `Contrato ${contrato.contractNumber} — ${contrato.equipment.name}\n` +
          `Período: ${periodStart.toLocaleDateString('pt-BR')} a ${periodEnd.toLocaleDateString('pt-BR')}\n` +
          (totalHoras > 0 ? `Total de horas: ${totalHoras}h\n` : '') +
          (totalDias > 0 ? `Total de diárias: ${totalDias}\n` : '') +
          `Medições: ${medicoesPendentes.length}`,
        status: 'draft',
      }
    })

    // Cria o ContractInvoice
    const contractInvoice = await prisma.contractInvoice.create({
      data: {
        userId: session.user.id,
        contractId: params.id,
        periodStart,
        periodEnd,
        totalMeasured: contrato.billingType === 'hourly' ? totalHoras : totalDias,
        totalAmount,
        invoiceId: invoice.id,
        status: 'draft',
      }
    })

    // Marca medições como faturadas
    await prisma.measurement.updateMany({
      where: {
        contractId: params.id,
        userId: session.user.id,
        status: 'pending',
      },
      data: { status: 'invoiced' }
    })

    // Monta WhatsApp
    let whatsappUrl = null
    if (contrato.clienteTel) {
      const tel = contrato.clienteTel.replace(/\D/g, '')
      const tipo = contrato.billingType === 'hourly'
        ? `${totalHoras}h trabalhadas`
        : `${totalDias} diária(s)`
      const mensagem = encodeURIComponent(
        `Olá ${contrato.clienteNome}! Segue a fatura do contrato ${contrato.contractNumber}.\n\n` +
        `🏗️ Equipamento: ${contrato.equipment.name}\n` +
        `📅 Período: ${periodStart.toLocaleDateString('pt-BR')} a ${periodEnd.toLocaleDateString('pt-BR')}\n` +
        `⏱️ ${tipo}\n` +
        `💰 Total: R$ ${totalAmount.toFixed(2)}\n` +
        `📄 Fatura: ${invoiceNumber}\n\n` +
        `Vencimento: ${new Date(invoice.dueDate).toLocaleDateString('pt-BR')}`
      )
      whatsappUrl = `https://wa.me/55${tel}?text=${mensagem}`
    }

    return NextResponse.json({
      invoice,
      contractInvoice,
      whatsappUrl,
      totalAmount,
      medicoesFaturadas: medicoesPendentes.length,
    }, { status: 201 })
  } catch (error) {
    console.error('[POST /api/contratos/[id]/faturar]', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
