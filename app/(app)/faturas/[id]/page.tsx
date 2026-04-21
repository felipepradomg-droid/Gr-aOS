import { getInvoiceById } from '@/lib/actions/invoices'
import { InvoiceActions } from '@/components/invoices/invoice-actions'
import { InvoiceWhatsAppButton } from '@/components/invoices/invoice-whatsapp-button'
import { notFound } from 'next/navigation'
import { formatCurrency } from '@/lib/utils'
import { ChevronLeft, FileText } from 'lucide-react'
import Link from 'next/link'

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  draft: { label: 'Rascunho', color: 'bg-gray-100 text-gray-600' },
  sent: { label: 'Enviada', color: 'bg-blue-100 text-blue-700' },
  paid: { label: 'Paga ✅', color: 'bg-green-100 text-green-700' },
  overdue: { label: 'Vencida ⚠️', color: 'bg-red-100 text-red-600' },
  cancelled: { label: 'Cancelada', color: 'bg-gray-100 text-gray-400' },
}

export default async function InvoiceDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const invoice = await getInvoiceById(params.id)
  if (!invoice) notFound()

  const statusConfig = STATUS_CONFIG[invoice.status] ?? STATUS_CONFIG.draft
  const isOverdue =
    invoice.status === 'sent' && new Date(invoice.dueDate) < new Date()

  return (
    <div className="max-w-xl mx-auto p-4 md:p-6 space-y-5">
      {/* Header */}
      <div className="flex items-start gap-3">
        <Link href="/faturas">
          <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors mt-0.5">
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </button>
        </Link>
        <div className="flex-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-xs font-bold text-gray-400">
                {invoice.invoiceNumber}
              </p>
              <h1 className="text-xl font-bold text-gray-900 mt-0.5">
                {invoice.clienteNome}
              </h1>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold shrink-0 ${
                isOverdue ? 'bg-red-100 text-red-600' : statusConfig.color
              }`}
            >
              {isOverdue ? 'Vencida ⚠️' : statusConfig.label}
            </span>
          </div>
        </div>
      </div>

      {/* Valor destaque */}
      <div className="bg-gray-900 text-white rounded-2xl p-6 text-center">
        <p className="text-sm text-gray-400 mb-1">Valor Total</p>
        <p className="text-4xl font-bold">
          {formatCurrency(invoice.totalAmount)}
        </p>
        {invoice.taxAmount > 0 && (
          <p className="text-sm text-gray-400 mt-1">
            inclui {formatCurrency(invoice.taxAmount)} de impostos
          </p>
        )}
      </div>

      {/* Detalhes */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide">
              Emissão
            </p>
            <p className="font-medium text-gray-900 mt-0.5">
              {new Date(invoice.issueDate).toLocaleDateString('pt-BR')}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide">
              Vencimento
            </p>
            <p
              className={`font-medium mt-0.5 ${
                isOverdue ? 'text-red-600' : 'text-gray-900'
              }`}
            >
              {new Date(invoice.dueDate).toLocaleDateString('pt-BR')}
            </p>
          </div>
        </div>

        {invoice.clienteTel && (
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide">
              Telefone
            </p>
            <p className="font-medium text-gray-900 mt-0.5">
              {invoice.clienteTel}
            </p>
          </div>
        )}

        {invoice.clienteEmail && (
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide">
              E-mail
            </p>
            <p className="font-medium text-gray-900 mt-0.5">
              {invoice.clienteEmail}
            </p>
          </div>
        )}

        {invoice.paymentMethod && (
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide">
              Forma de Pagamento
            </p>
            <p className="font-medium text-gray-900 mt-0.5">
              {invoice.paymentMethod === 'pix'
                ? '💳 Pix'
                : invoice.paymentMethod === 'boleto'
                ? '📄 Boleto'
                : invoice.paymentMethod === 'transfer'
                ? '🏦 Transferência'
                : invoice.paymentMethod === 'cash'
                ? '💵 Dinheiro'
                : invoice.paymentMethod}
            </p>
          </div>
        )}

        {/* OS vinculada */}
        {invoice.serviceOrder && (
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide">
              Ordem de Serviço
            </p>
            <Link href={`/os/${invoice.serviceOrderId}`}>
              <div className="flex items-center gap-2 mt-1 text-blue-600 hover:text-blue-700">
                <FileText className="h-4 w-4" />
                <span className="text-sm font-medium">
                  {invoice.serviceOrder.osNumber}
                </span>
                {invoice.serviceOrder.equipment && (
                  <span className="text-sm text-gray-500">
                    · {invoice.serviceOrder.equipment.name}
                  </span>
                )}
              </div>
            </Link>
          </div>
        )}

        {invoice.notes && (
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide">
              Observações
            </p>
            <p className="text-sm text-gray-700 mt-0.5">{invoice.notes}</p>
          </div>
        )}

        {/* Pago em */}
        {invoice.paidAt && (
          <div className="bg-green-50 rounded-lg p-3">
            <p className="text-sm text-green-700 font-medium">
              ✅ Pago em{' '}
              {new Date(invoice.paidAt).toLocaleDateString('pt-BR')}
            </p>
          </div>
        )}
      </div>

      {/* Ações */}
      <div className="flex flex-col gap-3">
        <InvoiceWhatsAppButton
          invoiceNumber={invoice.invoiceNumber}
          clienteNome={invoice.clienteNome}
          clienteTel={invoice.clienteTel}
          totalAmount={invoice.totalAmount}
          dueDate={invoice.dueDate as unknown as string}
          status={invoice.status}
          paymentMethod={invoice.paymentMethod}
        />
        <InvoiceActions invoiceId={invoice.id} status={invoice.status} />
      </div>
    </div>
  )
}
