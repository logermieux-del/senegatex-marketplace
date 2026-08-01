import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { disputeSchema } from '@/lib/validators';
import { sendDisputeCreatedEmail } from '@/lib/external/email';
import { recomputeDisputeRate } from '@/lib/transporteur-stats';
import { z } from 'zod';

const createDisputeSchema = disputeSchema.extend({
  livraisonId: z.string().cuid(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = await req.json();
    const data = createDisputeSchema.parse(body);

    const livraison = await prisma.livraison.findUnique({
      where: { id: data.livraisonId },
      include: {
        transporteur: { include: { user: true } },
      },
    });

    if (!livraison) {
      return NextResponse.json({ error: 'Livraison not found' }, { status: 404 });
    }

    const existing = await prisma.dispute.findFirst({
      where: { livraisonId: data.livraisonId, signaleParUserId: session.user.id, statut: { in: ['OPEN', 'IN_REVIEW'] } },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'You already have an open dispute for this delivery' },
        { status: 400 }
      );
    }

    const dispute = await prisma.dispute.create({
      data: {
        livraisonId: data.livraisonId,
        signaleParUserId: session.user.id,
        raison: data.raison,
        description: data.description,
        preuves: data.preuves ? JSON.stringify(data.preuves) : null,
        statut: 'OPEN',
      },
    });

    // Mark the delivery as having an incident (visible to admin/transporteur)
    await prisma.livraison.update({
      where: { id: data.livraisonId },
      data: { incident: true },
    });

    await recomputeDisputeRate(livraison.transporteurId);

    if (livraison.transporteur.user.email) {
      sendDisputeCreatedEmail({
        transporteurEmail: livraison.transporteur.user.email,
        transporteurName: livraison.transporteur.user.name,
        raison: data.raison,
        livraisonId: data.livraisonId,
      }).catch((err) => console.error('Dispute notification email failed:', err));
    }

    return NextResponse.json(
      {
        data: {
          id: dispute.id,
          statut: dispute.statut,
          message: 'Dispute filed. Our team will review it shortly.',
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

    console.error('Create dispute error:', error);
    return NextResponse.json({ error: 'Failed to create dispute' }, { status: 500 });
  }
}
