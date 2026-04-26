-- Migration 0003: Manutenção Preditiva

-- HourMeter (Horímetro)
CREATE TABLE "HourMeter" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "equipmentId" TEXT NOT NULL,
  "reading" DOUBLE PRECISION NOT NULL,
  "readingDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "recordedBy" TEXT,
  "notes" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "HourMeter_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "HourMeter"
  ADD CONSTRAINT "HourMeter_equipmentId_fkey"
  FOREIGN KEY ("equipmentId") REFERENCES "Equipment"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;

-- MaintenancePlan (Plano de Manutenção)
CREATE TABLE "MaintenancePlan" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "equipmentId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "triggerType" TEXT NOT NULL DEFAULT 'hours',
  "intervalHours" DOUBLE PRECISION,
  "intervalDays" INTEGER,
  "lastDoneAt" TIMESTAMP(3),
  "lastDoneHours" DOUBLE PRECISION,
  "nextDueAt" TIMESTAMP(3),
  "nextDueHours" DOUBLE PRECISION,
  "estimatedCost" DOUBLE PRECISION,
  "status" TEXT NOT NULL DEFAULT 'active',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "MaintenancePlan_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "MaintenancePlan"
  ADD CONSTRAINT "MaintenancePlan_equipmentId_fkey"
  FOREIGN KEY ("equipmentId") REFERENCES "Equipment"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;

-- MaintenanceAlert (Alertas)
CREATE TABLE "MaintenanceAlert" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "equipmentId" TEXT NOT NULL,
  "planId" TEXT,
  "alertType" TEXT NOT NULL,
  "message" TEXT NOT NULL,
  "triggeredAt" DOUBLE PRECISION,
  "dueDate" TIMESTAMP(3),
  "status" TEXT NOT NULL DEFAULT 'pending',
  "resolvedAt" TIMESTAMP(3),
  "blocksBooking" BOOLEAN NOT NULL DEFAULT false,
  "whatsappSentAt" TIMESTAMP(3),
  "whatsappMessageId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "MaintenanceAlert_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "MaintenanceAlert"
  ADD CONSTRAINT "MaintenanceAlert_equipmentId_fkey"
  FOREIGN KEY ("equipmentId") REFERENCES "Equipment"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "MaintenanceAlert"
  ADD CONSTRAINT "MaintenanceAlert_planId_fkey"
  FOREIGN KEY ("planId") REFERENCES "MaintenancePlan"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

-- EquipmentCost (Custos TCO)
CREATE TABLE "EquipmentCost" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "equipmentId" TEXT NOT NULL,
  "costType" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "amount" DOUBLE PRECISION NOT NULL,
  "costDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "maintenanceRecordId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "EquipmentCost_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "EquipmentCost"
  ADD CONSTRAINT "EquipmentCost_equipmentId_fkey"
  FOREIGN KEY ("equipmentId") REFERENCES "Equipment"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;

-- Registrar migration
INSERT INTO "_prisma_migrations" (
  id, checksum, finished_at, migration_name,
  logs, rolled_back_at, started_at, applied_steps_count
) VALUES (
  '0003_manutencao_preditiva',
  '0003_manutencao_preditiva',
  now(),
  '0003_manutencao_preditiva',
  NULL, NULL, now(), 1
);
