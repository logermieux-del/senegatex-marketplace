import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import crypto from 'crypto';
import {
  sendOrderConfirmationEmail,
  sendSaleNotificationEmail,
  sendPaymentFailureEmail,
} from '@/lib/external/email';

interface WaveWebhookPayload {
  event: string;
  data: {
    transaction_id: string;
    status: string;
    amount: number;
    currency: string;
    description?: string;
    recipient_phone?: string;
  };
  timestamp: number;
  signature: string;
}

const WAVE_API_KEY = process.env.WAVE_API_KEY || '';

function verifyWaveSignature(payload: string, signature: string): boolean {
  // Wave signs payloads with HMAC-SHA256
  // Format: signature = base64(HMAC-SHA256(payload, api_key))
  const hash = crypto
    .createHmac('sha256', WAVE_API_KEY)
    .update(payload)
    .digest('base64');

  return crypto.timingSafeEqual(
    Buffer.from(hash),
    Buffer.from(signature)
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    let payload: WaveWebhookPayload;

    try {
      payload = JSON.parse(body);
    } catch {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }

    // Verify signature
    if (!verifyWaveSignature(body, payload.signature)) {
      console.error('Wave webhook signature verification failed');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const { event, data } = payload;

    console.log(`Wave webhook event: ${event} | Transaction: ${data.transaction_id}`);

    switch (event) {
      case 'TRANSACTION_COMPLETED': {
        // Find transaction by Wave ID
        const transaction = await prisma.transaction.findFirst({
          where: { waveTransactionId: data.transaction_id },
          include: { listing: true, buyer: true, seller: true },
        });

        if (!transaction) {
          console.warn(`Transaction not found for Wave ID: ${data.transaction_id}`);
          return NextResponse.json({ success: true }); // Don't error
        }

        // Verify amount matches (security check)
        if (transaction.amount !== data.amount) {
          console.error(
            `Amount mismatch: expected ${transaction.amount}, got ${data.amount}`
          );
          return NextResponse.json({ error: 'Amount mismatch' }, { status: 400 });
        }

        // Update transaction
        await prisma.transaction.update({
          where: { id: transaction.id },
          data: {
            paymentStatus: 'COMPLETED',
            completedAt: new Date(),
          },
        });

        // Mark listing as SOLD
        await prisma.listing.update({
          where: { id: transaction.listingId },
          data: { status: 'SOLD' },
        });

        console.log(`✅ Wave transaction ${transaction.id} completed`);

        // Send email notifications (async, don't wait)
        Promise.all([
          sendOrderConfirmationEmail({
            buyerEmail: transaction.buyer.email,
            buyerName: transaction.buyer.name,
            listingTitle: transaction.listing.title,
            listingPrice: transaction.amount,
            sellerName: transaction.seller.name,
            transactionId: transaction.id,
          }),
          sendSaleNotificationEmail({
            sellerEmail: transaction.seller.email,
            sellerName: transaction.seller.name,
            listingTitle: transaction.listing.title,
            listingPrice: transaction.amount,
            buyerName: transaction.buyer.name,
            transactionId: transaction.id,
          }),
        ]).catch((err) => console.error('Email send error:', err));

        break;
      }

      case 'TRANSACTION_FAILED': {
        const transaction = await prisma.transaction.findFirst({
          where: { waveTransactionId: data.transaction_id },
          include: { buyer: true, listing: true },
        });

        if (transaction) {
          await prisma.transaction.update({
            where: { id: transaction.id },
            data: {
              paymentStatus: 'FAILED',
            },
          });

          console.log(`❌ Wave transaction ${transaction.id} failed`);

          // Send failure email to buyer
          sendPaymentFailureEmail({
            buyerEmail: transaction.buyer.email,
            buyerName: transaction.buyer.name,
            listingTitle: transaction.listing.title,
            reason: 'Wave payment processing failed. Please try again.',
          }).catch((err) => console.error('Email send error:', err));
        }
        break;
      }

      case 'TRANSACTION_CANCELED': {
        const transaction = await prisma.transaction.findFirst({
          where: { waveTransactionId: data.transaction_id },
        });

        if (transaction) {
          await prisma.transaction.update({
            where: { id: transaction.id },
            data: {
              paymentStatus: 'REFUNDED',
            },
          });

          console.log(`🚫 Wave transaction ${transaction.id} canceled`);
        }
        break;
      }

      default:
        console.log(`Unhandled Wave event: ${event}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'unknown error';
    console.error(`Wave webhook error: ${message}`);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
