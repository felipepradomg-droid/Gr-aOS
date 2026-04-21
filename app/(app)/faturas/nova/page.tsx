'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createInvoice } from '@/lib/actions/invoices'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

export default function NovaFaturaPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [amount, setAmount] = useState('')
  const [taxAmount, setTaxAmount] = useState('0')

  const total =
    (parseFloat(amount) || 0) + (parseFloat(taxAmount) || 0)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    const result = await createInvoice(formData)
    setLoading(false)
    if (result?.error) {
      toast.error(result.error as string)
    } else {
      toast.success('Fatura criada!')
      router.push(`/faturas/${result.data?.id}`)
    }
  }

  return (
    <div className="max-w-xl mx-auto p-4 md:p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/faturas">
          <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </button>
        </Link>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Nova Fatura</h1>
          <p className="text-sm text-gray-500">Cobrança manual</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Cliente */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
          <h2 className="font-semibold text-gray-700">Cliente</h2>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">
              Nome do Cliente *
            </label>
            <input
              name="clienteNome"
              required
              placeholder="ex: Construtora ABC"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">
                Telefone
              </label>
              <input
                name="clienteTel"
                placeholder="11999999999"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">
                E-mail
              </label>
              <input
                name="clienteEmail"
                type="email"
                placeholder="email@empresa.com"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>
          </div>
        </div>

        {/* Valores */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
          <h2 className="font-semibold text-gray-700">Valores</h2>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">
                Valor (R$) *
              </label>
              <input
                name="amount"
                type="number"
                step="0.01"
                required
                placeholder="0,00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">
                Impostos (R$)
              </label>
              <input
                name="taxAmount"
                type="number"
                step="0.01"
                placeholder="0,00"
                value={taxAmount}
                onChange={(e) => setTaxAmount(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>
          </div>

          {total > 0 && (
            <div className="bg-gray-50 rounded-xl p-4 flex justify-between items-center">
              <span className="text-sm text-gray-500">Total</span>
              <span className="font-bold text-gray-900 text-lg">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                }).format(total)}
              </span>
            </div>
          )}
        </div>

        {/* Datas */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
          <h2 className="font-semibold text-gray-700">Datas</h2>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">
                Data de Emissão *
              </label>
              <input
                name="issueDate"
                type="date"
                required
                defaultValue={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">
                Vencimento *
              </label>
              <input
                name="dueDate"
                type="date"
                required
                defaultValue={
                  new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                    .toISOString()
                    .split('T')[0]
                }
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>
          </div>
        </div>

        {/* Pagamento */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
          <h2 className="font-semibold text-gray-700">Pagamento</h2>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">
              Forma de Pagamento
            </label>
            <select
              name="paymentMethod"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"
            >
              <option value="">Selecione</option>
              <option value="pix">💳 Pix</option>
              <option value="boleto">📄 Boleto</option>
              <option value="transfer">🏦 Transferência</option>
              <option value="cash">💵 Dinheiro</option>
              <option value="other">Outro</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">
              Observações
            </label>
            <textarea
              name="notes"
              rows={2}
              placeholder="Informações adicionais..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-700 transition-colors disabled:opacity-50"
        >
          {loading ? 'Criando fatura...' : 'Criar Fatura'}
        </button>
      </form>
    </div>
  )
}
