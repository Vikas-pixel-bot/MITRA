'use server';

import { prisma } from '@/lib/prisma';

export interface HabitItem {
  id: string;
  name: string;
  category: string;
  completedToday: boolean;
  streak: number;
}

export async function getUserHabits(userId: string) {
  try {
    let habits = await prisma.habit.findMany({
      where: { userId },
      orderBy: { createdAt: 'asc' },
    });

    if (habits.length === 0) {
      const defaultHabits = [
        { name: 'Drink 4 Glasses of Water Daily', category: 'HYDRATION' },
        { name: 'Evening 2-Minute Reflection Journal', category: 'MINDFULNESS' },
        { name: '10-Minute Walk around Dormitory Grounds', category: 'PHYSICAL' },
        { name: 'Observe Positive Growth in 1 Child', category: 'CARE' },
      ];

      const created = [];
      for (const h of defaultHabits) {
        const item = await prisma.habit.create({
          data: {
            userId,
            name: h.name,
            category: h.category,
            completedToday: false,
            streak: 0,
          },
        });
        created.push(item);
      }
      habits = created;
    }

    return {
      success: true as const,
      habits: habits.map((h) => ({
        id: h.id,
        name: h.name,
        category: h.category,
        completedToday: h.completedToday,
        streak: h.streak,
      })),
    };
  } catch (error) {
    console.error('Error fetching habits:', error);
    return { success: false as const, habits: [] };
  }
}

export async function toggleHabit(habitId: string, currentCompleted: boolean) {
  try {
    const nextStatus = !currentCompleted;
    const updated = await prisma.habit.update({
      where: { id: habitId },
      data: {
        completedToday: nextStatus,
        streak: nextStatus ? { increment: 1 } : { decrement: 1 },
      },
    });
    return { success: true as const, habit: updated };
  } catch (error) {
    console.error('Error toggling habit:', error);
    return { success: false as const, error: 'Failed to update habit' };
  }
}

export async function addCustomHabit(userId: string, name: string) {
  try {
    if (!name.trim()) return { success: false as const, error: 'Habit name cannot be empty' };
    const habit = await prisma.habit.create({
      data: {
        userId,
        name: name.trim(),
        category: 'WELLBEING',
        completedToday: false,
        streak: 0,
      },
    });
    return { success: true as const, habit };
  } catch (error) {
    console.error('Error adding habit:', error);
    return { success: false as const, error: 'Failed to add habit' };
  }
}
