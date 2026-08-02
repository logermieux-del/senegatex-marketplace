import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { createLivraisonSchema } from '@/lib/validators';
import { getLivraisons, createLivraison as createLivraisonFn } from '@/lib/api/livraisons';
import { z } from 'zod';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const searchParams = req.nextUrl.searchParams;
    const statut = searchParams.get('statut') || undefined;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const result = await getLivraisons(session.user.id, statut, { page, limit });
    return NextResponse.json(result);
  } catch (error) {
    console.error('Get livraisons error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch livraisons' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = await req.json();
    const data = createLivraisonSchema.parse(body);

    const livraison = await createLivraisonFn(
      data.transporteurId,
      data.adresseDepart,
      data.adresseArrivee,
      data.tarifNegocie,
      data.transactionId
    );

    return NextResponse.json({ data: livraison }, { status: 201 });
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
      if (error.message.includes('not verified')) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
    }

    console.error('Create livraison error:', error);
    return NextResponse.json(
      { error: 'Failed to create livraison' },
      { status: 500 }
    );
  }
}
