import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    let settings = await prisma.taxSettings.findFirst({
      where: { ativo: true },
      orderBy: { createdAt: 'asc' },
    })

    if (!settings) {
      settings = await prisma.taxSettings.create({
        data: {
          id: 'default-tax-settings',
          regime: 'SIMPLES_NACIONAL',
          simplesAnexo: 'III',
          simplesAliquotaNominal: 0.06,
          issAliquota: 0.05,
          issCodigoServico: '7.09',
        },
      })
    }

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Erro ao buscar configurações fiscais:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()

    const existing = await prisma.taxSettings.findFirst({
      where: { ativo: true },
    })

    let settings
    if (existing) {
      settings = await prisma.taxSettings.update({
        where: { id: existing.id },
        data: {
          regime: body.regime,
          simplesAnexo: body.simplesAnexo,
          simplesAliquotaNominal: body.simplesAliquotaNominal ? parseFloat(body.simplesAliquotaNominal) : undefined,
          simplesFatorReducao: body.simplesFatorReducao ? parseFloat(body.simplesFatorReducao) : undefined,
          issAliquota: body.issAliquota ? parseFloat(body.issAliquota) : undefined,
          issMunicipio: body.issMunicipio,
          issCodigoServico: body.issCodigoServico,
          irpjPercentualPresuncao: body.irpjPercentualPresuncao ? parseFloat(body.irpjPercentualPresuncao) : undefined,
          irpjAliquota: body.irpjAliquota ? parseFloat(body.irpjAliquota) : undefined,
          irpjAdicionalAliquota: body.irpjAdicionalAliquota ? parseFloat(body.irpjAdicionalAliquota) : undefined,
          irpjAdicionalLimite: body.irpjAdicionalLimite ? parseFloat(body.irpjAdicionalLimite) : undefined,
          csllPercentualPresuncao: body.csllPercentualPresuncao ? parseFloat(body.csllPercentualPresuncao) : undefined,
          csllAliquota: body.csllAliquota ? parseFloat(body.csllAliquota) : undefined,
          pisRegime: body.pisRegime,
          pisAliquota: body.pisAliquota ? parseFloat(body.pisAliquota) : undefined,
          cofinsRegime: body.cofinsRegime,
          cofinsAliquota: body.cofinsAliquota ? parseFloat(body.cofinsAliquota) : undefined,
          inssAliquotaPatronal: body.inssAliquotaPatronal ? parseFloat(body.inssAliquotaPatronal) : undefined,
          inssRatAliquota: body.inssRatAliquota ? parseFloat(body.inssRatAliquota) : undefined,
          inssFap: body.inssFap ? parseFloat(body.inssFap) : undefined,
          inssTermceirosAliquota: body.inssTermceirosAliquota ? parseFloat(body.inssTermceirosAliquota) : undefined,
          fgtsAliquota: body.fgtsAliquota ? parseFloat(body.fgtsAliquota) : undefined,
        },
      })
    } else {
      settings = await prisma.taxSettings.create({ data: body })
    }

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Erro ao salvar configurações fiscais:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
