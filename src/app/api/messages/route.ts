import { NextRequest, NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/auth';
import {
  sendMessage,
  getMessages,
  getConversations,
  markConversationAsRead,
} from '@/lib/api/messages';
import { z } from 'zod';

const sendMessageSchema = z.object({
  toUserId: z.string().min(1),
  body: z.string().min(1).max(5000),
  listingId: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const session = await getAuthSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const action = searchParams.get('action');
    const conversationWith = searchParams.get('conversationWith');
    const limit = Math.min(50, parseInt(searchParams.get('limit') || '20'));
    const offset = parseInt(searchParams.get('offset') || '0');

    if (action === 'conversations') {
      const conversations = await getConversations(session.user.id, limit);
      return NextResponse.json({
        data: conversations,
      });
    }

    const messages = await getMessages(
      session.user.id,
      conversationWith || undefined,
      limit,
      offset
    );

    // Auto-mark retrieved messages as read
    if (conversationWith) {
      await markConversationAsRead(session.user.id, conversationWith);
    }

    return NextResponse.json({
      data: messages,
    });
  } catch (error) {
    console.error('Get messages error:', error);
    const message = error instanceof Error ? error.message : 'Failed to fetch messages';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getAuthSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { toUserId, body: messageBody, listingId } = sendMessageSchema.parse(body);

    if (toUserId === session.user.id) {
      return NextResponse.json(
        { error: 'Cannot send message to yourself' },
        { status: 400 }
      );
    }

    const message = await sendMessage(
      session.user.id,
      toUserId,
      messageBody,
      listingId
    );

    return NextResponse.json(
      {
        success: true,
        message,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Send message error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }

    const message = error instanceof Error ? error.message : 'Failed to send message';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
