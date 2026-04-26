// app/api/bi/insights/route.ts
// Motor de inteligência — gera insights e sugestões automáticas

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const userId = session.user.id
    const now = new Date()
    const mesAtual = new Date(now.getFullYear(), now.getMonth(), 1)
    const mesAnterior = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const fimMesAnterior = new Date(now.getFullYear(), now.getMonth(), 0)
    const trintaDiasAtras = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    const seteDiasAtras = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    // Busca dados em paralelo
    const [
      equipamentos,
      osAtivas,
      faturasVencidas,
      faturaMesAtual,
      faturaMesAnterior,
      alertasManutencao,
      contratosPendentes,
      clientesRecentes,
    ] = await Promise.all([
      prisma.equipment.findMany({
        where: { userId },
        include: {
          bookings: {
            where: { endDate: { gte: trintaDiasAtras } },
            orderBy: { endDate: 'desc' },
            take: 1,
          },
          serviceOrders: {
            where: { status: { in: ['pending', 'confirmed', 'in_progress'] } },
            take: 1,
          },
          maintenanceAlerts: {
            where: { status: 'pending' },
            take: 1,
          },
        },
      }),
      prisma.serviceOrder.count({
        where: { userId, status: { in: ['pending', 'confirmed', 'in_progress'] } }
      }),
      prisma.invoice.findMany({
        where: { userId, status: 'sent', dueDate: { lt: now } },
        orderBy: { dueDate: 'asc' },
        take: 5,
      }),
      prisma.invoice.aggregate({
        where: { userId, issueDate: { gte: mesAtual } },
        _sum: { totalAmount: true },
      }),
      prisma.invoice.aggregate({
        where: { userId, issueDate: { gte: mesAnterior, lte: fimMesAnterior } },
        _sum: { totalAmount: true },
      }),
      prisma.maintenanceAlert.findMany({
        where: { userId, status: 'pending', alertType: 'overdue' },
        include: { equipment: { select: { name: true } } },
        take: 3,
      }),
      prisma.contract.findMany({
        where: { userId, status: 'active' },
        include: {
          measurements: { where: { status: 'pending' } },
        },
      }),
      prisma.serviceOrder.groupBy({
        by: ['clienteNome'],
        where: { userId, createdAt: { gte: trintaDiasAtras } },
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
        take: 5,
      }),
    ])

    const insights: Array<{
      id: string
      type: 'warning' | 'opportunity' | 'info' | 'success'
      title: string
      description: string
      action?: string
      actionUrl?: string
      whatsappUrl?: string
      value?: number
      priority: number
    }> = []

    // 1. Equipamentos ociosos
    for (const eq of equipamentos) {
      const temOSAtiva = eq.serviceOrders.length > 0
      const temContrato = await prisma.contract.findFirst({
        where: { equipmentId: eq.id, status: 'active' }
      })

      if (!temOSAtiva && !temContrato && eq.status === 'available') {
        const ultimaLocacao = eq.bookings[0]
        const diasOcioso = ultimaLocacao
          ? Math.floor((now.getTime() - ultimaLocacao.endDate.getTime()) / (1000 * 60 * 60 * 24))
          : null

        if (diasOcioso !== null && diasOcioso >= 5) {
          // Busca clientes que locaram este equipamento
          const clientesQueUsaram = await prisma.serviceOrder.findMany({
            where: { equipmentId: eq.id, userId },
            select: { clienteNome: true, clienteTel: true },
            distinct: ['clienteNome'],
            take: 3,
          })

          const primeiroCliente = clientesQueUsaram[0]
          let whatsappUrl = null
          if (primeiroCliente?.clienteTel) {
            const tel = primeiroCliente.clienteTel.replace(/\D/g, '')
            const mensagem = encodeURIComponent(
              `Olá ${primeiroCliente.clienteNome}! Temos o ${eq.name} disponível para locação. ` +
              `Gostaria de verificar disponibilidade para seu próximo projeto?`
            )
            whatsappUrl = `https://wa.me/55${tel}?text=${mensagem}`
          }

          insights.push({
            id: `ocioso_${eq.id}`,
            type: 'opportunity',
            title: `${eq.name} ocioso há ${diasOcioso} dias`,
            description: clientesQueUsaram.length > 0
              ? `${clientesQueUsaram.length} cliente(s) já locaram este equipamento. Envie uma oferta pelo WhatsApp!`
              : 'Este equipamento está disponível e sem locação agendada.',
            action: whatsappUrl ? 'Enviar oferta' : 'Ver frota',
            actionUrl: `/frota/${eq.id}`,
            whatsappUrl,
            priority: diasOcioso >= 15 ? 1 : 2,
          })
        }
      }
    }

    // 2. Faturas vencidas
    if (faturasVencidas.length > 0) {
      const totalVencido = faturasVencidas.reduce((s, f) => s + f.totalAmount, 0)
      insights.push({
        id: 'faturas_vencidas',
        type: 'warning',
        title: `${faturasVencidas.length} fatura(s) vencida(s)`,
        description: `Total de R$ ${totalVencido.toFixed(2)} em atraso. Faça a cobrança agora.`,
        action: 'Ver faturas',
        actionUrl: '/faturas?status=sent',
        value: totalVencido,
        priority: 1,
      })
    }

    // 3. Comparativo mensal
    const receitaAtual = faturaMesAtual._sum.totalAmount ?? 0
    const receitaAnterior = faturaMesAnterior._sum.totalAmount ?? 0
    if (receitaAnterior > 0) {
      const variacao = ((receitaAtual - receitaAnterior) / receitaAnterior) * 100
      if (variacao <= -20) {
        insights.push({
          id: 'receita_baixa',
          type: 'warning',
          title: `Receita ${Math.abs(variacao).toFixed(0)}% abaixo do mês anterior`,
          description: `Mês atual: R$ ${receitaAtual.toFixed(2)} vs R$ ${receitaAnterior.toFixed(2)} no mês passado.`,
          action: 'Ver financeiro',
          actionUrl: '/financeiro',
          value: variacao,
          priority: 2,
        })
      } else if (variacao >= 20) {
        insights.push({
          id: 'receita_alta',
          type: 'success',
          title: `Receita ${variacao.toFixed(0)}% acima do mês anterior! 🎉`,
          description: `Mês atual: R$ ${receitaAtual.toFixed(2)} vs R$ ${receitaAnterior.toFixed(2)} no mês passado.`,
          action: 'Ver financeiro',
          actionUrl: '/financeiro',
          value: variacao,
          priority: 3,
        })
      }
    }

    // 4. Alertas de manutenção vencidos
    if (alertasManutencao.length > 0) {
      insights.push({
        id: 'manutencao_vencida',
        type: 'warning',
        title: `${alertasManutencao.length} manutenção(ões) vencida(s)`,
        description: alertasManutencao.map(a => a.equipment.name).join(', ') + ' — equipamentos bloqueados para locação.',
        action: 'Resolver agora',
        actionUrl: '/manutencao?aba=alertas',
        priority: 1,
      })
    }

    // 5. Contratos com medições pendentes
    const contratosFaturar = contratosPendentes.filter(c => c.measurements.length > 0)
    if (contratosFaturar.length > 0) {
      const totalPendente = contratosFaturar.reduce(
        (s, c) => s + c.measurements.reduce((ms, m) => ms + m.amount, 0), 0
      )
      insights.push({
        id: 'contratos_pendentes',
        type: 'opportunity',
        title: `R$ ${totalPendente.toFixed(2)} para faturar em contratos`,
        description: `${contratosFaturar.length} contrato(s) com medições pendentes de faturamento.`,
        action: 'Faturar agora',
        actionUrl: '/contratos',
        value: totalPendente,
        priority: 2,
      })
    }

    // 6. Clientes frequentes — sugerir contrato
    for (const cliente of clientesRecentes) {
      if (cliente._count.id >= 3) {
        insights.push({
          id: `cliente_frequente_${cliente.clienteNome}`,
          type: 'opportunity',
          title: `${cliente.clienteNome} fez ${cliente._count.id} locações este mês`,
          description: 'Cliente frequente! Considere propor um contrato mensal com desconto.',
          action: 'Criar contrato',
          actionUrl: '/contratos/novo',
          priority: 3,
        })
      }
    }

    // Ordena por prioridade
    insights.sort((a, b) => a.priority - b.priority)

    // KPIs resumidos
    const kpis = {
      receitaMesAtual: receitaAtual,
      receitaMesAnterior: receitaAnterior,
      variacaoReceita: receitaAnterior > 0
        ? ((receitaAtual - receitaAnterior) / receitaAnterior) * 100
        : 0,
      equipamentosDisponiveis: equipamentos.filter(e => e.status === 'available').length,
      equipamentosEmUso: equipamentos.filter(e => e.status === 'in_use').length,
      equipamentosManutencao: equipamentos.filter(e => e.status === 'maintenance').length,
      taxaOcupacao: equipamentos.length > 0
        ? Math.round((equipamentos.filter(e => e.status === 'in_use').length / equipamentos.length) * 100)
        : 0,
      osAtivas,
      faturasVencidas: faturasVencidas.length,
      totalVencido: faturasVencidas.reduce((s, f) => s + f.totalAmount, 0),
      alertasManutencao: alertasManutencao.length,
    }

    return NextResponse.json({ insights, kpis })
  } catch (error) {
    console.error('[GET /api/bi/insights]', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
