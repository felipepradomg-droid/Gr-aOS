'use client'

import { useState, useEffect } from 'react'
import { useAbastecimentos, AbastecimentoFormData } from '@/lib/hooks/useAbastecimentos'

const FUEL_TYPES = [
  { value: 'diesel',   label: 'Diesel' },
  { value: 'gasolina', label: 'Gasolina' },
  { value: 'etanol',   label: 'Etanol' },
  { value: 'arla',     label: 'Arla 32' },
]

const emptyForm: AbastecimentoFormData = {
  equipmentId:   '',
  fuelType:      'diesel',
  liters:        0,
  pricePerLiter: 0,
  meterType:     'hourmeter',
}

export default function AbastecimentosPage() {
  const [filtroEquip, setFiltroEquip]   = useState('')
  const [equipamentos, setEquipamentos] = useState<any[]>([])
  const { abastecimentos, totalLitros, totalCusto, loading, criar, deletar } =
    useAbastecimentos(filtroEquip || undefined)

  const [showForm, setShowForm] = useState(false)
  const [form, setForm]         = useState<AbastecimentoFormData>(emptyForm)
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro]         = useState('')

  useEffect(() => {
    fetch('/api/abastecimentos/equipamentos')
      .then(r => r.json())
      .then(data => {
        setEquipamentos(Array.isArray(data) ? data : [])
      })
      .catch(() => setEquipamentos([]))
  }, [])

  const set = (field: keyof AbastecimentoFormData, value: any) =>
    setForm(f => ({ ...f, [field]: value }))

  const totalCalculado = (form.liters || 0) * (form.pricePerLiter || 0)

  const handleSubmit = async () => {
    if (!form.equipmentId || !form.liters || !form.pricePerLiter) {
      setErro('Preencha equipamento, litros e preço por litro.')
      return
    }
    setSalvando(true)
    setErro('')
    try {
      await criar(form)
      setForm(emptyForm)
      setShowForm(false)
    } catch (e: any) {
      setErro(e.message)
    } finally {
      setSalvando(false)
    }
  }

  const fmt = (v: number) =>
    v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Abastecimentos</h1>
          <p className="text-sm text-gray-500">Controle de combustível por equipamento</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
        >
          + Novo abastecimento
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Total litros</p>
          <p className="text-2xl font-bold text-gray-900">{totalLitros.toLocaleString('pt-BR')} L</p>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Custo total</p>
          <p className="text-2xl font-bold text-red-600">{fmt(totalCusto)}</p>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Preço médio/L</p>
          <p className="text-2xl font-bold text-gray-900">
            {totalLitros > 0 ? fmt(totalCusto / totalLitros) : '—'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <label className="text-sm text-gray-600 font-medium">Filtrar por equipamento:</label>
        <select
          value={filtroEquip}
          onChange={e => setFiltroEquip(e.target.value)}
          className="border rounded-lg px-3 py-1.5 text-sm"
        >
          <option value="">Todos</option>
          {equipamentos.map((eq: any) => (
            <option key={eq.id} value={eq.id}>{eq.name}</option>
          ))}
        </select>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold text-gray-900">Registrar abastecimento</h2>

            {erro && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {erro}
              </p>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-700 mb-1">Equipamento *</label>
                <select
                  value={form.equipmentId}
                  onChange={e => set('equipmentId', e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                >
                  <option value="">Selecione...</option>
                  {equipamentos.map((eq: any) => (
                    <option key={eq.id} value={eq.id}>{eq.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Data</label>
                <input
                  type="date"
                  value={form.supplyDate || new Date().toISOString().split('T')[0]}
                  onChange={e => set('supplyDate', e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Combustível</label>
                <select
                  value={form.fuelType}
                  onChange={e => set('fuelType', e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                >
                  {FUEL_TYPES.map(f => (
                    <option key={f.value} value={f.value}>{f.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Litros *</label>
                <input
                  type="number" min="0" step="0.01"
                  value={form.liters || ''}
                  onChange={e => set('liters', parseFloat(e.target.value))}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                  placeholder="0,00"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">R$/Litro *</label>
                <input
                  type="number" min="0" step="0.01"
                  value={form.pricePerLiter || ''}
                  onChange={e => set('pricePerLiter', parseFloat(e.target.value))}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                  placeholder="0,00"
                />
              </div>

              <div className="col-span-2 bg-blue-50 border border-blue-200 rounded-lg px-4 py-2 flex justify-between items-center">
                <span className="text-sm text-blue-700 font-medium">Total calculado</span>
                <span className="text-lg font-bold text-blue-900">{fmt(totalCalculado)}</span>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Tipo de medidor</label>
                <select
                  value={form.meterType}
                  onChange={e => set('meterType', e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                >
                  <option value="hourmeter">Horímetro (h)</option>
                  <option value="odometer">Hodômetro (km)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Leitura {form.meterType === 'hourmeter' ? '(horas)' : '(km)'}
                </label>
                <input
                  type="number" min="0" step="0.1"
                  value={form.meterReading || ''}
                  onChange={e => set('meterReading', parseFloat(e.target.value))}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                  placeholder="Opcional"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Posto / Fornecedor</label>
                <input
                  type="text"
                  value={form.supplier || ''}
                  onChange={e => set('supplier', e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                  placeholder="Nome do posto"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Nº Nota Fiscal</label>
                <input
                  type="text"
                  value={form.invoiceNumber || ''}
                  onChange={e => set('invoiceNumber', e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                  placeholder="Opcional"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-700 mb-1">Operador / Responsável</label>
                <input
                  type="text"
                  value={form.operatorName || ''}
                  onChange={e => set('operatorName', e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                  placeholder="Nome de quem abasteceu"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-700 mb-1">Observações</label>
                <textarea
                  value={form.notes || ''}
                  onChange={e => set('notes', e.target.value)}
                  rows={2}
                  className="w-full border rounded-lg px-3 py-2 text-sm resize-none"
                  placeholder="Opcional"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => { setShowForm(false); setErro('') }}
                className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                disabled={salvando}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
              >
                {salvando ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Carregando...</div>
        ) : abastecimentos.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            Nenhum abastecimento registrado ainda.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Data</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Equipamento</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Combustível</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Litros</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">R$/L</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Total</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Medidor</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Fornecedor</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {abastecimentos.map(a => (
                <tr key={a.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-700">
                    {new Date(a.supplyDate).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900">{a.equipment.name}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 capitalize">
                      {a.fuelType}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-gray-700">{a.liters.toLocaleString('pt-BR')} L</td>
                  <td className="px-4 py-3 text-right text-gray-700">{fmt(a.pricePerLiter)}</td>
                  <td className="px-4 py-3 text-right font-semibold text-gray-900">{fmt(a.totalCost)}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {a.meterReading
                      ? `${a.meterReading.toLocaleString('pt-BR')} ${a.meterType === 'hourmeter' ? 'h' : 'km'}`
                      : '—'}
                  </td>
                  <td className="px-4 py-3 text-gray-500">{a.supplier || '—'}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => {
                        if (confirm('Excluir este abastecimento?')) deletar(a.id)
                      }}
                      className="text-red-400 hover:text-red-600 text-xs"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
