'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function NovoOperadorPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    nome: '',
    cpf: '',
    rg: '',
    telefone: '',
    email: '',
    endereco: '',
    cidade: '',
    estado: '',
    cep: '',
    cnhNumero: '',
    cnhCategoria: '',
    cnhValidade: '',
    paymentType: 'daily',
    salarioFixo: '',
    valorDiaria: '',
    valorHora: '',
    status: 'active',
    notes: '',
  })

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  async function handleSubmit() {
    setError('')
    if (!form.nome) {
      setError('Nome é obrigatório.')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/operadores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          salarioFixo: form.salarioFixo ? parseFloat(form.salarioFixo) : null,
          valorDiaria: form.valorDiaria ? parseFloat(form.valorDiaria) : null,
          valorHora: form.valorHora ? parseFloat(form.valorHora) : null,
          cnhValidade: form.cnhValidade ? new Date(form.cnhValidade).toISOString() : null,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Erro ao cadastrar operador.')
        return
      }
      router.push(`/operadores/${data.id}`)
    } catch {
      setError('Erro de conexão. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-lg">

      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/operadores">
          <button className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
            <ArrowLeft className="h-4 w-4 text-gray-600" />
          </button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Novo Operador</h1>
          <p className="text-sm text-gray-500 mt-0.5">Cadastro completo</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-5">

        {/* ── DADOS PESSOAIS ── */}
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
          Dados Pessoais
        </p>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
            Nome completo *
          </label>
          <input
            name="nome"
            value={form.nome}
            onChange={handleChange}
            placeholder="Nome do operador"
            className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-gray-400"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">CPF</label>
            <input
              name="cpf"
              value={form.cpf}
              onChange={handleChange}
              placeholder="000.000.000-00"
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-gray-400"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">RG</label>
            <input
              name="rg"
              value={form.rg}
              onChange={handleChange}
              placeholder="00.000.000-0"
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-gray-400"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">WhatsApp</label>
            <input
              name="telefone"
              value={form.telefone}
              onChange={handleChange}
              placeholder="(11) 99999-9999"
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-gray-400"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">E-mail</label>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="email@exemplo.com"
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-gray-400"
            />
          </div>
        </div>

        {/* ── ENDEREÇO ── */}
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest pt-2">
          Endereço
        </p>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Endereço</label>
          <input
            name="endereco"
            value={form.endereco}
            onChange={handleChange}
            placeholder="Rua, número, bairro"
            className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-gray-400"
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-1 space-y-1.5">
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">CEP</label>
            <input
              name="cep"
              value={form.cep}
              onChange={handleChange}
              placeholder="00000-000"
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-gray-400"
            />
          </div>
          <div className="col-span-1 space-y-1.5">
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Cidade</label>
            <input
              name="cidade"
              value={form.cidade}
              onChange={handleChange}
              placeholder="São Paulo"
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-gray-400"
            />
          </div>
          <div className="col-span-1 space-y-1.5">
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">UF</label>
            <input
              name="estado"
              value={form.estado}
              onChange={handleChange}
              placeholder="SP"
              maxLength={2}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-gray-400"
            />
          </div>
        </div>

        {/* ── CNH ── */}
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest pt-2">
          CNH
        </p>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Número CNH</label>
            <input
              name="cnhNumero"
              value={form.cnhNumero}
              onChange={handleChange}
              placeholder="00000000000"
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-gray-400"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Categoria</label>
            <select
              name="cnhCategoria"
              value={form.cnhCategoria}
              onChange={handleChange}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-gray-400 bg-white"
            >
              <option value="">Selecione</option>
              {['A', 'B', 'C', 'D', 'E', 'AB', 'AC', 'AD', 'AE'].map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Validade CNH</label>
          <input
            name="cnhValidade"
            type="date"
            value={form.cnhValidade}
            onChange={handleChange}
            className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-gray-400"
          />
        </div>

        {/* ── PAGAMENTO ── */}
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest pt-2">
          Pagamento
        </p>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Tipo de Pagamento *</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { value: 'fixed',  label: '💼 Salário Fixo' },
              { value: 'daily',  label: '📅 Por Diária' },
              { value: 'hourly', label: '⏱️ Por Hora' },
            ].map(opt => (
              <button
                key={opt.value}
                onClick={() => setForm(prev => ({ ...prev, paymentType: opt.value }))}
                className={`py-2.5 rounded-lg text-xs font-semibold border transition-colors ${
                  form.paymentType === opt.value
                    ? 'bg-gray-900 text-white border-gray-900'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {form.paymentType === 'fixed' && (
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Salário Fixo (R$/mês)</label>
            <input
              name="salarioFixo"
              type="number"
              min="0"
              step="0.01"
              value={form.salarioFixo}
              onChange={handleChange}
              placeholder="0,00"
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-gray-400"
            />
          </div>
        )}

        {form.paymentType === 'daily' && (
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Valor por Diária (R$)</label>
            <input
              name="valorDiaria"
              type="number"
              min="0"
              step="0.01"
              value={form.valorDiaria}
              onChange={handleChange}
              placeholder="0,00"
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-gray-400"
            />
          </div>
        )}

        {form.paymentType === 'hourly' && (
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Valor por Hora (R$)</label>
            <input
              name="valorHora"
              type="number"
              min="0"
              step="0.01"
              value={form.valorHora}
              onChange={handleChange}
              placeholder="0,00"
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-gray-400"
            />
          </div>
        )}

        {/* ── STATUS ── */}
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest pt-2">
          Status
        </p>

        <div className="grid grid-cols-2 gap-2">
          {[
            { value: 'active',   label: '✅ Ativo' },
            { value: 'inactive', label: '⛔ Inativo' },
          ].map(opt => (
            <button
              key={opt.value}
              onClick={() => setForm(prev => ({ ...prev, status: opt.value }))}
              className={`py-2.5 rounded-lg text-xs font-semibold border transition-colors ${
                form.status === opt.value
                  ? 'bg-gray-900 text-white border-gray-900'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* ── OBSERVAÇÕES ── */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Observações</label>
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            placeholder="Anotações gerais sobre o operador..."
            rows={3}
            className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-gray-400 resize-none"
          />
        </div>

        {error && (
          <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-3 bg-gray-900 text-white rounded-lg text-sm font-semibold hover:bg-gray-700 transition-colors disabled:opacity-50"
        >
          {loading ? 'Salvando...' : '👷 Cadastrar Operador'}
        </button>

      </div>
    </div>
  )
}
