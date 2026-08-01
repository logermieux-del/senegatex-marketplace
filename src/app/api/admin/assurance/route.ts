import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/auth';
import { getFundBalance, ASSURANCE_RATE } from '@/lib/assurance-fund';

export async function GET() {
  try {
    const session = await getAuthSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const fund = await getFundBalance();

    const remboursements = await prisma.remboursementAssurance.findMany({
      where: { statut: 'PENDING' },
      include: {
        beneficiaire: { select: { name: true, phone: true } },
        dispute: { select: { raison: true } },
      },
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json({
      data: {
        taux: `${(ASSURANCE_RATE * 100).toFixed(1)}%`,
        fonds: fund,
        remboursementsEnAttente: remboursements.map((r) => ({
          id: r.id,
          livraisonId: r.livraisonId,
          beneficiaireNom: r.beneficiaire.name,
          beneficiairePhone: r.beneficiaire.phone,
          raison: r.dispute.raison,
          montant: r.montant,
          createdAt: r.createdAt,
        })),
      },
    });
  } catch (error) {
    console.error('Admin get assurance error:', error);
    return NextResponse.json({ error: 'Failed to fetch assurance data' }, { status: 500 });
  }
}
