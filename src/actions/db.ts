'use server';

import { prisma } from '@/lib/prisma';

// --- Chat Actions ---

export async function saveChatMessage(role: string, content: string) {
  try {
    await prisma.chatMessage.create({
      data: {
        role,
        content,
      },
    });
    return { success: true };
  } catch (error) {
    console.error('Error saving chat message:', error);
    return { success: false, error };
  }
}

export async function getChatHistory() {
  try {
    const messages = await prisma.chatMessage.findMany({
      orderBy: { createdAt: 'asc' },
    });
    return { success: true, messages };
  } catch (error) {
    console.error('Error fetching chat history:', error);
    return { success: false, messages: [] };
  }
}

export async function clearChatHistory() {
  try {
    await prisma.chatMessage.deleteMany({});
    return { success: true };
  } catch (error) {
    console.error('Error clearing chat history:', error);
    return { success: false };
  }
}

// --- Habit Actions ---

// Helper to seed habits if none exist
async function ensureHabitsSeeded() {
  const count = await prisma.habit.count();
  if (count === 0) {
    await prisma.habit.createMany({
      data: [
        { title: 'Drink enough water', icon: 'Droplets' },
        { title: 'Eat meals on time', icon: 'Utensils' },
        { title: 'Talk positively with one student', icon: 'MessageCircle' },
        { title: 'Record observations', icon: 'FileText' },
        { title: 'Sleep on time', icon: 'Moon' },
      ],
    });
  }
}

export async function getTodayHabits() {
  try {
    await ensureHabitsSeeded();
    
    // Get all habits
    const allHabits = await prisma.habit.findMany();
    
    // Get today's logs
    const today = new Date().toISOString().split('T')[0];
    const todayLogs = await prisma.habitLog.findMany({
      where: { date: today },
    });

    // Map habits with their completion status for today
    const habitsWithStatus = allHabits.map((habit) => {
      const log = todayLogs.find((l) => l.habitId === habit.id);
      return {
        id: habit.id,
        title: habit.title,
        icon: habit.icon,
        completed: log ? log.completed : false,
      };
    });

    return { success: true, habits: habitsWithStatus };
  } catch (error) {
    console.error('Error fetching today habits:', error);
    return { success: false, habits: [] };
  }
}

export async function toggleHabitLog(habitId: string, completed: boolean) {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    // Upsert the log for today
    await prisma.habitLog.upsert({
      where: {
        habitId_date: {
          habitId: habitId,
          date: today,
        },
      },
      update: {
        completed: completed,
      },
      create: {
        habitId: habitId,
        date: today,
        completed: completed,
      },
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error toggling habit:', error);
    return { success: false };
  }
}
