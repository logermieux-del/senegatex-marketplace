import { prisma } from '@/lib/db';
import { parseAddress, parseLocation, parseRating } from '@/lib/utils/json-parse';
import { LIVRAISON_CONFIG } from '@/lib/utils/constants';

interface PaginationParams {
  page: number;
  limit: number;
}

interface AddressData {
  region: string;
  arrondissement?: string;
  rue?: string;
  lat?: number;
  lng?: number;
}

interface RatingData {
  punctualite: number;
  etatProduit: number;
  communication: number;
  professionalisme: number;
  commentaire?: string;
}

export async function getLivraisons(
  userId: string,
  statut?: string,
  pagination?: PaginationParams
) {
  const { page = 1, limit = 20 } = pagination || {};

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = {
    transporteur: {
      userId,
    },
  };

  if (statut) {
    where.statut = statut;
  }

  const [livraisons, total] = await Promise.all([
    prisma.livraison.findMany({
      where,
      select: {
        id: true,
        statut: true,
        tarifNegocie: true,
        adresseDepart: true,
        adresseArrivee: true,
        datePrise: true,
        dateEstimeeArrivee: true,
        dateArriveeReelle: true,
        transporteur: {
          select: {
            id: true,
            user: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.livraison.count({ where }),
  ]);

  return {
    data: livraisons.map((l) => ({
      id: l.id,
      statut: l.statut,
      tarifNegocie: l.tarifNegocie,
      adresseDepart: parseAddress(l.adresseDepart),
      adresseArrivee: parseAddress(l.adresseArrivee),
      dates: {
        prise: l.datePrise,
        estimeeArrivee: l.dateEstimeeArrivee,
        arriveeReelle: l.dateArriveeReelle,
      },
    })),
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
}

export async function createLivraison(
  transporteurId: string,
  adresseDepart: AddressData,
  adresseArrivee: AddressData,
  tarifNegocie: number,
  transactionId?: string
) {
  // Verify transporteur exists and is verified
  const transporteur = await prisma.transporteur.findUnique({
    where: { id: transporteurId },
  });

  if (!transporteur) {
    throw new Error('Transporter not found');
  }

  if (transporteur.statut !== 'VERIFIED' && transporteur.statut !== 'ACTIVE') {
    throw new Error('Transporter is not verified');
  }

  // Calculate commission (5% of tarif)
  const commissionYombal = Math.ceil(tarifNegocie * (LIVRAISON_CONFIG.COMMISSION_PERCENT / 100));

  const livraison = await prisma.livraison.create({
    data: {
      transporteurId,
      adresseDepart: JSON.stringify(adresseDepart),
      adresseArrivee: JSON.stringify(adresseArrivee),
      tarifNegocie,
      commissionYombal,
      statut: 'PENDING',
      transactionId,
    },
  });

  return {
    id: livraison.id,
    statut: livraison.statut,
    tarifNegocie: livraison.tarifNegocie,
  };
}

export async function getLivraisonById(id: string) {
  const livraison = await prisma.livraison.findUnique({
    where: { id },
    select: {
      id: true,
      statut: true,
      adresseDepart: true,
      adresseArrivee: true,
      tarifNegocie: true,
      commissionYombal: true,
      datePrise: true,
      dateEstimeeArrivee: true,
      dateArriveeReelle: true,
      locationActuelle: true,
      photoPreuve: true,
      ratingAcheteur: true,
      transporteur: {
        select: {
          id: true,
          user: {
            select: {
              name: true,
              phone: true,
              avatar: true,
            },
          },
          typeVehicule: true,
          plaqueImmatriculation: true,
          notianceGlobale: true,
        },
      },
      createdAt: true,
    },
  });

  if (!livraison) {
    throw new Error('Livraison not found');
  }

  const adresseDepart = parseAddress(livraison.adresseDepart);
  const adresseArrivee = parseAddress(livraison.adresseArrivee);
  const locationActuelle = parseLocation(livraison.locationActuelle);

  return {
    id: livraison.id,
    statut: livraison.statut,
    adresseDepart,
    adresseArrivee,
    tarifs: {
      negocie: livraison.tarifNegocie,
      commission: livraison.commissionYombal,
      montantTransporteur: livraison.tarifNegocie - livraison.commissionYombal,
    },
    timeline: {
      createdAt: livraison.createdAt,
      datePrise: livraison.datePrise,
      dateEstimeeArrivee: livraison.dateEstimeeArrivee,
      dateArriveeReelle: livraison.dateArriveeReelle,
    },
    gps: locationActuelle,
    transporteur: {
      id: livraison.transporteur.id,
      name: livraison.transporteur.user.name,
      phone: livraison.transporteur.user.phone,
      avatar: livraison.transporteur.user.avatar,
      vehicleType: livraison.transporteur.typeVehicule,
      licensePlate: livraison.transporteur.plaqueImmatriculation,
      rating: livraison.transporteur.notianceGlobale,
    },
    proof: {
      photo: livraison.photoPreuve,
      rating: parseRating(livraison.ratingAcheteur),
    },
  };
}

export async function updateLivraisonStatus(
  id: string,
  userId: string,
  statut: string
) {
  // Verify ownership - only transporteur can update
  const livraison = await prisma.livraison.findUnique({
    where: { id },
    include: {
      transporteur: true,
    },
  });

  if (!livraison) {
    throw new Error('Livraison not found');
  }

  if (livraison.transporteur.userId !== userId) {
    throw new Error('Unauthorized');
  }

  // Update status with timeline
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateData: any = {
    statut,
  };

  if (statut === 'ACCEPTED') {
    updateData.datePrise = new Date();
    updateData.dateEstimeeArrivee = new Date(
      Date.now() + LIVRAISON_CONFIG.DELIVERY_ESTIMATE_HOURS * 60 * 60 * 1000
    );
  }

  if (statut === 'DELIVERED') {
    updateData.dateArriveeReelle = new Date();
  }

  const updated = await prisma.livraison.update({
    where: { id },
    data: updateData,
  });

  return {
    id: updated.id,
    statut: updated.statut,
    message: `Delivery status updated to ${updated.statut}`,
  };
}

export async function rateLivraison(
  id: string,
  rating: RatingData
) {
  // Get livraison
  const livraison = await prisma.livraison.findUnique({
    where: { id },
  });

  if (!livraison) {
    throw new Error('Livraison not found');
  }

  if (livraison.statut !== 'DELIVERED') {
    throw new Error('Can only rate delivered livraisons');
  }

  // Store rating
  const ratingData = {
    punctualite: rating.punctualite,
    etatProduit: rating.etatProduit,
    communication: rating.communication,
    professionalisme: rating.professionalisme,
    commentaire: rating.commentaire || '',
  };

  // Calculate numeric score for aggregation
  const ratingScore =
    (rating.punctualite +
      rating.etatProduit +
      rating.communication +
      rating.professionalisme) /
    4;

  const updated = await prisma.livraison.update({
    where: { id },
    data: {
      ratingAcheteur: JSON.stringify(ratingData),
      ratingScore,
    },
  });

  // Update transporteur average rating using SQL aggregation
  await calculateTransporteurRating(livraison.transporteurId);

  return {
    id: updated.id,
    rating: ratingData,
    message: 'Livraison rated successfully',
  };
}

export async function calculateTransporteurRating(transporteurId: string) {
  // Use raw SQL for efficient aggregation instead of fetching all records
  const result = await prisma.$queryRaw<Array<{ avg: number | null }>>`
    SELECT AVG(rating_score) as avg
    FROM livraison
    WHERE transporteur_id = ${transporteurId}
      AND statut = 'DELIVERED'
      AND rating_score IS NOT NULL
  `;

  const averageScore = result[0]?.avg || 0;

  await prisma.transporteur.update({
    where: { id: transporteurId },
    data: {
      notianceGlobale: Math.round(averageScore * 10) / 10,
    },
  });
}

export async function getLocation(id: string) {
  const livraison = await prisma.livraison.findUnique({
    where: { id },
    select: {
      id: true,
      statut: true,
      locationActuelle: true,
      adresseDepart: true,
      adresseArrivee: true,
    },
  });

  if (!livraison) {
    throw new Error('Livraison not found');
  }

  return {
    id: livraison.id,
    statut: livraison.statut,
    location: parseLocation(livraison.locationActuelle),
    adresseDepart: parseAddress(livraison.adresseDepart),
    adresseArrivee: parseAddress(livraison.adresseArrivee),
  };
}

export async function updateLocation(
  id: string,
  userId: string,
  lat: number,
  lng: number
) {
  // Verify ownership
  const livraison = await prisma.livraison.findUnique({
    where: { id },
    include: {
      transporteur: true,
    },
  });

  if (!livraison) {
    throw new Error('Livraison not found');
  }

  if (livraison.transporteur.userId !== userId) {
    throw new Error('Unauthorized');
  }

  if (livraison.statut !== 'IN_TRANSIT' && livraison.statut !== 'PICKED_UP') {
    throw new Error('Can only update location for in-transit deliveries');
  }

  const location = {
    lat,
    lng,
    timestamp: new Date().toISOString(),
  };

  const updated = await prisma.livraison.update({
    where: { id },
    data: {
      locationActuelle: JSON.stringify(location),
    },
  });

  return {
    id: updated.id,
    location,
    message: 'Location updated',
  };
}
