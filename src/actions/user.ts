'use server';

import { prisma } from '@/lib/prisma';
import type { OnboardingData } from '@/app/onboarding/_context';

export async function saveOnboardingUser(data: OnboardingData) {
  try {
    // 1. Create or update School if school name is provided
    let schoolId: string | undefined = undefined;
    if (data.school.name) {
      const schoolCode = data.school.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
      const school = await prisma.school.upsert({
        where: { code: schoolCode },
        update: {
          name: data.school.name,
          district: data.school.district,
          taluka: data.school.projectOffice,
          studentCapacity: parseInt(data.school.studentCount) || 0,
        },
        create: {
          code: schoolCode,
          name: data.school.name,
          district: data.school.district,
          taluka: data.school.projectOffice,
          studentCapacity: parseInt(data.school.studentCount) || 0,
        },
      });
      schoolId = school.id;
    }

    // 2. Create or update Superintendent User
    const honorificName = data.honorific ? `${data.name} ${data.honorific}` : data.name;
    const langCode = data.language === 'Marathi' ? 'mr' : data.language === 'Hindi' ? 'hi' : 'en';
    const goalText = data.goalChoice === 'custom' ? data.customGoal : data.goalChoice || '';

    const user = await prisma.user.create({
      data: {
        name: data.name || 'Superintendent',
        honorific: honorificName,
        language: langCode,
        onboardingCompleted: true,
        primaryChallenges: data.challenges,
        thirtyDayGoal: goalText,
        schoolId: schoolId,
      },
    });

    // 3. Create Goal entity if goal exists
    if (goalText) {
      await prisma.goal.create({
        data: {
          userId: user.id,
          title: goalText,
          category: 'GROWTH',
          status: 'IN_PROGRESS',
        },
      });
    }

    // 4. Create initial Rhythm Notification
    await prisma.notification.create({
      data: {
        userId: user.id,
        title: 'Welcome to MITRA PWA',
        message: `Namaste ${honorificName || 'Superintendent'}. MITRA is live and by your side.`,
        level: 'INFO',
      },
    });

    return { success: true, userId: user.id };
  } catch (error: any) {
    console.error('Error persisting onboarding user:', error);
    return { success: false, error: error?.message || 'Failed to save onboarding data' };
  }
}
