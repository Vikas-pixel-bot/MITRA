'use server';

import { prisma } from '@/lib/prisma';

export interface DailyLogInput {
  userId: string;
  attendanceCount?: number;
  sickCount?: number;
  mealQuality?: string;
  notes?: string;
}

export async function submitDailyLog(input: DailyLogInput) {
  try {
    const user = await prisma.user.findUnique({ where: { id: input.userId } });

    const entry = await prisma.dailyLog.create({
      data: {
        schoolId: user?.schoolId ?? null,
        createdById: input.userId,
        attendanceCount: input.attendanceCount ?? 0,
        sickCount: input.sickCount ?? 0,
        mealQuality: input.mealQuality || null,
        notes: input.notes || null,
      },
    });

    return { success: true as const, id: entry.id };
  } catch (error) {
    console.error('Error saving daily log:', error);
    return { success: false as const, error: 'Failed to save today’s log' };
  }
}

export async function getTodayLogs(userId: string) {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const logs = await prisma.dailyLog.findMany({
      where: { createdById: userId, createdAt: { gte: startOfDay } },
      orderBy: { createdAt: 'desc' },
    });

    return {
      success: true as const,
      logs: logs.map((l) => ({
        id: l.id,
        attendanceCount: l.attendanceCount,
        sickCount: l.sickCount,
        mealQuality: l.mealQuality,
        notes: l.notes,
        createdAt: l.createdAt.toISOString(),
      })),
    };
  } catch (error) {
    console.error('Error loading today’s logs:', error);
    return { success: false as const, error: 'Failed to load logs' };
  }
}
