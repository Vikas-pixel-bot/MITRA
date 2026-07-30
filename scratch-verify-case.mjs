import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import { config } from 'dotenv';
config({ path: '.env.local' });
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

const caseRow = await prisma.case.findFirst({
  where: { caseNumber: 'CASE-MS7G9978' },
  include: { student: true, conversation: { include: { messages: true } } },
});
console.log('Case found:', JSON.stringify(caseRow, null, 2));
await prisma.$disconnect();
