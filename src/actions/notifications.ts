'use server';

import { prisma } from '@/lib/prisma';

export async function getNotifications(userId: string) {
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId, read: false },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });
    return {
      success: true as const,
      notifications: notifications.map((n) => ({
        id: n.id,
        title: n.title,
        message: n.message,
        level: n.level,
      })),
    };
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return { success: false as const, notifications: [] };
  }
}

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
