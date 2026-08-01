import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { recomputeDisputeRate } from '@/lib/transporteur-stats';
import { sendDisputeResolvedEmail } from '@/lib/external/email';
import { z } from 'zod';

async function getDisputeWithAccess(id: string, userId: string) {
  const dispute = await prisma.dispute.findUnique({
    where: { id },
    include: {
      livraison: {
        include: { transporteur: { include: { user: true } } },
      },
      signalePar: { select: { id: true, name: true, email: true } },
    },
  });

  if (!dispute) return { dispute: null, allowed: false, isAdmin: false };

  const user = await prisma.user.findUnique({ where: { id: userId } });
  const isAdmin = user?.role === 'ADMIN';
  const isSignaleur = dispute.signaleParUserId === userId;
  const isTransporteur = dispute.livraison.transporteur.userId === userId;

  return { dispute, allowed: isAdmin || isSignaleur || isTransporteur, isAdmin };
}

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
    const { dispute, allowed } = await getDisputeWithAccess(id, session.user.id);

    if (!dispute) {
      return NextResponse.json({ error: 'Dispute not found' }, { status: 404 });
    }

    if (!allowed) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    return NextResponse.json({
      data: {
        id: dispute.id,
        livraisonId: dispute.livraisonId,
        raison: dispute.raison,
        description: dispute.description,
        preuves: dispute.preuves ? JSON.parse(dispute.preuves) : null,
        statut: dispute.statut,
        resolution: dispute.resolution ? JSON.parse(dispute.resolution) : null,
        signalePar: dispute.signalePar,
        dateResolution: dispute.dateResolution,
        createdAt: dispute.createdAt,
      },
    });
  } catch (error) {
    console.error('Get dispute error:', error);
    return NextResponse.json({ error: 'Failed to fetch dispute' }, { status: 500 });
  }
}

const resolveSchema = z.object({
  statut: z.enum(['IN_REVIEW', 'RESOLVED', 'ESCALATED']),
  resolution: z
    .object({
      type: z.enum(['remboursement', 'compensation', 'rejete']),
      montant: z.number().int().min(0).optional(),
      notes: z.string().max(1000).optional(),
    })
    .optional(),
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
    const { dispute, isAdmin } = await getDisputeWithAccess(id, session.user.id);

    if (!dispute) {
      return NextResponse.json({ error: 'Dispute not found' }, { status: 404 });
    }

    if (!isAdmin) {
      return NextResponse.json({ error: 'Only admins can resolve disputes' }, { status: 403 });
    }

    const body = await req.json();
    const data = resolveSchema.parse(body);

    const updated = await prisma.dispute.update({
      where: { id },
      data: {
        statut: data.statut,
        resolution: data.resolution ? JSON.stringify(data.resolution) : undefined,
        reviewedByAdmin: session.user.id,
        dateResolution: data.statut === 'RESOLVED' ? new Date() : undefined,
      },
    });

    const stats = await recomputeDisputeRate(dispute.livraison.transporteurId);

    if (data.statut === 'RESOLVED' && dispute.signalePar.email) {
      sendDisputeResolvedEmail({
        toEmail: dispute.signalePar.email,
        toName: dispute.signalePar.name,
        resolutionType: data.resolution?.type || 'rejete',
        montant: data.resolution?.montant,
      }).catch((err) => console.error('Dispute resolution email failed:', err));
    }

    return NextResponse.json({
      data: {
        id: updated.id,
        statut: updated.statut,
        transporteurAutoSuspended: stats?.autoSuspended ?? false,
        message: 'Dispute updated',
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Resolve dispute error:', error);
    return NextResponse.json({ error: 'Failed to resolve dispute' }, { status: 500 });
  }
}
