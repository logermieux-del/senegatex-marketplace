import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/auth';
import { sendRefundSentEmail } from '@/lib/external/email';
import { z } from 'zod';

const markPaidSchema = z.object({
  methode: z.enum(['wave', 'orange_money', 'cash', 'virement']),
  reference: z.string().max(100).optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAuthSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();
    const data = markPaidSchema.parse(body);

    const remboursement = await prisma.remboursementAssurance.findUnique({
      where: { id },
      include: { beneficiaire: true },
    });

    if (!remboursement) {
      return NextResponse.json({ error: 'Remboursement not found' }, { status: 404 });
    }

    if (remboursement.statut === 'PAID') {
      return NextResponse.json({ error: 'Already marked as paid' }, { status: 400 });
    }

    const updated = await prisma.remboursementAssurance.update({
      where: { id },
      data: {
        statut: 'PAID',
        methode: data.methode,
        reference: data.reference,
        paidByAdminId: session.user.id,
        paidAt: new Date(),
      },
    });

    if (remboursement.beneficiaire.email) {
      sendRefundSentEmail({
        toEmail: remboursement.beneficiaire.email,
        toName: remboursement.beneficiaire.name,
        montant: remboursement.montant,
        methode: data.methode,
      }).catch((err) => console.error('Refund sent email failed:', err));
    }

    return NextResponse.json({
      data: { id: updated.id, statut: updated.statut, message: 'Remboursement marked as paid' },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Mark remboursement paid error:', error);
    return NextResponse.json({ error: 'Failed to update remboursement' }, { status: 500 });
  }
}
