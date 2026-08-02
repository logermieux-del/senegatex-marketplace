import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { locationSchema } from '@/lib/validators';
import { getLocation, updateLocation } from '@/lib/api/livraisons';
import { z } from 'zod';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = await getLocation(id);
    return NextResponse.json({ data: result });
  } catch (error) {
    if (error instanceof Error && error.message.includes('not found')) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    console.error('Get location error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch location' },
      { status: 500 }
    );
  }
}

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
    const data = locationSchema.parse(body);

    const result = await updateLocation(id, session.user.id, data.lat, data.lng);
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
      if (error.message.includes('Unauthorized')) {
        return NextResponse.json({ error: error.message }, { status: 403 });
      }
      if (error.message.includes('Can only update')) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
    }

    console.error('Update location error:', error);
    return NextResponse.json(
      { error: 'Failed to update location' },
      { status: 500 }
    );
  }
}
