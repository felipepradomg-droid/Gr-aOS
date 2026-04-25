// lib/nfeio.ts
// Cliente de integração com NFE.io para emissão de NFS-e

const NFEIO_BASE_URL = 'https://api.nfe.io/v1'
const NFEIO_API_KEY = process.env.NFEIO_API_KEY!
const NFEIO_ENVIRONMENT = process.env.NFEIO_ENVIRONMENT || 'sandbox'

interface NfseData {
  cityServiceCode: string
  description: string
  servicesAmount: number
  borrower: {
    name: string
    email?: string
    federalTaxNumber?: string
    address?: {
      street?: string
      number?: string
      city?: string
      state?: string
      postalCode?: string
    }
  }
}

interface NfseResponse {
  serviceInvoice?: {
    id: string
    number: string
    checkCode: string
    status: string
    pdfUrl?: string
    xmlUrl?: string
  }
  error?: string
}

// Emite uma NFS-e para uma empresa cadastrada no NFE.io
export async function emitirNfse(
  companyId: string,
  data: NfseData
): Promise<NfseResponse> {
  try {
    const response = await fetch(
      `${NFEIO_BASE_URL}/companies/${companyId}/serviceinvoices`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${Buffer.from(NFEIO_API_KEY + ':').toString('base64')}`,
        },
        body: JSON.stringify({
          cityServiceCode: data.cityServiceCode,
          description: data.description,
          servicesAmount: data.servicesAmount,
          borrower: data.borrower,
          environment: NFEIO_ENVIRONMENT,
        }),
      }
    )

    const result = await response.json()

    if (!response.ok) {
      return { error: result.message || 'Erro ao emitir NFS-e' }
    }

    return { serviceInvoice: result }
  } catch (error) {
    console.error('[NFEio] Erro ao emitir NFS-e:', error)
    return { error: 'Falha na conexão com NFE.io' }
  }
}

// Consulta o status de uma NFS-e já emitida
export async function consultarNfse(
  companyId: string,
  invoiceId: string
): Promise<NfseResponse> {
  try {
    const response = await fetch(
      `${NFEIO_BASE_URL}/companies/${companyId}/serviceinvoices/${invoiceId}`,
      {
        headers: {
          'Authorization': `Basic ${Buffer.from(NFEIO_API_KEY + ':').toString('base64')}`,
        },
      }
    )

    const result = await response.json()

    if (!response.ok) {
      return { error: result.message || 'Erro ao consultar NFS-e' }
    }

    return { serviceInvoice: result }
  } catch (error) {
    console.error('[NFEio] Erro ao consultar NFS-e:', error)
    return { error: 'Falha na conexão com NFE.io' }
  }
}

// Cancela uma NFS-e emitida
export async function cancelarNfse(
  companyId: string,
  invoiceId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(
      `${NFEIO_BASE_URL}/companies/${companyId}/serviceinvoices/${invoiceId}`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': `Basic ${Buffer.from(NFEIO_API_KEY + ':').toString('base64')}`,
        },
      }
    )

    if (!response.ok) {
      const result = await response.json()
      return { success: false, error: result.message || 'Erro ao cancelar NFS-e' }
    }

    return { success: true }
  } catch (error) {
    console.error('[NFEio] Erro ao cancelar NFS-e:', error)
    return { success: false, error: 'Falha na conexão com NFE.io' }
  }
}
