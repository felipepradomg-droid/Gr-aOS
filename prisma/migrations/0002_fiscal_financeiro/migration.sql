-- Migration 0002: Módulo Fiscal e Financeiro

-- NFS-e Providers
CREATE TABLE "NfseProvider" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "baseUrl" TEXT NOT NULL,
  "authType" TEXT NOT NULL,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "NfseProvider_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "NfseProvider_name_key" ON "NfseProvider"("name");

-- Municipality Tax Config
CREATE TABLE "MunicipalityTaxConfig" (
  "id" TEXT NOT NULL,
  "ibgeCode" CHAR(7) NOT NULL,
  "cityName" TEXT NOT NULL,
  "state" CHAR(2) NOT NULL,
  "providerId" TEXT NOT NULL,
  "providerCredentials" JSONB,
  "issRate" DOUBLE PRECISION,
  "serviceCode" TEXT,
  "serviceDescription" TEXT,
  "requiresRps" BOOLEAN NOT NULL DEFAULT true,
  "nfseEnvironment" TEXT NOT NULL DEFAULT 'homologacao',
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "MunicipalityTaxConfig_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "MunicipalityTaxConfig_ibgeCode_key" ON "MunicipalityTaxConfig"("ibgeCode");
ALTER TABLE "MunicipalityTaxConfig"
  ADD CONSTRAINT "MunicipalityTaxConfig_providerId_fkey"
  FOREIGN KEY ("providerId") REFERENCES "NfseProvider"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;

-- Adicionar campos fiscais na Invoice existente
ALTER TABLE "Invoice"
  ADD COLUMN IF NOT EXISTS "clienteCnpjCpf" TEXT,
  ADD COLUMN IF NOT EXISTS "municipalityConfigId" TEXT,
  ADD COLUMN IF NOT EXISTS "rpsNumber" INTEGER,
  ADD COLUMN IF NOT EXISTS "rpsSeries" TEXT,
  ADD COLUMN IF NOT EXISTS "nfseNumber" TEXT,
  ADD COLUMN IF NOT EXISTS "nfseVerificationCode" TEXT,
  ADD COLUMN IF NOT EXISTS "nfsePdfUrl" TEXT,
  ADD COLUMN IF NOT EXISTS "nfseXml" TEXT,
  ADD COLUMN IF NOT EXISTS "providerProtocol" TEXT,
  ADD COLUMN IF NOT EXISTS "providerResponse" JSONB,
  ADD COLUMN IF NOT EXISTS "errorMessage" TEXT,
  ADD COLUMN IF NOT EXISTS "emittedAt" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "cancelledAt" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "whatsappSentAt" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "whatsappMessageId" TEXT;
ALTER TABLE "Invoice"
  ADD CONSTRAINT "Invoice_municipalityConfigId_fkey"
  FOREIGN KEY ("municipalityConfigId") REFERENCES "MunicipalityTaxConfig"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

-- Bank Accounts
CREATE TABLE "BankAccount" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "bankName" TEXT NOT NULL,
  "bankCode" TEXT,
  "agency" TEXT,
  "accountNumber" TEXT,
  "accountType" TEXT,
  "integrationType" TEXT,
  "apiCredentials" JSONB,
  "externalAccountId" TEXT,
  "currentBalance" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "balanceUpdatedAt" TIMESTAMP(3),
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "BankAccount_pkey" PRIMARY KEY ("id")
);

-- Bank Transactions
CREATE TABLE "BankTransaction" (
  "id" TEXT NOT NULL,
  "bankAccountId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "transactionDate" TIMESTAMP(3) NOT NULL,
  "description" TEXT NOT NULL,
  "amount" DOUBLE PRECISION NOT NULL,
  "balanceAfter" DOUBLE PRECISION,
  "externalId" TEXT,
  "documentNumber" TEXT,
  "counterpartDocument" TEXT,
  "counterpartName" TEXT,
  "paymentType" TEXT,
  "reconciliationStatus" TEXT NOT NULL DEFAULT 'pending',
  "confidenceScore" DOUBLE PRECISION,
  "importedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "BankTransaction_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "BankTransaction_externalId_key" ON "BankTransaction"("externalId");
ALTER TABLE "BankTransaction"
  ADD CONSTRAINT "BankTransaction_bankAccountId_fkey"
  FOREIGN KEY ("bankAccountId") REFERENCES "BankAccount"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;

-- Receivables
CREATE TABLE "Receivable" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "invoiceId" TEXT,
  "bankAccountId" TEXT,
  "clienteNome" TEXT NOT NULL,
  "clienteCnpjCpf" TEXT,
  "paymentMethod" TEXT NOT NULL,
  "amount" DOUBLE PRECISION NOT NULL,
  "dueDate" TIMESTAMP(3) NOT NULL,
  "externalId" TEXT,
  "barcode" TEXT,
  "pixKey" TEXT,
  "pixQrcode" TEXT,
  "paymentUrl" TEXT,
  "status" TEXT NOT NULL DEFAULT 'pending',
  "paidAmount" DOUBLE PRECISION,
  "paidAt" TIMESTAMP(3),
  "paymentMethodUsed" TEXT,
  "fineAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "interestAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "discountAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "bankTransactionId" TEXT,
  "reconciledAt" TIMESTAMP(3),
  "reconciledBy" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Receivable_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Receivable_invoiceId_key" ON "Receivable"("invoiceId");
CREATE UNIQUE INDEX "Receivable_externalId_key" ON "Receivable"("externalId");
CREATE UNIQUE INDEX "Receivable_bankTransactionId_key" ON "Receivable"("bankTransactionId");
ALTER TABLE "Receivable"
  ADD CONSTRAINT "Receivable_invoiceId_fkey"
  FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Receivable"
  ADD CONSTRAINT "Receivable_bankAccountId_fkey"
  FOREIGN KEY ("bankAccountId") REFERENCES "BankAccount"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Receivable"
  ADD CONSTRAINT "Receivable_bankTransactionId_fkey"
  FOREIGN KEY ("bankTransactionId") REFERENCES "BankTransaction"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

-- Reconciliation Log
CREATE TABLE "ReconciliationLog" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "bankTransactionId" TEXT NOT NULL,
  "receivableId" TEXT,
  "action" TEXT NOT NULL,
  "performedBy" TEXT,
  "confidenceScore" DOUBLE PRECISION,
  "notes" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ReconciliationLog_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "ReconciliationLog"
  ADD CONSTRAINT "ReconciliationLog_bankTransactionId_fkey"
  FOREIGN KEY ("bankTransactionId") REFERENCES "BankTransaction"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;

-- Registrar esta migration no controle do Prisma
INSERT INTO "_prisma_migrations" (
  id, checksum, finished_at, migration_name,
  logs, rolled_back_at, started_at, applied_steps_count
) VALUES (
  '0002_fiscal_financeiro',
  '0002_fiscal_financeiro',
  now(),
  '0002_fiscal_financeiro',
  NULL, NULL, now(), 1
);
