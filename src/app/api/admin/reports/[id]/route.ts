import { NextRequest, NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getAuthSession();

    // Check if admin
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { status } = body;

    // Validate status
    if (!['RESOLVED', 'DISMISSED'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    // Update report
    const report = await prisma.report.update({
      where: { id: params.id },
      data: {
        status,
        reviewedBy: session.user.id,
      },
    });

    // If resolved and reason is severe, delete listing
    if (status === 'RESOLVED' && ['fraud', 'fake', 'stolen'].includes(report.reason.toLowerCase())) {
      await prisma.listing.update({
        where: { id: report.listingId },
        data: { status: 'DELETED' },
      });

      console.log(`Listing ${report.listingId} deleted due to: ${report.reason}`);
    }

    return NextResponse.json(report);
  } catch (error) {
    console.error('Report update error:', error);
    const message = error instanceof Error ? error.message : 'Failed to update report';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
