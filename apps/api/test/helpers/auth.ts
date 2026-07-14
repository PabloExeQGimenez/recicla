import request from 'supertest';
import type { INestApplication } from '@nestjs/common';
import type { App } from 'supertest/types';

export async function loginAsAdmin(
  app: INestApplication<App>,
  email = process.env.ADMIN_EMAIL || 'admin@recicla.com',
  password = process.env.ADMIN_PASSWORD || 'admin123',
): Promise<string> {
  const response = await request(app.getHttpServer())
    .post('/api/auth/login')
    .send({ email, password })
    .expect(201);

  return response.body.token;
}

export function authHeader(token: string) {
  return { Authorization: `Bearer ${token}` };
}
