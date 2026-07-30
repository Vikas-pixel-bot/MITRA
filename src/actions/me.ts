'use server';

import { prisma } from '@/lib/prisma';

export async function getMeOverview(userId?: string | null) {
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

    const [goal, reflections] = await Promise.all([
      prisma.goal.findFirst({
        where: { userId: user.id, status: 'IN_PROGRESS' },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.journalEntry.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
    ]);

    return {
      success: true as const,
      user: {
        id: user.id,
        name: user.name,
        honorific: user.honorific,
        primaryChallenges: user.primaryChallenges,
      },
      goal: goal
        ? {
            id: goal.id,
            title: goal.title,
            createdAt: goal.createdAt.toISOString(),
          }
        : null,
      reflections: reflections.map((r) => ({
        id: r.id,
        content: r.content,
        mood: r.mood,
        createdAt: r.createdAt.toISOString(),
      })),
    };
  } catch (error) {
    console.error('Error loading Me overview:', error);
    return { success: false as const, error: 'Failed to load your growth journey' };
  }
}

export async function addReflection(userId: string, content: string, mood?: string) {
  try {
    if (!content.trim()) {
      return { success: false as const, error: 'Reflection cannot be empty' };
    }
    const entry = await prisma.journalEntry.create({
      data: { userId, content: content.trim(), mood: mood || null },
    });
    return { success: true as const, id: entry.id };
  } catch (error) {
    console.error('Error saving reflection:', error);
    return { success: false as const, error: 'Failed to save your reflection' };
  }
}
