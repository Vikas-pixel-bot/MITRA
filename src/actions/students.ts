'use server';

import { prisma } from '@/lib/prisma';

export interface StudentFilterOptions {
  schoolId?: string;
  query?: string;
  healthStatus?: string;
  riskFlagOnly?: boolean;
}

export async function getStudents(options: StudentFilterOptions = {}) {
  try {
    const { schoolId, query, healthStatus, riskFlagOnly } = options;

    let targetSchoolId = schoolId;
    if (!targetSchoolId) {
      const firstSchool = await prisma.school.findFirst();
      if (firstSchool) {
        targetSchoolId = firstSchool.id;
      }
    }

    const where: any = {};
    if (targetSchoolId) {
      where.schoolId = targetSchoolId;
    }

    if (healthStatus && healthStatus !== 'ALL') {
      where.healthStatus = healthStatus;
    }

    if (riskFlagOnly) {
      where.riskFlag = true;
    }

    if (query && query.trim()) {
      const q = query.trim();
      where.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { rollNo: { contains: q, mode: 'insensitive' } },
        { grade: { contains: q, mode: 'insensitive' } },
      ];
    }

    const students = await prisma.student.findMany({
      where,
      include: {
        cases: {
          orderBy: { createdAt: 'desc' },
          take: 3,
        },
      },
      orderBy: [{ riskFlag: 'desc' }, { name: 'asc' }],
    });

    return {
      success: true as const,
      students: students.map((s) => ({
        id: s.id,
        name: s.name,
        rollNo: s.rollNo,
        gender: s.gender,
        grade: s.grade,
        healthStatus: s.healthStatus,
        riskFlag: s.riskFlag,
        notes: s.notes,
        casesCount: s.cases.length,
        recentCases: s.cases.map((c) => ({
          id: c.id,
          title: c.title,
          severity: c.severity,
          status: c.status,
          createdAt: c.createdAt.toISOString(),
        })),
      })),
    };
  } catch (error) {
    console.error('Error fetching students:', error);
    return { success: false as const, error: 'Failed to fetch students' };
  }
}

export async function seedStudentsIfEmpty() {
  try {
    const count = await prisma.student.count();
    if (count > 0) return { success: true, seeded: false };

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

    const SAMPLE_STUDENTS = [
      {
        name: 'Aarti Pawar',
        rollNo: 'ASH-101',
        gender: 'Female',
        grade: 'Class 7',
        healthStatus: 'HEALTHY',
        riskFlag: false,
        notes: 'Active in morning sports circle. Resilient and helpful.',
        schoolId: school.id,
      },
      {
        name: 'Rahul Gavali',
        rollNo: 'ASH-102',
        gender: 'Male',
        grade: 'Class 8',
        healthStatus: 'FEVER',
        riskFlag: true,
        notes: 'Reported mild fever in evening assembly (100.2°F). Under observation in sick room.',
        schoolId: school.id,
      },
      {
        name: 'Savitri Bhoye',
        rollNo: 'ASH-103',
        gender: 'Female',
        grade: 'Class 6',
        healthStatus: 'HOMESICK',
        riskFlag: false,
        notes: 'Newly admitted student. Paired with Aarti Pawar for restorative buddy support.',
        schoolId: school.id,
      },
      {
        name: 'Vikas Kuwar',
        rollNo: 'ASH-104',
        gender: 'Male',
        grade: 'Class 9',
        healthStatus: 'HEALTHY',
        riskFlag: false,
        notes: 'School sports team captain.',
        schoolId: school.id,
      },
      {
        name: 'Pooja Madavi',
        rollNo: 'ASH-105',
        gender: 'Female',
        grade: 'Class 7',
        healthStatus: 'HEALTHY',
        riskFlag: false,
        notes: 'Regular library reader.',
        schoolId: school.id,
      },
    ];

    for (const s of SAMPLE_STUDENTS) {
      await prisma.student.create({ data: s });
    }

    return { success: true, seeded: true };
  } catch (error) {
    console.error('Error seeding students:', error);
    return { success: false as const, error: 'Failed to seed students' };
  }
}

export async function addStudentNote(studentId: string, note: string) {
  try {
    const student = await prisma.student.findUnique({ where: { id: studentId } });
    if (!student) return { success: false, error: 'Student not found' };

    const updatedNotes = student.notes ? `${student.notes}\n• ${note}` : `• ${note}`;
    await prisma.student.update({
      where: { id: studentId },
      data: { notes: updatedNotes },
    });

    return { success: true };
  } catch (error) {
    console.error('Error adding student note:', error);
    return { success: false, error: 'Failed to add note' };
  }
}

export async function updateStudentHealth(studentId: string, healthStatus: string, riskFlag: boolean) {
  try {
    await prisma.student.update({
      where: { id: studentId },
      data: { healthStatus, riskFlag },
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating student health:', error);
    return { success: false, error: 'Failed to update health status' };
  }
}
