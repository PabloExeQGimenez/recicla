import { JwtAuthGuard } from './jwt-auth.guard';
import { Reflector } from '@nestjs/core';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;
  let reflector: Reflector;

  const mockContext = {
    getHandler: jest.fn(),
    getClass: jest.fn(),
    switchToHttp: () => ({
      getRequest: () => ({
        user: { id: 'u-1', email: 'test@test.com', role: 'ADMIN' },
      }),
    }),
  } as unknown as ExecutionContext;

  beforeEach(() => {
    reflector = { getAllAndOverride: jest.fn() } as any;
    guard = new JwtAuthGuard(reflector);
  });

  describe('canActivate', () => {
    it('debería retornar true si el endpoint es público (@Public)', () => {
      reflector.getAllAndOverride.mockImplementation((key: string) => {
        if (key === IS_PUBLIC_KEY) return true;
        return undefined;
      });

      const result = guard.canActivate(mockContext);

      expect(result).toBe(true);
    });

    it('debería delegar a Passport si no es público', () => {
      reflector.getAllAndOverride.mockImplementation(() => undefined);

      const parentSpy = jest.spyOn(
        Object.getPrototypeOf(Object.getPrototypeOf(guard)),
        'canActivate',
      );
      parentSpy.mockReturnValue(true);

      const result = guard.canActivate(mockContext);

      expect(result).toBe(true);
      parentSpy.mockRestore();
    });
  });

  describe('handleRequest', () => {
    it('debería lanzar el error original si hay error', () => {
      const error = new Error('JWT error');

      expect(() => {
        guard.handleRequest(error, null);
      }).toThrow(Error);
      expect(() => {
        guard.handleRequest(error, null);
      }).toThrow('JWT error');
    });

    it('debería lanzar UnauthorizedException si no hay user', () => {
      expect(() => {
        guard.handleRequest(null, null);
      }).toThrow(UnauthorizedException);
      expect(() => {
        guard.handleRequest(null, null);
      }).toThrow('Token inválido o expirado');
    });

    it('debería retornar el user si existe', () => {
      const user = { id: 'u-1', email: 'test@test.com', role: 'ADMIN' };

      const result = guard.handleRequest(null, user);

      expect(result).toEqual(user);
    });
  });
});
