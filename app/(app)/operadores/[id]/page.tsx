'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, Trash2, Save, Plus, Clock, Briefcase } from 'lucide-react'
import Link from 'next/link'

interface Operator {
  id: string
  nome: string
  cpf?: string | null
  rg?: string | null
  telefone?: string | null
  email?: string | null
  endereco?: string | null
  cidade?: string | null
  estado?: string | null
  cep?: string | null
  cnhNumero?: string | null
  cnhCategoria?: string | null
  cnhValidade?: string | null
  paymentType: string
  salarioFixo?: number | null
  valorDiaria?: number | null
  valorHora?: number | null
  status: string
  notes?: string | null
  operatorAssignments: Assignment[]
  workLogs: WorkLog[]
}

interface Assignment {
  id: string
  startDate: string
  endDate?: string | null
  notes?: string | null
  equipment?: { id: string; name: string; type: string } | null
  contract?: { id: string; contractNumber: string; clienteNome: string } | null
}

interface WorkLog {
  id: string
  workDate: string
  hoursWorked: number
  amountDue?: number | null
  paymentType?: string | null
  contractId?: string | null
  equipmentId?: string | null
  notes?: string | null
}

const paymentLabel: Record<string, string> = {
  fixed: 'Salário Fixo',
  daily: 'Por Diária',
  hourly: 'Por Hora',
}

export default function OperadorDetailPage() {
  const router = useRouter()
  const { id } = useParams<{ id: string }>()

  const [operator, setOperator] = useState<Operator | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')
  const [tab, setTab] = useState<'dados' | 'jornada' | 'vinculos'>('dados')

  // Form edição
  const [form, setForm] = useState<Record<string, string>>({})

  // Modal novo registro de jornada
  const [showWorkLog, setShowWorkLog] = useState(false)
  const [workLogForm, setWorkLogForm] = useState({
    workDate: new Date().toISOString().split('T')[0],
    hoursWorked: '',
    notes: '',
  })
  const [savingLog, setSavingLog] = useState(false)

  useEffect(() => {
    fetch(`/api/operadores/${id}`)
      .then(r => r.json())
      .then(data => {
        setOperator(data)
        setForm({
          nome: data.nome ?? '',
          cpf: data.cpf ?? '',
          rg: data.rg ?? '',
          telefone: data.telefone ?? '',
          email: data.email ?? '',
          endereco: data.endereco ?? '',
          cidade: data.cidade ?? '',
          estado: data.estado ?? '',
          cep: data.cep ?? '',
          cnhNumero: data.cnhNumero ?? '',
          cnhCategoria: data.cnhCategoria ?? '',
          cnhValidade: data.cnhValidade
            ? new Date(data.cnhValidade).toISOString().split('T')[0]
            : '',
          paymentType: data.paymentType ?? 'daily',
          salarioFixo: data.salarioFixo?.toString() ?? '',
          valorDiaria: data.valorDiaria?.toString() ?? '',
          valorHora: data.valorHora?.toString() ?? '',
          status: data.status ?? 'active',
          notes: data.notes ?? '',
        })
      })
      .catch(() => setError('Erro ao carregar operador.'))
      .finally(() => setLoading(false))
  }, [id])

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  async function handleSave() {
    setError('')
    setSaving(true)
    try {
      const res = await fetch(`/api/operadores/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          salarioFixo: form.salarioFixo ? parseFloat(form.salarioFixo) : null,
          valorDiaria: form.valorDiaria ? parseFloat(form.valorDiaria) : null,
          valorHora: form.valorHora ? parseFloat(form.valorHora) : null,
          cnhValidade: form.cnhValidade
            ? new Date(form.cnhValidade).toISOString()
            : null,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Erro ao salvar.')
        return
      }
      setOperator(data)
    } catch {
      setError('Erro de conexão.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!confirm('Excluir este operador? Todos os registros de jornada serão removidos.')) return
    setDeleting(true)
    try {
      await fetch(`/api/operadores/${id}`, { method: 'DELETE' })
      router.push('/operadores')
    } catch {
      setError('Erro ao excluir.')
      setDeleting(false)
    }
  }

  async function handleSaveWorkLog() {
    if (!workLogForm.hoursWorked) return
    setSavingLog(true)
    try {
      const res = await fetch(`/api/operadores/${id}/worklogs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workDate: new Date(workLogForm.workDate).toISOString(),
          hoursWorked: parseFloat(workLogForm.hoursWorked),
          notes: workLogForm.notes,
        }),
      })
      const data = await res.json()
      if (res.ok) {
        setOperator(prev =>
          prev ? { ...prev, workLogs: [data, ...prev.workLogs] } : prev
        )
        setShowWorkLog(false)
        setWorkLogForm({
          workDate: new Date().toISOString().split('T')[0],
          hoursWorked: '',
          notes: '',
        })
      }
    } finally {
      setSavingLog(false)
    }
  }

  // Totais de jornada
  const totalHoras = operator?.workLogs.reduce((s, l) => s + l.hoursWorked, 0) ?? 0
  const totalPagar = operator?.workLogs.reduce((s, l) => s + (l.amountDue ?? 0), 0) ?? 0

  if (loading) return <div className="p-6 text-sm text-gray-400">Carregando...</div>
  if (!operator) return <div className="p-6 text-sm text-red-500">Operador não encontrado.</div>

  return (
    <div className="p-4 md:p-6 space-y-5 max-w-lg">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/operadores">
            <button className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <ArrowLeft className="h-4 w-4 text-gray-600" />
            </button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-gray-900">{operator.nome}</h1>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                operator.status === 'active'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-500'
              }`}>
                {operator.status === 'active' ? 'Ativo' : 'Inativo'}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">{paymentLabel[operator.paymentType]}</p>
          </div>
        </div>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="p-2 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-colors"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
        {[
          { key: 'dados',    label: '📋 Dados' },
          { key: 'jornada',  label: '⏱️ Jornada' },
          { key: 'vinculos', label: '🔗 Vínculos' },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key as typeof tab)}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-colors ${
              tab === t.key
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── TAB DADOS ── */}
      {tab === 'dados' && (
        <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-5">

          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Dados Pessoais</p>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Nome *</label>
            <input name="nome" value={form.nome} onChange={handleChange}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-gray-400" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">CPF</label>
              <input name="cpf" value={form.cpf} onChange={handleChange} placeholder="000.000.000-00"
                className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-gray-400" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">RG</label>
              <input name="rg" value={form.rg} onChange={handleChange}
                className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-gray-400" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">WhatsApp</label>
              <input name="telefone" value={form.telefone} onChange={handleChange} placeholder="(11) 99999-9999"
                className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-gray-400" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">E-mail</label>
              <input name="email" value={form.email} onChange={handleChange}
                className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-gray-400" />
            </div>
          </div>

          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest pt-2">Endereço</p>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Endereço</label>
            <input name="endereco" value={form.endereco} onChange={handleChange}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-gray-400" />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">CEP</label>
              <input name="cep" value={form.cep} onChange={handleChange}
                className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-gray-400" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Cidade</label>
              <input name="cidade" value={form.cidade} onChange={handleChange}
                className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-gray-400" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">UF</label>
              <input name="estado" value={form.estado} onChange={handleChange} maxLength={2}
                className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-gray-400" />
            </div>
          </div>

          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest pt-2">CNH</p>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Número</label>
              <input name="cnhNumero" value={form.cnhNumero} onChange={handleChange}
                className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-gray-400" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Categoria</label>
              <select name="cnhCategoria" value={form.cnhCategoria} onChange={handleChange}
                className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-gray-400 bg-white">
                <option value="">Selecione</option>
                {['A','B','C','D','E','AB','AC','AD','AE'].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Validade CNH</label>
            <input name="cnhValidade" type="date" value={form.cnhValidade} onChange={handleChange}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-gray-400" />
          </div>

          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest pt-2">Pagamento</p>

          <div className="grid grid-cols-3 gap-2">
            {[
              { value: 'fixed',  label: '💼 Fixo' },
              { value: 'daily',  label: '📅 Diária' },
              { value: 'hourly', label: '⏱️ Hora' },
            ].map(opt => (
              <button key={opt.value}
                onClick={() => setForm(prev => ({ ...prev, paymentType: opt.value }))}
                className={`py-2.5 rounded-lg text-xs font-semibold border transition-colors ${
                  form.paymentType === opt.value
                    ? 'bg-gray-900 text-white border-gray-900'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                }`}>
                {opt.label}
              </button>
            ))}
          </div>

          {form.paymentType === 'fixed' && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Salário (R$/mês)</label>
              <input name="salarioFixo" type="number" min="0" step="0.01" value={form.salarioFixo} onChange={handleChange}
                className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-gray-400" />
            </div>
          )}
          {form.paymentType === 'daily' && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Valor Diária (R$)</label>
              <input name="valorDiaria" type="number" min="0" step="0.01" value={form.valorDiaria} onChange={handleChange}
                className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-gray-400" />
            </div>
          )}
          {form.paymentType === 'hourly' && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Valor Hora (R$)</label>
              <input name="valorHora" type="number" min="0" step="0.01" value={form.valorHora} onChange={handleChange}
                className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-gray-400" />
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            {[
              { value: 'active',   label: '✅ Ativo' },
              { value: 'inactive', label: '⛔ Inativo' },
            ].map(opt => (
              <button key={opt.value}
                onClick={() => setForm(prev => ({ ...prev, status: opt.value }))}
                className={`py-2.5 rounded-lg text-xs font-semibold border transition-colors ${
                  form.status === opt.value
                    ? 'bg-gray-900 text-white border-gray-900'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                }`}>
                {opt.label}
              </button>
            ))}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Observações</label>
            <textarea name="notes" value={form.notes} onChange={handleChange} rows={3}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-gray-400 resize-none" />
          </div>

          {error && (
            <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</div>
          )}

          <button onClick={handleSave} disabled={saving}
            className="w-full py-3 bg-gray-900 text-white rounded-lg text-sm font-semibold hover:bg-gray-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
            <Save className="h-4 w-4" />
            {saving ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </div>
      )}

      {/* ── TAB JORNADA ── */}
      {tab === 'jornada' && (
        <div className="space-y-4">

          {/* Totais */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
              <p className="text-xs text-gray-400 mb-1">Total de Horas</p>
              <p className="text-2xl font-bold text-gray-900">{totalHoras.toFixed(1)}h</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
              <p className="text-xs text-gray-400 mb-1">Total a Pagar</p>
              <p className="text-2xl font-bold text-gray-900">
                {totalPagar.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </p>
            </div>
          </div>

          <button onClick={() => setShowWorkLog(true)}
            className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-sm font-semibold text-gray-500 hover:border-gray-400 hover:text-gray-700 transition-colors flex items-center justify-center gap-2">
            <Plus className="h-4 w-4" />
            Registrar Jornada
          </button>

          {/* Modal registro */}
          {showWorkLog && (
            <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
              <p className="text-sm font-bold text-gray-900">Novo Registro de Jornada</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Data</label>
                  <input type="date" value={workLogForm.workDate}
                    onChange={e => setWorkLogForm(p => ({ ...p, workDate: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-gray-400" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Horas</label>
                  <input type="number" min="0" step="0.5" value={workLogForm.hoursWorked} placeholder="Ex: 8"
                    onChange={e => setWorkLogForm(p => ({ ...p, hoursWorked: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-gray-400" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Observação</label>
                <input value={workLogForm.notes} placeholder="Opcional"
                  onChange={e => setWorkLogForm(p => ({ ...p, notes: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-gray-400" />
              </div>
              <div className="flex gap-2">
                <button onClick={() => setShowWorkLog(false)}
                  className="flex-1 py-2.5 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50">
                  Cancelar
                </button>
                <button onClick={handleSaveWorkLog} disabled={savingLog}
                  className="flex-1 py-2.5 bg-gray-900 text-white rounded-lg text-sm font-semibold disabled:opacity-50">
                  {savingLog ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            </div>
          )}

          {/* Lista de logs */}
          {operator.workLogs.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <Clock className="h-8 w-8 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">Nenhuma jornada registrada</p>
            </div>
          ) : (
            <div className="space-y-2">
              {operator.workLogs.map(log => (
                <div key={log.id} className="bg-white rounded-xl border border-gray-200 p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {new Date(log.workDate).toLocaleDateString('pt-BR')}
                      </p>
                      {log.notes && <p className="text-xs text-gray-500 mt-0.5">{log.notes}</p>}
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-900">{log.hoursWorked}h</p>
                      {log.amountDue != null && (
                        <p className="text-xs text-green-700 font-medium">
                          {log.amountDue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── TAB VÍNCULOS ── */}
      {tab === 'vinculos' && (
        <div className="space-y-3">
          {operator.operatorAssignments.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <Briefcase className="h-8 w-8 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">Nenhum vínculo cadastrado</p>
              <p className="text-xs mt-1">Vincule este operador em um contrato ou equipamento</p>
            </div>
          ) : (
            operator.operatorAssignments.map(a => (
              <div key={a.id} className="bg-white rounded-xl border border-gray-200 p-4 space-y-2">
                {a.equipment && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-400 uppercase">Equipamento</span>
                    <span className="text-sm font-semibold text-gray-900">{a.equipment.name}</span>
                    <span className="text-xs text-gray-400">{a.equipment.type}</span>
                  </div>
                )}
                {a.contract && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-400 uppercase">Contrato</span>
                    <span className="text-sm font-semibold text-gray-900">#{a.contract.contractNumber}</span>
                    <span className="text-xs text-gray-400">{a.contract.clienteNome}</span>
                  </div>
                )}
                <p className="text-xs text-gray-400">
                  {new Date(a.startDate).toLocaleDateString('pt-BR')}
                  {a.endDate ? ` → ${new Date(a.endDate).toLocaleDateString('pt-BR')}` : ' → Em andamento'}
                </p>
              </div>
            ))
          )}
        </div>
      )}

    </div>
  )
}
