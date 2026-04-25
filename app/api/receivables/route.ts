// app/api/receivables/route.ts
// Gera boleto ou PIX via Asaas e salva no banco

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { criarOuBuscarCliente, criarCobranca, buscarQrCodePix } from '@/lib/asaas'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const receivables = await prisma.receivable.findMany({
      where: { userId: session.user.id },
      include: {
        invoice: {
          select: { invoiceNumber: true, totalAmount: true }
        },
        bankAccount: {
          select: { bankName: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(receivables)
  } catch (error) {
    console.error('[GET /api/receivables]', error)
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

    // Valida campos obrigatórios
    if (!body.clienteNome || !body.clienteCnpjCpf || !body.amount || !body.dueDate || !body.paymentMethod) {
      return NextResponse.json(
        { error: 'Campos obrigatórios: clienteNome, clienteCnpjCpf, amount, dueDate, paymentMethod' },
        { status: 400 }
      )
    }

    // Cria ou busca cliente no Asaas
    const clienteResult = await criarOuBuscarCliente({
      name: body.clienteNome,
      cpfCnpj: body.clienteCnpjCpf.replace(/\D/g, ''),
      email: body.clienteEmail || undefined,
      phone: body.clienteTel || undefined,
    })

    if (clienteResult.error || !clienteResult.customer) {
      return NextResponse.json(
        { error: clienteResult.error || 'Erro ao criar cliente no Asaas' },
        { status: 422 }
      )
    }

    const asaasCustomerId = clienteResult.customer.id

    // Cria a cobrança no Asaas
    const cobrancaResult = await criarCobranca({
      customer: asaasCustomerId,
      billingType: body.paymentMethod === 'pix' ? 'PIX' : 'BOLETO',
      value: body.amount,
      dueDate: body.dueDate, // YYYY-MM-DD
      description: body.description || `Cobrança GrúaOS - ${body.clienteNome}`,
      externalReference: body.invoiceId || undefined,
      fine: { value: 2 },       // 2% de multa
      interest: { value: 1 },   // 1% de juros ao mês
    })

    if (cobrancaResult.error || !cobrancaResult.payment) {
      return NextResponse.json(
        { error: cobrancaResult.error || 'Erro ao criar cobrança no Asaas' },
        { status: 422 }
      )
    }

    const payment = cobrancaResult.payment

    // Busca QR Code se for PIX
    let pixQrcode = null
    let pixKey = null
    if (body.paymentMethod === 'pix') {
      const qrResult = await buscarQrCodePix(payment.id)
      if (qrResult.qrCode) {
        pixQrcode = qrResult.qrCode.encodedImage || null
        pixKey = qrResult.qrCode.payload || null
      }
    }

    // Salva o receivable no banco
    const receivable = await prisma.receivable.create({
      data: {
        userId: session.user.id,
        invoiceId: body.invoiceId || null,
        clienteNome: body.clienteNome,
        clienteCnpjCpf: body.clienteCnpjCpf,
        paymentMethod: body.paymentMethod,
        amount: body.amount,
        dueDate: new Date(body.dueDate),
        externalId: payment.id,
        barcode: payment.bankSlipUrl || null,
        pixKey: pixKey,
        pixQrcode: pixQrcode,
        paymentUrl: payment.invoiceUrl || null,
        status: 'pending',
        fineAmount: 0,
        interestAmount: 0,
        discountAmount: 0,
      }
    })

    // Monta link do WhatsApp
    let whatsappUrl = null
    if (body.clienteTel) {
      const tel = body.clienteTel.replace(/\D/g, '')
      const metodo = body.paymentMethod === 'pix' ? 'PIX' : 'Boleto'
      const mensagem = encodeURIComponent(
        `Olá ${body.clienteNome}! Segue seu ${metodo} GrúaOS.\n\n` +
        `Valor: R$ ${body.amount.toFixed(2)}\n` +
        `Vencimento: ${new Date(body.dueDate).toLocaleDateString('pt-BR')}\n` +
        (payment.invoiceUrl ? `\nLink: ${payment.invoiceUrl}` : '')
      )
      whatsappUrl = `https://wa.me/55${tel}?text=${mensagem}`
    }

    return NextResponse.json({ receivable, whatsappUrl }, { status: 201 })
  } catch (error) {
    console.error('[POST /api/receivables]', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
