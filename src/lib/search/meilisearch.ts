import { MeiliSearch } from 'meilisearch';
import type { Listing } from '@prisma/client';

const client = new MeiliSearch({
  host: process.env.MEILISEARCH_URL || 'http://localhost:7700',
  apiKey: process.env.MEILISEARCH_MASTER_KEY,
});

export const searchIndex = client.index('listings');

const INDEX_NAME = 'listings';

export interface SearchFilters {
  city?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'recent' | 'popular';
}

export async function initializeIndex() {
  try {
    const index = client.index(INDEX_NAME);
    await index.updateSearchableAttributes(['title', 'description', 'city', 'category']);
    await index.updateFilterableAttributes(['city', 'category', 'price', 'status', 'createdAt']);
    await index.updateSortableAttributes(['price', 'createdAt', 'viewCount']);
    await index.updateTypoTolerance({ enabled: true });
    console.log(`✅ Meilisearch index "${INDEX_NAME}" initialized`);
  } catch (error) {
    console.error('Failed to initialize Meilisearch index:', error);
  }
}

export async function searchListings(
  query: string = '',
  filters?: SearchFilters,
  page: number = 1,
  limit: number = 20
) {
  try {
    const filterArray: string[] = [];

    if (filters?.city) filterArray.push(`city = "${filters.city}"`);
    if (filters?.category) filterArray.push(`category = "${filters.category}"`);
    if (filters?.minPrice) filterArray.push(`price >= ${filters.minPrice}`);
    if (filters?.maxPrice) filterArray.push(`price <= ${filters.maxPrice}`);
    filterArray.push('status = "ACTIVE"');

    const sort = filters?.sortBy === 'popular' ? ['viewCount:desc'] : ['createdAt:desc'];

    const results = await searchIndex.search(query, {
      filter: filterArray,
      page,
      hitsPerPage: limit,
      sort,
    });

    return {
      data: results.hits,
      total: (results as any).estimatedTotalHits || (results as any).totalHits || 0,
      page,
      limit,
      pages: Math.ceil(((results as any).estimatedTotalHits || (results as any).totalHits || 0) / limit),
    };
  } catch (error) {
    console.error('Meilisearch error:', error);
    return { data: [], total: 0, page, limit, pages: 0 };
  }
}

export async function indexListing(listing: Listing & { user?: { name: string } }) {
  try {
    const document = {
      id: listing.id,
      title: listing.title,
      description: listing.description,
      city: listing.city,
      category: listing.category,
      price: Number(listing.price),
      status: listing.status,
      viewCount: listing.viewCount,
      createdAt: listing.createdAt.toISOString(),
      userName: (listing.user as any)?.name || 'Anonymous',
    };
    await searchIndex.updateDocuments([document]);
  } catch (error) {
    console.error('Meilisearch index error:', error);
  }
}

export async function deleteListing(id: string) {
  try {
    await searchIndex.deleteDocument(id);
  } catch (error) {
    console.error('Meilisearch delete error:', error);
  }
}

export async function reindexAllListings(listings: (Listing & { user?: { name: string } })[]) {
  try {
    const index = client.index(INDEX_NAME);
    await index.deleteAllDocuments();
    const documents = listings.map((listing) => ({
      id: listing.id,
      title: listing.title,
      description: listing.description,
      city: listing.city,
      category: listing.category,
      price: Number(listing.price),
      status: listing.status,
      viewCount: listing.viewCount,
      createdAt: listing.createdAt.toISOString(),
      userName: (listing.user as any)?.name || 'Anonymous',
    }));
    await index.addDocuments(documents);
    console.log(`✅ Reindexed ${documents.length} listings`);
    return { indexed: documents.length };
  } catch (error) {
    console.error('Reindex error:', error);
    throw error;
  }
}
