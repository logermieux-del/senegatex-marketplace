import { NextRequest, NextResponse } from 'next/server';
import { MeiliSearch } from 'meilisearch';

const client = new MeiliSearch({
  host: process.env.MEILISEARCH_URL || 'http://localhost:7700',
  apiKey: process.env.MEILISEARCH_MASTER_KEY || 'test-key',
});

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q') || '';
    const city = searchParams.get('city');
    const category = searchParams.get('category');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');

    // Build filter string for Meilisearch
    const filters: string[] = ['status = "ACTIVE"'];

    if (city) {
      filters.push(`city = "${city}"`);
    }
    if (category) {
      filters.push(`category = "${category}"`);
    }
    if (minPrice) {
      filters.push(`price >= ${Math.floor(parseFloat(minPrice) * 100000)}`);
    }
    if (maxPrice) {
      filters.push(`price <= ${Math.floor(parseFloat(maxPrice) * 100000)}`);
    }

    const index = client.index('listings');
    const results = await index.search(query, {
      filter: filters.length > 0 ? filters : undefined,
      offset: (page - 1) * limit,
      limit: Math.min(limit, 50),
      sort: ['createdAt:desc'],
    });

    // Parse photos for each result
    const data = results.hits.map((listing) => ({
      ...listing,
      photos: listing.photos
        ? typeof listing.photos === 'string'
          ? JSON.parse(listing.photos as string)
          : listing.photos
        : [],
    }));

    return NextResponse.json({
      data,
      pagination: {
        total: results.estimatedTotalHits,
        page,
        limit,
        pages: Math.ceil((results.estimatedTotalHits || 0) / limit),
      },
    });
  } catch (error) {
    console.error('Search error:', error);
    const message = error instanceof Error ? error.message : 'Search failed';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
