import { RolesGuard } from './roles.guard';
import { Reflector } from '@nestjs/core';
import { ExecutionContext } from '@nestjs/common';
import { ROLES_KEY } from '../decorators/roles.decorator';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: Reflector;

  const mockContext = {
    getHandler: jest.fn(),
    getClass: jest.fn(),
    switchToHttp: () => ({
      getRequest: () => ({ user: { id: 'u-1', role: 'ADMIN' } }),
    }),
  } as unknown as ExecutionContext;

  beforeEach(() => {
    reflector = { getAllAndOverride: jest.fn() } as any;
    guard = new RolesGuard(reflector);
  });

  it('debería retornar true si no hay roles requeridos', () => {
    reflector.getAllAndOverride.mockReturnValue(undefined);

    const result = guard.canActivate(mockContext);

    expect(result).toBe(true);
  });

  it('debería retornar true si el array de roles está vacío', () => {
    reflector.getAllAndOverride.mockReturnValue([]);

    const result = guard.canActivate(mockContext);

    expect(result).toBe(true);
  });

  it('debería retornar true si el user tiene el rol requerido', () => {
    reflector.getAllAndOverride.mockReturnValue(['ADMIN']);

    const result = guard.canActivate(mockContext);

    expect(result).toBe(true);
  });

  it('debería retornar false si el user no tiene el rol requerido', () => {
    reflector.getAllAndOverride.mockReturnValue(['ADMIN']);

    const operadorContext = {
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: () => ({
        getRequest: () => ({ user: { id: 'u-2', role: 'OPERADOR' } }),
      }),
    } as unknown as ExecutionContext;

    const result = guard.canActivate(operadorContext);

    expect(result).toBe(false);
  });

  it('debería retornar true si el user tiene uno de los roles requeridos', () => {
    reflector.getAllAndOverride.mockReturnValue(['ADMIN', 'OPERADOR']);

    const result = guard.canActivate(mockContext);

    expect(result).toBe(true);
  });
});
