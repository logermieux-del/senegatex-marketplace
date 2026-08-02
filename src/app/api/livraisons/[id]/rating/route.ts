import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { livraisonRatingSchema } from '@/lib/validators';
import { rateLivraison } from '@/lib/api/livraisons';
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

    const result = await rateLivraison(id, {
      punctualite: data.punctualite,
      etatProduit: data.etatProduit,
      communication: data.communication,
      professionalisme: data.professionalisme,
      commentaire: data.commentaire,
    });

    return NextResponse.json({ data: result });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    if (error instanceof Error) {
      if (error.message.includes('not found')) {
        return NextResponse.json({ error: error.message }, { status: 404 });
      }
      if (error.message.includes('Can only rate')) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
    }

    console.error('Rate livraison error:', error);
    return NextResponse.json(
      { error: 'Failed to rate livraison' },
      { status: 500 }
    );
  }
}
