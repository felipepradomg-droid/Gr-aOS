'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface Equipment {
  id: string
  name: string
  type: string
  status: string
  dailyRate?: number | null
  hourlyRate?: number | null
}

export default function NovoContratoPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [equipamentos, setEquipamentos] = useState<Equipment[]>([])
  const [form, setForm] = useState({
    equipmentId: '',
    clienteNome: '',
    clienteCnpjCpf: '',
    clienteEmail: '',
    clienteTel: '',
    billingType: 'daily',
    rate: '',
    totalContractValue: '',
    advancePercent: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    siteAddress: '',
    siteCity: '',
    operatorName: '',
    notes: '',
  })

  useEffect(() => {
    fetch('/api/equipamentos')
      .then(r => r.json())
      .then(data => setEquipamentos(Array.isArray(data) ? data : []))
      .catch(() => setEquipamentos([]))
  }, [])

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target
    setForm(prev => {
      const updated = { ...prev, [name]: value }
      if (name === 'equipmentId' || name === 'billingType') {
        const eq = equipamentos.find(e => e.id === (name === 'equipmentId' ? value : prev.equipmentId))
        if (eq) {
          const billingType = name === 'billingType' ? value : prev.billingType
          if (billingType === 'daily' && eq.dailyRate) {
            updated.rate = String(eq.dailyRate)
          } else if (billingType === 'hourly' && eq.hourlyRate) {
            updated.rate = String(eq.hourlyRate)
          } else if (billingType === 'fixed') {
            updated.rate = '0'
          }
        }
      }
      return updated
    })
  }

  const advanceAmount = form.totalContractValue && form.advancePercent
    ? (parseFloat(form.totalContractValue) * parseFloat(form.advancePercent)) / 100
    : null

  async function handleSubmit() {
    setError('')

    if (!form.equipmentId || !form.clienteNome || !form.startDate) {
      setError('Preencha todos os campos obrigatórios.')
      return
    }

    if (form.billingType === 'fixed' && !form.totalContractValue) {
      setError('Informe o valor total da obra.')
      return
    }

    if (form.billingType !== 'fixed' && !form.rate) {
      setError('Informe o valor da taxa.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/contratos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          rate: form.billingType === 'fixed' ? 0 : parseFloat(form.rate),
          totalContractValue: form.totalContractValue ? parseFloat(form.totalContractValue) : null,
          advancePercent: form.advancePercent ? parseFloat(form.advancePercent) : null,
          advanceAmount: advanceAmount,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Erro ao criar contrato.')
        return
      }

      router.push(`/contratos/${data.id}`)
    } catch {
      setError('Erro de conexão. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-lg">
      <div className="flex items-center gap-3">
        <Link href="/contratos">
          <button className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
            <ArrowLeft className="h-4 w-4 text-gray-600" />
          </button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Novo Contrato</h1>
          <p className="text-sm text-gray-500 mt-0.5">Locação de longo prazo</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">

        {/* Equipamento */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
            Equipamento *
          </label>
          <select
            name="equipmentId"
            value={form.equipmentId}
            onChange={handleChange}
            className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-gray-400 bg-white"
          >
            <option value="">Selecione o equipamento</option>
            {equipamentos.map(eq => (
              <option key={eq.id} value={eq.id}>
                {eq.name} — {eq.type}
              </option>
            ))}
          </select>
        </div>

        {/* Tipo de cobrança */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
            Tipo de Cobrança *
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { value: 'hourly',  label: '⏱️ Por Hora' },
              { value: 'daily',   label: '📅 Por Diária' },
              { value: 'monthly', label: '🗓️ Por Mês' },
              { value: 'fixed',   label: '🏗️ Valor por Obra' },
            ].map(opt => (
              <button
                key={opt.value}
                onClick={() => setForm(prev => ({ ...prev, billingType: opt.value }))}
                className={`py-2.5 rounded-lg text-xs font-semibold border transition-colors ${
                  form.billingType === opt.value
                    ? 'bg-gray-900 text-white border-gray-900'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Campos para Valor por Obra */}
        {form.billingType === 'fixed' ? (
          <div className="space-y-4 bg-orange-50 border border-orange-200 rounded-xl p-4">
            <p className="text-xs font-semibold text-orange-700 uppercase tracking-wide">
              🏗️ Contrato por Empreitada
            </p>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                Valor Total da Obra (R$) *
              </label>
              <input
                name="totalContractValue"
                type="number"
                min="0"
                step="0.01"
                value={form.totalContractValue}
                onChange={handleChange}
                placeholder="0,00"
                className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-gray-400 bg-white"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                % de Adiantamento
              </label>
              <input
                name="advancePercent"
                type="number"
                min="0"
                max="100"
                step="1"
                value={form.advancePercent}
                onChange={handleChange}
                placeholder="Ex: 30"
                className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-gray-400 bg-white"
              />
            </div>
            {advanceAmount !== null && (
              <div className="bg-white border border-orange-200 rounded-lg px-4 py-2 flex justify-between items-center">
                <span className="text-sm text-orange-700 font-medium">Valor do adiantamento</span>
                <span className="text-lg font-bold text-orange-900">
                  {advanceAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
              Valor {form.billingType === 'hourly' ? 'por Hora' : form.billingType === 'daily' ? 'por Diária' : 'por Mês'} (R$) *
            </label>
            <input
              name="rate"
              type="number"
              min="0"
              step="0.01"
              value={form.rate}
              onChange={handleChange}
              placeholder="0,00"
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-gray-400"
            />
          </div>
        )}

        {/* Diária parada — só aparece quando billingType = daily */}
        {form.billingType === 'daily' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 space-y-1.5">
            <p className="text-xs font-semibold text-yellow-700 uppercase tracking-wide">
              ⚠️ Diárias Paradas
            </p>
            <p className="text-xs text-yellow-600">
              Nas medições você poderá registrar diárias paradas (standby) separadamente com valor próprio.
            </p>
          </div>
        )}

        {/* Cliente */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
            Nome do Cliente *
          </label>
          <input
            name="clienteNome"
            value={form.clienteNome}
            onChange={handleChange}
            placeholder="Nome ou razão social"
            className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-gray-400"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
            CPF / CNPJ
          </label>
          <input
            name="clienteCnpjCpf"
            value={form.clienteCnpjCpf}
            onChange={handleChange}
            placeholder="000.000.000-00"
            className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-gray-400"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
              WhatsApp
            </label>
            <input
              name="clienteTel"
              value={form.clienteTel}
              onChange={handleChange}
              placeholder="(11) 99999-9999"
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-gray-400"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
              E-mail
            </label>
            <input
              name="clienteEmail"
              value={form.clienteEmail}
              onChange={handleChange}
              placeholder="email@exemplo.com"
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-gray-400"
            />
          </div>
        </div>

        {/* Datas */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
              Início *
            </label>
            <input
              name="startDate"
              type="date"
              value={form.startDate}
              onChange={handleChange}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-gray-400"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
              Previsão Fim
            </label>
            <input
              name="endDate"
              type="date"
              value={form.endDate}
              onChange={handleChange}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-gray-400"
            />
          </div>
        </div>

        {/* Obra */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
              Cidade da Obra
            </label>
            <input
              name="siteCity"
              value={form.siteCity}
              onChange={handleChange}
              placeholder="Ex: São Paulo"
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-gray-400"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
              Operador
            </label>
            <input
              name="operatorName"
              value={form.operatorName}
              onChange={handleChange}
              placeholder="Nome do operador"
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-gray-400"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
            Endereço da Obra
          </label>
          <input
            name="siteAddress"
            value={form.siteAddress}
            onChange={handleChange}
            placeholder="Rua, número, bairro"
            className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-gray-400"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
            Observações
          </label>
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            placeholder="Condições especiais, observações do contrato..."
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
          {loading ? 'Criando...' : '📋 Criar Contrato'}
        </button>
      </div>
    </div>
  )
}
