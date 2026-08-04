import { NextRequest, NextResponse } from 'next/server';
import { searchListings } from '@/lib/search/meilisearch';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q') || '';
    const city = searchParams.get('city') || undefined;
    const category = searchParams.get('category') || undefined;
    const minPrice = searchParams.get('minPrice') ? parseInt(searchParams.get('minPrice')!) : undefined;
    const maxPrice = searchParams.get('maxPrice') ? parseInt(searchParams.get('maxPrice')!) : undefined;
    const sortBy = (searchParams.get('sortBy') as 'recent' | 'popular') || 'recent';
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '20')));

    const result = await searchListings(query, { city, category, minPrice, maxPrice, sortBy }, page, limit);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Search error:', error);
    const message = error instanceof Error ? error.message : 'Search failed';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
