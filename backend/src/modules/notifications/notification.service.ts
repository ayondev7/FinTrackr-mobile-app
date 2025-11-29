import Expo, { ExpoPushMessage, ExpoPushTicket } from 'expo-server-sdk';
import prisma from '../../config/database';

const expo = new Expo();

export interface NotificationPayload {
  title: string;
  body: string;
  data?: Record<string, unknown>;
}

export const sendNotificationToUser = async (
  userId: string,
  payload: NotificationPayload
): Promise<void> => {
  const deviceTokens = await prisma.deviceToken.findMany({
    where: { userId },
    select: { id: true, expoPushToken: true },
  });

  if (deviceTokens.length === 0) {
    console.log(`No device tokens found for user ${userId}`);
    return;
  }

  const messages: ExpoPushMessage[] = [];
  const tokenIdMap: Map<string, string> = new Map();

  for (const device of deviceTokens) {
    if (!Expo.isExpoPushToken(device.expoPushToken)) {
      console.log(`Invalid Expo push token: ${device.expoPushToken}`);
      await prisma.deviceToken.delete({ where: { id: device.id } });
      continue;
    }

    messages.push({
      to: device.expoPushToken,
      sound: 'default',
      title: payload.title,
      body: payload.body,
      data: payload.data,
    });

    tokenIdMap.set(device.expoPushToken, device.id);
  }

  if (messages.length === 0) {
    return;
  }

  const chunks = expo.chunkPushNotifications(messages);

  for (const chunk of chunks) {
    try {
      const tickets = await expo.sendPushNotificationsAsync(chunk);
      await handlePushTickets(tickets, chunk, tokenIdMap);
    } catch (error) {
      console.error('Error sending push notifications:', error);
    }
  }
};

export const sendNotificationToMultipleUsers = async (
  userIds: string[],
  payload: NotificationPayload
): Promise<void> => {
  const deviceTokens = await prisma.deviceToken.findMany({
    where: { userId: { in: userIds } },
    select: { id: true, expoPushToken: true },
  });

  if (deviceTokens.length === 0) {
    console.log('No device tokens found for users');
    return;
  }

  const messages: ExpoPushMessage[] = [];
  const tokenIdMap: Map<string, string> = new Map();

  for (const device of deviceTokens) {
    if (!Expo.isExpoPushToken(device.expoPushToken)) {
      console.log(`Invalid Expo push token: ${device.expoPushToken}`);
      await prisma.deviceToken.delete({ where: { id: device.id } });
      continue;
    }

    messages.push({
      to: device.expoPushToken,
      sound: 'default',
      title: payload.title,
      body: payload.body,
      data: payload.data,
    });

    tokenIdMap.set(device.expoPushToken, device.id);
  }

  if (messages.length === 0) {
    return;
  }

  const chunks = expo.chunkPushNotifications(messages);

  for (const chunk of chunks) {
    try {
      const tickets = await expo.sendPushNotificationsAsync(chunk);
      await handlePushTickets(tickets, chunk, tokenIdMap);
    } catch (error) {
      console.error('Error sending push notifications:', error);
    }
  }
};

const handlePushTickets = async (
  tickets: ExpoPushTicket[],
  messages: ExpoPushMessage[],
  tokenIdMap: Map<string, string>
): Promise<void> => {
  for (let i = 0; i < tickets.length; i++) {
    const ticket = tickets[i];
    const message = messages[i];
    const token = message.to as string;

    if (ticket.status === 'error') {
      console.error(`Push notification error for token ${token}:`, ticket.message);

      if (ticket.details?.error === 'DeviceNotRegistered') {
        const deviceId = tokenIdMap.get(token);
        if (deviceId) {
          await prisma.deviceToken.delete({ where: { id: deviceId } });
          console.log(`Deleted invalid device token: ${token}`);
        }
      }
    }
  }
};

export const cleanupInactiveDevices = async (daysInactive: number = 60): Promise<number> => {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysInactive);

  const result = await prisma.deviceToken.deleteMany({
    where: {
      lastActiveAt: { lt: cutoffDate },
    },
  });

  console.log(`Cleaned up ${result.count} inactive device tokens`);
  return result.count;
};

export const cleanupUserInactiveDevices = async (
  userId: string,
  daysInactive: number = 60
): Promise<number> => {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysInactive);

  const result = await prisma.deviceToken.deleteMany({
    where: {
      userId,
      lastActiveAt: { lt: cutoffDate },
    },
  });

  if (result.count > 0) {
    console.log(`Cleaned up ${result.count} inactive device tokens for user ${userId}`);
  }

  return result.count;
};
