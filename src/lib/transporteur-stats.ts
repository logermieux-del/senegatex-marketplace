import { prisma } from '@/lib/db';

// Auto-suspension thresholds (business rule, not a paid service — safe to tune anytime)
const AUTO_SUSPEND_MIN_DISPUTE_RATE = 20; // percent
const AUTO_SUSPEND_MIN_LIVRAISONS = 5; // avoid punishing small sample sizes

/**
 * Recomputes tauxDisputes (% of this transporter's deliveries with at least
 * one dispute filed) and auto-suspends the transporter if the rate exceeds
 * the threshold on a meaningful sample size.
 */
export async function recomputeDisputeRate(transporteurId: string) {
  const transporteur = await prisma.transporteur.findUnique({
    where: { id: transporteurId },
    select: { nombreLivraisons: true, statut: true },
  });

  if (!transporteur || transporteur.nombreLivraisons === 0) {
    return;
  }

  const livraisonsAvecDispute = await prisma.livraison.count({
    where: {
      transporteurId,
      disputes: { some: {} },
    },
  });

  const tauxDisputes =
    Math.round((livraisonsAvecDispute / transporteur.nombreLivraisons) * 1000) / 10;

  const shouldAutoSuspend =
    tauxDisputes >= AUTO_SUSPEND_MIN_DISPUTE_RATE &&
    transporteur.nombreLivraisons >= AUTO_SUSPEND_MIN_LIVRAISONS &&
    transporteur.statut !== 'SUSPENDED';

  await prisma.transporteur.update({
    where: { id: transporteurId },
    data: {
      tauxDisputes,
      ...(shouldAutoSuspend ? { statut: 'SUSPENDED' } : {}),
    },
  });

  return { tauxDisputes, autoSuspended: shouldAutoSuspend };
}
