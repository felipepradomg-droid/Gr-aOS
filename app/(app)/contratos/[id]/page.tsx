import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { MeasurementForm } from '@/components/MeasurementForm'
import { formatCurrency, formatDate } from '@/lib/utils'
import { ArrowLeft, MapPin, Calendar, Clock, Wrench, FileText, Send } from 'lucide-react'
import Link from 'next/link'
import { faturarContrato } from './actions'

export default async function ContratoDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) redirect('/login')

  const contrato = await prisma.contract.findFirst({
    where: { id: params.id, userId: session.user.id },
    include: {
      equipment: { select: { name: true, type: true } },
      measurements: { orderBy: { measureDate: 'desc' } },
      invoices: { orderBy: { createdAt: 'desc' } },
    },
  })

  if (!contrato) redirect('/contratos')

  const medicoesPendentes = contrato.measurements.filter(m => m.status === 'pending')
  const medicoesFlaturadas = contrato.measurements.filter(m => m.status === 'invoiced')
  const totalPendente = medicoesPendentes.reduce((s, m) => s + m.amount, 0)
  const totalFaturado = medicoesFlaturadas.reduce((s, m) => s + m.amount, 0)

  const BILLING_LABELS: Record<string, string> = {
    hourly: 'por hora',
    daily: 'por diária',
    monthly: 'por mês',
  }

  const STATUS_COLORS: Record<string, string> = {
    active: 'text-green-700 bg-green-100',
    paused: 'text-yellow-700 bg-yellow-100',
    completed: 'text-blue-700 bg-blue-100',
    cancelled: 'text-gray-500 bg-gray-100',
  }

  const STATUS_LABELS: Record<string, string> = {
    active: 'Ativo',
    paused: 'Pausado',
    completed: 'Concluído',
    cancelled: 'Cancelado',
  }

  const fmt = (d: Date | null | undefined) =>
    d ? formatDate(d.toISOString()) : '-'

  const contratoId = contrato.id

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/contratos">
          <button className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
            <ArrowLeft className="h-4 w-4 text-gray-600" />
          </button>
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-xs font-bold text-gray-400">{contrato.contractNumber}</p>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_COLORS[contrato.status]}`}>
              {STATUS_LABELS[contrato.status]}
            </span>
          </div>
          <h1 className="text-xl font-bold text-gray-900 truncate">{contrato.clienteNome}</h1>
        </div>
      </div>

      {/* Info do contrato */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-sm text-gray-600">
            <Wrench className="h-4 w-4 text-gray-400" />
            <span className="font-medium">{contrato.equipment.name}</span>
          </div>
          <p className="text-base font-bold text-gray-900">
            {formatCurrency(contrato.rate)}
            <span className="text-xs font-normal text-gray-400 ml-1">
              {BILLING_LABELS[contrato.billingType]}
            </span>
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3 w-3" />
            <span>Início: {fmt(contrato.startDate)}</span>
          </div>
          {contrato.endDate && (
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3 w-3" />
              <span>Fim: {fmt(contrato.endDate)}</span>
            </div>
          )}
          {contrato.siteCity && (
            <div className="flex items-center gap-1.5">
              <MapPin className="h-3 w-3" />
              <span>{contrato.siteCity}</span>
            </div>
          )}
          {contrato.operatorName && (
            <div className="flex items-center gap-1.5">
              <Clock className="h-3 w-3" />
              <span>{contrato.operatorName}</span>
            </div>
          )}
        </div>

        {contrato.notes && (
          <p className="text-xs text-gray-400 leading-relaxed border-t border-gray-100 pt-3">
            {contrato.notes}
          </p>
        )}
      </div>

      {/* Totais */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-orange-50 rounded-xl border border-orange-200 p-4">
          <p className="text-xs text-orange-600 uppercase tracking-wide">A Faturar</p>
          <p className="text-xl font-bold text-orange-700 mt-1">
            {formatCurrency(totalPendente)}
          </p>
          <p className="text-xs text-orange-500 mt-0.5">
            {medicoesPendentes.length} medição(ões)
          </p>
        </div>
        <div className="bg-green-50 rounded-xl border border-green-200 p-4">
          <p className="text-xs text-green-600 uppercase tracking-wide">Faturado</p>
          <p className="text-xl font-bold text-green-700 mt-1">
            {formatCurrency(totalFaturado)}
          </p>
          <p className="text-xs text-green-500 mt-0.5">
            {medicoesFlaturadas.length} medição(ões)
          </p>
        </div>
      </div>

      {/* Registrar medição */}
      {contrato.status === 'active' && (
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Registrar Medição</h3>
          <MeasurementForm contract={contrato as any} />
        </div>
      )}

      {/* Botão faturar */}
      {medicoesPendentes.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-800">Gerar Fatura do Período</p>
              <p className="text-xs text-gray-500 mt-0.5">
                {medicoesPendentes.length} medições · {formatCurrency(totalPendente)}
              </p>
            </div>
            <FileText className="h-5 w-5 text-gray-400" />
          </div>
          <form action={faturarContrato.bind(null, contratoId)}>
            <button
              type="submit"
              className="w-full py-3 bg-gray-900 text-white rounded-lg text-sm font-semibold hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
            >
              <Send className="h-4 w-4" />
              Gerar Fatura do Período
            </button>
          </form>
        </div>
      )}

      {/* Histórico de medições */}
      {contrato.measurements.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            Histórico de Medições
          </h3>
          <div className="space-y-2">
            {contrato.measurements.map(m => (
              <div
                key={m.id}
                className="bg-white rounded-xl border border-gray-200 p-3 flex items-center justify-between"
              >
                <div>
                  <p className="text-xs text-gray-400">
                    {fmt(m.measureDate)}
                    {m.operatorName && ` · ${m.operatorName}`}
                  </p>
                  <p className="text-sm text-gray-600 mt-0.5">
                    {m.hoursWorked ? `${m.hoursWorked}h` : ''}
                    {m.daysWorked ? `${m.daysWorked} diária(s)` : ''}
                    {m.notes ? ` · ${m.notes}` : ''}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-gray-900">
                    {formatCurrency(m.amount)}
                  </p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    m.status === 'invoiced'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-orange-100 text-orange-700'
                  }`}>
                    {m.status === 'invoiced' ? 'Faturado' : 'Pendente'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Faturas geradas */}
      {contrato.invoices.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            Faturas Geradas
          </h3>
          <div className="space-y-2">
            {contrato.invoices.map(inv => (
              <div
                key={inv.id}
                className="bg-white rounded-xl border border-gray-200 p-3 flex items-center justify-between"
              >
                <div>
                  <p className="text-xs text-gray-400">
                    {fmt(inv.periodStart)} a {fmt(inv.periodEnd)}
                  </p>
                  <p className="text-sm font-medium text-gray-700 mt-0.5">
                    {inv.totalMeasured} {contrato.billingType === 'hourly' ? 'horas' : 'diárias'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-gray-900">
                    {formatCurrency(inv.totalAmount)}
                  </p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    inv.status === 'paid'
                      ? 'bg-green-100 text-green-700'
                      : inv.status === 'sent'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {inv.status === 'paid' ? 'Paga' : inv.status === 'sent' ? 'Enviada' : 'Rascunho'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
