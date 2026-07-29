'use server';

import { prisma } from '@/lib/prisma';
import { generateObject } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';
import { ensureDefaultWarden } from './wardens';

const DailyLogSchema = z.object({
  attendance: z.object({
    present: z.number().nullable().optional().describe('Number of students present'),
    absent: z.number().nullable().optional().describe('Number of students absent'),
    notes: z.string().optional().describe('Any notes about attendance'),
  }).optional(),
  healthEvents: z.array(
    z.object({
      studentName: z.string().optional().describe('Name of the student if mentioned'),
      issue: z.string().describe('The health issue or incident'),
      actionTaken: z.string().optional().describe('What action the warden took'),
    })
  ).optional(),
  activities: z.array(z.string()).optional().describe('List of activities mentioned'),
  moodIndex: z.number().min(1).max(5).describe('Estimate the warden\'s mood based on the text from 1 (very stressed/sad) to 5 (excellent/happy).').optional(),
  summary: z.string().describe('A one-sentence summary of the log.'),
});

export async function synthesizeAndSaveDailyLog(rawInput: string) {
  try {
    // 1. Get or create a default warden for the MVP
    const wardenId = await ensureDefaultWarden();

    // 2. Use Gemini to extract structured JSON from the raw text
    const { object } = await generateObject({
      model: google('gemini-1.5-flash'),
      schema: DailyLogSchema,
      prompt: `Analyze the following daily log from a hostel warden at a Government Ashram School and extract structured data: attendance numbers, health issues, activities, and an estimated mood index (1-5).
      
      Raw Input: "${rawInput}"`,
    });

    // 3. Save to database
    const log = await prisma.dailyLog.create({
      data: {
        wardenId,
        rawInput,
        moodIndex: object.moodIndex ?? null,
        synthesizedRecords: object as any,
      },
    });

    return { success: true, log, synthesized: object };
  } catch (error) {
    console.error('Error synthesizing daily log:', error);
    return { success: false, error: 'Failed to process the log.' };
  }
}

export async function getRecentDailyLogs() {
  try {
    const wardenId = await ensureDefaultWarden();
    const logs = await prisma.dailyLog.findMany({
      where: { wardenId },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });
    return { success: true, logs };
  } catch (error) {
    console.error('Error fetching logs:', error);
    return { success: false, logs: [] };
  }
}
