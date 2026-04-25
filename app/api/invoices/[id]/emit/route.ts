// app/api/invoices/[id]/emit/route.ts
// Emite a NFS-e de uma fatura e envia por WhatsApp

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { emitirNfse } from '@/lib/nfeio'

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    // Busca a fatura
    const invoice = await prisma.invoice.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
      include: {
        municipalityConfig: {
          include: { provider: true }
        }
      }
    })

    if (!invoice) {
      return NextResponse.json({ error: 'Fatura não encontrada' }, { status: 404 })
    }

    if (invoice.status === 'emitted') {
      return NextResponse.json({ error: 'NFS-e já emitida' }, { status: 400 })
    }

    if (!invoice.municipalityConfigId) {
      return NextResponse.json(
        { error: 'Configure o município antes de emitir a NFS-e' },
        { status: 400 }
      )
    }

    if (!invoice.clienteCnpjCpf) {
      return NextResponse.json(
        { error: 'CPF/CNPJ do cliente é obrigatório para emitir NFS-e' },
        { status: 400 }
      )
    }

    // Atualiza status para emissão em andamento
    await prisma.invoice.update({
      where: { id: invoice.id },
      data: { status: 'pending_emission' }
    })

    // Busca o companyId do NFE.io nas credenciais do município
    const credentials = invoice.municipalityConfig?.providerCredentials as any
    const companyId = credentials?.companyId

    if (!companyId) {
      await prisma.invoice.update({
        where: { id: invoice.id },
        data: {
          status: 'error',
          errorMessage: 'companyId do NFE.io não configurado'
        }
      })
      return NextResponse.json(
        { error: 'Configuração do NFE.io incompleta' },
        { status: 400 }
      )
    }

    // Emite a NFS-e
    const resultado = await emitirNfse(companyId, {
      cityServiceCode: invoice.municipalityConfig?.serviceCode || '07.09',
      description: `Locação de guindaste - OS referente à fatura ${invoice.invoiceNumber}`,
      servicesAmount: invoice.amount,
      borrower: {
        name: invoice.clienteNome,
        email: invoice.clienteEmail || undefined,
        federalTaxNumber: invoice.clienteCnpjCpf.replace(/\D/g, ''),
      }
    })

    if (resultado.error) {
      await prisma.invoice.update({
        where: { id: invoice.id },
        data: {
          status: 'error',
          errorMessage: resultado.error
        }
      })
      return NextResponse.json({ error: resultado.error }, { status: 422 })
    }

    // Salva os dados da NFS-e emitida
    const nfse = resultado.serviceInvoice!
    const invoiceAtualizada = await prisma.invoice.update({
      where: { id: invoice.id },
      data: {
        status: 'emitted',
        nfseNumber: nfse.number,
        nfseVerificationCode: nfse.checkCode,
        nfsePdfUrl: nfse.pdfUrl || null,
        providerProtocol: nfse.id,
        providerResponse: nfse as any,
        emittedAt: new Date(),
        errorMessage: null,
      }
    })

    // Monta link do WhatsApp se tiver telefone
    let whatsappUrl = null
    if (invoice.clienteTel) {
      const tel = invoice.clienteTel.replace(/\D/g, '')
      const mensagem = encodeURIComponent(
        `Olá ${invoice.clienteNome}! Segue sua NFS-e referente à fatura ${invoice.invoiceNumber}.\n\n` +
        `Valor: R$ ${invoice.totalAmount.toFixed(2)}\n` +
        (nfse.pdfUrl ? `PDF: ${nfse.pdfUrl}` : `Código de verificação: ${nfse.checkCode}`)
      )
      whatsappUrl = `https://wa.me/55${tel}?text=${mensagem}`
    }

    return NextResponse.json({
      invoice: invoiceAtualizada,
      whatsappUrl,
      nfse: resultado.serviceInvoice
    })
  } catch (error) {
    console.error('[POST /api/invoices/[id]/emit]', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
