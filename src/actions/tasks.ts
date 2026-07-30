'use server';

import { prisma } from '@/lib/prisma';

export interface TaskItem {
  id: string;
  title: string;
  completed: boolean;
  timeSlot?: string | null;
  createdAt: string;
}

export async function getTodayTasks(userId: string) {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const tasks = await prisma.task.findMany({
      where: {
        userId,
        createdAt: { gte: todayStart },
      },
      orderBy: { createdAt: 'asc' },
    });

    // If no tasks exist for today, seed default daily warden routine tasks
    if (tasks.length === 0) {
      const defaultTasks = [
        { title: 'Morning Assembly & Physical Attendance Check', timeSlot: '7:30 AM' },
        { title: 'Inspect Dining Kitchen & Sample Breakfast', timeSlot: '8:15 AM' },
        { title: 'Check Sick Room & Student Medicines', timeSlot: '11:00 AM' },
        { title: 'Supervise Afternoon Meal & RO Water Hygiene', timeSlot: '1:30 PM' },
        { title: 'Evening Study Circle Observation & Hydration', timeSlot: '7:00 PM' },
        { title: 'Night Dormitory Attendance Roll Call', timeSlot: '9:00 PM' },
      ];

      const created = [];
      for (const t of defaultTasks) {
        const item = await prisma.task.create({
          data: {
            userId,
            title: t.title,
            timeSlot: t.timeSlot,
            completed: false,
          },
        });
        created.push(item);
      }

      return {
        success: true as const,
        tasks: created.map((t) => ({
          id: t.id,
          title: t.title,
          completed: t.completed,
          timeSlot: t.timeSlot,
          createdAt: t.createdAt.toISOString(),
        })),
      };
    }

    return {
      success: true as const,
      tasks: tasks.map((t) => ({
        id: t.id,
        title: t.title,
        completed: t.completed,
        timeSlot: t.timeSlot,
        createdAt: t.createdAt.toISOString(),
      })),
    };
  } catch (error) {
    console.error('Error fetching today tasks:', error);
    return { success: false as const, tasks: [] };
  }
}

export async function toggleTaskCompleted(taskId: string, completed: boolean) {
  try {
    const updated = await prisma.task.update({
      where: { id: taskId },
      data: { completed },
    });
    return { success: true as const, task: updated };
  } catch (error) {
    console.error('Error toggling task:', error);
    return { success: false as const, error: 'Failed to update task' };
  }
}

export async function addTodayTask(userId: string, title: string, timeSlot?: string) {
  try {
    if (!title.trim()) {
      return { success: false as const, error: 'Task title cannot be empty' };
    }
    const task = await prisma.task.create({
      data: {
        userId,
        title: title.trim(),
        timeSlot: timeSlot || null,
        completed: false,
      },
    });
    return { success: true as const, task };
  } catch (error) {
    console.error('Error adding task:', error);
    return { success: false as const, error: 'Failed to add task' };
  }
}
