import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import { config } from 'dotenv';
config({ path: '.env.local' });
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

const school = await prisma.school.create({
  data: { code: 'TEST-SCHOOL-CHATRAG', name: 'Test School', district: 'Nashik', studentCapacity: 100 },
});
const user = await prisma.user.create({
  data: { name: 'Chat Test User', honorific: 'Test Sir', language: 'en', onboardingCompleted: true, schoolId: school.id },
});
const student = await prisma.student.create({
  data: { name: 'Ramesh Kumar', schoolId: school.id, grade: 'Class 7' },
});
console.log('USER_ID=' + user.id);
await prisma.$disconnect();
