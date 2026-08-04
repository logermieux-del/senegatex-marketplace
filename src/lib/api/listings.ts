import { prisma } from '@/lib/db';
import { createListingSchema, updateListingSchema, type CreateListingInput } from '@/lib/validators';
import { indexListing, deleteListing } from '@/lib/search/meilisearch';
import { Prisma } from '@prisma/client';
import type { z } from 'zod';

interface ListingFilters {
  city?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  q?: string;
  transactionType?: string;
  propertyType?: string;
}

// price is stored as BigInt (real estate prices exceed INT4 range) but every
// listing price fits comfortably under Number.MAX_SAFE_INTEGER, so callers
// (API routes, frontend) work with plain numbers.
function toPlainListing<T extends { price: bigint }>(listing: T) {
  return { ...listing, price: Number(listing.price) };
}

export async function getListings(page: number = 1, limit: number = 10, filters?: ListingFilters) {
  const skip = (page - 1) * limit;

  const where: Prisma.ListingWhereInput = {
    status: 'ACTIVE',
    ...(filters?.city && { city: filters.city }),
    ...(filters?.category && { category: filters.category }),
    ...(filters?.minPrice && { price: { gte: BigInt(filters.minPrice) } }),
    ...(filters?.maxPrice && { price: { lte: BigInt(filters.maxPrice) } }),
    ...(filters?.transactionType && { transactionType: filters.transactionType }),
    ...(filters?.propertyType && { propertyType: filters.propertyType }),
    ...(filters?.q && {
      OR: [
        { title: { contains: filters.q, mode: 'insensitive' } },
        { description: { contains: filters.q, mode: 'insensitive' } },
      ],
    }),
  };

  const [listings, total] = await Promise.all([
    prisma.listing.findMany({
      where,
      skip,
      take: limit,
      include: { user: { select: { id: true, name: true, avatar: true } } },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.listing.count({ where }),
  ]);

  return {
    data: listings.map(toPlainListing),
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
  };
}

export async function getListingById(id: string) {
  const listing = await prisma.listing.findUnique({
    where: { id },
    include: {
      user: {
        select: { id: true, name: true, avatar: true, email: true, phone: true },
      },
      messages: { take: 5, orderBy: { createdAt: 'desc' } },
      transactions: { where: { paymentStatus: 'COMPLETED' } },
    },
  });

  return listing ? toPlainListing(listing) : null;
}

export async function createListing(userId: string, data: CreateListingInput & { photos?: string[] }) {
  const validated = createListingSchema.parse(data);

  const listing = await prisma.listing.create({
    data: {
      ...validated,
      price: BigInt(validated.price),
      userId,
      photos: data.photos ? JSON.stringify(data.photos) : null,
    },
    include: { user: { select: { id: true, name: true } } },
  });

  // Index in Meilisearch (async, don't block)
  indexListing(listing as any).catch(console.error);

  return toPlainListing(listing);
}

export async function updateListing(
  id: string,
  userId: string,
  data: z.infer<typeof updateListingSchema>
) {
  // Verify ownership
  const listing = await prisma.listing.findUnique({
    where: { id },
    select: { userId: true },
  });

  if (!listing || listing.userId !== userId) {
    throw new Error('Unauthorized');
  }

  const { photos, price, ...validated } = updateListingSchema.parse(data);

  const updated = await prisma.listing.update({
    where: { id },
    data: {
      ...validated,
      ...(price !== undefined && { price: BigInt(price) }),
      ...(photos && { photos: JSON.stringify(photos) }),
    },
    include: { user: { select: { name: true } } },
  });

  // Reindex in Meilisearch
  indexListing(updated as any).catch(console.error);

  return toPlainListing(updated);
}

export async function deleteListing(id: string, userId: string) {
  const listing = await prisma.listing.findUnique({
    where: { id },
    select: { userId: true },
  });

  if (!listing || listing.userId !== userId) {
    throw new Error('Unauthorized');
  }

  const deleted = await prisma.listing.update({
    where: { id },
    data: { status: 'DELETED' },
  });

  // Remove from Meilisearch index
  deleteListing(id).catch(console.error);

  return deleted;
}

export async function incrementViewCount(id: string) {
  return prisma.listing.update({
    where: { id },
    data: { viewCount: { increment: 1 } },
  });
}
