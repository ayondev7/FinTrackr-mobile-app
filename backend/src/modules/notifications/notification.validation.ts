import { z } from 'zod';

export const registerDeviceSchema = z.object({
  deviceId: z.string().min(1, 'Device ID is required'),
  expoPushToken: z.string().min(1, 'Expo push token is required'),
  deviceName: z.string().optional(),
  platform: z.enum(['ios', 'android']),
});

export type RegisterDeviceInput = z.infer<typeof registerDeviceSchema>;
