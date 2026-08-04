import { prisma } from '@/lib/db';
import { notifyNewMessage } from '@/lib/notifications';

export async function sendMessage(
  fromUserId: string,
  toUserId: string,
  body: string,
  listingId?: string
) {
  try {
    // Check recipient exists
    const recipient = await prisma.user.findUnique({
      where: { id: toUserId },
    });

    if (!recipient) {
      throw new Error('Recipient not found');
    }

    // Create message
    const message = await prisma.message.create({
      data: {
        fromUserId,
        toUserId,
        body,
        listingId: listingId || null,
      },
      include: {
        from: { select: { name: true, email: true } },
        listing: { select: { id: true, title: true } },
      },
    });

    // Notify recipient
    await notifyNewMessage(
      toUserId,
      message.from.name,
      listingId || '',
      message.listing?.title || 'Votre annonce'
    ).catch(console.error);

    console.log(`💬 Message sent from ${fromUserId} to ${toUserId}`);
    return message;
  } catch (error) {
    console.error('Failed to send message:', error);
    throw error;
  }
}

export async function getMessages(
  userId: string,
  conversationWith?: string,
  limit = 50,
  offset = 0
) {
  try {
    const where = conversationWith
      ? {
          OR: [
            { fromUserId: userId, toUserId: conversationWith },
            { fromUserId: conversationWith, toUserId: userId },
          ],
        }
      : {
          OR: [{ fromUserId: userId }, { toUserId: userId }],
        };

    const messages = await prisma.message.findMany({
      where,
      include: {
        from: { select: { id: true, name: true, avatar: true } },
        to: { select: { id: true, name: true } },
        listing: { select: { id: true, title: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });

    return messages;
  } catch (error) {
    console.error('Failed to fetch messages:', error);
    throw error;
  }
}

export async function getConversations(userId: string, limit = 50) {
  try {
    // Get unique conversations (last message from each person)
    const conversations = await prisma.message.findMany({
      where: {
        OR: [{ fromUserId: userId }, { toUserId: userId }],
      },
      select: {
        fromUserId: true,
        toUserId: true,
        from: { select: { id: true, name: true, avatar: true, email: true } },
        to: { select: { id: true, name: true, avatar: true, email: true } },
        body: true,
        isRead: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
      take: limit * 2, // Get more to deduplicate
    });

    // Map conversations and deduplicate
    const uniqueConversations = new Map();

    conversations.forEach((msg) => {
      const otherUserId = msg.fromUserId === userId ? msg.toUserId : msg.fromUserId;
      const key = otherUserId;

      if (!uniqueConversations.has(key)) {
        uniqueConversations.set(key, {
          otherUser:
            msg.fromUserId === userId ? msg.to : msg.from,
          lastMessage: msg.body,
          lastMessageTime: msg.createdAt,
          isRead: msg.isRead,
          unreadCount: 0,
        });
      }
    });

    // Count unread messages per conversation
    const unreadCounts = await Promise.all(
      Array.from(uniqueConversations.keys()).map((otherUserId) =>
        prisma.message.count({
          where: {
            toUserId: userId,
            fromUserId: otherUserId,
            isRead: false,
          },
        })
      )
    );

    const result = Array.from(uniqueConversations.entries())
      .map(([otherUserId], index) => ({
        ...uniqueConversations.get(otherUserId),
        unreadCount: unreadCounts[index],
      }))
      .sort(
        (a, b) =>
          new Date(b.lastMessageTime).getTime() -
          new Date(a.lastMessageTime).getTime()
      )
      .slice(0, limit);

    return result;
  } catch (error) {
    console.error('Failed to fetch conversations:', error);
    throw error;
  }
}

export async function markMessageAsRead(messageId: string, userId: string) {
  try {
    const message = await prisma.message.findUnique({
      where: { id: messageId },
    });

    if (!message || message.toUserId !== userId) {
      throw new Error('Message not found or unauthorized');
    }

    return prisma.message.update({
      where: { id: messageId },
      data: { isRead: true },
      include: {
        from: { select: { name: true } },
        listing: { select: { title: true } },
      },
    });
  } catch (error) {
    console.error('Failed to mark message as read:', error);
    throw error;
  }
}

export async function markConversationAsRead(
  userId: string,
  otherUserId: string
) {
  try {
    return prisma.message.updateMany({
      where: {
        toUserId: userId,
        fromUserId: otherUserId,
        isRead: false,
      },
      data: { isRead: true },
    });
  } catch (error) {
    console.error('Failed to mark conversation as read:', error);
    throw error;
  }
}
