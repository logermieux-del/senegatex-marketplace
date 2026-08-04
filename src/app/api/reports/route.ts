import { NextRequest, NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/auth';
import { reportListing } from '@/lib/moderation';
import { z } from 'zod';

const reportSchema = z.object({
  listingId: z.string(),
  reason: z.enum(['inappropriate', 'fraud', 'duplicate', 'contact_info', 'offensive']),
  description: z.string().min(10).max(1000),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getAuthSession();

    const body = await request.json();
    const { listingId, reason, description } = reportSchema.parse(body);

    // Create report (anonymous or identified)
    await reportListing(
      listingId,
      reason,
      description,
      session?.user?.id // Can be null for anonymous reports
    );

    return NextResponse.json(
      {
        success: true,
        message: 'Merci de nous avoir signalé cet abus. Nous enquêterons rapidement.',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Report creation error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 });
    }

    const message = error instanceof Error ? error.message : 'Failed to create report';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
