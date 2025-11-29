import { Request, Response } from 'express';
import prisma from '../../config/database';
import { asyncHandler, sendSuccess } from '../../utils/apiHelpers';
import { cleanupInactiveDevices, sendNotificationToMultipleUsers } from '../notifications/notification.service';

export const cleanupDevices = asyncHandler(async (req: Request, res: Response) => {
  console.log('Admin: Cleanup inactive devices request');

  const deletedCount = await cleanupInactiveDevices(60);

  console.log(`Admin: Cleaned up ${deletedCount} inactive device tokens`);

  sendSuccess(res, { deletedCount }, `Cleaned up ${deletedCount} inactive device tokens`);
});

export const sendMonthlyReports = asyncHandler(async (req: Request, res: Response) => {
  console.log('Admin: Send monthly reports request');

  const usersWithMonthlyReports = await prisma.user.findMany({
    where: { notifyMonthlyReports: true },
    select: { id: true },
  });

  if (usersWithMonthlyReports.length === 0) {
    console.log('Admin: No users with monthly reports enabled');
    sendSuccess(res, { sentCount: 0 }, 'No users with monthly reports enabled');
    return;
  }

  const userIds = usersWithMonthlyReports.map((u) => u.id);

  const now = new Date();
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const monthName = lastMonth.toLocaleString('en-US', { month: 'long' });

  await sendNotificationToMultipleUsers(userIds, {
    title: `📊 Your ${monthName} Report is Ready`,
    body: 'Tap to view and download your monthly spending report',
    data: { type: 'monthly_report', screen: 'Settings' },
  });

  console.log(`Admin: Sent monthly reports to ${userIds.length} users`);

  sendSuccess(res, { sentCount: userIds.length }, `Sent monthly reports to ${userIds.length} users`);
});
