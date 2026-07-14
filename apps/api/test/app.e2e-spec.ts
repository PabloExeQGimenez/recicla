import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { setupTestDb, teardownTestDb } from './setup';
import { loginAsAdmin, authHeader } from './helpers/auth';

describe('E2E Tests', () => {
  let app: INestApplication<App>;
  let adminToken: string;
  let materialId: string;
  let recuperadorId: string;
  let pesajeId: string;
  let solicitudId: string;

  beforeAll(async () => {
    process.env.DATABASE_URL =
      'postgresql://recicla_admin:recicla_api@localhost:5433/recicla_db_test';
    await setupTestDb();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    await app.init();

    adminToken = await loginAsAdmin(app);
  }, 30000);

  afterAll(async () => {
    await teardownTestDb();
    await app.close();
  });

  describe('Auth', () => {
    it('POST /api/auth/login - login exitoso', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ email: 'admin@recicla.com', password: 'admin123' })
        .expect(201);

      expect(response.body.token).toBeDefined();
      expect(response.body.user.email).toBe('admin@recicla.com');
      expect(response.body.user.role).toBe('ADMIN');
    });

    it('POST /api/auth/login - credenciales inválidas', async () => {
      await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ email: 'admin@recicla.com', password: 'wrong' })
        .expect(401);
    });

    it('POST /api/auth/register - crear usuario', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/auth/register')
        .set(authHeader(adminToken))
        .send({
          name: 'Operador',
          lastName: 'Test',
          email: 'operador@test.com',
          password: 'pass1234',
          role: 'OPERADOR',
        })
        .expect(201);

      expect(response.body.user.name).toBe('Operador');
      expect(response.body.user.role).toBe('OPERADOR');
    });

    it('GET /api/auth/users - listar usuarios (admin)', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/auth/users')
        .set(authHeader(adminToken))
        .expect(200);

      expect(response.body.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('Materiales', () => {
    it('POST /api/materiales - crear material (admin)', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/materiales')
        .set(authHeader(adminToken))
        .send({ name: 'Cartón', currentPrice: 2.5 })
        .expect(201);

      materialId = response.body.id;
      expect(response.body.name).toBe('Cartón');
      expect(response.body.currentPrice).toBe(2.5);
      expect(response.body.active).toBe(true);
    });

    it('GET /api/materiales - listar materiales', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/materiales')
        .set(authHeader(adminToken))
        .expect(200);

      expect(response.body.length).toBeGreaterThanOrEqual(1);
    });

    it('GET /api/materiales/:id - obtener material por id', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/materiales/${materialId}`)
        .set(authHeader(adminToken))
        .expect(200);

      expect(response.body.id).toBe(materialId);
      expect(response.body.name).toBe('Cartón');
    });

    it('PATCH /api/materiales/:id/price - cambiar precio', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/api/materiales/${materialId}/price`)
        .set(authHeader(adminToken))
        .send({ currentPrice: 3.0 })
        .expect(200);

      expect(response.body.currentPrice).toBe(3.0);
    });
  });

  describe('Recuperadores', () => {
    it('POST /api/recuperadores - crear recuperador', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/recuperadores')
        .set(authHeader(adminToken))
        .send({ name: 'Juan', lastName: 'Pérez', dni: '12345678' })
        .expect(201);

      recuperadorId = response.body.id;
      expect(response.body.name).toBe('Juan');
      expect(response.body.lastName).toBe('Pérez');
      expect(response.body.active).toBe(true);
    });

    it('GET /api/recuperadores - listar recuperadores', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/recuperadores')
        .set(authHeader(adminToken))
        .expect(200);

      expect(response.body.data.length).toBeGreaterThanOrEqual(1);
    });

    it('GET /api/recuperadores/:id - obtener recuperador', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/recuperadores/${recuperadorId}`)
        .set(authHeader(adminToken))
        .expect(200);

      expect(response.body.id).toBe(recuperadorId);
    });
  });

  describe('Pesajes', () => {
    it('POST /api/pesajes - crear pesaje', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/pesajes')
        .set(authHeader(adminToken))
        .send({
          recuperadorId,
          date: new Date('2026-01-15').toISOString(),
          items: [{ materialId, weight: 10 }],
        })
        .expect(201);

      pesajeId = response.body.id;
      expect(response.body.recuperadorId).toBe(recuperadorId);
      expect(response.body.items).toHaveLength(1);
      expect(response.body.status).toBe('PENDING');
    });

    it('GET /api/pesajes - listar pesajes', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/pesajes')
        .set(authHeader(adminToken))
        .expect(200);

      expect(response.body.data.length).toBeGreaterThanOrEqual(1);
    });

    it('GET /api/pesajes/:id - obtener pesaje', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/pesajes/${pesajeId}`)
        .set(authHeader(adminToken))
        .expect(200);

      expect(response.body.id).toBe(pesajeId);
    });
  });

  describe('Solicitudes de Pago', () => {
    it('POST /api/solicitudes-pago - crear solicitud', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/solicitudes-pago')
        .set(authHeader(adminToken))
        .send({
          from: new Date('2026-01-01').toISOString(),
          to: new Date('2026-01-31').toISOString(),
        })
        .expect(201);

      solicitudId = response.body.id;
      expect(response.body.status).toBe('PAYMENT_REQUESTED');
    });

    it('GET /api/solicitudes-pago - listar solicitudes', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/solicitudes-pago')
        .set(authHeader(adminToken))
        .expect(200);

      expect(response.body.data.length).toBeGreaterThanOrEqual(1);
    });

    it('GET /api/solicitudes-pago/:id - obtener solicitud', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/solicitudes-pago/${solicitudId}`)
        .set(authHeader(adminToken))
        .expect(200);

      expect(response.body.id).toBe(solicitudId);
    });
  });

  describe('Dashboard', () => {
    it('GET /api/dashboard - obtener datos del dashboard', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/dashboard')
        .set(authHeader(adminToken))
        .expect(200);

      expect(response.body).toHaveProperty('recoverersThisMonth');
      expect(response.body).toHaveProperty('totalKgThisMonth');
      expect(response.body).toHaveProperty('pendingAmount');
      expect(response.body).toHaveProperty('materials');
    });
  });

  describe('Auth - Negativo', () => {
    it('debería rechazar requests sin token', async () => {
      await request(app.getHttpServer()).get('/api/materiales').expect(401);
    });

    it('debería rechazar requests con token inválido', async () => {
      await request(app.getHttpServer())
        .get('/api/materiales')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);
    });

    it('OPERADOR no puede crear materiales', async () => {
      const loginResponse = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ email: 'operador@test.com', password: 'pass1234' })
        .expect(201);

      const operadorToken = loginResponse.body.token;

      await request(app.getHttpServer())
        .post('/api/materiales')
        .set(authHeader(operadorToken))
        .send({ name: 'Test', currentPrice: 1 })
        .expect(403);
    });
  });
});
