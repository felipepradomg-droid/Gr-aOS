'use client'

import { useState } from 'react'
import { Send, Plus, Clock, Calendar } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

interface Contract {
  id: string
  contractNumber: string
  clienteNome: string
  clienteTel?: string | null
  billingType: string
  rate: number
}

interface Props {
  contract: Contract
  onSuccess?: () => void
}

export function MeasurementForm({ contract, onSuccess }: Props) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [whatsappUrl, setWhatsappUrl] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    hoursWorked: '',
    daysWorked: '',
    measureDate: new Date().toISOString().split('T')[0],
    operatorName: '',
    notes: '',
  })

  const isHourly = contract.billingType === 'hourly'
  const isDaily = contract.billingType === 'daily'

  // Calcula preview do valor
  const valorPreview = isHourly && form.hoursWorked
    ? contract.rate * parseFloat(form.hoursWorked)
    : isDaily && form.daysWorked
    ? contract.rate * parseFloat(form.daysWorked)
    : 0

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit() {
    setError('')

    if (isHourly && !form.hoursWorked) {
      setError('Informe as horas trabalhadas.')
      return
    }
    if (isDaily && !form.daysWorked) {
      setError('Informe as diárias trabalhadas.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`/api/contratos/${contract.id}/medicoes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hoursWorked: form.hoursWorked ? parseFloat(form.hoursWorked) : null,
          daysWorked: form.daysWorked ? parseFloat(form.daysWorked) : null,
          measureDate: form.measureDate,
          operatorName: form.operatorName || null,
          notes: form.notes || null,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Erro ao registrar medição.')
        return
      }

      if (data.whatsappUrl) {
        setWhatsappUrl(data.whatsappUrl)
      }

      // Limpa o formulário
      setForm({
        hoursWorked: '',
        daysWorked: '',
        measureDate: new Date().toISOString().split('T')[0],
        operatorName: '',
        notes: '',
      })
      setShowForm(false)
      onSuccess?.()
    } catch {
      setError('Erro de conexão. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-3">
      {/* Botão para abrir formulário */}
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="w-full flex items-center justify-center gap-2 py-3 bg-gray-900 text-white rounded-xl text-sm font-semibold hover:bg-gray-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Registrar Medição
        </button>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-800">Nova Medição</p>
            <button
              onClick={() => setShowForm(false)}
              className="text-xs text-gray-400 hover:text-gray-600"
            >
              Cancelar
            </button>
          </div>

          {/* Data */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              Data da Medição
            </label>
            <input
              name="measureDate"
              type="date"
              value={form.measureDate}
              onChange={handleChange}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-gray-400"
            />
          </div>

          {/* Horas ou Diárias */}
          {isHourly && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Horas Trabalhadas *
              </label>
              <input
                name="hoursWorked"
                type="number"
                min="0"
                step="0.5"
                value={form.hoursWorked}
                onChange={handleChange}
                placeholder="Ex: 8.5"
                className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-gray-400"
              />
            </div>
          )}

          {isDaily && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Diárias Trabalhadas *
              </label>
              <input
                name="daysWorked"
                type="number"
                min="0"
                step="0.5"
                value={form.daysWorked}
                onChange={handleChange}
                placeholder="Ex: 1"
                className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-gray-400"
              />
            </div>
          )}

          {/* Preview do valor */}
          {valorPreview > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg px-3 py-2 flex items-center justify-between">
              <p className="text-xs font-semibold text-green-700">Valor desta medição</p>
              <p className="text-sm font-bold text-green-700">{formatCurrency(valorPreview)}</p>
            </div>
          )}

          {/* Operador */}
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

          {/* Observações */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
              Observações
            </label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="Ex: Operação em turno noturno"
              rows={2}
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
            {loading ? 'Salvando...' : 'Salvar Medição'}
          </button>
        </div>
      )}

      {/* WhatsApp de confirmação */}
      {whatsappUrl && (
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2 py-3 bg-green-500 text-white rounded-xl text-sm font-semibold hover:bg-green-600 transition-colors"
        >
          <Send className="h-4 w-4" />
          Enviar confirmação por WhatsApp
        </a>
      )}
    </div>
  )
}
