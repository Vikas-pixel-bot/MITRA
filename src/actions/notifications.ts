'use server';

import { prisma } from '@/lib/prisma';

export async function dismissNotification(notificationId: string) {
  try {
    await prisma.notification.update({
      where: { id: notificationId },
      data: { read: true },
    });
    return { success: true as const };
  } catch (error) {
    console.error('Error dismissing notification:', error);
    return { success: false as const, error: 'Failed to dismiss reminder' };
  }
}
