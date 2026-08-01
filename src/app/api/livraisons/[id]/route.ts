import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { z } from 'zod';

// Mock GPS interpolation between two points
function interpolateGPS(
  start: { lat: number; lng: number },
  end: { lat: number; lng: number },
  progress: number // 0-1
) {
  return {
    lat: start.lat + (end.lat - start.lat) * progress,
    lng: start.lng + (end.lng - start.lng) * progress,
    timestamp: new Date().toISOString(),
  };
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

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
      return NextResponse.json(
        { error: 'Livraison not found' },
        { status: 404 }
      );
    }

    // Parse JSON fields
    const adresseDepart = JSON.parse(livraison.adresseDepart || '{}');
    const adresseArrivee = JSON.parse(livraison.adresseArrivee || '{}');
    const locationActuelle = livraison.locationActuelle
      ? JSON.parse(livraison.locationActuelle)
      : null;

    // For demo: generate mock GPS position based on status and time elapsed
    let mockGPS = locationActuelle;
    if (!mockGPS && adresseDepart.lat && adresseArrivee.lat) {
      // Mock GPS interpolation for demo
      let progress = 0;
      switch (livraison.statut) {
        case 'PICKED_UP':
          progress = 0.2;
          break;
        case 'IN_TRANSIT':
          progress = Math.random() * 0.6 + 0.2; // Random between 0.2-0.8
          break;
        case 'DELIVERED':
          progress = 1;
          break;
        default:
          progress = 0;
      }

      mockGPS = interpolateGPS(adresseDepart, adresseArrivee, progress);
    }

    const formatted = {
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
      gps: mockGPS,
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
        rating: livraison.ratingAcheteur
          ? JSON.parse(livraison.ratingAcheteur)
          : null,
      },
    };

    return NextResponse.json({ data: formatted });
  } catch (error) {
    console.error('Get livraison error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch livraison' },
      { status: 500 }
    );
  }
}

const updateStatusSchema = z.object({
  statut: z.enum([
    'PENDING',
    'ACCEPTED',
    'PICKED_UP',
    'IN_TRANSIT',
    'DELIVERED',
    'FAILED',
  ]),
  notes: z.string().optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const data = updateStatusSchema.parse(body);

    // Verify ownership - only transporteur can update
    const livraison = await prisma.livraison.findUnique({
      where: { id },
      include: {
        transporteur: true,
      },
    });

    if (!livraison) {
      return NextResponse.json(
        { error: 'Livraison not found' },
        { status: 404 }
      );
    }

    if (livraison.transporteur.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Update status with timeline
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: any = {
      statut: data.statut,
    };

    if (data.statut === 'ACCEPTED') {
      updateData.datePrise = new Date();
      // Estimate 2 hours delivery
      updateData.dateEstimeeArrivee = new Date(Date.now() + 2 * 60 * 60 * 1000);
    }

    if (data.statut === 'DELIVERED') {
      updateData.dateArriveeReelle = new Date();
    }

    const updated = await prisma.livraison.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      data: {
        id: updated.id,
        statut: updated.statut,
        message: `Delivery status updated to ${updated.statut}`,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Update livraison status error:', error);
    return NextResponse.json(
      { error: 'Failed to update livraison' },
      { status: 500 }
    );
  }
}
