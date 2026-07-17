import { PrismaClient, Role, PesajeStatus, SolicitudPagoStatus } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import 'dotenv/config';

const prisma = new PrismaClient();

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error(
      'Faltan las variables de entorno ADMIN_EMAIL y ADMIN_PASSWORD',
    );
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (!existingUser) {
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
  } else {
    console.log(`Usuario admin ya existe: ${email}`);
  }

  const existingMaterials = await prisma.material.count();
  if (existingMaterials > 0) {
    console.log('Ya existen materiales, se omite la creación de datos de prueba.');
    return;
  }

  console.log('Creando datos de prueba...');

  const materials = await Promise.all([
    prisma.material.create({
      data: { name: 'Cartón', currentPrice: 150 },
    }),
    prisma.material.create({
      data: { name: 'Papel', currentPrice: 195 },
    }),
    prisma.material.create({
      data: { name: 'Segunda', currentPrice: 120 },
    }),
    prisma.material.create({
      data: { name: 'Cristal', currentPrice: 250 },
    }),
    prisma.material.create({
      data: { name: 'Verde', currentPrice: 190 },
    }),
    prisma.material.create({
      data: { name: 'Soplado', currentPrice: 260 },
    }),
    prisma.material.create({
      data: { name: 'Mezcla', currentPrice: 120 },
    }),
    prisma.material.create({
      data: { name: 'Nylon', currentPrice: 90 },
    }),
    prisma.material.create({
      data: { name: 'Vidrio', currentPrice: 80 },
    }),
    prisma.material.create({
      data: { name: 'Lata', currentPrice: 380 },
    }),
  ]);
  console.log(`Creados ${materials.length} materiales.`);

  const recuperadoresData = [
    {
      name: 'Carlos',
      lastName: 'García',
      dni: '30123456',
      cuil: '20-30123456-3',
      birthdate: new Date('1985-03-15'),
      address: 'Av. San Martín 1234',
      phone: '11-5555-1234',
      email: 'carlos.garcia@email.com',
      account: '0012345678',
      route: 'Ruta A',
      program: 'Reciclaje Urbano',
    },
    {
      name: 'María',
      lastName: 'López',
      dni: '27654321',
      cuil: '27-27654321-5',
      birthdate: new Date('1990-07-22'),
      address: 'Calle Belgrano 567',
      phone: '11-5555-5678',
      email: 'maria.lopez@email.com',
      account: '0087654321',
      route: 'Ruta B',
      program: 'Reciclaje Comercial',
    },
    {
      name: 'Juan',
      lastName: 'Pérez',
      dni: '32456789',
      cuil: '20-32456789-1',
      birthdate: new Date('1988-11-10'),
      address: 'Av. Rivadavia 890',
      phone: '11-5555-9012',
      email: 'juan.perez@email.com',
      account: '0056789012',
      route: 'Ruta C',
      program: 'Reciclaje Urbano',
    },
    {
      name: 'Ana',
      lastName: 'Martínez',
      dni: '28987654',
      cuil: '27-28987654-9',
      birthdate: new Date('1992-05-03'),
      address: 'Calle Independencia 345',
      phone: '11-5555-3456',
      email: 'ana.martinez@email.com',
      account: '0034567890',
      route: 'Ruta A',
      program: 'Reciclaje Industrial',
    },
    {
      name: 'Roberto',
      lastName: 'Díaz',
      dni: '31234567',
      cuil: '20-31234567-7',
      birthdate: new Date('1983-09-18'),
      address: 'Av. Corrientes 2345',
      phone: '11-5555-7890',
      email: 'roberto.diaz@email.com',
      account: '0023456789',
      route: 'Ruta B',
      program: 'Reciclaje Urbano',
    },
    {
      name: 'Lucía',
      lastName: 'Fernández',
      dni: '29876543',
      cuil: '27-29876543-2',
      birthdate: new Date('1995-01-25'),
      address: 'Calle Entre Ríos 678',
      phone: '11-5555-2345',
      email: 'lucia.fernandez@email.com',
      account: '0098765432',
      route: 'Ruta C',
      program: 'Reciclaje Comercial',
    },
  ];

  const recuperadores = await Promise.all(
    recuperadoresData.map((data) =>
      prisma.recuperador.create({ data }),
    ),
  );
  console.log(`Creados ${recuperadores.length} recuperadores.`);

  const now = new Date();
  const threeMonthsAgo = new Date(now);
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

  const pesajesTemplates = [
    { recuperadorIdx: 0, items: [{ materialIdx: 0, minW: 30, maxW: 80 }] },
    { recuperadorIdx: 1, items: [{ materialIdx: 1, minW: 15, maxW: 50 }] },
    { recuperadorIdx: 2, items: [{ materialIdx: 4, minW: 20, maxW: 60 }, { materialIdx: 5, minW: 10, maxW: 30 }] },
    { recuperadorIdx: 3, items: [{ materialIdx: 9, minW: 10, maxW: 40 }] },
    { recuperadorIdx: 4, items: [{ materialIdx: 0, minW: 25, maxW: 70 }, { materialIdx: 1, minW: 10, maxW: 30 }] },
    { recuperadorIdx: 5, items: [{ materialIdx: 3, minW: 5, maxW: 20 }, { materialIdx: 8, minW: 5, maxW: 15 }] },
    { recuperadorIdx: 0, items: [{ materialIdx: 6, minW: 20, maxW: 50 }] },
    { recuperadorIdx: 1, items: [{ materialIdx: 7, minW: 8, maxW: 25 }, { materialIdx: 2, minW: 15, maxW: 40 }] },
    { recuperadorIdx: 2, items: [{ materialIdx: 9, minW: 15, maxW: 50 }] },
    { recuperadorIdx: 3, items: [{ materialIdx: 0, minW: 20, maxW: 60 }, { materialIdx: 4, minW: 10, maxW: 25 }] },
    { recuperadorIdx: 4, items: [{ materialIdx: 5, minW: 12, maxW: 35 }] },
    { recuperadorIdx: 5, items: [{ materialIdx: 1, minW: 18, maxW: 45 }, { materialIdx: 3, minW: 8, maxW: 20 }] },
    { recuperadorIdx: 0, items: [{ materialIdx: 9, minW: 20, maxW: 55 }] },
    { recuperadorIdx: 1, items: [{ materialIdx: 0, minW: 25, maxW: 65 }, { materialIdx: 6, minW: 10, maxW: 30 }] },
    { recuperadorIdx: 2, items: [{ materialIdx: 2, minW: 15, maxW: 40 }] },
    { recuperadorIdx: 3, items: [{ materialIdx: 4, minW: 20, maxW: 50 }, { materialIdx: 7, minW: 5, maxW: 15 }] },
    { recuperadorIdx: 4, items: [{ materialIdx: 3, minW: 10, maxW: 30 }] },
    { recuperadorIdx: 5, items: [{ materialIdx: 9, minW: 25, maxW: 70 }, { materialIdx: 0, minW: 15, maxW: 40 }] },
    { recuperadorIdx: 0, items: [{ materialIdx: 1, minW: 20, maxW: 50 }, { materialIdx: 5, minW: 10, maxW: 25 }] },
    { recuperadorIdx: 1, items: [{ materialIdx: 8, minW: 8, maxW: 20 }] },
    { recuperadorIdx: 2, items: [{ materialIdx: 0, minW: 30, maxW: 75 }, { materialIdx: 2, minW: 10, maxW: 30 }] },
    { recuperadorIdx: 3, items: [{ materialIdx: 6, minW: 15, maxW: 40 }] },
    { recuperadorIdx: 4, items: [{ materialIdx: 4, minW: 20, maxW: 55 }, { materialIdx: 9, minW: 10, maxW: 30 }] },
    { recuperadorIdx: 5, items: [{ materialIdx: 1, minW: 18, maxW: 45 }] },
    { recuperadorIdx: 0, items: [{ materialIdx: 3, minW: 10, maxW: 25 }, { materialIdx: 7, minW: 5, maxW: 15 }] },
    { recuperadorIdx: 1, items: [{ materialIdx: 9, minW: 20, maxW: 60 }] },
    { recuperadorIdx: 2, items: [{ materialIdx: 5, minW: 12, maxW: 35 }, { materialIdx: 0, minW: 15, maxW: 40 }] },
    { recuperadorIdx: 3, items: [{ materialIdx: 2, minW: 10, maxW: 30 }] },
    { recuperadorIdx: 4, items: [{ materialIdx: 8, minW: 8, maxW: 20 }, { materialIdx: 4, minW: 15, maxW: 35 }] },
    { recuperadorIdx: 5, items: [{ materialIdx: 9, minW: 25, maxW: 65 }] },
  ];

  const statusDistribution: PesajeStatus[] = [
    ...Array(12).fill(PesajeStatus.PENDING),
    ...Array(10).fill(PesajeStatus.PAYMENT_REQUESTED),
    ...Array(8).fill(PesajeStatus.PAID),
  ];

  const allPesajes: { id: string; status: PesajeStatus; date: Date }[] = [];

  for (let i = 0; i < pesajesTemplates.length; i++) {
    const template = pesajesTemplates[i];
    const recuperador = recuperadores[template.recuperadorIdx];
    const status = statusDistribution[i];
    const date = randomDate(threeMonthsAgo, now);

    const pesaje = await prisma.pesaje.create({
      data: {
        recuperadorId: recuperador.id,
        status,
        date,
        items: {
          create: template.items.map((item) => ({
            materialId: materials[item.materialIdx].id,
            weight: randomInt(item.minW, item.maxW),
            pricePerKgAtMoment: materials[item.materialIdx].currentPrice,
          })),
        },
      },
      include: { items: true },
    });

    allPesajes.push({ id: pesaje.id, status: pesaje.status, date: pesaje.date });
  }
  console.log(`Creados ${allPesajes.length} pesajes.`);

  const paymentRequestedPesajes = allPesajes.filter(
    (p) => p.status === PesajeStatus.PAYMENT_REQUESTED,
  );

  if (paymentRequestedPesajes.length >= 2) {
    const sortedAsc = [...paymentRequestedPesajes].sort(
      (a, b) => a.date.getTime() - b.date.getTime(),
    );

    const solicitud1 = await prisma.solicitudPago.create({
      data: {
        from: sortedAsc[0].date,
        to: sortedAsc[1].date,
        status: SolicitudPagoStatus.PAYMENT_REQUESTED,
        pesajes: {
          connect: [
            { id: sortedAsc[0].id },
            { id: sortedAsc[1].id },
          ],
        },
      },
    });
    console.log(`Solicitud de pago #1 creada: ${solicitud1.id} (PAYMENT_REQUESTED)`);
  }

  const paidPesajes = allPesajes.filter(
    (p) => p.status === PesajeStatus.PAID,
  );

  if (paidPesajes.length >= 2) {
    const sortedAsc = [...paidPesajes].sort(
      (a, b) => a.date.getTime() - b.date.getTime(),
    );

    const solicitud2 = await prisma.solicitudPago.create({
      data: {
        from: sortedAsc[0].date,
        to: sortedAsc[1].date,
        status: SolicitudPagoStatus.PAID,
        pesajes: {
          connect: [
            { id: sortedAsc[0].id },
            { id: sortedAsc[1].id },
          ],
        },
      },
    });
    console.log(`Solicitud de pago #2 creada: ${solicitud2.id} (PAID)`);
  }

  if (paymentRequestedPesajes.length >= 4) {
    const remaining = paymentRequestedPesajes.slice(2, 4);
    const sortedAsc = [...remaining].sort(
      (a, b) => a.date.getTime() - b.date.getTime(),
    );

    const solicitud3 = await prisma.solicitudPago.create({
      data: {
        from: sortedAsc[0].date,
        to: sortedAsc[1].date,
        status: SolicitudPagoStatus.PAYMENT_REQUESTED,
        pesajes: {
          connect: [
            { id: sortedAsc[0].id },
            { id: sortedAsc[1].id },
          ],
        },
      },
    });
    console.log(`Solicitud de pago #3 creada: ${solicitud3.id} (PAYMENT_REQUESTED)`);
  }

  console.log('Datos de prueba creados exitosamente.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
