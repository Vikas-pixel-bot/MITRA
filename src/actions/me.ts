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
      let school = await prisma.school.findFirst();
      if (!school) {
        school = await prisma.school.create({
          data: {
            code: 'ASHRAM-NASHIK-01',
            name: 'Government Tribal Residential Ashramshala, Igatpuri',
            district: 'Nashik',
            taluka: 'Igatpuri',
            studentCapacity: 250,
          },
        });
      }

      user = await prisma.user.create({
        data: {
          name: 'Superintendent',
          honorific: 'Superintendent Sir',
          language: 'mr',
          onboardingCompleted: true,
          primaryChallenges: ['Hostel Operations & Safety', 'Student Restorative Care'],
          thirtyDayGoal: 'Build a calm, restorative hostel rhythm for student wellbeing.',
          schoolId: school.id,
        },
      });

      await prisma.goal.create({
        data: {
          userId: user.id,
          title: user.thirtyDayGoal || 'Build a calm, restorative hostel rhythm',
          category: 'GROWTH',
          status: 'IN_PROGRESS',
        },
      });
    }

    const [goal, reflections] = await Promise.all([
      prisma.goal.findFirst({
        where: { userId: user.id, status: 'IN_PROGRESS' },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.journalEntry.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        take: 30,
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
        : {
            id: 'default-goal',
            title: user.thirtyDayGoal || 'Build a calm, restorative hostel rhythm',
            createdAt: new Date().toISOString(),
          },
      reflections: reflections.map((r) => ({
        id: r.id,
        content: r.content,
        mood: r.mood,
        createdAt: r.createdAt.toISOString(),
      })),
    };
  } catch (error) {
    console.error('Error loading Me overview:', error);
    return {
      success: false as const,
      error: "I couldn't load your growth journey because the connection is unstable.",
    };
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
