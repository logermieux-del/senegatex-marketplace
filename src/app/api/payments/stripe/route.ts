import { NextRequest, NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/auth';
import { prisma } from '@/lib/db';
import Stripe from 'stripe';
import { z } from 'zod';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

const paymentSchema = z.object({
  listingId: z.string(),
  amount: z.number().positive(),
  currency: z.string().default('XOF'),
  buyerName: z.string().min(1),
  buyerEmail: z.string().email(),
  buyerPhone: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getAuthSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { listingId, amount, currency, buyerName, buyerEmail, buyerPhone } =
      paymentSchema.parse(body);

    // Verify listing exists and get seller
    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
      include: { user: true },
    });

    if (!listing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
    }

    if (listing.status === 'SOLD') {
      return NextResponse.json({ error: 'Listing already sold' }, { status: 400 });
    }

    // Create Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency.toLowerCase(),
      description: `Yembal - ${listing.title}`,
      metadata: {
        listingId,
        buyerId: session.user.id,
        sellerId: listing.userId,
      },
      receipt_email: buyerEmail,
    });

    // Create transaction record (PENDING)
    const transaction = await prisma.transaction.create({
      data: {
        listingId,
        sellerId: listing.userId,
        buyerId: session.user.id,
        amount,
        currency,
        paymentMethod: 'STRIPE',
        paymentStatus: 'PENDING',
        stripePaymentId: paymentIntent.id,
        notes: `Buyer: ${buyerName} (${buyerPhone})`,
      },
    });

    return NextResponse.json(
      {
        transactionId: transaction.id,
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Stripe payment error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 });
    }

    const message = error instanceof Error ? error.message : 'Payment initialization failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
