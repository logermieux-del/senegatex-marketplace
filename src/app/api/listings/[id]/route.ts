import { NextRequest, NextResponse } from 'next/server';
import { getListingById, updateListing, deleteListing, incrementViewCount } from '@/lib/api/listings';
import { getAuthSession } from '@/lib/auth';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const listing = await getListingById(id);

    if (!listing) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    // Increment view count (async, don't await)
    incrementViewCount(id).catch(console.error);

    // Parse photos if stored as JSON string
    const photos = listing.photos
      ? (typeof listing.photos === 'string' ? JSON.parse(listing.photos) : listing.photos)
      : [];

    return NextResponse.json({
      data: {
        ...listing,
        photos: Array.isArray(photos) ? photos : [photos],
      },
    });
  } catch (error) {
    console.error('GET /api/listings/[id] error:', error);
    const message = error instanceof Error ? error.message : 'Failed to fetch listing';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAuthSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const listing = await updateListing(id, session.user.id, body);

    return NextResponse.json(listing);
  } catch (error) {
    console.error('PATCH /api/listings/[id] error:', error);
    const message = error instanceof Error ? error.message : 'Failed to update listing';
    if (message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAuthSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await deleteListing(id, session.user.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/listings/[id] error:', error);
    const message = error instanceof Error ? error.message : 'Failed to delete listing';
    if (message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
