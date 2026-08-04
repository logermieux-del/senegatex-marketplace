import { prisma } from './db';

export type NotificationType =
  | 'NEW_MESSAGE'
  | 'LISTING_SOLD'
  | 'PAYMENT_RECEIVED'
  | 'PAYMENT_FAILED'
  | 'REVIEW_RECEIVED'
  | 'ACCOUNT_SUSPENDED'
  | 'LISTING_FLAGGED';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  relatedUserId?: string;
  relatedListingId?: string;
  relatedTransactionId?: string;
  isRead: boolean;
  createdAt: Date;
  actionUrl?: string;
}

export async function createNotification(
  userId: string,
  type: NotificationType,
  title: string,
  message: string,
  data?: {
    relatedUserId?: string;
    relatedListingId?: string;
    relatedTransactionId?: string;
    actionUrl?: string;
  }
) {
  try {
    // Store in database
    const notification = await prisma.notification.create({
      data: {
        userId,
        type,
        title,
        message,
        relatedUserId: data?.relatedUserId,
        relatedListingId: data?.relatedListingId,
        relatedTransactionId: data?.relatedTransactionId,
        actionUrl: data?.actionUrl,
        isRead: false,
      },
    });

    // TODO: Emit real-time event to user via WebSocket
    // emitToUser(userId, 'notification', notification);

    return notification;
  } catch (error) {
    console.error('Failed to create notification:', error);
    throw error;
  }
}

export async function getUnreadNotifications(userId: string) {
  return prisma.notification.findMany({
    where: {
      userId,
      isRead: false,
    },
    orderBy: { createdAt: 'desc' },
    take: 20,
  });
}

export async function markNotificationAsRead(notificationId: string, userId: string) {
  return prisma.notification.updateMany({
    where: {
      id: notificationId,
      userId,
    },
    data: {
      isRead: true,
    },
  });
}

export async function markAllNotificationsAsRead(userId: string) {
  return prisma.notification.updateMany({
    where: {
      userId,
      isRead: false,
    },
    data: {
      isRead: true,
    },
  });
}

// Notification helpers for common events

export async function notifyNewMessage(
  toUserId: string,
  fromUserName: string,
  listingId: string,
  listingTitle?: string
) {
  const title = 'Nouveau message';
  const message = `${fromUserName} vous a envoyé un message${listingTitle ? ` à propos de ${listingTitle}` : ''}`;

  return createNotification(toUserId, 'NEW_MESSAGE', title, message, {
    relatedListingId: listingId,
    actionUrl: '/dashboard/messages',
  });
}

export async function notifyListingSold(
  sellerId: string,
  listingTitle: string,
  buyerName: string,
  listingId: string
) {
  const title = 'Annonce vendue!';
  const message = `Votre annonce "${listingTitle}" a été vendue à ${buyerName}`;

  return createNotification(sellerId, 'LISTING_SOLD', title, message, {
    relatedListingId: listingId,
    actionUrl: `/dashboard/sales`,
  });
}

export async function notifyPaymentReceived(
  sellerId: string,
  amount: number,
  buyerName: string
) {
  const title = 'Paiement reçu';
  const message = `Vous avez reçu ${amount.toLocaleString()} XOF de ${buyerName}`;

  return createNotification(sellerId, 'PAYMENT_RECEIVED', title, message, {
    actionUrl: '/dashboard/sales',
  });
}

export async function notifyPaymentFailed(
  buyerId: string,
  listingTitle: string,
  reason: string
) {
  const title = 'Paiement échoué';
  const message = `Le paiement pour "${listingTitle}" a échoué: ${reason}`;

  return createNotification(buyerId, 'PAYMENT_FAILED', title, message, {
    actionUrl: '/dashboard/purchases',
  });
}

export async function notifyAccountSuspended(
  userId: string,
  reason: string,
  durationDays?: number
) {
  const title = '⚠️ Compte suspendu';
  const message = durationDays
    ? `Votre compte a été suspendu pour ${durationDays} jours. Raison: ${reason}`
    : `Votre compte a été suspendu. Raison: ${reason}`;

  return createNotification(userId, 'ACCOUNT_SUSPENDED', title, message);
}

export async function notifyListingFlagged(
  sellerId: string,
  listingTitle: string,
  reason: string
) {
  const title = 'Annonce signalée';
  const message = `Votre annonce "${listingTitle}" a été signalée. Raison: ${reason}`;

  return createNotification(sellerId, 'LISTING_FLAGGED', title, message, {
    actionUrl: '/dashboard/listings',
  });
}
