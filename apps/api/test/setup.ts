import { execSync } from 'child_process';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function setupTestDb() {
  execSync('npx prisma migrate deploy', {
    cwd: process.cwd(),
    env: { ...process.env, DATABASE_URL: process.env.DATABASE_URL },
    stdio: 'pipe',
  });

  await seed();
}

export async function teardownTestDb() {
  const tables = [
    '"PesajeItem"',
    '"Pesaje"',
    '"SolicitudPago"',
    '"Material"',
    '"Recuperador"',
    '"User"',
  ];
  for (const table of tables) {
    await prisma.$executeRawUnsafe(`TRUNCATE TABLE ${table} CASCADE`);
  }
}

async function seed() {
  const email = process.env.ADMIN_EMAIL || 'admin@recicla.com';
  const password = process.env.ADMIN_PASSWORD || 'admin123';

  const existing = await prisma.user.findUnique({ where: { email } });
  if (!existing) {
    const hashed = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: {
        name: 'Admin',
        lastName: 'Test',
        email,
        password: hashed,
        role: 'ADMIN',
      },
    });
  }
}

export { prisma };
