import { prisma } from './db';
import { notifyAccountSuspended, notifyListingFlagged } from './notifications';
import { sendAccountSuspendedEmail } from './external/email';

export type SuspensionReason =
  | 'fraud'
  | 'spam'
  | 'inappropriate_content'
  | 'harassment'
  | 'false_information'
  | 'payment_issue'
  | 'other';

export async function reportListing(
  listingId: string,
  reason: string,
  description: string,
  reportedBy?: string
) {
  try {
    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
    });

    if (!listing) {
      throw new Error('Listing not found');
    }

    const report = await prisma.report.create({
      data: {
        listingId,
        reportedBy: reportedBy || null,
        reason,
        description,
        status: 'PENDING',
      },
    });

    console.log(`📋 Report created for listing ${listingId}: ${reason}`);
    return report;
  } catch (error) {
    console.error('Failed to create report:', error);
    throw error;
  }
}

export async function getPendingReports(limit = 50) {
  return prisma.report.findMany({
    where: { status: 'PENDING' },
    include: {
      listing: { include: { user: { select: { id: true, name: true, email: true } } } },
    },
    orderBy: { createdAt: 'asc' },
    take: limit,
  });
}

export async function reviewReport(
  reportId: string,
  status: 'RESOLVED' | 'DISMISSED' | 'ESCALATED',
  adminNotes: string,
  adminId: string,
  action?: {
    type: 'suspend-user' | 'unlist' | 'warn';
    duration?: number; // days
  }
) {
  try {
    const report = await prisma.report.findUnique({
      where: { id: reportId },
      include: { listing: true },
    });

    if (!report) throw new Error('Report not found');

    // Update report
    await prisma.report.update({
      where: { id: reportId },
      data: {
        status,
        reviewedBy: adminId,
        adminNotes,
      },
    });

    // Take action if needed
    if (action) {
      if (action.type === 'unlist') {
        // Mark listing as DELETED
        await prisma.listing.update({
          where: { id: report.listingId },
          data: { status: 'DELETED' },
        });

        await notifyListingFlagged(
          report.listing.userId,
          report.listing.title,
          report.reason
        );

        console.log(`🗑️ Listing ${report.listingId} unlisted`);
      }

      if (action.type === 'suspend-user') {
        const suspendedUntil = action.duration
          ? new Date(Date.now() + action.duration * 24 * 60 * 60 * 1000)
          : null;

        await prisma.user.update({
          where: { id: report.listing.userId },
          data: {
            isSuspended: true,
            suspendedUntil,
          },
        });

        await notifyAccountSuspended(
          report.listing.userId,
          report.reason,
          action.duration
        );

        const user = await prisma.user.findUnique({
          where: { id: report.listing.userId },
          select: { email: true, name: true },
        });

        if (user) {
          await sendAccountSuspendedEmail({
            email: user.email,
            name: user.name,
            reason: report.reason,
            durationDays: action.duration,
          }).catch(console.error);
        }

        console.log(`🚫 User ${report.listing.userId} suspended`);
      }

      // Log moderator action
      await prisma.moderatorAction.create({
        data: {
          userId: adminId,
          action: action.type,
          reason: adminNotes,
          targetListingId: report.listingId,
          targetUserId: report.listing.userId,
          duration: action.duration,
        },
      });
    }

    return report;
  } catch (error) {
    console.error('Failed to review report:', error);
    throw error;
  }
}

export async function suspendUser(
  userId: string,
  reason: string,
  durationDays: number,
  adminId: string
) {
  try {
    const suspendedUntil = new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000);

    await prisma.user.update({
      where: { id: userId },
      data: {
        isSuspended: true,
        suspendedUntil,
      },
    });

    await notifyAccountSuspended(userId, reason, durationDays);

    await prisma.moderatorAction.create({
      data: {
        userId: adminId,
        action: 'suspend',
        reason,
        targetUserId: userId,
        duration: durationDays,
      },
    });

    console.log(`🚫 User ${userId} suspended for ${durationDays} days`);
  } catch (error) {
    console.error('Failed to suspend user:', error);
    throw error;
  }
}

export async function unsuspendUser(userId: string, adminId: string) {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        isSuspended: false,
        suspendedUntil: null,
      },
    });

    await prisma.moderatorAction.create({
      data: {
        userId: adminId,
        action: 'unsuspend',
        reason: 'Manual unsuspension',
        targetUserId: userId,
      },
    });

    console.log(`✅ User ${userId} unsuspended`);
  } catch (error) {
    console.error('Failed to unsuspend user:', error);
    throw error;
  }
}

export async function getModeratorDashboard(limit = 50) {
  const [pendingReports, activelyLockedUsers, recentActions] = await Promise.all([
    prisma.report.count({ where: { status: 'PENDING' } }),
    prisma.user.count({ where: { isSuspended: true } }),
    prisma.moderatorAction.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        moderator: { select: { name: true } },
      },
    }),
  ]);

  return {
    stats: {
      pendingReports,
      suspendedUsers: activelyLockedUsers,
    },
    recentActions,
  };
}
