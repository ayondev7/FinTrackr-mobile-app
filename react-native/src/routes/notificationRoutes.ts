const BASE = '/notifications';

export const notificationRoutes = {
  registerDevice: `${BASE}/register-device`,
  unregisterDevice: (deviceId: string) => `${BASE}/unregister-device/${deviceId}`,
  devices: `${BASE}/devices`,
  removeDevice: (deviceId: string) => `${BASE}/devices/${deviceId}`,
};
