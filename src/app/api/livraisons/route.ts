import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { computeAssuranceMontant } from '@/lib/assurance-fund';
import { z } from 'zod';

const createLivraisonSchema = z.object({
  transactionId: z.string().optional(),
  transporteurId: z.string().cuid(),
  adresseDepart: z.object({
    region: z.string(),
    arrondissement: z.string().optional(),
    rue: z.string().optional(),
    lat: z.number().optional(),
    lng: z.number().optional(),
  }),
  adresseArrivee: z.object({
    region: z.string(),
    arrondissement: z.string().optional(),
    rue: z.string().optional(),
    lat: z.number().optional(),
    lng: z.number().optional(),
  }),
  tarifNegocie: z.number().int().min(500),
});

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const searchParams = req.nextUrl.searchParams;
    const statut = searchParams.get('statut');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {
      transporteur: {
        userId: session.user.id,
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

    const formatted = livraisons.map((l) => ({
      id: l.id,
      statut: l.statut,
      tarifNegocie: l.tarifNegocie,
      adresseDepart: JSON.parse(l.adresseDepart || '{}'),
      adresseArrivee: JSON.parse(l.adresseArrivee || '{}'),
      dates: {
        prise: l.datePrise,
        estimeeArrivee: l.dateEstimeeArrivee,
        arriveeReelle: l.dateArriveeReelle,
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
    console.error('Get livraisons error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch livraisons' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = await req.json();
    const data = createLivraisonSchema.parse(body);

    // Verify transporteur exists and is verified
    const transporteur = await prisma.transporteur.findUnique({
      where: { id: data.transporteurId },
    });

    if (!transporteur) {
      return NextResponse.json(
        { error: 'Transporter not found' },
        { status: 404 }
      );
    }

    if (transporteur.statut !== 'VERIFIED' && transporteur.statut !== 'ACTIVE') {
      return NextResponse.json(
        { error: 'Transporter is not verified' },
        { status: 400 }
      );
    }

    // Calculate commission (5-10% of tarif)
    const commissionYombal = Math.ceil(data.tarifNegocie * 0.05); // 5% commission
    const assuranceMontant = computeAssuranceMontant(data.tarifNegocie);

    const livraison = await prisma.livraison.create({
      data: {
        transporteurId: data.transporteurId,
        adresseDepart: JSON.stringify(data.adresseDepart),
        adresseArrivee: JSON.stringify(data.adresseArrivee),
        tarifNegocie: data.tarifNegocie,
        commissionYombal,
        assuranceMontant,
        statut: 'PENDING',
        transactionId: data.transactionId,
      },
    });

    return NextResponse.json(
      {
        data: {
          id: livraison.id,
          statut: livraison.statut,
          tarifNegocie: livraison.tarifNegocie,
          assuranceMontant: livraison.assuranceMontant,
          totalAPayer: livraison.tarifNegocie + livraison.assuranceMontant,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Create livraison error:', error);
    return NextResponse.json(
      { error: 'Failed to create livraison' },
      { status: 500 }
    );
  }
}
