import { NextRequest, NextResponse } from 'next/server';
import { searchListings } from '@/lib/search/meilisearch';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const q = searchParams.get('q');
    const page = parseInt(searchParams.get('page') || '1');

    if (!q || q.length < 2) {
      return NextResponse.json({
        results: [],
        pagination: { page, limit: 20, totalHits: 0 },
      });
    }

    const filters = {
      city: searchParams.get('city') || undefined,
      category: searchParams.get('category') || undefined,
      minPrice: searchParams.get('minPrice') ? parseInt(searchParams.get('minPrice')!) : undefined,
      maxPrice: searchParams.get('maxPrice') ? parseInt(searchParams.get('maxPrice')!) : undefined,
    };

    const results = await searchListings(q, filters, page);

    return NextResponse.json({
      results: results.hits,
      pagination: {
        page: results.page,
        limit: results.hitsPerPage,
        totalHits: results.totalHits,
        totalPages: results.totalPages,
      },
      processingTimeMs: results.processingTimeMs,
    });
  } catch (error: any) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: error.message || 'Search failed' },
      { status: 500 }
    );
  }
}
