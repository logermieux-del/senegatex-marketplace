import { NextRequest, NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const session = await getAuthSession();

    // Check if user is admin
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Fetch stats
    const [
      totalUsers,
      totalListings,
      activeListings,
      soldListings,
      totalTransactions,
      pendingReports,
      reports,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.listing.count(),
      prisma.listing.count({ where: { status: 'ACTIVE' } }),
      prisma.listing.count({ where: { status: 'SOLD' } }),
      prisma.transaction.count({ where: { paymentStatus: 'COMPLETED' } }),
      prisma.report.count({ where: { status: 'PENDING' } }),
      prisma.report.findMany({
        where: { status: 'PENDING' },
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: { listing: { select: { title: true } } },
      }),
    ]);

    // Calculate monthly revenue (sum of completed transactions this month)
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const monthlyTransactions = await prisma.transaction.aggregate({
      where: {
        paymentStatus: 'COMPLETED',
        completedAt: { gte: monthStart },
      },
      _sum: { amount: true },
    });

    const monthlyRevenue = Math.round((monthlyTransactions._sum.amount || 0) / 1000000);

    return NextResponse.json({
      stats: {
        totalUsers,
        totalListings,
        activeListings,
        soldListings,
        totalTransactions,
        pendingReports,
        monthlyRevenue,
        bannedUsers: 0, // TODO: Add suspension tracking
      },
      reports: reports.map((r) => ({
        id: r.id,
        listingId: r.listingId,
        listing: { title: r.listing.title },
        reason: r.reason,
        status: r.status,
        createdAt: r.createdAt,
      })),
    });
  } catch (error: any) {
    console.error('Admin dashboard error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to load dashboard' },
      { status: 500 }
    );
  }
}
