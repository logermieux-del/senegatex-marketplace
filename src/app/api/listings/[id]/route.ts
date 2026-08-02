import { NextRequest, NextResponse } from 'next/server';
import { getListingById, updateListing, deleteListing, incrementViewCount } from '@/lib/api/listings';
import { getAuthSession } from '@/lib/auth';

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const listing = await getListingById(params.id);

    if (!listing) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    // Increment view count (async, don't await)
    incrementViewCount(params.id).catch(console.error);

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
  } catch (error: any) {
    console.error('GET /api/listings/[id] error:', error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getAuthSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const listing = await updateListing(params.id, session.user.id, body);

    return NextResponse.json(listing);
  } catch (error: any) {
    console.error('PATCH /api/listings/[id] error:', error);
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getAuthSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await deleteListing(params.id, session.user.id);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('DELETE /api/listings/[id] error:', error);
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
