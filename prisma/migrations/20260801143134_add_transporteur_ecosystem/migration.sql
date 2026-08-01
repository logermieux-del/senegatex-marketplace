-- AlterTable
ALTER TABLE "User" ADD COLUMN "arrondissement" TEXT;
ALTER TABLE "User" ADD COLUMN "pointRetrait" TEXT;
ALTER TABLE "User" ADD COLUMN "region" TEXT;

-- CreateTable
CREATE TABLE "Transporteur" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "typeVehicule" TEXT NOT NULL,
    "plaqueImmatriculation" TEXT NOT NULL,
    "regionsCouvertes" TEXT NOT NULL,
    "tarifParZone" TEXT NOT NULL,
    "capaciteVolume" TEXT NOT NULL,
    "statut" TEXT NOT NULL DEFAULT 'PENDING',
    "documentsVerification" TEXT,
    "dateVerification" DATETIME,
    "notianceGlobale" REAL NOT NULL DEFAULT 0.0,
    "nombreLivraisons" INTEGER NOT NULL DEFAULT 0,
    "tauxDisputes" REAL NOT NULL DEFAULT 0.0,
    "lastActivityAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Transporteur_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Livraison" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "transactionId" TEXT,
    "transporteurId" TEXT NOT NULL,
    "adresseDepart" TEXT NOT NULL,
    "adresseArrivee" TEXT NOT NULL,
    "statut" TEXT NOT NULL DEFAULT 'PENDING',
    "locationActuelle" TEXT,
    "tarifNegocie" INTEGER NOT NULL,
    "commissionYombal" INTEGER NOT NULL,
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

-- CreateTable
CREATE TABLE "Dispute" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "livraisonId" TEXT NOT NULL,
    "signaleParUserId" TEXT NOT NULL,
    "raison" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "preuves" TEXT,
    "statut" TEXT NOT NULL DEFAULT 'OPEN',
    "resolution" TEXT,
    "reviewedByAdmin" TEXT,
    "dateResolution" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Dispute_livraisonId_fkey" FOREIGN KEY ("livraisonId") REFERENCES "Livraison" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Dispute_signaleParUserId_fkey" FOREIGN KEY ("signaleParUserId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Transporteur_userId_key" ON "Transporteur"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Transporteur_plaqueImmatriculation_key" ON "Transporteur"("plaqueImmatriculation");

-- CreateIndex
CREATE INDEX "Transporteur_userId_idx" ON "Transporteur"("userId");

-- CreateIndex
CREATE INDEX "Transporteur_statut_idx" ON "Transporteur"("statut");

-- CreateIndex
CREATE INDEX "Transporteur_regionsCouvertes_idx" ON "Transporteur"("regionsCouvertes");

-- CreateIndex
CREATE INDEX "Livraison_transporteurId_idx" ON "Livraison"("transporteurId");

-- CreateIndex
CREATE INDEX "Livraison_statut_idx" ON "Livraison"("statut");

-- CreateIndex
CREATE INDEX "Livraison_createdAt_idx" ON "Livraison"("createdAt");

-- CreateIndex
CREATE INDEX "Dispute_livraisonId_idx" ON "Dispute"("livraisonId");

-- CreateIndex
CREATE INDEX "Dispute_statut_idx" ON "Dispute"("statut");

-- CreateIndex
CREATE INDEX "Dispute_createdAt_idx" ON "Dispute"("createdAt");

-- CreateIndex
CREATE INDEX "User_region_idx" ON "User"("region");
