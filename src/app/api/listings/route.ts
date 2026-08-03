import { NextRequest, NextResponse } from 'next/server';
import { getListings, createListing } from '@/lib/api/listings';
import { getAuthSession } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const filters = {
      city: searchParams.get('city') || undefined,
      category: searchParams.get('category') || undefined,
      minPrice: searchParams.get('minPrice') ? parseInt(searchParams.get('minPrice')!) : undefined,
      maxPrice: searchParams.get('maxPrice') ? parseInt(searchParams.get('maxPrice')!) : undefined,
      q: searchParams.get('q') || undefined,
      transactionType: searchParams.get('transactionType') || undefined,
      propertyType: searchParams.get('propertyType') || undefined,
    };

    const result = await getListings(page, Math.min(limit, 50), filters);

    // Parse photos in each listing
    const data = result.data.map((listing) => ({
      ...listing,
      photos: listing.photos
        ? (typeof listing.photos === 'string' ? JSON.parse(listing.photos) : listing.photos)
        : [],
    }));

    return NextResponse.json({ ...result, data });
  } catch (error) {
    console.error('GET /api/listings error:', error);
    const message = error instanceof Error ? error.message : 'Failed to fetch listings';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getAuthSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const listing = await createListing(session.user.id, body);

    return NextResponse.json(listing, { status: 201 });
  } catch (error) {
    console.error('POST /api/listings error:', error);
    const message = error instanceof Error ? error.message : 'Failed to create listing';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
