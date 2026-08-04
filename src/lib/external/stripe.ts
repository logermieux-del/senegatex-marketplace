import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

export interface CreatePaymentIntentInput {
  listingId: string;
  amount: number; // in XOF (smallest unit)
  buyerEmail: string;
  buyerId: string;
  sellerId: string;
  listingTitle: string;
}

export async function createPaymentIntent(input: CreatePaymentIntentInput) {
  try {
    // Convert XOF to smallest unit (cents for Stripe - usually)
    const amountInCents = Math.round(input.amount / 100); // XOF to lowest unit

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'xof',
      payment_method_types: ['card'],
      metadata: {
        listingId: input.listingId,
        buyerId: input.buyerId,
        sellerId: input.sellerId,
        listingTitle: input.listingTitle,
      },
      receipt_email: input.buyerEmail,
    });

    return {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: paymentIntent.amount,
    };
  } catch (error) {
    console.error('Stripe payment intent error:', error);
    throw error;
  }
}

export async function confirmPayment(paymentIntentId: string) {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    return {
      status: paymentIntent.status,
      amount: paymentIntent.amount,
      metadata: paymentIntent.metadata,
    };
  } catch (error) {
    console.error('Stripe confirm error:', error);
    throw error;
  }
}

export async function refundPayment(paymentIntentId: string, reason?: string) {
  try {
    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
      reason: (reason as any) || 'requested_by_customer',
    });

    return {
      refundId: refund.id,
      status: refund.status,
      amount: refund.amount,
    };
  } catch (error) {
    console.error('Stripe refund error:', error);
    throw error;
  }
}

export function verifyWebhookSignature(body: string, signature: string | undefined): any {
  try {
    if (!signature) throw new Error('Missing signature');

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );

    return event;
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    throw error;
  }
}
