import { prisma } from '@/lib/db';

// Business decision confirmed with the founder: 1.5% surcharge (midpoint of
// the 1-2% range), added on top of tarifNegocie, funding a pooled reserve
// that pays out validated dispute refunds. Not a per-delivery earmark —
// refunds draw from the shared pool across all deliveries.
export const ASSURANCE_RATE = 0.015;

export function computeAssuranceMontant(tarifNegocie: number) {
  return Math.ceil(tarifNegocie * ASSURANCE_RATE);
}

/**
 * Fund balance = total surcharge collected across all deliveries minus
 * total refunds already committed (PENDING or PAID — once a refund is
 * approved it's earmarked even before the physical transfer happens).
 */
export async function getFundBalance() {
  const [collected, committed] = await Promise.all([
    prisma.livraison.aggregate({ _sum: { assuranceMontant: true } }),
    prisma.remboursementAssurance.aggregate({ _sum: { montant: true } }),
  ]);

  const totalCollecte = collected._sum.assuranceMontant || 0;
  const totalRembourse = committed._sum.montant || 0;

  return {
    totalCollecte,
    totalRembourse,
    solde: totalCollecte - totalRembourse,
  };
}
