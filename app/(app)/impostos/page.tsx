'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Calculator,
  Settings,
  CreditCard,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  ChevronRight,
  Plus,
  RefreshCw,
  Building2,
  FileText,
  DollarSign,
  Calendar,
  X,
  Save,
  Edit2,
} from 'lucide-react'

interface TaxSettings {
  id: string
  regime: string
  simplesAnexo: string
  simplesAliquotaNominal: string
  issAliquota: string
  issMunicipio: string
  issCodigoServico: string
  irpjPercentualPresuncao: string
  irpjAliquota: string
  irpjAdicionalAliquota: string
  irpjAdicionalLimite: string
  csllPercentualPresuncao: string
  csllAliquota: string
  pisRegime: string
  pisAliquota: string
  cofinsRegime: string
  cofinsAliquota: string
  inssAliquotaPatronal: string
  inssRatAliquota: string
  inssFap: string
  inssTermceirosAliquota: string
  fgtsAliquota: string
}

interface TaxApuration {
  id: string
  competencia: string
  regime: string
  faturamentoBruto: string
  totalImpostos: string
  totalPago: string
  totalPendente: string
  status: string
  simplesValor?: string
  simplesAliquotaEfetiva?: string
  issValor?: string
  irpjTotal?: string
  csllValor?: string
  pisValor?: string
  cofinsValor?: string
  inssTotal?: string
  fgtsValor?: string
  simplesVencimento?: string
  issVencimento?: string
  irpjVencimento?: string
  pisVencimento?: string
  inssVencimento?: string
  fgtsVencimento?: string
  pagamentos?: TaxPayment[]
}

interface TaxPayment {
  id: string
  competencia: string
  tributo: string
  descricao: string
  valor: string
  vencimento: string
  dataPagamento?: string
  status: string
  numeroGuia?: string
  banco?: string
}

const fmt = (v: string | number | undefined) => {
  if (v === undefined || v === null) return 'R$ 0,00'
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(v))
}

const fmtPct = (v: string | number | undefined) => {
  if (!v) return '0,00%'
  return (Number(v) * 100).toFixed(2).replace('.', ',') + '%'
}

const fmtDate = (d?: string) => {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('pt-BR')
}

const competenciaLabel = (c: string) => {
  const [y, m] = c.split('-')
  const months = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez']
  return `${months[parseInt(m) - 1]}/${y}`
}

const statusColor = (s: string) => {
  switch (s) {
    case 'QUITADO': return 'text-emerald-400 bg-emerald-400/10'
    case 'PARCIALMENTE_PAGO': return 'text-amber-400 bg-amber-400/10'
    case 'APURADO': return 'text-blue-400 bg-blue-400/10'
    case 'RASCUNHO': return 'text-slate-400 bg-slate-400/10'
    case 'PAGO': return 'text-emerald-400 bg-emerald-400/10'
    case 'PENDENTE': return 'text-amber-400 bg-amber-400/10'
    case 'ATRASADO': return 'text-red-400 bg-red-400/10'
    default: return 'text-slate-400 bg-slate-400/10'
  }
}

const statusLabel = (s: string) => {
  const map: Record<string, string> = {
    QUITADO: 'Quitado', PARCIALMENTE_PAGO: 'Parcial',
    APURADO: 'Apurado', RASCUNHO: 'Rascunho',
    PAGO: 'Pago', PENDENTE: 'Pendente', ATRASADO: 'Atrasado',
  }
  return map[s] || s
}

const TRIBUTOS = ['SIMPLES','ISS','IRPJ','CSLL','PIS','COFINS','INSS','FGTS','OUTRO']

const currentCompetencia = () => {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  return `${y}-${m}`
}

function ApuracaoModal({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const [competencia, setCompetencia] = useState(currentCompetencia())
  const [faturamento, setFaturamento] = useState('')
  const [deducoes, setDeducoes] = useState('')
  const [folha, setFolha] = useState('')
  const [obs, setObs] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!faturamento) return
    setLoading(true)
    try {
      await fetch('/api/impostos/apuracao', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          competencia,
          faturamentoBruto: faturamento,
          deducoes: deducoes || '0',
          folhaPagamento: folha || '0',
          observacoes: obs,
        }),
      })
      onSaved()
      onClose()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[#1a1f2e] border border-white/10 rounded-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-white font-semibold text-lg">Nova Apuração</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X size={20} /></button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="text-slate-400 text-sm block mb-1">Competência</label>
            <input type="month" value={competencia} onChange={(e) => setCompetencia(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="text-slate-400 text-sm block mb-1">Faturamento Bruto *</label>
            <input type="number" placeholder="0,00" value={faturamento} onChange={(e) => setFaturamento(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="text-slate-400 text-sm block mb-1">Deduções</label>
            <input type="number" placeholder="0,00" value={deducoes} onChange={(e) => setDeducoes(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="text-slate-400 text-sm block mb-1">Folha de Pagamento (para INSS/FGTS)</label>
            <input type="number" placeholder="0,00" value={folha} onChange={(e) => setFolha(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="text-slate-400 text-sm block mb-1">Observações</label>
            <textarea value={obs} onChange={(e) => setObs(e.target.value)} rows={2}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500 resize-none" />
          </div>
        </div>
        <div className="p-6 border-t border-white/10 flex gap-3">
          <button onClick={onClose} className="flex-1 py-2 rounded-lg border border-white/10 text-slate-400 text-sm hover:bg-white/5">Cancelar</button>
          <button onClick={handleSubmit} disabled={loading || !faturamento}
            className="flex-1 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium disabled:opacity-50 flex items-center justify-center gap-2">
            {loading ? <RefreshCw size={14} className="animate-spin" /> : <Calculator size={14} />}
            Calcular
          </button>
        </div>
      </div>
    </div>
  )
}

function PagamentoModal({ apuration, onClose, onSaved }: { apuration: TaxApuration; onClose: () => void; onSaved: () => void }) {
  const [tributo, setTributo] = useState('SIMPLES')
  const [descricao, setDescricao] = useState('')
  const [valor, setValor] = useState('')
  const [vencimento, setVencimento] = useState('')
  const [dataPag, setDataPag] = useState('')
  const [numGuia, setNumGuia] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setLoading(true)
    try {
      await fetch('/api/impostos/pagamentos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apurationId: apuration.id,
          competencia: apuration.competencia,
          tributo,
          descricao: descricao || tributo,
          valor,
          vencimento,
          dataPagamento: dataPag || undefined,
          numeroGuia: numGuia || undefined,
        }),
      })
      onSaved()
      onClose()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[#1a1f2e] border border-white/10 rounded-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-white font-semibold text-lg">Registrar Pagamento</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X size={20} /></button>
        </div>
        <div className="p-6 space-y-4">
          <p className="text-slate-400 text-sm">Competência: <span className="text-white">{competenciaLabel(apuration.competencia)}</span></p>
          <div>
            <label className="text-slate-400 text-sm block mb-1">Tributo</label>
            <select value={tributo} onChange={(e) => setTributo(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500">
              {TRIBUTOS.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="text-slate-400 text-sm block mb-1">Descrição</label>
            <input type="text" placeholder={`Guia ${tributo}`} value={descricao} onChange={(e) => setDescricao(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-400 text-sm block mb-1">Valor</label>
              <input type="number" placeholder="0,00" value={valor} onChange={(e) => setValor(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="text-slate-400 text-sm block mb-1">Vencimento</label>
              <input type="date" value={vencimento} onChange={(e) => setVencimento(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-400 text-sm block mb-1">Data Pagamento</label>
              <input type="date" value={dataPag} onChange={(e) => setDataPag(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="text-slate-400 text-sm block mb-1">Nº da Guia</label>
              <input type="text" value={numGuia} onChange={(e) => setNumGuia(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500" />
            </div>
          </div>
        </div>
        <div className="p-6 border-t border-white/10 flex gap-3">
          <button onClick={onClose} className="flex-1 py-2 rounded-lg border border-white/10 text-slate-400 text-sm hover:bg-white/5">Cancelar</button>
          <button onClick={handleSubmit} disabled={loading || !valor || !vencimento}
            className="flex-1 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium disabled:opacity-50 flex items-center justify-center gap-2">
            {loading ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
            Salvar
          </button>
        </div>
      </div>
    </div>
  )
}

function DashboardTab({ apurations, onNovaApuracao }: { apurations: TaxApuration[]; onNovaApuracao: () => void }) {
  const anoAtual = new Date().getFullYear().toString()
  const doAno = apurations.filter((a) => a.competencia.startsWith(anoAtual))

  const totalAnual = doAno.reduce((s, a) => s + Number(a.totalImpostos), 0)
  const pagoAnual = doAno.reduce((s, a) => s + Number(a.totalPago), 0)
  const pendente = doAno.reduce((s, a) => s + Number(a.totalPendente), 0)
  const fatAnual = doAno.reduce((s, a) => s + Number(a.faturamentoBruto), 0)
  const cargaMedia = fatAnual > 0 ? (totalAnual / fatAnual) * 100 : 0

  const atrasados = apurations.filter((a) => a.status !== 'QUITADO' && Number(a.totalPendente) > 0)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Anual', value: fmt(totalAnual), icon: FileText, color: 'text-blue-400' },
          { label: 'Pago', value: fmt(pagoAnual), icon: CheckCircle, color: 'text-emerald-400' },
          { label: 'Pendente', value: fmt(pendente), icon: Clock, color: 'text-amber-400' },
          { label: 'Carga Tributária', value: `${cargaMedia.toFixed(1)}%`, icon: TrendingUp, color: 'text-purple-400' },
        ].map((k) => (
          <div key={k.label} className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <k.icon size={16} className={k.color} />
              <span className="text-slate-400 text-xs">{k.label}</span>
            </div>
            <p className={`text-xl font-bold ${k.color}`}>{k.value}</p>
          </div>
        ))}
      </div>

      {atrasados.length > 0 && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle size={18} className="text-amber-400 mt-0.5 shrink-0" />
          <div>
            <p className="text-amber-400 font-medium text-sm">Impostos pendentes</p>
            <p className="text-slate-400 text-xs mt-0.5">{atrasados.length} competência(s) com saldo a pagar totalizando {fmt(pendente)}</p>
          </div>
        </div>
      )}

      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-medium">Histórico de Apurações</h3>
          <button onClick={onNovaApuracao} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm px-3 py-1.5 rounded-lg">
            <Plus size={14} /> Nova Apuração
          </button>
        </div>

        {apurations.length === 0 ? (
          <div className="bg-white/5 border border-white/10 rounded-xl p-12 text-center">
            <Calculator size={40} className="text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400">Nenhuma apuração registrada</p>
            <button onClick={onNovaApuracao} className="mt-4 bg-blue-600 hover:bg-blue-500 text-white text-sm px-4 py-2 rounded-lg">
              Criar primeira apuração
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {apurations.map((a) => (
              <div key={a.id} className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                    <Calendar size={20} className="text-blue-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">{competenciaLabel(a.competencia)}</p>
                    <p className="text-slate-400 text-xs">{a.regime.replace('_', ' ')} • Fat. {fmt(a.faturamentoBruto)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-white font-semibold">{fmt(a.totalImpostos)}</p>
                    <p className="text-slate-400 text-xs">Pendente: {fmt(a.totalPendente)}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColor(a.status)}`}>{statusLabel(a.status)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function ApuracaoTab({ apurations, onRefresh }: { apurations: TaxApuration[]; onRefresh: () => void }) {
  const [selected, setSelected] = useState<string | null>(null)
  const [detail, setDetail] = useState<TaxApuration | null>(null)
  const [showPagModal, setShowPagModal] = useState(false)
  const [loadingDetail, setLoadingDetail] = useState(false)

  const loadDetail = async (competencia: string) => {
    setLoadingDetail(true)
    try {
      const res = await fetch(`/api/impostos/apuracao?competencia=${competencia}`)
      const data = await res.json()
      setDetail(data)
      setSelected(competencia)
    } finally {
      setLoadingDetail(false)
    }
  }

  const marcarPago = async (paymentId: string) => {
    await fetch(`/api/impostos/pagamentos/${paymentId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'PAGO', dataPagamento: new Date().toISOString().split('T')[0] }),
    })
    if (detail) loadDetail(detail.competencia)
    onRefresh()
  }

  if (!selected || !detail) {
    return (
      <div className="space-y-2">
        {apurations.length === 0 ? (
          <p className="text-slate-400 text-center py-12">Nenhuma apuração encontrada</p>
        ) : (
          apurations.map((a) => (
            <button key={a.id} onClick={() => loadDetail(a.competencia)}
              className="w-full bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-4 flex items-center justify-between text-left transition-colors">
              <div>
                <p className="text-white font-medium">{competenciaLabel(a.competencia)}</p>
                <p className="text-slate-400 text-xs mt-0.5">{a.regime.replace('_', ' ')}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColor(a.status)}`}>{statusLabel(a.status)}</span>
                <ChevronRight size={16} className="text-slate-400" />
              </div>
            </button>
          ))
        )}
      </div>
    )
  }

  const impostoRows = [
    { label: 'DAS (Simples Nacional)', valor: detail.simplesValor, venc: detail.simplesVencimento },
    { label: 'ISS', valor: detail.issValor, venc: detail.issVencimento },
    { label: 'IRPJ + Adicional', valor: detail.irpjTotal, venc: detail.irpjVencimento },
    { label: 'CSLL', valor: detail.csllValor, venc: detail.irpjVencimento },
    { label: 'PIS', valor: detail.pisValor, venc: detail.pisVencimento },
    { label: 'COFINS', valor: detail.cofinsValor, venc: detail.pisVencimento },
    { label: 'INSS Patronal + RAT + Terceiros', valor: detail.inssTotal, venc: detail.inssVencimento },
    { label: 'FGTS', valor: detail.fgtsValor, venc: detail.fgtsVencimento },
  ].filter((r) => r.valor && Number(r.valor) > 0)

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <button onClick={() => { setSelected(null); setDetail(null) }} className="text-slate-400 hover:text-white text-sm">← Voltar</button>
        <h3 className="text-white font-medium">{competenciaLabel(detail.competencia)}</h3>
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColor(detail.status)}`}>{statusLabel(detail.status)}</span>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Faturamento', value: fmt(detail.faturamentoBruto), color: 'text-blue-400' },
          { label: 'Total Impostos', value: fmt(detail.totalImpostos), color: 'text-red-400' },
          { label: 'Pendente', value: fmt(detail.totalPendente), color: 'text-amber-400' },
        ].map((k) => (
          <div key={k.label} className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
            <p className="text-slate-400 text-xs mb-1">{k.label}</p>
            <p className={`font-bold text-sm ${k.color}`}>{k.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-white/10">
          <p className="text-white font-medium text-sm">Impostos Calculados</p>
          {detail.simplesAliquotaEfetiva && (
            <p className="text-slate-400 text-xs mt-0.5">Alíquota efetiva: {fmtPct(detail.simplesAliquotaEfetiva)}</p>
          )}
        </div>
        <div className="divide-y divide-white/5">
          {impostoRows.map((r) => (
            <div key={r.label} className="px-4 py-3 flex items-center justify-between">
              <div>
                <p className="text-slate-300 text-sm">{r.label}</p>
                {r.venc && <p className="text-slate-500 text-xs">Venc: {fmtDate(r.venc)}</p>}
              </div>
              <p className="text-white font-semibold">{fmt(r.valor)}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-white font-medium text-sm">Pagamentos Registrados</p>
          <button onClick={() => setShowPagModal(true)}
            className="flex items-center gap-1 text-xs bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg">
            <Plus size={12} /> Registrar
          </button>
        </div>
        {(!detail.pagamentos || detail.pagamentos.length === 0) ? (
          <p className="text-slate-500 text-sm text-center py-6">Nenhum pagamento registrado</p>
        ) : (
          <div className="space-y-2">
            {detail.pagamentos.map((p) => (
              <div key={p.id} className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center justify-between">
                <div>
                  <p className="text-slate-300 text-sm">{p.descricao}</p>
                  <p className="text-slate-500 text-xs">Venc: {fmtDate(p.vencimento)}{p.dataPagamento ? ` • Pago: ${fmtDate(p.dataPagamento)}` : ''}</p>
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-white font-semibold text-sm">{fmt(p.valor)}</p>
                  {p.status !== 'PAGO' ? (
                    <button onClick={() => marcarPago(p.id)}
                      className="text-xs bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-400 px-2 py-1 rounded">
                      Pagar
                    </button>
                  ) : (
                    <span className="text-xs text-emerald-400">✓ Pago</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showPagModal && (
        <PagamentoModal
          apuration={detail}
          onClose={() => setShowPagModal(false)}
          onSaved={() => { loadDetail(detail.competencia); onRefresh() }}
        />
      )}
    </div>
  )
}

function ConfiguracoesTab() {
  const [settings, setSettings] = useState<Partial<TaxSettings>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch('/api/impostos/configuracoes')
      .then((r) => r.json())
      .then((d) => { setSettings(d); setLoading(false) })
  }, [])

  const handleSave = async () => {
    setSaving(true)
    await fetch('/api/impostos/configuracoes', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const field = (label: string, key: keyof TaxSettings, type = 'number', placeholder = '') => (
    <div>
      <label className="text-slate-400 text-xs block mb-1">{label}</label>
      <input type={type} step="0.0001" placeholder={placeholder}
        value={settings[key] as string || ''}
        onChange={(e) => setSettings((prev) => ({ ...prev, [key]: e.target.value }))}
        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500" />
    </div>
  )

  if (loading) return <div className="text-slate-400 text-center py-12">Carregando...</div>

  return (
    <div className="space-y-6">
      <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-4">
        <h3 className="text-white font-medium flex items-center gap-2">
          <Building2 size={16} className="text-blue-400" /> Regime Tributário
        </h3>
        <div>
          <label className="text-slate-400 text-xs block mb-1">Regime</label>
          <select value={settings.regime || 'SIMPLES_NACIONAL'}
            onChange={(e) => setSettings((prev) => ({ ...prev, regime: e.target.value }))}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500">
            <option value="SIMPLES_NACIONAL">Simples Nacional</option>
            <option value="LUCRO_PRESUMIDO">Lucro Presumido</option>
            <option value="LUCRO_REAL">Lucro Real</option>
          </select>
        </div>
        {settings.regime === 'SIMPLES_NACIONAL' && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-400 text-xs block mb-1">Anexo</label>
              <select value={settings.simplesAnexo || 'III'}
                onChange={(e) => setSettings((prev) => ({ ...prev, simplesAnexo: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm">
                {['I','II','III','IV','V'].map((a) => <option key={a} value={a}>Anexo {a}</option>)}
              </select>
            </div>
            {field('Alíquota Nominal', 'simplesAliquotaNominal', 'number', '0.06')}
          </div>
        )}
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-4">
        <h3 className="text-white font-medium flex items-center gap-2">
          <DollarSign size={16} className="text-amber-400" /> ISS
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {field('Alíquota ISS (ex: 0.05)', 'issAliquota', 'number', '0.05')}
          {field('Município', 'issMunicipio', 'text', 'São Paulo')}
          {field('Código LC116', 'issCodigoServico', 'text', '7.09')}
        </div>
      </div>

      {settings.regime !== 'SIMPLES_NACIONAL' && (
        <>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-4">
            <h3 className="text-white font-medium flex items-center gap-2">
              <FileText size={16} className="text-purple-400" /> IRPJ / CSLL
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {field('% Presunção IRPJ', 'irpjPercentualPresuncao', 'number', '0.08')}
              {field('Alíquota IRPJ', 'irpjAliquota', 'number', '0.15')}
              {field('Adicional IRPJ', 'irpjAdicionalAliquota', 'number', '0.10')}
              {field('Limite Adicional (R$)', 'irpjAdicionalLimite', 'number', '20000')}
              {field('% Presunção CSLL', 'csllPercentualPresuncao', 'number', '0.12')}
              {field('Alíquota CSLL', 'csllAliquota', 'number', '0.09')}
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-4">
            <h3 className="text-white font-medium flex items-center gap-2">
              <Calculator size={16} className="text-green-400" /> PIS / COFINS
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-400 text-xs block mb-1">Regime PIS</label>
                <select value={settings.pisRegime || 'CUMULATIVO'}
                  onChange={(e) => setSettings((prev) => ({ ...prev, pisRegime: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm">
                  <option value="CUMULATIVO">Cumulativo — 0,65%</option>
                  <option value="NAO_CUMULATIVO">Não-Cumulativo — 1,65%</option>
                </select>
              </div>
              {field('Alíquota PIS', 'pisAliquota', 'number', '0.0065')}
              <div>
                <label className="text-slate-400 text-xs block mb-1">Regime COFINS</label>
                <select value={settings.cofinsRegime || 'CUMULATIVO'}
                  onChange={(e) => setSettings((prev) => ({ ...prev, cofinsRegime: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm">
                  <option value="CUMULATIVO">Cumulativo — 3%</option>
                  <option value="NAO_CUMULATIVO">Não-Cumulativo — 7,6%</option>
                </select>
              </div>
              {field('Alíquota COFINS', 'cofinsAliquota', 'number', '0.03')}
            </div>
          </div>
        </>
      )}

      <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-4">
        <h3 className="text-white font-medium flex items-center gap-2">
          <CreditCard size={16} className="text-rose-400" /> INSS / FGTS
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {field('INSS Patronal', 'inssAliquotaPatronal', 'number', '0.20')}
          {field('RAT/GILRAT', 'inssRatAliquota', 'number', '0.03')}
          {field('FAP', 'inssFap', 'number', '1.00')}
          {field('Terceiros', 'inssTermceirosAliquota', 'number', '0.058')}
          {field('FGTS', 'fgtsAliquota', 'number', '0.08')}
        </div>
      </div>

      <button onClick={handleSave} disabled={saving}
        className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium flex items-center justify-center gap-2 disabled:opacity-50">
        {saving ? <RefreshCw size={16} className="animate-spin" /> : saved ? <CheckCircle size={16} /> : <Save size={16} />}
        {saved ? 'Salvo!' : 'Salvar Configurações'}
      </button>
    </div>
  )
}

function CalendarioTab() {
  const hoje = new Date()
  const ano = hoje.getFullYear()

  const eventos = [
    { dia: `${ano}-01-20`, tributo: 'DAS', desc: 'Simples Nacional — Jan' },
    { dia: `${ano}-02-20`, tributo: 'DAS', desc: 'Simples Nacional — Fev' },
    { dia: `${ano}-03-20`, tributo: 'DAS', desc: 'Simples Nacional — Mar' },
    { dia: `${ano}-03-31`, tributo: 'IRPJ/CSLL', desc: '1º Trimestre — DARF' },
    { dia: `${ano}-04-20`, tributo: 'DAS', desc: 'Simples Nacional — Abr' },
    { dia: `${ano}-05-20`, tributo: 'DAS', desc: 'Simples Nacional — Mai' },
    { dia: `${ano}-06-20`, tributo: 'DAS', desc: 'Simples Nacional — Jun' },
    { dia: `${ano}-06-30`, tributo: 'IRPJ/CSLL', desc: '2º Trimestre — DARF' },
    { dia: `${ano}-07-20`, tributo: 'DAS', desc: 'Simples Nacional — Jul' },
    { dia: `${ano}-08-20`, tributo: 'DAS', desc: 'Simples Nacional — Ago' },
    { dia: `${ano}-09-20`, tributo: 'DAS', desc: 'Simples Nacional — Set' },
    { dia: `${ano}-09-30`, tributo: 'IRPJ/CSLL', desc: '3º Trimestre — DARF' },
    { dia: `${ano}-10-20`, tributo: 'DAS', desc: 'Simples Nacional — Out' },
    { dia: `${ano}-11-20`, tributo: 'DAS', desc: 'Simples Nacional — Nov' },
    { dia: `${ano}-12-20`, tributo: 'DAS', desc: 'Simples Nacional — Dez' },
    { dia: `${ano}-12-31`, tributo: 'IRPJ/CSLL', desc: '4º Trimestre — DARF' },
  ]

  const proximos = eventos.filter((e) => new Date(e.dia) >= hoje).slice(0, 6)

  const tributoColor = (t: string) => {
    if (t === 'DAS') return 'bg-blue-500/20 text-blue-400'
    if (t === 'IRPJ/CSLL') return 'bg-purple-500/20 text-purple-400'
    return 'bg-slate-500/20 text-slate-400'
  }

  return (
    <div className="space-y-4">
      <p className="text-slate-400 text-sm">Próximos vencimentos — {ano}</p>
      <div className="space-y-2">
        {proximos.map((e) => {
          const d = new Date(e.dia)
          const diff = Math.ceil((d.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24))
          const urgente = diff <= 5
          return (
            <div key={e.dia} className={`bg-white/5 border rounded-xl p-4 flex items-center justify-between ${urgente ? 'border-amber-500/30' : 'border-white/10'}`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex flex-col items-center justify-center ${urgente ? 'bg-amber-500/20' : 'bg-white/5'}`}>
                  <span className={`text-xs font-bold ${urgente ? 'text-amber-400' : 'text-slate-300'}`}>{d.getDate().toString().padStart(2, '0')}</span>
                  <span className="text-slate-500 text-xs">{d.toLocaleString('pt-BR', { month: 'short' })}</span>
                </div>
                <div>
                  <p className="text-white text-sm">{e.desc}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${tributoColor(e.tributo)}`}>{e.tributo}</span>
                </div>
              </div>
              <span className={`text-xs ${urgente ? 'text-amber-400 font-semibold' : 'text-slate-500'}`}>
                {diff === 0 ? 'Hoje!' : diff === 1 ? 'Amanhã' : `em ${diff}d`}
              </span>
            </div>
          )
        })}
      </div>
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 text-xs text-slate-400 leading-relaxed">
        <p className="text-blue-400 font-medium mb-1">💡 Dica fiscal para locadoras</p>
        <p>Locação com operador é serviço (ISS) — Anexo III ou IV do Simples. Locação sem operador pode ser locação de bem móvel, sem ISS. Confirme com seu contador.</p>
      </div>
    </div>
  )
}

const TABS = [
  { id: 'dashboard', label: 'Visão Geral', icon: TrendingUp },
  { id: 'apuracao', label: 'Apuração', icon: Calculator },
  { id: 'calendario', label: 'Calendário', icon: Calendar },
  { id: 'configuracoes', label: 'Config', icon: Settings },
]

export default function ImpostosPage() {
  const [tab, setTab] = useState('dashboard')
  const [apurations, setApurations] = useState<TaxApuration[]>([])
  const [loading, setLoading] = useState(true)
  const [showApuracaoModal, setShowApuracaoModal] = useState(false)

  const loadApurations = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/impostos/apuracao')
      const data = await res.json()
      setApurations(Array.isArray(data) ? data : [])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadApurations() }, [loadApurations])

  return (
    <div className="min-h-screen bg-[#0f1117] text-white">
      <div className="border-b border-white/10 bg-[#0f1117]/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <Calculator size={18} className="text-white" />
            </div>
            <div>
              <h1 className="text-white font-semibold text-lg leading-tight">Impostos</h1>
              <p className="text-slate-500 text-xs">Gestão Fiscal</p>
            </div>
          </div>
          <button onClick={loadApurations} className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-white/5">
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
        <div className="max-w-4xl mx-auto px-4 flex gap-1 pb-3 overflow-x-auto">
          {TABS.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm whitespace-nowrap transition-colors ${
                tab === t.id ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}>
              <t.icon size={14} />
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {loading && tab === 'dashboard' ? (
          <div className="text-center py-12 text-slate-400">
            <RefreshCw size={24} className="animate-spin mx-auto mb-3" />
            Carregando...
          </div>
        ) : (
          <>
            {tab === 'dashboard' && <DashboardTab apurations={apurations} onNovaApuracao={() => setShowApuracaoModal(true)} />}
            {tab === 'apuracao' && <ApuracaoTab apurations={apurations} onRefresh={loadApurations} />}
            {tab === 'calendario' && <CalendarioTab />}
            {tab === 'configuracoes' && <ConfiguracoesTab />}
          </>
        )}
      </div>

      {showApuracaoModal && (
        <ApuracaoModal onClose={() => setShowApuracaoModal(false)} onSaved={loadApurations} />
      )}
    </div>
  )
}
