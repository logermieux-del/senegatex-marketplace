import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { reindexAllListings } from '@/lib/search/meilisearch';

export async function POST(request: NextRequest) {
  try {
    // Security: Check admin token or only allow from internal
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.split('Bearer ')[1];

    if (token !== process.env.ADMIN_SECRET_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch all active listings
    const listings = await prisma.listing.findMany({
      where: { status: 'ACTIVE' },
      include: { user: { select: { name: true } } },
    });

    // Reindex
    const result = await reindexAllListings(listings);

    return NextResponse.json({
      success: true,
      message: `Reindexed ${result.indexed} listings`,
    });
  } catch (error) {
    console.error('Reindex error:', error);
    const message = error instanceof Error ? error.message : 'Reindex failed';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
