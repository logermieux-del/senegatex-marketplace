import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = 'notifications@yombal.sn';

interface EmailParams {
  to: string;
  subject: string;
  html: string;
}

async function sendEmail({ to, subject, html }: EmailParams) {
  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html,
    });

    if (result.error) {
      console.error('Email send error:', result.error);
      return null;
    }

    console.log(`Email sent to ${to} | ID: ${result.data?.id}`);
    return result.data;
  } catch (error) {
    console.error('Email service error:', error);
    return null;
  }
}

// ============ Email Templates ============

export async function sendOrderConfirmationEmail(params: {
  buyerEmail: string;
  buyerName: string;
  listingTitle: string;
  listingPrice: number;
  sellerName: string;
  transactionId: string;
}) {
  const { buyerEmail, buyerName, listingTitle, listingPrice, sellerName, transactionId } = params;

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto; max-width: 600px; margin: 0 auto; padding: 20px; background: #fff7ed; border-radius: 8px;">
      <div style="background: white; padding: 30px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
        <h1 style="color: #f97316; margin: 0 0 10px 0;">✅ Order Confirmed!</h1>
        <p style="color: #666; margin: 0 0 20px 0;">Hi <strong>${buyerName}</strong>,</p>

        <div style="background: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; font-size: 14px; color: #666;">
            <strong>Item:</strong> ${listingTitle}
          </p>
          <p style="margin: 8px 0 0 0; font-size: 14px; color: #666;">
            <strong>Price:</strong> ${(listingPrice / 1000).toLocaleString()} XOF
          </p>
          <p style="margin: 8px 0 0 0; font-size: 14px; color: #666;">
            <strong>Seller:</strong> ${sellerName}
          </p>
          <p style="margin: 8px 0 0 0; font-size: 14px; color: #666;">
            <strong>Transaction ID:</strong> <code>${transactionId}</code>
          </p>
        </div>

        <p style="color: #666; line-height: 1.6;">
          Your payment has been received. Next steps:
        </p>

        <ol style="color: #666; line-height: 1.8;">
          <li>The seller will be notified about your purchase</li>
          <li>Go to your <strong>Messages</strong> to arrange pickup or delivery</li>
          <li>Confirm receipt and leave a review</li>
        </ol>

        <a href="http://localhost:3000/messages" style="display: inline-block; background: #f97316; color: white; padding: 10px 20px; border-radius: 6px; text-decoration: none; margin-top: 20px;">
          View Messages
        </a>

        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">

        <p style="color: #999; font-size: 12px; margin: 0;">
          This is an automated message. Do not reply to this email.
        </p>
      </div>
    </div>
  `;

  return sendEmail({
    to: buyerEmail,
    subject: `✅ Order Confirmed: ${listingTitle}`,
    html,
  });
}

export async function sendSaleNotificationEmail(params: {
  sellerEmail: string;
  sellerName: string;
  listingTitle: string;
  listingPrice: number;
  buyerName: string;
  transactionId: string;
}) {
  const { sellerEmail, sellerName, listingTitle, listingPrice, buyerName, transactionId } = params;

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto; max-width: 600px; margin: 0 auto; padding: 20px; background: #fff7ed; border-radius: 8px;">
      <div style="background: white; padding: 30px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
        <h1 style="color: #f97316; margin: 0 0 10px 0;">🎉 You Made a Sale!</h1>
        <p style="color: #666; margin: 0 0 20px 0;">Hi <strong>${sellerName}</strong>,</p>

        <div style="background: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; font-size: 14px; color: #666;">
            <strong>Item Sold:</strong> ${listingTitle}
          </p>
          <p style="margin: 8px 0 0 0; font-size: 14px; color: #666;">
            <strong>Sale Price:</strong> ${(listingPrice / 1000).toLocaleString()} XOF
          </p>
          <p style="margin: 8px 0 0 0; font-size: 14px; color: #666;">
            <strong>Buyer:</strong> ${buyerName}
          </p>
          <p style="margin: 8px 0 0 0; font-size: 14px; color: #666;">
            <strong>Transaction ID:</strong> <code>${transactionId}</code>
          </p>
        </div>

        <p style="color: #666; line-height: 1.6;">
          Congratulations! Someone has purchased your listing. Here's what to do next:
        </p>

        <ol style="color: #666; line-height: 1.8;">
          <li>Go to <strong>Messages</strong> to contact the buyer</li>
          <li>Arrange a meetup time and location (local pickup recommended)</li>
          <li>Confirm the transaction once completed</li>
          <li>Leave a review for the buyer</li>
        </ol>

        <a href="http://localhost:3000/messages" style="display: inline-block; background: #f97316; color: white; padding: 10px 20px; border-radius: 6px; text-decoration: none; margin-top: 20px;">
          Contact Buyer
        </a>

        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">

        <p style="color: #999; font-size: 12px; margin: 0;">
          This is an automated message. Do not reply to this email.
        </p>
      </div>
    </div>
  `;

  return sendEmail({
    to: sellerEmail,
    subject: `🎉 Sale Confirmed: ${listingTitle} - ${(listingPrice / 1000).toLocaleString()} XOF`,
    html,
  });
}

export async function sendPaymentFailureEmail(params: {
  buyerEmail: string;
  buyerName: string;
  listingTitle: string;
  reason?: string;
}) {
  const { buyerEmail, buyerName, listingTitle, reason } = params;

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto; max-width: 600px; margin: 0 auto; padding: 20px; background: #fef2f2; border-radius: 8px;">
      <div style="background: white; padding: 30px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
        <h1 style="color: #ef4444; margin: 0 0 10px 0;">❌ Payment Failed</h1>
        <p style="color: #666; margin: 0 0 20px 0;">Hi <strong>${buyerName}</strong>,</p>

        <div style="background: #fef2f2; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ef4444;">
          <p style="margin: 0; color: #991b1b;">
            Unfortunately, your payment for <strong>${listingTitle}</strong> could not be processed.
          </p>
          ${reason ? `<p style="margin: 10px 0 0 0; color: #991b1b; font-size: 14px;">Reason: ${reason}</p>` : ''}
        </div>

        <p style="color: #666; line-height: 1.6;">
          Please try again with:
        </p>

        <ul style="color: #666; line-height: 1.8;">
          <li>A different payment method</li>
          <li>Check that your card/account has sufficient funds</li>
          <li>Verify billing information</li>
        </ul>

        <a href="http://localhost:3000" style="display: inline-block; background: #f97316; color: white; padding: 10px 20px; border-radius: 6px; text-decoration: none; margin-top: 20px;">
          Try Again
        </a>

        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">

        <p style="color: #999; font-size: 12px; margin: 0;">
          Contact support if the problem persists.
        </p>
      </div>
    </div>
  `;

  return sendEmail({
    to: buyerEmail,
    subject: `❌ Payment Failed: ${listingTitle}`,
    html,
  });
}

export async function sendWelcomeEmail(params: {
  email: string;
  name: string;
}) {
  const { email, name } = params;

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto; max-width: 600px; margin: 0 auto; padding: 20px; background: #fff7ed; border-radius: 8px;">
      <div style="background: white; padding: 30px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
        <h1 style="color: #f97316; margin: 0 0 10px 0;">🎉 Welcome to Yombal!</h1>
        <p style="color: #666; margin: 0 0 20px 0;">Hello <strong>${name}</strong>,</p>

        <p style="color: #666; line-height: 1.6;">
          Thank you for joining Yombal, the #1 marketplace for buying and selling locally in Senegal.
        </p>

        <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #333; margin: 0 0 15px 0;">Get Started:</h3>
          <ul style="color: #666; line-height: 1.8; margin: 0; padding-left: 20px;">
            <li><strong>Browse</strong> thousands of listings</li>
            <li><strong>Create</strong> your first listing to sell</li>
            <li><strong>Message</strong> buyers and sellers</li>
            <li><strong>Pay safely</strong> with Stripe or Wave</li>
          </ul>
        </div>

        <a href="http://localhost:3000" style="display: inline-block; background: #f97316; color: white; padding: 10px 20px; border-radius: 6px; text-decoration: none; margin-top: 20px;">
          Start Browsing
        </a>

        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">

        <p style="color: #999; font-size: 12px; margin: 0;">
          Questions? Check our Help Center or contact support.
        </p>
      </div>
    </div>
  `;

  return sendEmail({
    to: email,
    subject: `🎉 Welcome to Yombal, ${name}!`,
    html,
  });
}

// ============ Transporteur / Livraison Templates ============

const STATUT_LABELS: Record<string, string> = {
  PENDING: 'En attente',
  ACCEPTED: 'Acceptée par le transporteur',
  PICKED_UP: 'Colis récupéré',
  IN_TRANSIT: 'En cours de livraison',
  DELIVERED: 'Livré',
  FAILED: 'Échec de la livraison',
};

export async function sendDeliveryStatusEmail(params: {
  toEmail: string;
  toName: string;
  statut: string;
  livraisonId: string;
}) {
  const { toEmail, toName, statut, livraisonId } = params;
  const label = STATUT_LABELS[statut] || statut;

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: white; padding: 30px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
        <h1 style="color: #f97316; margin: 0 0 10px 0;">📦 Mise à jour de votre livraison</h1>
        <p style="color: #666;">Bonjour <strong>${toName}</strong>,</p>
        <p style="color: #666; line-height: 1.6;">Statut actuel : <strong>${label}</strong></p>
        <a href="http://localhost:3000/livraisons/${livraisonId}/tracking" style="display: inline-block; background: #f97316; color: white; padding: 10px 20px; border-radius: 6px; text-decoration: none; margin-top: 20px;">
          Suivre ma livraison
        </a>
      </div>
    </div>
  `;

  return sendEmail({ to: toEmail, subject: `📦 Livraison: ${label}`, html });
}

export async function sendDisputeCreatedEmail(params: {
  transporteurEmail: string;
  transporteurName: string;
  raison: string;
  livraisonId: string;
}) {
  const { transporteurEmail, transporteurName, raison, livraisonId } = params;

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: white; padding: 30px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); border-left: 4px solid #ef4444;">
        <h1 style="color: #ef4444; margin: 0 0 10px 0;">⚠️ Un problème a été signalé</h1>
        <p style="color: #666;">Bonjour <strong>${transporteurName}</strong>,</p>
        <p style="color: #666; line-height: 1.6;">
          Un client a signalé un problème (<strong>${raison}</strong>) concernant la livraison
          <code>${livraisonId}</code>. Notre équipe va l'examiner.
        </p>
      </div>
    </div>
  `;

  return sendEmail({ to: transporteurEmail, subject: '⚠️ Litige signalé sur une livraison', html });
}

export async function sendDisputeResolvedEmail(params: {
  toEmail: string;
  toName: string;
  resolutionType: string;
  montant?: number;
}) {
  const { toEmail, toName, resolutionType, montant } = params;

  const resolutionLabels: Record<string, string> = {
    remboursement: 'Remboursement accordé',
    compensation: 'Compensation accordée',
    rejete: 'Litige rejeté',
  };

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: white; padding: 30px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
        <h1 style="color: #f97316; margin: 0 0 10px 0;">✅ Litige résolu</h1>
        <p style="color: #666;">Bonjour <strong>${toName}</strong>,</p>
        <p style="color: #666; line-height: 1.6;">
          ${resolutionLabels[resolutionType] || resolutionType}
          ${montant ? ` — ${(montant / 1).toLocaleString()} XOF` : ''}
        </p>
      </div>
    </div>
  `;

  return sendEmail({ to: toEmail, subject: '✅ Votre litige a été traité', html });
}

export async function sendPaymentSentEmail(params: {
  toEmail: string;
  toName: string;
  montant: number;
  methode: string;
}) {
  const { toEmail, toName, montant, methode } = params;

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: white; padding: 30px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
        <h1 style="color: #22c55e; margin: 0 0 10px 0;">💰 Paiement envoyé</h1>
        <p style="color: #666;">Bonjour <strong>${toName}</strong>,</p>
        <p style="color: #666; line-height: 1.6;">
          Un paiement de <strong>${montant.toLocaleString()} XOF</strong> vous a été envoyé via
          <strong>${methode}</strong>.
        </p>
      </div>
    </div>
  `;

  return sendEmail({ to: toEmail, subject: '💰 Paiement de livraison envoyé', html });
}
