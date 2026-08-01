import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const transporteur = await prisma.transporteur.findUnique({
      where: { userId: session.user.id },
    });

    if (!transporteur) {
      return NextResponse.json({ error: 'No transporter profile found' }, { status: 404 });
    }

    const paiements = await prisma.paiementTransporteur.findMany({
      where: { transporteurId: transporteur.id },
      orderBy: { createdAt: 'desc' },
    });

    const totalEnAttente = paiements
      .filter((p) => p.statut === 'PENDING')
      .reduce((sum, p) => sum + p.montant, 0);

    const totalPaye = paiements
      .filter((p) => p.statut === 'PAID')
      .reduce((sum, p) => sum + p.montant, 0);

    return NextResponse.json({
      data: {
        resume: { totalEnAttente, totalPaye, devise: 'XOF' },
        paiements: paiements.map((p) => ({
          id: p.id,
          livraisonId: p.livraisonId,
          montant: p.montant,
          statut: p.statut,
          methode: p.methode,
          reference: p.reference,
          paidAt: p.paidAt,
          createdAt: p.createdAt,
        })),
      },
    });
  } catch (error) {
    console.error('Get paiements error:', error);
    return NextResponse.json({ error: 'Failed to fetch paiements' }, { status: 500 });
  }
}
