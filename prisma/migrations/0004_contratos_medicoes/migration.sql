-- Migration 0004: Contratos e Medições

-- Contract
CREATE TABLE "Contract" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "equipmentId" TEXT NOT NULL,
  "contractNumber" TEXT NOT NULL,
  "clienteNome" TEXT NOT NULL,
  "clienteTel" TEXT,
  "clienteEmail" TEXT,
  "clienteCnpjCpf" TEXT,
  "billingType" TEXT NOT NULL DEFAULT 'daily',
  "rate" DOUBLE PRECISION NOT NULL,
  "currency" TEXT NOT NULL DEFAULT 'BRL',
  "startDate" TIMESTAMP(3) NOT NULL,
  "endDate" TIMESTAMP(3),
  "status" TEXT NOT NULL DEFAULT 'active',
  "siteAddress" TEXT,
  "siteCity" TEXT,
  "operatorName" TEXT,
  "notes" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Contract_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Contract_contractNumber_key" ON "Contract"("contractNumber");
ALTER TABLE "Contract"
  ADD CONSTRAINT "Contract_equipmentId_fkey"
  FOREIGN KEY ("equipmentId") REFERENCES "Equipment"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;

-- Measurement
CREATE TABLE "Measurement" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "contractId" TEXT NOT NULL,
  "measureDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "hoursWorked" DOUBLE PRECISION,
  "daysWorked" DOUBLE PRECISION,
  "amount" DOUBLE PRECISION NOT NULL,
  "operatorName" TEXT,
  "notes" TEXT,
  "status" TEXT NOT NULL DEFAULT 'pending',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Measurement_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "Measurement"
  ADD CONSTRAINT "Measurement_contractId_fkey"
  FOREIGN KEY ("contractId") REFERENCES "Contract"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;

-- ContractInvoice
CREATE TABLE "ContractInvoice" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "contractId" TEXT NOT NULL,
  "periodStart" TIMESTAMP(3) NOT NULL,
  "periodEnd" TIMESTAMP(3) NOT NULL,
  "totalMeasured" DOUBLE PRECISION NOT NULL,
  "totalAmount" DOUBLE PRECISION NOT NULL,
  "invoiceId" TEXT,
  "status" TEXT NOT NULL DEFAULT 'draft',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ContractInvoice_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "ContractInvoice"
  ADD CONSTRAINT "ContractInvoice_contractId_fkey"
  FOREIGN KEY ("contractId") REFERENCES "Contract"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;

-- Registrar migration
INSERT INTO "_prisma_migrations" (
  id, checksum, finished_at, migration_name,
  logs, rolled_back_at, started_at, applied_steps_count
) VALUES (
  '0004_contratos_medicoes',
  '0004_contratos_medicoes',
  now(),
  '0004_contratos_medicoes',
  NULL, NULL, now(), 1
);
