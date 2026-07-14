import { JwtStrategy } from './jwt.strategy';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;
  let mockConfig: jest.Mocked<ConfigService>;

  beforeEach(() => {
    mockConfig = { getOrThrow: jest.fn() } as any;
    mockConfig.getOrThrow.mockReturnValue('test-secret');
    strategy = new JwtStrategy(mockConfig);
  });

  it('debería retornar { id, email, role } con payload válido', async () => {
    const payload = { sub: 'u-1', email: 'test@test.com', role: 'ADMIN' };

    const result = await strategy.validate(payload);

    expect(result).toEqual({
      id: 'u-1',
      email: 'test@test.com',
      role: 'ADMIN',
    });
  });

  it('debería lanzar UnauthorizedException si falta sub', async () => {
    const payload = { email: 'test@test.com', role: 'ADMIN' };

    await expect(strategy.validate(payload as any)).rejects.toThrow(
      UnauthorizedException,
    );
    await expect(strategy.validate(payload as any)).rejects.toThrow(
      'Token inválido',
    );
  });

  it('debería lanzar UnauthorizedException si falta email', async () => {
    const payload = { sub: 'u-1', role: 'ADMIN' };

    await expect(strategy.validate(payload as any)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('debería lanzar UnauthorizedException si falta role', async () => {
    const payload = { sub: 'u-1', email: 'test@test.com' };

    await expect(strategy.validate(payload as any)).rejects.toThrow(
      UnauthorizedException,
    );
  });
});
