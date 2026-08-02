import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { id } = await params;

    const transporteur = await prisma.transporteur.findUnique({ where: { id } });
    if (!transporteur) {
      return NextResponse.json({ error: 'Transporter not found' }, { status: 404 });
    }

    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    const isAdmin = user?.role === 'ADMIN';
    const isOwner = transporteur.userId === session.user.id;

    if (!isAdmin && !isOwner) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const disputes = await prisma.dispute.findMany({
      where: { livraison: { transporteurId: id } },
      include: {
        signalePar: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      data: disputes.map((d) => ({
        id: d.id,
        livraisonId: d.livraisonId,
        raison: d.raison,
        description: d.description,
        statut: d.statut,
        signaleParNom: d.signalePar.name,
        createdAt: d.createdAt,
        dateResolution: d.dateResolution,
      })),
    });
  } catch (error) {
    console.error('Get transporteur disputes error:', error);
    return NextResponse.json({ error: 'Failed to fetch disputes' }, { status: 500 });
  }
}
