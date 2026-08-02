import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { updateStatusSchema } from '@/lib/validators';
import { getLivraisonById, updateLivraisonStatus } from '@/lib/api/livraisons';
import { z } from 'zod';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const livraison = await getLivraisonById(id);
    return NextResponse.json({ data: livraison });
  } catch (error) {
    if (error instanceof Error && error.message.includes('not found')) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    console.error('Get livraison error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch livraison' },
      { status: 500 }
    );
  }
}

export async function PATCH(
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
    const data = updateStatusSchema.parse(body);

    const updated = await updateLivraisonStatus(id, session.user.id, data.statut);
    return NextResponse.json({ data: updated });
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
      if (error.message.includes('Unauthorized')) {
        return NextResponse.json({ error: error.message }, { status: 403 });
      }
    }

    console.error('Update livraison status error:', error);
    return NextResponse.json(
      { error: 'Failed to update livraison' },
      { status: 500 }
    );
  }
}
