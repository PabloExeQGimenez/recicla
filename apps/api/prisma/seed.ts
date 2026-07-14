import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import 'dotenv/config';

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if(!email || !password) {
    throw new Error(
      "Faltan las variables de entorno ADMIN_EMAIL y ADMIN_PASSWORD"
    )
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    console.log(`Usuario admin ya existe: ${email}`);
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name: 'Admin',
      lastName: 'Recicla',
      email,
      password: hashedPassword,
      role: Role.ADMIN,
    },
  });

  console.log(`Usuario admin creado: ${user.email} (rol: ${user.role})`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
