'use server';

import { prisma } from '@/lib/prisma';

export async function getTodayBriefing(userId?: string | null) {
  try {
    let user = userId ? await prisma.user.findUnique({ where: { id: userId } }) : null;
    if (!user) {
      user = await prisma.user.findFirst({
        where: { onboardingCompleted: true },
        orderBy: { createdAt: 'desc' },
      });
    }
    if (!user) {
      return { success: false as const, error: 'User not found' };
    }

    const notifications = await prisma.notification.findMany({
      where: { userId: user.id, read: false },
      orderBy: { createdAt: 'desc' },
      take: 3,
    });

    return {
      success: true as const,
      user: {
        id: user.id,
        name: user.name,
        honorific: user.honorific,
        thirtyDayGoal: user.thirtyDayGoal,
        primaryChallenges: user.primaryChallenges,
        language: user.language,
      },
      notifications: notifications.map((n) => ({
        id: n.id,
        title: n.title,
        message: n.message,
        level: n.level,
      })),
    };
  } catch (error) {
    console.error('Error loading Today briefing:', error);
    return { success: false as const, error: 'Failed to load briefing' };
  }
}
