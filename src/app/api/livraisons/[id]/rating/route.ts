import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { livraisonRatingSchema } from '@/lib/validators';
import { z } from 'zod';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const data = livraisonRatingSchema.parse(body);

    // Get livraison
    const livraison = await prisma.livraison.findUnique({
      where: { id },
      include: {
        transporteur: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!livraison) {
      return NextResponse.json(
        { error: 'Livraison not found' },
        { status: 404 }
      );
    }

    if (livraison.statut !== 'DELIVERED') {
      return NextResponse.json(
        { error: 'Can only rate delivered livraisons' },
        { status: 400 }
      );
    }

    // Store rating
    const rating = {
      punctualite: data.punctualite,
      etatProduit: data.etatProduit,
      communication: data.communication,
      professionalisme: data.professionalisme,
      commentaire: data.commentaire || '',
    };

    const updated = await prisma.livraison.update({
      where: { id },
      data: {
        ratingAcheteur: JSON.stringify(rating),
      },
    });

    // Update transporteur average rating
    const allRatings = await prisma.livraison.findMany({
      where: {
        transporteurId: livraison.transporteurId,
        statut: 'DELIVERED',
        ratingAcheteur: { not: null },
      },
      select: {
        ratingAcheteur: true,
      },
    });

    if (allRatings.length > 0) {
      let totalScore = 0;

      allRatings.forEach((l) => {
        if (l.ratingAcheteur) {
          const r = JSON.parse(l.ratingAcheteur);
          totalScore +=
            (r.punctualite +
              r.etatProduit +
              r.communication +
              r.professionalisme) /
            4;
        }
      });

      const averageScore = totalScore / allRatings.length;

      await prisma.transporteur.update({
        where: { id: livraison.transporteurId },
        data: {
          notianceGlobale: Math.round(averageScore * 10) / 10, // Round to 1 decimal
        },
      });
    }

    return NextResponse.json({
      data: {
        id: updated.id,
        rating,
        message: 'Livraison rated successfully',
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Rate livraison error:', error);
    return NextResponse.json(
      { error: 'Failed to rate livraison' },
      { status: 500 }
    );
  }
}
