'use client'

import { useEffect, useState } from 'react'
import { InsightCard } from '@/components/InsightCard'
import { formatCurrency } from '@/lib/utils'
import { RefreshCw, TrendingUp, TrendingDown } from 'lucide-react'

interface Insight {
  id: string
  type: 'warning' | 'opportunity' | 'info' | 'success'
  title: string
  description: string
  action?: string
  actionUrl?: string
  whatsappUrl?: string
  value?: number
  priority: number
}

interface Kpis {
  receitaMesAtual: number
  receitaMesAnterior: number
  variacaoReceita: number
  equipamentosDisponiveis: number
  equipamentosEmUso: number
  equipamentosManutencao: number
  taxaOcupacao: number
  osAtivas: number
  faturasVencidas: number
  totalVencido: number
  alertasManutencao: number
}

export default function BiPage() {
  const [insights, setInsights] = useState<Insight[]>([])
  const [kpis, setKpis] = useState<Kpis | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  async function fetchInsights() {
    setLoading(true)
    try {
      const res = await fetch('/api/bi/insights')
      const data = await res.json()
      setInsights(data.insights ?? [])
      setKpis(data.kpis ?? null)
      setLastUpdate(new Date())
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInsights()
  }, [])

  const warnings = insights.filter(i => i.type === 'warning')
  const opportunities = insights.filter(i => i.type === 'opportunity')
  const successes = insights.filter(i => i.type === 'success')

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inteligência</h1>
          <p className="text-sm text-gray-500 mt-1">
            Insights e sugestões automáticas
          </p>
        </div>
        <button
          onClick={fetchInsights}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          Atualizar
        </button>
      </div>

      {/* KPIs */}
      {kpis && (
        <div className="space-y-3">
          {/* Receita */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Receita este mês
              </p>
              <div className={`flex items-center gap-1 text-xs font-bold ${
                kpis.variacaoReceita >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {kpis.variacaoReceita >= 0
                  ? <TrendingUp className="h-3.5 w-3.5" />
                  : <TrendingDown className="h-3.5 w-3.5" />
                }
                {Math.abs(kpis.variacaoReceita).toFixed(0)}% vs mês anterior
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(kpis.receitaMesAtual)}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Mês anterior: {formatCurrency(kpis.receitaMesAnterior)}
            </p>
          </div>

          {/* Grid de KPIs */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-xl border border-blue-200 p-4">
              <p className="text-xs text-blue-600 uppercase tracking-wide">Taxa Ocupação</p>
              <p className="text-2xl font-bold text-blue-700 mt-1">{kpis.taxaOcupacao}%</p>
              <p className="text-xs text-gray-400 mt-0.5">
                {kpis.equipamentosEmUso} em uso · {kpis.equipamentosDisponiveis} livres
              </p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-xs text-gray-500 uppercase tracking-wide">OS Ativas</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{kpis.osAtivas}</p>
              <p className="text-xs text-gray-400 mt-0.5">ordens em andamento</p>
            </div>
            {kpis.totalVencido > 0 && (
              <div className="bg-white rounded-xl border border-red-200 p-4">
                <p className="text-xs text-red-500 uppercase tracking-wide">Vencido</p>
                <p className="text-xl font-bold text-red-600 mt-1">
                  {formatCurrency(kpis.totalVencido)}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {kpis.faturasVencidas} fatura(s)
                </p>
              </div>
            )}
            {kpis.alertasManutencao > 0 && (
              <div className="bg-white rounded-xl border border-orange-200 p-4">
                <p className="text-xs text-orange-600 uppercase tracking-wide">Manutenção</p>
                <p className="text-2xl font-bold text-orange-700 mt-1">
                  {kpis.alertasManutencao}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">alerta(s) vencido(s)</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="text-center py-12 text-gray-400">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-3 text-gray-300" />
          <p className="text-sm">Analisando seus dados...</p>
        </div>
      )}

      {/* Insights */}
      {!loading && insights.length === 0 && (
        <div className="text-center py-12 text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
          <p className="text-4xl mb-3">🎯</p>
          <p className="text-sm font-medium">Tudo em ordem!</p>
          <p className="text-xs mt-1">Nenhum insight pendente no momento.</p>
        </div>
      )}

      {!loading && warnings.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs font-bold text-red-600 uppercase tracking-wide flex items-center gap-1.5">
            ⚠️ Atenção Necessária ({warnings.length})
          </p>
          {warnings.map(i => <InsightCard key={i.id} insight={i} />)}
        </div>
      )}

      {!loading && opportunities.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs font-bold text-orange-600 uppercase tracking-wide flex items-center gap-1.5">
            💡 Oportunidades ({opportunities.length})
          </p>
          {opportunities.map(i => <InsightCard key={i.id} insight={i} />)}
        </div>
      )}

      {!loading && successes.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs font-bold text-green-600 uppercase tracking-wide flex items-center gap-1.5">
            🎉 Conquistas ({successes.length})
          </p>
          {successes.map(i => <InsightCard key={i.id} insight={i} />)}
        </div>
      )}

      {lastUpdate && (
        <p className="text-xs text-gray-400 text-center">
          Atualizado às {lastUpdate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
        </p>
      )}
    </div>
  )
}
