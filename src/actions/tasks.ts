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

export async function deleteTask(taskId: string) {
  try {
    await prisma.task.delete({ where: { id: taskId } });
    return { success: true as const };
  } catch (error) {
    console.error('Error deleting task:', error);
    return { success: false as const, error: 'Failed to delete task' };
  }
}

export async function addTodayTask(userId: string, title: string, timeSlot?: string) {
  try {
    if (!title.trim()) {
      return { success: false as const, error: 'Task title cannot be empty' };
    }

    let targetUserId = userId;
    let userExists = await prisma.user.findUnique({ where: { id: targetUserId } });
    if (!userExists) {
      userExists = await prisma.user.findFirst({ where: { onboardingCompleted: true } });
      if (userExists) targetUserId = userExists.id;
    }

    if (!userExists) {
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
      const newUser = await prisma.user.create({
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
      targetUserId = newUser.id;
    }

    const task = await prisma.task.create({
      data: {
        userId: targetUserId,
        title: title.trim(),
        timeSlot: timeSlot || null,
        completed: false,
      },
    });

    return {
      success: true as const,
      task: {
        id: task.id,
        title: task.title,
        timeSlot: task.timeSlot,
        completed: task.completed,
        createdAt: task.createdAt.toISOString(),
      },
    };
  } catch (error) {
    console.error('Error adding task:', error);
    return { success: false as const, error: 'Failed to add task' };
  }
}
