import { prisma } from '@/lib/db';
import { createListingSchema, updateListingSchema, type CreateListingInput } from '@/lib/validators';
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

export async function getListings(page: number = 1, limit: number = 10, filters?: ListingFilters) {
  const skip = (page - 1) * limit;

  const where: Prisma.ListingWhereInput = {
    status: 'ACTIVE',
    ...(filters?.city && { city: filters.city }),
    ...(filters?.category && { category: filters.category }),
    ...(filters?.minPrice && { price: { gte: filters.minPrice } }),
    ...(filters?.maxPrice && { price: { lte: filters.maxPrice } }),
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
    data: listings,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
  };
}

export async function getListingById(id: string) {
  return prisma.listing.findUnique({
    where: { id },
    include: {
      user: {
        select: { id: true, name: true, avatar: true, email: true, phone: true },
      },
      messages: { take: 5, orderBy: { createdAt: 'desc' } },
      transactions: { where: { paymentStatus: 'COMPLETED' } },
    },
  });
}

export async function createListing(userId: string, data: CreateListingInput & { photos?: string[] }) {
  const validated = createListingSchema.parse(data);

  return prisma.listing.create({
    data: {
      ...validated,
      userId,
      photos: data.photos ? JSON.stringify(data.photos) : null,
    },
    include: { user: { select: { id: true, name: true } } },
  });
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

  const { photos, ...validated } = updateListingSchema.parse(data);

  return prisma.listing.update({
    where: { id },
    data: {
      ...validated,
      ...(photos && { photos: JSON.stringify(photos) }),
    },
  });
}

export async function deleteListing(id: string, userId: string) {
  const listing = await prisma.listing.findUnique({
    where: { id },
    select: { userId: true },
  });

  if (!listing || listing.userId !== userId) {
    throw new Error('Unauthorized');
  }

  return prisma.listing.update({
    where: { id },
    data: { status: 'DELETED' },
  });
}

export async function incrementViewCount(id: string) {
  return prisma.listing.update({
    where: { id },
    data: { viewCount: { increment: 1 } },
  });
}
