import { AuthService } from './auth.service';
import { PrismaService } from '../../../shared/database/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { BcryptService } from '../infrastructure/services/bcrypt.service';
import {
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let mockPrisma: { user: jest.Mocked<any> };
  let mockJwt: jest.Mocked<JwtService>;
  let mockBcrypt: jest.Mocked<BcryptService>;

  beforeEach(() => {
    mockPrisma = {
      user: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
        delete: jest.fn(),
      },
    };
    mockJwt = { sign: jest.fn() } as any;
    mockBcrypt = { compare: jest.fn(), hash: jest.fn() } as any;
    service = new AuthService(mockPrisma as any, mockJwt, mockBcrypt);
  });

  describe('login', () => {
    it('debería lanzar UnauthorizedException si el usuario no existe', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(service.login('test@test.com', 'pass')).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.login('test@test.com', 'pass')).rejects.toThrow(
        'Credenciales inválidas',
      );
    });

    it('debería lanzar UnauthorizedException si la contraseña es incorrecta', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'u-1',
        email: 'test@test.com',
        password: 'hash',
        role: 'OPERADOR',
      });
      mockBcrypt.compare.mockResolvedValue(false);

      await expect(service.login('test@test.com', 'wrong')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('debería retornar token y usuario en login exitoso', async () => {
      const user = {
        id: 'u-1',
        name: 'Juan',
        lastName: 'Pérez',
        dni: '12345678',
        email: 'test@test.com',
        password: 'hash',
        role: 'OPERADOR',
      };
      mockPrisma.user.findUnique.mockResolvedValue(user);
      mockBcrypt.compare.mockResolvedValue(true);
      mockJwt.sign.mockReturnValue('jwt-token');

      const result = await service.login('test@test.com', 'pass');

      expect(result.token).toBe('jwt-token');
      expect(result.user.id).toBe('u-1');
      expect(result.user.email).toBe('test@test.com');
      expect(mockJwt.sign).toHaveBeenCalledWith({
        sub: 'u-1',
        email: 'test@test.com',
        role: 'OPERADOR',
      });
    });
  });

  describe('register', () => {
    it('debería lanzar ConflictException si el email ya existe', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ id: 'u-1' });

      await expect(
        service.register('Juan', 'Pérez', 'test@test.com', 'pass123'),
      ).rejects.toThrow(ConflictException);
      await expect(
        service.register('Juan', 'Pérez', 'test@test.com', 'pass123'),
      ).rejects.toThrow('El email ya está registrado');
    });

    it('debería lanzar ConflictException si el DNI ya existe', async () => {
      mockPrisma.user.findUnique.mockImplementation(async (args: any) => {
        if (args.where.email) return null;
        if (args.where.dni) return { id: 'u-2', dni: '12345678' };
        return null;
      });

      await expect(
        service.register(
          'Juan',
          'Pérez',
          'new@test.com',
          'pass123',
          'OPERADOR',
          '12345678',
        ),
      ).rejects.toThrow(ConflictException);
      await expect(
        service.register(
          'Juan',
          'Pérez',
          'new@test.com',
          'pass123',
          'OPERADOR',
          '12345678',
        ),
      ).rejects.toThrow('El DNI ya está registrado');
    });

    it('debería crear usuario y retornar token', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      mockBcrypt.hash.mockResolvedValue('hashed-pass');
      mockPrisma.user.create.mockResolvedValue({
        id: 'u-1',
        name: 'Juan',
        lastName: 'Pérez',
        dni: null,
        email: 'new@test.com',
        role: 'OPERADOR',
      });
      mockJwt.sign.mockReturnValue('jwt-token');

      const result = await service.register(
        'Juan',
        'Pérez',
        'new@test.com',
        'pass123',
      );

      expect(result.token).toBe('jwt-token');
      expect(result.user.name).toBe('Juan');
      expect(mockBcrypt.hash).toHaveBeenCalledWith('pass123');
      expect(mockPrisma.user.create).toHaveBeenCalled();
    });

    it('debería crear usuario con DNI si se provee', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      mockBcrypt.hash.mockResolvedValue('hashed-pass');
      mockPrisma.user.create.mockResolvedValue({
        id: 'u-1',
        name: 'Juan',
        lastName: 'Pérez',
        dni: '12345678',
        email: 'new@test.com',
        role: 'ADMIN',
      });
      mockJwt.sign.mockReturnValue('jwt-token');

      const result = await service.register(
        'Juan',
        'Pérez',
        'new@test.com',
        'pass123',
        'ADMIN',
        '12345678',
      );

      expect(result.user.dni).toBe('12345678');
      expect(result.user.role).toBe('ADMIN');
    });
  });

  describe('getProfile', () => {
    it('debería lanzar UnauthorizedException si el usuario no existe', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(service.getProfile('u-1')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('debería retornar el perfil del usuario', async () => {
      const user = {
        id: 'u-1',
        name: 'Juan',
        lastName: 'Pérez',
        dni: '12345678',
        email: 'test@test.com',
        role: 'OPERADOR',
      };
      mockPrisma.user.findUnique.mockResolvedValue(user);

      const result = await service.getProfile('u-1');

      expect(result.id).toBe('u-1');
      expect(result.name).toBe('Juan');
    });
  });

  describe('findAll', () => {
    it('debería retornar todos los usuarios', async () => {
      const users = [
        {
          id: 'u-1',
          name: 'Juan',
          lastName: 'Pérez',
          dni: null,
          email: 'a@test.com',
          role: 'OPERADOR',
          createdAt: new Date(),
        },
      ];
      mockPrisma.user.findMany.mockResolvedValue(users);

      const result = await service.findAll();

      expect(result).toHaveLength(1);
      expect(mockPrisma.user.findMany).toHaveBeenCalledWith({
        select: {
          id: true,
          name: true,
          lastName: true,
          dni: true,
          email: true,
          role: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
      });
    });
  });

  describe('findById', () => {
    it('debería lanzar UnauthorizedException si un OPERADOR intenta ver otro usuario', async () => {
      await expect(
        service.findById('u-2', { id: 'u-1', role: 'OPERADOR' }),
      ).rejects.toThrow(UnauthorizedException);
      await expect(
        service.findById('u-2', { id: 'u-1', role: 'OPERADOR' }),
      ).rejects.toThrow('No tenés permiso para ver este usuario');
    });

    it('debería permitir a un OPERADOR ver su propio perfil', async () => {
      const user = {
        id: 'u-1',
        name: 'Juan',
        lastName: 'Pérez',
        dni: null,
        email: 'test@test.com',
        role: 'OPERADOR',
        createdAt: new Date(),
      };
      mockPrisma.user.findUnique.mockResolvedValue(user);

      const result = await service.findById('u-1', {
        id: 'u-1',
        role: 'OPERADOR',
      });

      expect(result.id).toBe('u-1');
    });

    it('debería permitir a un ADMIN ver cualquier usuario', async () => {
      const user = {
        id: 'u-2',
        name: 'María',
        lastName: 'García',
        dni: null,
        email: 'other@test.com',
        role: 'OPERADOR',
        createdAt: new Date(),
      };
      mockPrisma.user.findUnique.mockResolvedValue(user);

      const result = await service.findById('u-2', {
        id: 'u-1',
        role: 'ADMIN',
      });

      expect(result.id).toBe('u-2');
    });

    it('debería lanzar UnauthorizedException si el usuario no existe', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(
        service.findById('u-99', { id: 'u-1', role: 'ADMIN' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('delete', () => {
    it('debería lanzar UnauthorizedException si no es ADMIN', async () => {
      await expect(
        service.delete('u-2', { id: 'u-1', role: 'OPERADOR' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('debería lanzar BadRequestException si intenta eliminarse a sí mismo', async () => {
      await expect(
        service.delete('u-1', { id: 'u-1', role: 'ADMIN' }),
      ).rejects.toThrow(BadRequestException);
      await expect(
        service.delete('u-1', { id: 'u-1', role: 'ADMIN' }),
      ).rejects.toThrow('No podés eliminarte a vos mismo');
    });

    it('debería lanzar UnauthorizedException si el usuario a eliminar no existe', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(
        service.delete('u-99', { id: 'u-1', role: 'ADMIN' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('debería eliminar el usuario correctamente', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ id: 'u-2' });
      mockPrisma.user.delete.mockResolvedValue(undefined);

      await service.delete('u-2', { id: 'u-1', role: 'ADMIN' });

      expect(mockPrisma.user.delete).toHaveBeenCalledWith({
        where: { id: 'u-2' },
      });
    });
  });
});
