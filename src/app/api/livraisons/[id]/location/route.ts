import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { z } from 'zod';

const locationSchema = z.object({
  lat: z.number(),
  lng: z.number(),
});

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

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
      return NextResponse.json(
        { error: 'Livraison not found' },
        { status: 404 }
      );
    }

    const locationActuelle = livraison.locationActuelle
      ? JSON.parse(livraison.locationActuelle)
      : null;

    return NextResponse.json({
      data: {
        id: livraison.id,
        statut: livraison.statut,
        location: locationActuelle,
        adresseDepart: JSON.parse(livraison.adresseDepart || '{}'),
        adresseArrivee: JSON.parse(livraison.adresseArrivee || '{}'),
      },
    });
  } catch (error) {
    console.error('Get location error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch location' },
      { status: 500 }
    );
  }
}

export async function POST(
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
    const data = locationSchema.parse(body);

    // Verify ownership
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

    if (livraison.statut !== 'IN_TRANSIT' && livraison.statut !== 'PICKED_UP') {
      return NextResponse.json(
        { error: 'Can only update location for in-transit deliveries' },
        { status: 400 }
      );
    }

    const location = {
      lat: data.lat,
      lng: data.lng,
      timestamp: new Date().toISOString(),
    };

    const updated = await prisma.livraison.update({
      where: { id },
      data: {
        locationActuelle: JSON.stringify(location),
      },
    });

    return NextResponse.json({
      data: {
        id: updated.id,
        location,
        message: 'Location updated',
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Update location error:', error);
    return NextResponse.json(
      { error: 'Failed to update location' },
      { status: 500 }
    );
  }
}
