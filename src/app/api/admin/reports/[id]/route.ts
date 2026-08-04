import { NextRequest, NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { reviewReport } from '@/lib/moderation';
import { z } from 'zod';

const reviewSchema = z.object({
  status: z.enum(['RESOLVED', 'DISMISSED', 'ESCALATED']),
  adminNotes: z.string().min(1),
  action: z
    .object({
      type: z.enum(['suspend-user', 'unlist', 'warn']),
      duration: z.number().int().min(1).optional(),
    })
    .optional(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getAuthSession();

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
    const { status, adminNotes, action } = reviewSchema.parse(body);

    const report = await reviewReport(id, status, adminNotes, session.user.id, action);

    return NextResponse.json({
      success: true,
      report,
      message: `Report ${status.toLowerCase()}`,
    });
  } catch (error) {
    console.error('Report review error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 });
    }

    const message = error instanceof Error ? error.message : 'Failed to review report';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
