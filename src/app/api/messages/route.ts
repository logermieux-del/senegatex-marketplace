import { NextRequest, NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const messageSchema = z.object({
  toUserId: z.string(),
  listingId: z.string().optional(),
  body: z.string().min(1).max(5000),
});

export async function GET(request: NextRequest) {
  try {
    const session = await getAuthSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const messages = await prisma.message.findMany({
      where: {
        toUserId: session.user.id,
      },
      include: {
        from: {
          select: { id: true, name: true, avatar: true },
        },
        to: {
          select: { id: true, name: true },
        },
        listing: {
          select: { id: true, title: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return NextResponse.json({
      data: messages.map((msg) => ({
        id: msg.id,
        body: msg.body,
        fromUser: msg.from,
        toUser: msg.to,
        listing: msg.listing,
        isRead: msg.isRead,
        createdAt: msg.createdAt,
      })),
    });
  } catch (error: any) {
    console.error('Get messages error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getAuthSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { toUserId, listingId, body: messageBody } = messageSchema.parse(body);

    if (toUserId === session.user.id) {
      return NextResponse.json(
        { error: 'Cannot message yourself' },
        { status: 400 }
      );
    }

    const message = await prisma.message.create({
      data: {
        fromUserId: session.user.id,
        toUserId,
        listingId: listingId || null,
        body: messageBody,
      },
      include: {
        from: true,
        to: true,
        listing: true,
      },
    });

    return NextResponse.json(message, { status: 201 });
  } catch (error: any) {
    console.error('Create message error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }

    return NextResponse.json(
      { error: error.message || 'Failed to send message' },
      { status: 500 }
    );
  }
}
