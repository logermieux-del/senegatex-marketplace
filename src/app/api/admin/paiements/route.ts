import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const session = await getAuthSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const searchParams = req.nextUrl.searchParams;
    const statut = searchParams.get('statut') || 'PENDING';

    const paiements = await prisma.paiementTransporteur.findMany({
      where: { statut },
      include: {
        transporteur: { select: { user: { select: { name: true, phone: true } } } },
        livraison: { select: { adresseDepart: true, adresseArrivee: true } },
      },
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json({
      data: paiements.map((p) => ({
        id: p.id,
        transporteurNom: p.transporteur.user.name,
        transporteurPhone: p.transporteur.user.phone,
        livraisonId: p.livraisonId,
        montant: p.montant,
        statut: p.statut,
        createdAt: p.createdAt,
      })),
      totalDu: paiements.reduce((sum, p) => sum + p.montant, 0),
    });
  } catch (error) {
    console.error('Admin get paiements error:', error);
    return NextResponse.json({ error: 'Failed to fetch paiements' }, { status: 500 });
  }
}
