import { Response } from 'express';
import prisma from '../../config/database';
import { asyncHandler, sendSuccess } from '../../utils/apiHelpers';
import { AuthRequest } from '../../middleware/auth';
import { registerDeviceSchema } from './notification.validation';

export const registerDevice = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id: userId } = req.user!;
  console.log('Register device request for user:', userId);

  const validatedData = registerDeviceSchema.parse(req.body);

  const deviceToken = await prisma.deviceToken.upsert({
    where: {
      userId_deviceId: {
        userId,
        deviceId: validatedData.deviceId,
      },
    },
    update: {
      expoPushToken: validatedData.expoPushToken,
      deviceName: validatedData.deviceName,
      platform: validatedData.platform,
      lastActiveAt: new Date(),
    },
    create: {
      userId,
      deviceId: validatedData.deviceId,
      expoPushToken: validatedData.expoPushToken,
      deviceName: validatedData.deviceName,
      platform: validatedData.platform,
    },
  });

  console.log('Device registered successfully:', deviceToken.id);

  sendSuccess(res, { id: deviceToken.id }, 'Device registered successfully');
});

export const unregisterDevice = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id: userId } = req.user!;
  const { deviceId } = req.params;
  console.log('Unregister device request for user:', userId, 'device:', deviceId);

  await prisma.deviceToken.deleteMany({
    where: {
      userId,
      deviceId,
    },
  });

  console.log('Device unregistered successfully');

  sendSuccess(res, null, 'Device unregistered successfully');
});

export const getDevices = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id: userId } = req.user!;
  console.log('Get devices request for user:', userId);

  const devices = await prisma.deviceToken.findMany({
    where: { userId },
    select: {
      id: true,
      deviceId: true,
      deviceName: true,
      platform: true,
      lastActiveAt: true,
      createdAt: true,
    },
    orderBy: { lastActiveAt: 'desc' },
  });

  console.log('Devices retrieved:', devices.length);

  sendSuccess(res, devices, 'Devices retrieved successfully');
});

export const removeDevice = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id: userId } = req.user!;
  const { deviceId } = req.params;
  console.log('Remove device request:', deviceId);

  await prisma.deviceToken.deleteMany({
    where: {
      userId,
      deviceId,
    },
  });

  console.log('Device removed successfully');

  sendSuccess(res, null, 'Device removed successfully');
});
