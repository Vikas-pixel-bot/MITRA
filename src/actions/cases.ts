'use server';

import { prisma } from '@/lib/prisma';
import type { CaseSeverity, CaseType } from '@prisma/client';

export interface CreateCaseInput {
  userId: string;
  conversationId?: string;
  title: string;
  type: CaseType;
  severity: CaseSeverity;
  description: string;
  studentName?: string;
}

/**
 * D-004: "Conversations become Cases." Called by the MITRA chat's createCase
 * tool when the model judges a conversation describes a real, trackable
 * situation (not general questions/casual chat).
 */
export async function createCaseFromConversation(input: CreateCaseInput) {
  try {
    const user = await prisma.user.findUnique({ where: { id: input.userId } });

    let studentId: string | undefined;
    if (input.studentName && user?.schoolId) {
      const student = await prisma.student.findFirst({
        where: {
          schoolId: user.schoolId,
          name: { contains: input.studentName, mode: 'insensitive' },
        },
      });
      studentId = student?.id;
    }

    const caseNumber = `CASE-${Date.now().toString(36).toUpperCase()}`;

    const created = await prisma.case.create({
      data: {
        caseNumber,
        title: input.title,
        type: input.type,
        severity: input.severity,
        description: input.description,
        schoolId: user?.schoolId ?? undefined,
        studentId,
        createdById: input.userId,
        conversationId: input.conversationId,
      },
    });

    return { success: true as const, caseId: created.id, caseNumber: created.caseNumber };
  } catch (error) {
    console.error('Error creating case:', error);
    return { success: false as const, error: 'Failed to create case' };
  }
}
