-- CreateTable
CREATE TABLE "RemboursementAssurance" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "disputeId" TEXT NOT NULL,
    "livraisonId" TEXT NOT NULL,
    "beneficiaireUserId" TEXT NOT NULL,
    "montant" INTEGER NOT NULL,
    "statut" TEXT NOT NULL DEFAULT 'PENDING',
    "methode" TEXT,
    "reference" TEXT,
    "paidByAdminId" TEXT,
    "paidAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "RemboursementAssurance_disputeId_fkey" FOREIGN KEY ("disputeId") REFERENCES "Dispute" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "RemboursementAssurance_livraisonId_fkey" FOREIGN KEY ("livraisonId") REFERENCES "Livraison" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "RemboursementAssurance_beneficiaireUserId_fkey" FOREIGN KEY ("beneficiaireUserId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Livraison" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "transactionId" TEXT,
    "transporteurId" TEXT NOT NULL,
    "adresseDepart" TEXT NOT NULL,
    "adresseArrivee" TEXT NOT NULL,
    "statut" TEXT NOT NULL DEFAULT 'PENDING',
    "locationActuelle" TEXT,
    "tarifNegocie" INTEGER NOT NULL,
    "commissionYombal" INTEGER NOT NULL,
    "assuranceMontant" INTEGER NOT NULL DEFAULT 0,
    "datePrise" DATETIME,
    "dateEstimeeArrivee" DATETIME,
    "dateArriveeReelle" DATETIME,
    "photoPreuve" TEXT,
    "ratingAcheteur" TEXT,
    "incident" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Livraison_transporteurId_fkey" FOREIGN KEY ("transporteurId") REFERENCES "Transporteur" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Livraison" ("adresseArrivee", "adresseDepart", "commissionYombal", "createdAt", "dateArriveeReelle", "dateEstimeeArrivee", "datePrise", "id", "incident", "locationActuelle", "photoPreuve", "ratingAcheteur", "statut", "tarifNegocie", "transactionId", "transporteurId", "updatedAt") SELECT "adresseArrivee", "adresseDepart", "commissionYombal", "createdAt", "dateArriveeReelle", "dateEstimeeArrivee", "datePrise", "id", "incident", "locationActuelle", "photoPreuve", "ratingAcheteur", "statut", "tarifNegocie", "transactionId", "transporteurId", "updatedAt" FROM "Livraison";
DROP TABLE "Livraison";
ALTER TABLE "new_Livraison" RENAME TO "Livraison";
CREATE INDEX "Livraison_transporteurId_idx" ON "Livraison"("transporteurId");
CREATE INDEX "Livraison_statut_idx" ON "Livraison"("statut");
CREATE INDEX "Livraison_createdAt_idx" ON "Livraison"("createdAt");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "RemboursementAssurance_disputeId_key" ON "RemboursementAssurance"("disputeId");

-- CreateIndex
CREATE INDEX "RemboursementAssurance_statut_idx" ON "RemboursementAssurance"("statut");

-- CreateIndex
CREATE INDEX "RemboursementAssurance_createdAt_idx" ON "RemboursementAssurance"("createdAt");
