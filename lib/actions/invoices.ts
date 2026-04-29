export async function createInvoice(formData: FormData) {
  try {
    const userId = await getUserId()

    const count = await prisma.invoice.count({ where: { userId } })
    const invoiceNumber = generateInvoiceNumber(count + 1)

    const amount = parseFloat(formData.get('amount') as string)
    const taxAmount = parseFloat(formData.get('taxAmount') as string) || 0

    const invoice = await prisma.invoice.create({
      data: {
        userId,
        invoiceNumber,
        clienteNome: formData.get('clienteNome') as string,
        clienteCnpjCpf: (formData.get('clienteCnpjCpf') as string) || null,
        clienteTel: (formData.get('clienteTel') as string) || null,
        clienteEmail: (formData.get('clienteEmail') as string) || null,
        status: 'draft',
        issueDate: new Date(formData.get('issueDate') as string),
        dueDate: new Date(formData.get('dueDate') as string),
        amount,
        taxAmount,
        totalAmount: amount + taxAmount,
        paymentMethod: (formData.get('paymentMethod') as string) || null,
        notes: (formData.get('notes') as string) || null,
      },
    })

    revalidatePath('/faturas')
    return { data: invoice, error: null }
  } catch (e) {
    return { data: null, error: 'Erro ao criar fatura' }
  }
}
