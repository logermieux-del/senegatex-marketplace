import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/auth';
import { sendPaymentSentEmail } from '@/lib/external/email';
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

    const paiement = await prisma.paiementTransporteur.findUnique({
      where: { id },
      include: { transporteur: { include: { user: true } } },
    });

    if (!paiement) {
      return NextResponse.json({ error: 'Paiement not found' }, { status: 404 });
    }

    if (paiement.statut === 'PAID') {
      return NextResponse.json({ error: 'Already marked as paid' }, { status: 400 });
    }

    const updated = await prisma.paiementTransporteur.update({
      where: { id },
      data: {
        statut: 'PAID',
        methode: data.methode,
        reference: data.reference,
        paidByAdminId: session.user.id,
        paidAt: new Date(),
      },
    });

    if (paiement.transporteur.user.email) {
      sendPaymentSentEmail({
        toEmail: paiement.transporteur.user.email,
        toName: paiement.transporteur.user.name,
        montant: paiement.montant,
        methode: data.methode,
      }).catch((err) => console.error('Payment sent email failed:', err));
    }

    return NextResponse.json({
      data: { id: updated.id, statut: updated.statut, message: 'Payment marked as paid' },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Mark paiement paid error:', error);
    return NextResponse.json({ error: 'Failed to update paiement' }, { status: 500 });
  }
}
