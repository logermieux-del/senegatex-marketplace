import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const region = searchParams.get('region');
    const capacity = searchParams.get('capacity');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    // Build where clause
    const where: Prisma.TransporteurWhereInput = {
      statut: 'VERIFIED', // Only show verified transporters
    };

    if (region) {
      where.regionsCouvertes = {
        contains: region,
      };
    }

    if (capacity) {
      where.capaciteVolume = capacity;
    }

    // Fetch transporters with pagination
    const [transporteurs, total] = await Promise.all([
      prisma.transporteur.findMany({
        where,
        select: {
          id: true,
          user: {
            select: {
              name: true,
              avatar: true,
              phone: true,
            },
          },
          typeVehicule: true,
          regionsCouvertes: true,
          tarifParZone: true,
          capaciteVolume: true,
          notianceGlobale: true,
          nombreLivraisons: true,
          tauxDisputes: true,
          createdAt: true,
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          notianceGlobale: 'desc', // Sort by rating
        },
      }),
      prisma.transporteur.count({ where }),
    ]);

    const formatted = transporteurs.map((t) => ({
      id: t.id,
      name: t.user.name,
      avatar: t.user.avatar,
      phone: t.user.phone,
      typeVehicule: t.typeVehicule,
      regionsCouvertes: JSON.parse(t.regionsCouvertes || '[]'),
      tarifParZone: JSON.parse(t.tarifParZone || '{}'),
      capaciteVolume: t.capaciteVolume,
      rating: {
        average: t.notianceGlobale,
        deliveries: t.nombreLivraisons,
        disputeRate: t.tauxDisputes,
      },
    }));

    return NextResponse.json({
      data: formatted,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get transporters error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transporters' },
      { status: 500 }
    );
  }
}
