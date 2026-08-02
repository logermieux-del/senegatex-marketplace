import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import Stripe from 'stripe';
import {
  sendOrderConfirmationEmail,
  sendSaleNotificationEmail,
  sendPaymentFailureEmail,
} from '@/lib/external/email';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature') || '';

  let event: Stripe.Event;

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error: any) {
    console.error(`Webhook signature verification failed: ${error.message}`);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log(`✅ Payment succeeded: ${paymentIntent.id}`);

        // Find transaction by Stripe payment ID
        const transaction = await prisma.transaction.findFirst({
          where: { stripePaymentId: paymentIntent.id },
          include: { listing: true, buyer: true, seller: true },
        });

        if (!transaction) {
          console.warn(`Transaction not found for Stripe ID: ${paymentIntent.id}`);
          return NextResponse.json({ success: true }); // Don't error, webhook might retry
        }

        // Update transaction status
        await prisma.transaction.update({
          where: { id: transaction.id },
          data: {
            paymentStatus: 'COMPLETED',
            completedAt: new Date(),
          },
        });

        // Update listing status to SOLD
        await prisma.listing.update({
          where: { id: transaction.listingId },
          data: { status: 'SOLD' },
        });

        console.log(`Transaction ${transaction.id} marked as COMPLETED`);

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

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log(`❌ Payment failed: ${paymentIntent.id}`);

        // Find and update transaction
        const transaction = await prisma.transaction.findFirst({
          where: { stripePaymentId: paymentIntent.id },
          include: { buyer: true, listing: true },
        });

        if (transaction) {
          await prisma.transaction.update({
            where: { id: transaction.id },
            data: {
              paymentStatus: 'FAILED',
            },
          });

          console.log(`Transaction ${transaction.id} marked as FAILED`);

          // Send failure email to buyer
          sendPaymentFailureEmail({
            buyerEmail: transaction.buyer.email,
            buyerName: transaction.buyer.name,
            listingTitle: transaction.listing.title,
            reason: paymentIntent.last_payment_error?.message,
          }).catch((err) => console.error('Email send error:', err));
        }
        break;
      }

      case 'payment_intent.canceled': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log(`🚫 Payment canceled: ${paymentIntent.id}`);

        const transaction = await prisma.transaction.findFirst({
          where: { stripePaymentId: paymentIntent.id },
        });

        if (transaction) {
          await prisma.transaction.update({
            where: { id: transaction.id },
            data: {
              paymentStatus: 'REFUNDED',
            },
          });
        }
        break;
      }

      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge;
        console.log(`💰 Refund issued: ${charge.id}`);

        if (charge.payment_intent) {
          const transaction = await prisma.transaction.findFirst({
            where: { stripePaymentId: charge.payment_intent.toString() },
          });

          if (transaction) {
            // Update to REFUNDED and un-sell the listing
            await Promise.all([
              prisma.transaction.update({
                where: { id: transaction.id },
                data: { paymentStatus: 'REFUNDED' },
              }),
              prisma.listing.update({
                where: { id: transaction.listingId },
                data: { status: 'ACTIVE' }, // Re-list it
              }),
            ]);

            console.log(`Transaction ${transaction.id} refunded and listing re-activated`);
          }
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error(`Webhook processing error: ${error.message}`);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
