'use server';

import { prisma } from '@/lib/prisma';

export async function ensureDefaultWarden() {
  // Try to find the first warden
  let warden = await prisma.warden.findFirst();

  // If no warden exists, create a dummy one for the MVP
  if (!warden) {
    warden = await prisma.warden.create({
      data: {
        fullName: 'Kailash M.',
        hostelName: 'Government Ashram School',
        district: 'Nandurbar',
        studentCount: 120,
        genderServed: 'co-ed',
        experienceLevel: 5,
        languagePreference: 'marathi',
      },
    });
  }

  return warden.id;
}
