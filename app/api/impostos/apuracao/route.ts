import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const competencia = searchParams.get('competencia')
  const ano = searchParams.get('ano')

  try {
    if (competencia) {
      const apuration = await prisma.taxApuration.findUnique({
        where: { competencia },
        include: { pagamentos: { orderBy: { vencimento: 'asc' } } },
      })
      return NextResponse.json(apuration)
    }

    const where = ano ? { competencia: { startsWith: ano } } : {}

    const apurations = await prisma.taxApuration.findMany({
      where,
      orderBy: { competencia: 'desc' },
      select: {
        id: true,
        competencia: true,
        regime: true,
        faturamentoBruto: true,
        totalImpostos: true,
        totalPago: true,
        totalPendente: true,
        status: true,
      },
    })

    return NextResponse.json(apurations)
  } catch (error) {
    console.error('Erro ao buscar apurações:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { competencia, faturamentoBruto, deducoes, folhaPagamento, observacoes } = body

    const settings = await prisma.taxSettings.findFirst({ where: { ativo: true } })
    if (!settings) {
      return NextResponse.json({ error: 'Configure as alíquotas primeiro' }, { status: 400 })
    }

    const fat = parseFloat(faturamentoBruto) || 0
    const ded = parseFloat(deducoes) || 0
    const folha = parseFloat(folhaPagamento) || 0
    const fatLiq = fat - ded

    const [ano, mes] = competencia.split('-').map(Number)
    const vencSimples = new Date(ano, mes, 20)
    const vencISS = new Date(ano, mes, 10)
    const vencIRPJ = new Date(ano, mes, 31)
    const vencPISCOFINS = new Date(ano, mes, 25)
    const vencINSS = new Date(ano, mes, 20)
    const vencFGTS = new Date(ano, mes, 7)

    let calcData: Record<string, unknown> = {
      competencia,
      regime: settings.regime,
      faturamentoBruto: fat,
      deducoes: ded,
      faturamentoLiquido: fatLiq,
      folhaPagamento: folha,
      observacoes,
      status: 'APURADO',
    }

    let totalImpostos = 0

    if (settings.regime === 'SIMPLES_NACIONAL') {
      const dozeAtras = `${mes <= 1 ? ano - 1 : ano}-${String(mes <= 1 ? 12 + mes - 1 : mes - 1).padStart(2, '0')}`

      const historico = await prisma.taxApuration.findMany({
        where: { competencia: { lte: dozeAtras }, regime: 'SIMPLES_NACIONAL' },
        orderBy: { competencia: 'desc' },
        take: 12,
        select: { faturamentoBruto: true },
      })

      const rb12 = historico.reduce((sum, a) => sum + Number(a.faturamentoBruto), 0) + fat

      let aliquotaNominal = 0.06
      let pd = 0

      if (rb12 <= 180000) { aliquotaNominal = 0.06; pd = 0 }
      else if (rb12 <= 360000) { aliquotaNominal = 0.112; pd = 9360 }
      else if (rb12 <= 720000) { aliquotaNominal = 0.135; pd = 17640 }
      else if (rb12 <= 1800000) { aliquotaNominal = 0.16; pd = 35640 }
      else if (rb12 <= 3600000) { aliquotaNominal = 0.21; pd = 125640 }
      else { aliquotaNominal = 0.33; pd = 648000 }

      const aliquotaEfetiva = rb12 > 0 ? (rb12 * aliquotaNominal - pd) / rb12 : aliquotaNominal
      const simplesValor = fat * aliquotaEfetiva

      totalImpostos += simplesValor

      calcData = {
        ...calcData,
        simplesReceitaBruta12m: rb12,
        simplesAliquotaEfetiva: aliquotaEfetiva,
        simplesValor,
        simplesVencimento: vencSimples,
      }
    } else if (settings.regime === 'LUCRO_PRESUMIDO') {
      const issBase = fatLiq
      const issValor = issBase * Number(settings.issAliquota || 0.05)

      const irpjBase = fatLiq * Number(settings.irpjPercentualPresuncao || 0.08)
      const irpjValor = irpjBase * Number(settings.irpjAliquota || 0.15)
      const adicionalBase = Math.max(0, irpjBase - Number(settings.irpjAdicionalLimite || 20000) * 3)
      const irpjAdicional = adicionalBase * Number(settings.irpjAdicionalAliquota || 0.10)
      const irpjTotal = irpjValor + irpjAdicional

      const csllBase = fatLiq * Number(settings.csllPercentualPresuncao || 0.12)
      const csllValor = csllBase * Number(settings.csllAliquota || 0.09)

      const pisBase = fatLiq
      const pisValor = pisBase * Number(settings.pisAliquota || 0.0065)

      const cofinsBase = fatLiq
      const cofinsValor = cofinsBase * Number(settings.cofinsAliquota || 0.03)

      totalImpostos += issValor + irpjTotal + csllValor + pisValor + cofinsValor

      calcData = {
        ...calcData,
        issBase, issValor, issVencimento: vencISS,
        irpjBase, irpjValor, irpjAdicional, irpjTotal, irpjVencimento: vencIRPJ,
        csllBase, csllValor, csllVencimento: vencIRPJ,
        pisBase, pisValor, pisVencimento: vencPISCOFINS,
        cofinsBase, cofinsValor, cofinsVencimento: vencPISCOFINS,
      }
    }

    if (folha > 0) {
      const patronal = folha * Number(settings.inssAliquotaPatronal || 0.20)
      const rat = folha * Number(settings.inssRatAliquota || 0.03) * Number(settings.inssFap || 1.0)
      const terceiros = folha * Number(settings.inssTermceirosAliquota || 0.058)
      const inssTotal = patronal + rat + terceiros
      const fgtsValor = folha * Number(settings.fgtsAliquota || 0.08)

      totalImpostos += inssTotal + fgtsValor

      calcData = {
        ...calcData,
        inssBaaseFolha: folha,
        inssPatronalValor: patronal,
        inssRatValor: rat,
        inssTermceirosValor: terceiros,
        inssTotal,
        inssVencimento: vencINSS,
        fgtsBase: folha,
        fgtsValor,
        fgtsVencimento: vencFGTS,
      }
    }

    calcData.totalImpostos = totalImpostos
    calcData.totalPago = 0
    calcData.totalPendente = totalImpostos

    const existing = await prisma.taxApuration.findUnique({ where: { competencia } })
    let apuration

    if (existing) {
      apuration = await prisma.taxApuration.update({
        where: { competencia },
        data: calcData as Parameters<typeof prisma.taxApuration.update>[0]['data'],
        include: { pagamentos: true },
      })
    } else {
      apuration = await prisma.taxApuration.create({
        data: calcData as Parameters<typeof prisma.taxApuration.create>[0]['data'],
        include: { pagamentos: true },
      })
    }

    return NextResponse.json(apuration, { status: existing ? 200 : 201 })
  } catch (error) {
    console.error('Erro ao apurar impostos:', error)
    return NextResponse.json({ error: 'Erro ao calcular apuração' }, { status: 500 })
  }
}
