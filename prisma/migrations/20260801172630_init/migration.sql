-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "name" TEXT NOT NULL,
    "avatar" TEXT,
    "bio" TEXT,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "emailVerified" TIMESTAMP(3),
    "password" TEXT NOT NULL,
    "region" TEXT,
    "arrondissement" TEXT,
    "pointRetrait" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isSuspended" BOOLEAN NOT NULL DEFAULT false,
    "suspendedUntil" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Listing" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'XOF',
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "city" TEXT NOT NULL,
    "region" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "photos" TEXT,
    "thumbnail" TEXT,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "expiresAt" TIMESTAMP(3),

    CONSTRAINT "Listing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "fromUserId" TEXT NOT NULL,
    "toUserId" TEXT NOT NULL,
    "listingId" TEXT,
    "body" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "sellerId" TEXT NOT NULL,
    "buyerId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'XOF',
    "paymentMethod" TEXT NOT NULL,
    "paymentStatus" TEXT NOT NULL DEFAULT 'PENDING',
    "stripePaymentId" TEXT,
    "waveTransactionId" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "fromUserId" TEXT NOT NULL,
    "toUserId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "transactionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Report" (
    "id" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "reportedBy" TEXT,
    "reason" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "reviewedBy" TEXT,
    "adminNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ModeratorAction" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "targetUserId" TEXT,
    "targetListingId" TEXT,
    "duration" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ModeratorAction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transporteur" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "typeVehicule" TEXT NOT NULL,
    "plaqueImmatriculation" TEXT NOT NULL,
    "regionsCouvertes" TEXT NOT NULL,
    "tarifParZone" TEXT NOT NULL,
    "capaciteVolume" TEXT NOT NULL,
    "statut" TEXT NOT NULL DEFAULT 'PENDING',
    "documentsVerification" TEXT,
    "dateVerification" TIMESTAMP(3),
    "notianceGlobale" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "nombreLivraisons" INTEGER NOT NULL DEFAULT 0,
    "tauxDisputes" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "lastActivityAt" TIMESTAMP(3),
    "conditionsAccepteesAt" TIMESTAMP(3),
    "conditionsVersion" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transporteur_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Livraison" (
    "id" TEXT NOT NULL,
    "transactionId" TEXT,
    "transporteurId" TEXT NOT NULL,
    "adresseDepart" TEXT NOT NULL,
    "adresseArrivee" TEXT NOT NULL,
    "statut" TEXT NOT NULL DEFAULT 'PENDING',
    "locationActuelle" TEXT,
    "tarifNegocie" INTEGER NOT NULL,
    "commissionYombal" INTEGER NOT NULL,
    "assuranceMontant" INTEGER NOT NULL DEFAULT 0,
    "datePrise" TIMESTAMP(3),
    "dateEstimeeArrivee" TIMESTAMP(3),
    "dateArriveeReelle" TIMESTAMP(3),
    "photoPreuve" TEXT,
    "ratingAcheteur" TEXT,
    "incident" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Livraison_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Dispute" (
    "id" TEXT NOT NULL,
    "livraisonId" TEXT NOT NULL,
    "signaleParUserId" TEXT NOT NULL,
    "raison" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "preuves" TEXT,
    "statut" TEXT NOT NULL DEFAULT 'OPEN',
    "resolution" TEXT,
    "reviewedByAdmin" TEXT,
    "dateResolution" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Dispute_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RemboursementAssurance" (
    "id" TEXT NOT NULL,
    "disputeId" TEXT NOT NULL,
    "livraisonId" TEXT NOT NULL,
    "beneficiaireUserId" TEXT NOT NULL,
    "montant" INTEGER NOT NULL,
    "statut" TEXT NOT NULL DEFAULT 'PENDING',
    "methode" TEXT,
    "reference" TEXT,
    "paidByAdminId" TEXT,
    "paidAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RemboursementAssurance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaiementTransporteur" (
    "id" TEXT NOT NULL,
    "livraisonId" TEXT NOT NULL,
    "transporteurId" TEXT NOT NULL,
    "montant" INTEGER NOT NULL,
    "statut" TEXT NOT NULL DEFAULT 'PENDING',
    "methode" TEXT,
    "reference" TEXT,
    "paidByAdminId" TEXT,
    "paidAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PaiementTransporteur_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_phone_idx" ON "User"("phone");

-- CreateIndex
CREATE INDEX "User_isActive_idx" ON "User"("isActive");

-- CreateIndex
CREATE INDEX "User_region_idx" ON "User"("region");

-- CreateIndex
CREATE INDEX "Listing_userId_idx" ON "Listing"("userId");

-- CreateIndex
CREATE INDEX "Listing_status_idx" ON "Listing"("status");

-- CreateIndex
CREATE INDEX "Listing_city_idx" ON "Listing"("city");

-- CreateIndex
CREATE INDEX "Listing_category_idx" ON "Listing"("category");

-- CreateIndex
CREATE INDEX "Listing_createdAt_idx" ON "Listing"("createdAt");

-- CreateIndex
CREATE INDEX "Message_fromUserId_idx" ON "Message"("fromUserId");

-- CreateIndex
CREATE INDEX "Message_toUserId_idx" ON "Message"("toUserId");

-- CreateIndex
CREATE INDEX "Message_listingId_idx" ON "Message"("listingId");

-- CreateIndex
CREATE INDEX "Message_createdAt_idx" ON "Message"("createdAt");

-- CreateIndex
CREATE INDEX "Transaction_sellerId_idx" ON "Transaction"("sellerId");

-- CreateIndex
CREATE INDEX "Transaction_buyerId_idx" ON "Transaction"("buyerId");

-- CreateIndex
CREATE INDEX "Transaction_listingId_idx" ON "Transaction"("listingId");

-- CreateIndex
CREATE INDEX "Transaction_paymentStatus_idx" ON "Transaction"("paymentStatus");

-- CreateIndex
CREATE INDEX "Transaction_createdAt_idx" ON "Transaction"("createdAt");

-- CreateIndex
CREATE INDEX "Review_fromUserId_idx" ON "Review"("fromUserId");

-- CreateIndex
CREATE INDEX "Review_toUserId_idx" ON "Review"("toUserId");

-- CreateIndex
CREATE UNIQUE INDEX "Review_fromUserId_toUserId_key" ON "Review"("fromUserId", "toUserId");

-- CreateIndex
CREATE INDEX "Report_listingId_idx" ON "Report"("listingId");

-- CreateIndex
CREATE INDEX "Report_status_idx" ON "Report"("status");

-- CreateIndex
CREATE INDEX "Report_createdAt_idx" ON "Report"("createdAt");

-- CreateIndex
CREATE INDEX "ModeratorAction_userId_idx" ON "ModeratorAction"("userId");

-- CreateIndex
CREATE INDEX "ModeratorAction_createdAt_idx" ON "ModeratorAction"("createdAt");

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
CREATE UNIQUE INDEX "RemboursementAssurance_disputeId_key" ON "RemboursementAssurance"("disputeId");

-- CreateIndex
CREATE INDEX "RemboursementAssurance_statut_idx" ON "RemboursementAssurance"("statut");

-- CreateIndex
CREATE INDEX "RemboursementAssurance_createdAt_idx" ON "RemboursementAssurance"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "PaiementTransporteur_livraisonId_key" ON "PaiementTransporteur"("livraisonId");

-- CreateIndex
CREATE INDEX "PaiementTransporteur_transporteurId_idx" ON "PaiementTransporteur"("transporteurId");

-- CreateIndex
CREATE INDEX "PaiementTransporteur_statut_idx" ON "PaiementTransporteur"("statut");

-- CreateIndex
CREATE INDEX "PaiementTransporteur_createdAt_idx" ON "PaiementTransporteur"("createdAt");

-- AddForeignKey
ALTER TABLE "Listing" ADD CONSTRAINT "Listing_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_fromUserId_fkey" FOREIGN KEY ("fromUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_toUserId_fkey" FOREIGN KEY ("toUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_fromUserId_fkey" FOREIGN KEY ("fromUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_toUserId_fkey" FOREIGN KEY ("toUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModeratorAction" ADD CONSTRAINT "ModeratorAction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transporteur" ADD CONSTRAINT "Transporteur_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Livraison" ADD CONSTRAINT "Livraison_transporteurId_fkey" FOREIGN KEY ("transporteurId") REFERENCES "Transporteur"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dispute" ADD CONSTRAINT "Dispute_livraisonId_fkey" FOREIGN KEY ("livraisonId") REFERENCES "Livraison"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dispute" ADD CONSTRAINT "Dispute_signaleParUserId_fkey" FOREIGN KEY ("signaleParUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RemboursementAssurance" ADD CONSTRAINT "RemboursementAssurance_disputeId_fkey" FOREIGN KEY ("disputeId") REFERENCES "Dispute"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RemboursementAssurance" ADD CONSTRAINT "RemboursementAssurance_livraisonId_fkey" FOREIGN KEY ("livraisonId") REFERENCES "Livraison"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RemboursementAssurance" ADD CONSTRAINT "RemboursementAssurance_beneficiaireUserId_fkey" FOREIGN KEY ("beneficiaireUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaiementTransporteur" ADD CONSTRAINT "PaiementTransporteur_livraisonId_fkey" FOREIGN KEY ("livraisonId") REFERENCES "Livraison"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaiementTransporteur" ADD CONSTRAINT "PaiementTransporteur_transporteurId_fkey" FOREIGN KEY ("transporteurId") REFERENCES "Transporteur"("id") ON DELETE CASCADE ON UPDATE CASCADE;
