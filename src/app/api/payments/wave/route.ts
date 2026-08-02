import { NextRequest, NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/auth';
import { prisma } from '@/lib/db';
import axios from 'axios';
import { z } from 'zod';

const paymentSchema = z.object({
  listingId: z.string(),
  amount: z.number().positive(),
  currency: z.string().default('XOF'),
  buyerName: z.string().min(1),
  buyerEmail: z.string().email(),
  buyerPhone: z.string().min(1),
});

const WAVE_API_URL = process.env.WAVE_API_URL || 'https://api.wave.com/graphql';
const WAVE_API_KEY = process.env.WAVE_API_KEY;
const CALLBACK_URL = process.env.NEXTAUTH_URL || 'http://localhost:3000';

export async function POST(request: NextRequest) {
  try {
    const session = await getAuthSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { listingId, amount, currency, buyerName, buyerEmail: _buyerEmail, buyerPhone } =
      paymentSchema.parse(body);

    // Verify listing exists
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

    // Create transaction record first
    const transaction = await prisma.transaction.create({
      data: {
        listingId,
        sellerId: listing.userId,
        buyerId: session.user.id,
        amount,
        currency,
        paymentMethod: 'WAVE',
        paymentStatus: 'PENDING',
        notes: `Buyer: ${buyerName} (${buyerPhone})`,
      },
    });

    // Call Wave API to create payment
    let waveTransactionId = null;
    let paymentUrl = null;

    if (WAVE_API_KEY) {
      try {
        const response = await axios.post(
          WAVE_API_URL,
          {
            query: `
              mutation {
                sendMoney(input: {
                  amount: ${amount}
                  currency: "${currency}"
                  recipientPhone: "${buyerPhone}"
                  reason: "Yombal - ${listing.title}"
                }) {
                  transactionId
                  status
                  checkoutUrl
                }
              }
            `,
          },
          {
            headers: {
              Authorization: `Bearer ${WAVE_API_KEY}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (response.data?.data?.sendMoney) {
          waveTransactionId = response.data.data.sendMoney.transactionId;
          paymentUrl = response.data.data.sendMoney.checkoutUrl;

          // Update transaction with Wave ID
          await prisma.transaction.update({
            where: { id: transaction.id },
            data: { waveTransactionId },
          });
        }
      } catch (waveError) {
        console.error('Wave API error:', waveError);
        // Continue - transaction is created, Wave payment is optional for demo
      }
    }

    return NextResponse.json(
      {
        transactionId: transaction.id,
        waveTransactionId,
        paymentUrl: paymentUrl || `${CALLBACK_URL}/order-confirmation?transactionId=${transaction.id}`,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Wave payment error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }

    return NextResponse.json(
      { error: error.message || 'Payment initialization failed' },
      { status: 500 }
    );
  }
}
