'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function NovaCobrancaPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    clienteNome: '',
    clienteCnpjCpf: '',
    clienteEmail: '',
    clienteTel: '',
    paymentMethod: 'pix',
    amount: '',
    dueDate: '',
    description: '',
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit() {
    setError('')

    if (!form.clienteNome || !form.clienteCnpjCpf || !form.amount || !form.dueDate) {
      setError('Preencha todos os campos obrigatórios.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/receivables', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          amount: parseFloat(form.amount),
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Erro ao criar cobrança.')
        return
      }

      // Se tiver WhatsApp, abre direto
      if (data.whatsappUrl) {
        window.open(data.whatsappUrl, '_blank')
      }

      router.push('/financeiro')
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
        <Link href="/financeiro">
          <button className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
            <ArrowLeft className="h-4 w-4 text-gray-600" />
          </button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Nova Cobrança</h1>
          <p className="text-sm text-gray-500 mt-0.5">Gerar boleto ou PIX</p>
        </div>
      </div>

      {/* Formulário */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">

        {/* Método de pagamento */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
            Método de Pagamento
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { value: 'pix', label: '⚡ PIX' },
              { value: 'boleto', label: '📄 Boleto' },
            ].map(opt => (
              <button
                key={opt.value}
                onClick={() => setForm(prev => ({ ...prev, paymentMethod: opt.value }))}
                className={`py-2.5 rounded-lg text-sm font-semibold border transition-colors ${
                  form.paymentMethod === opt.value
                    ? 'bg-gray-900 text-white border-gray-900'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Dados do cliente */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
            Nome do Cliente *
          </label>
          <input
            name="clienteNome"
            value={form.clienteNome}
            onChange={handleChange}
            placeholder="Nome completo ou razão social"
            className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-gray-400"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
            CPF / CNPJ *
          </label>
          <input
            name="clienteCnpjCpf"
            value={form.clienteCnpjCpf}
            onChange={handleChange}
            placeholder="000.000.000-00 ou 00.000.000/0000-00"
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

        {/* Valor e vencimento */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
              Valor (R$) *
            </label>
            <input
              name="amount"
              value={form.amount}
              onChange={handleChange}
              placeholder="0,00"
              type="number"
              min="0"
              step="0.01"
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-gray-400"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
              Vencimento *
            </label>
            <input
              name="dueDate"
              value={form.dueDate}
              onChange={handleChange}
              type="date"
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-gray-400"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
            Descrição
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Ex: Locação de guindaste — OS #001"
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
          {loading
            ? 'Gerando...'
            : form.paymentMethod === 'pix'
            ? '⚡ Gerar PIX'
            : '📄 Gerar Boleto'
          }
        </button>

        <p className="text-xs text-gray-400 text-center">
          Após gerar, você poderá enviar por WhatsApp com 1 clique.
        </p>
      </div>
    </div>
  )
}
