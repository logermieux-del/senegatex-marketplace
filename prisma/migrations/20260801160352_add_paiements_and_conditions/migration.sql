-- AlterTable
ALTER TABLE "Transporteur" ADD COLUMN "conditionsAccepteesAt" DATETIME;
ALTER TABLE "Transporteur" ADD COLUMN "conditionsVersion" TEXT;

-- CreateTable
CREATE TABLE "PaiementTransporteur" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "livraisonId" TEXT NOT NULL,
    "transporteurId" TEXT NOT NULL,
    "montant" INTEGER NOT NULL,
    "statut" TEXT NOT NULL DEFAULT 'PENDING',
    "methode" TEXT,
    "reference" TEXT,
    "paidByAdminId" TEXT,
    "paidAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "PaiementTransporteur_livraisonId_fkey" FOREIGN KEY ("livraisonId") REFERENCES "Livraison" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PaiementTransporteur_transporteurId_fkey" FOREIGN KEY ("transporteurId") REFERENCES "Transporteur" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "PaiementTransporteur_livraisonId_key" ON "PaiementTransporteur"("livraisonId");

-- CreateIndex
CREATE INDEX "PaiementTransporteur_transporteurId_idx" ON "PaiementTransporteur"("transporteurId");

-- CreateIndex
CREATE INDEX "PaiementTransporteur_statut_idx" ON "PaiementTransporteur"("statut");

-- CreateIndex
CREATE INDEX "PaiementTransporteur_createdAt_idx" ON "PaiementTransporteur"("createdAt");
