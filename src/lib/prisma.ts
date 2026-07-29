import 'dotenv/config';
import * as dns from 'dns';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

// Force IPv4 for Supabase connection on Vercel Serverless (Node 20 default is IPv6)
dns.setDefaultResultOrder('ipv4first');

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const connectionString = process.env.DATABASE_URL || "";

const pool = globalForPrisma.prisma ? undefined : new Pool({ connectionString });
const adapter = pool ? new PrismaPg(pool) : undefined;

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
