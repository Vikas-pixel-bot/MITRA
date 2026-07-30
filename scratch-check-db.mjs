import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import { config } from 'dotenv';
config({ path: '.env.local' });

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

try {
  const count = await prisma.user.count();
  console.log('CONNECTED. Existing user count:', count);
} catch (e) {
  console.log('STILL FAILING:', e.message?.split('\n')[0] || e);
} finally {
  await prisma.$disconnect();
}
