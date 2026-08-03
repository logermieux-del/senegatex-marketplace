import { MeiliSearch } from 'meilisearch';
import type { Listing } from '@prisma/client';

const client = new MeiliSearch({
  host: process.env.MEILISEARCH_URL || 'http://localhost:7700',
  apiKey: process.env.MEILISEARCH_MASTER_KEY,
});

export const searchIndex = client.index('listings');

export interface SearchFilters {
  city?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
}

export async function searchListings(query: string, filters?: SearchFilters, page: number = 1) {
  try {
    const filterArray: string[] = [];

    if (filters?.city) filterArray.push(`city = "${filters.city}"`);
    if (filters?.category) filterArray.push(`category = "${filters.category}"`);
    if (filters?.minPrice) filterArray.push(`price >= ${filters.minPrice}`);
    if (filters?.maxPrice) filterArray.push(`price <= ${filters.maxPrice}`);
    filterArray.push('status = "ACTIVE"');

    const results = await searchIndex.search(query, {
      filter: filterArray,
      page,
      hitsPerPage: 20,
      sort: ['createdAt:desc'],
    });

    return results;
  } catch (error) {
    console.error('Meilisearch error:', error);
    throw error;
  }
}

export async function indexListing(listing: Listing) {
  try {
    await searchIndex.addDocuments([
      {
        id: listing.id,
        title: listing.title,
        description: listing.description,
        city: listing.city,
        category: listing.category,
        price: Number(listing.price),
        status: listing.status,
        createdAt: new Date(listing.createdAt).getTime() / 1000, // Unix timestamp
      },
    ]);
  } catch (error) {
    console.error('Meilisearch index error:', error);
    // Don't throw - search is optional
  }
}

export async function deleteListing(id: string) {
  try {
    await searchIndex.deleteDocument(id);
  } catch (error) {
    console.error('Meilisearch delete error:', error);
  }
}
