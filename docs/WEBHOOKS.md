# Webhooks Documentation - Yombal

## Stripe Webhooks

Endpoint: `POST /api/webhooks/stripe`

Validates Stripe payments and updates transaction status.

### Setup Stripe Webhook

```bash
# 1. Go to Stripe Dashboard → Developers → Webhooks
# 2. Add Endpoint
# 3. URL: https://yourdomain.com/api/webhooks/stripe
# 4. Select events:
#    - payment_intent.succeeded
#    - payment_intent.payment_failed
#    - payment_intent.canceled
#    - charge.refunded
# 5. Copy Signing Secret → STRIPE_WEBHOOK_SECRET
```

### Environment Variables

```bash
STRIPE_WEBHOOK_SECRET="whsec_live_xxx"  # From Stripe dashboard
```

### Handled Events

| Event | Action | Result |
|-------|--------|--------|
| `payment_intent.succeeded` | Transaction COMPLETED | Listing marked SOLD → Buyer + Seller emails |
| `payment_intent.payment_failed` | Transaction FAILED | Buyer notified of failure |
| `payment_intent.canceled` | Transaction REFUNDED | Listing re-activated |
| `charge.refunded` | Transaction REFUNDED | Refund emails sent |

### Security

- Verifies Stripe signature (HMAC-SHA256)
- Amount validation (prevents tampering)
- Idempotent (safe to retry)

---

## Wave Webhooks

Endpoint: `POST /api/webhooks/wave`

Validates Wave mobile money payments.

### Setup Wave Webhook

```bash
# 1. Go to Wave Dashboard → Settings → Webhooks
# 2. Add Endpoint
# 3. URL: https://yourdomain.com/api/webhooks/wave
# 4. Select events:
#    - TRANSACTION_COMPLETED
#    - TRANSACTION_FAILED
#    - TRANSACTION_CANCELED
# 5. API Key already configured in env
```

### Environment Variables

```bash
WAVE_API_KEY="your_wave_api_key"  # For signature verification
```

### Handled Events

| Event | Action | Result |
|-------|--------|--------|
| `TRANSACTION_COMPLETED` | Transaction COMPLETED | Listing marked SOLD → Buyer + Seller emails |
| `TRANSACTION_FAILED` | Transaction FAILED | Buyer notified of failure |
| `TRANSACTION_CANCELED` | Transaction REFUNDED | Listing re-activated |

### Security

- Verifies Wave signature (HMAC-SHA256)
- Amount validation (prevents tampering)
- Idempotent (safe to retry)

---

## Testing Webhooks Locally

### Using Stripe CLI

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe  # macOS
# or download from https://stripe.com/docs/stripe-cli

# Login
stripe login

# Forward webhooks to local
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Trigger test event
stripe trigger payment_intent.succeeded
```

### Manual Testing

```bash
# Test Stripe webhook
curl -X POST http://localhost:3000/api/webhooks/stripe \
  -H "Content-Type: application/json" \
  -H "stripe-signature: test" \
  -d '{
    "type": "payment_intent.succeeded",
    "data": {
      "object": {
        "id": "pi_test123"
      }
    }
  }'
```

---

## Email Notifications

Triggered by webhooks automatically.

### Emails Sent

1. **Order Confirmation** (to buyer)
   - Triggered: Payment succeeded
   - Contains: Item, Price, Seller, Transaction ID
   - CTA: "View Messages"

2. **Sale Notification** (to seller)
   - Triggered: Payment succeeded
   - Contains: Item, Price, Buyer, Transaction ID
   - CTA: "Contact Buyer"

3. **Payment Failure** (to buyer)
   - Triggered: Payment failed
   - Contains: Item, Failure reason
   - CTA: "Try Again"

### Environment Variables

```bash
RESEND_API_KEY="re_xxx"  # From Resend dashboard
```

### Customizing Email Templates

Edit `src/lib/external/email.ts`:

```typescript
export async function sendOrderConfirmationEmail(params: {
  buyerEmail: string;
  buyerName: string;
  listingTitle: string;
  listingPrice: number;
  sellerName: string;
  transactionId: string;
}) {
  // Customize HTML template here
}
```

---

## Webhook Flow Diagram

```
Payment Initiated (User clicks "Buy")
           ↓
Transaction created (PENDING)
           ↓
Stripe/Wave processes payment (background)
           ↓
Payment succeeds/fails
           ↓
Stripe/Wave sends webhook to /api/webhooks/stripe or /api/webhooks/wave
           ↓
Verify signature (security check)
           ↓
Update Transaction status (COMPLETED/FAILED)
           ↓
Update Listing status (SOLD or re-activate)
           ↓
Send emails (order confirmation, sale notification, etc.)
           ↓
User sees result in Messages & Email
```

---

## Troubleshooting

### Webhook not received

1. Check endpoint URL is public (not localhost)
2. Verify webhook is added in Stripe/Wave dashboard
3. Check logs: `npm run logs` or CloudWatch
4. Retry webhook from dashboard

### Signature verification fails

1. Verify `STRIPE_WEBHOOK_SECRET` or `WAVE_API_KEY` is correct
2. Check timing (signatures expire after ~5 minutes)
3. Ensure raw body is used (not parsed JSON)

### Transaction not updating

1. Check database: `SELECT * FROM "Transaction" WHERE id = 'xxx'`
2. Verify transaction exists before webhook arrives
3. Check Prisma queries for errors in logs

### Emails not sending

1. Verify `RESEND_API_KEY` is set
2. Check email address is valid
3. Test directly: `await sendOrderConfirmationEmail({...})`
4. Check Resend dashboard for bounces

---

## Production Checklist

- [ ] Stripe webhook added to production dashboard
- [ ] Wave webhook added to production dashboard
- [ ] `STRIPE_WEBHOOK_SECRET` set in production env
- [ ] `WAVE_API_KEY` set in production env
- [ ] `RESEND_API_KEY` set in production env
- [ ] Test payment → webhook → email flow
- [ ] Monitor logs for webhook errors
- [ ] Set up alerts for failed webhooks

---

**Last Updated:** 2026-07-31
