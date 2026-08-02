import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET(_req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const transporteur = await prisma.transporteur.findFirst({
      where: { user: { email: session.user.email } },
      select: {
        id: true,
        user: {
          select: {
            name: true,
            avatar: true,
            phone: true,
            bio: true,
          },
        },
        typeVehicule: true,
        plaqueImmatriculation: true,
        regionsCouvertes: true,
        tarifParZone: true,
        capaciteVolume: true,
        statut: true,
        notianceGlobale: true,
        nombreLivraisons: true,
        tauxDisputes: true,
      },
    });

    if (!transporteur) {
      return NextResponse.json(
        { error: 'No transporter profile found' },
        { status: 404 }
      );
    }

    const reliabilityScore = 100 - transporteur.tauxDisputes;

    const formatted = {
      id: transporteur.id,
      name: transporteur.user.name,
      avatar: transporteur.user.avatar,
      phone: transporteur.user.phone,
      bio: transporteur.user.bio,
      typeVehicule: transporteur.typeVehicule,
      plaqueImmatriculation: transporteur.plaqueImmatriculation,
      regionsCouvertes: JSON.parse(transporteur.regionsCouvertes || '[]'),
      tarifParZone: JSON.parse(transporteur.tarifParZone || '{}'),
      capaciteVolume: transporteur.capaciteVolume,
      statut: transporteur.statut,
      rating: {
        average: transporteur.notianceGlobale,
        totalDeliveries: transporteur.nombreLivraisons,
        disputeRate: transporteur.tauxDisputes,
        reliability: `${Math.round(reliabilityScore)}%`,
      },
    };

    return NextResponse.json({ data: formatted });
  } catch (error) {
    console.error('Get my profile error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}
