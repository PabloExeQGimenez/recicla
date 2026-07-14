import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../../shared/database/prisma.service';
import { BcryptService } from '../infrastructure/services/bcrypt.service';
import type { Role } from '@prisma/client';

export interface JwtPayload {
  sub: string;
  email: string;
  role: Role;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    lastName: string;
    dni: string | null;
    email: string;
    role: Role;
  };
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly bcryptService: BcryptService,
  ) {}

  async login(email: string, password: string): Promise<AuthResponse> {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const isPasswordValid = await this.bcryptService.compare(
      password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const token = this.jwtService.sign(payload);

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        lastName: user.lastName,
        dni: user.dni,
        email: user.email,
        role: user.role,
      },
    };
  }

  async register(
    name: string,
    lastName: string,
    email: string,
    password: string,
    role: Role = 'OPERADOR',
    dni?: string,
  ): Promise<AuthResponse> {
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('El email ya está registrado');
    }

    if (dni) {
      const existingDni = await this.prisma.user.findUnique({
        where: { dni },
      });

      if (existingDni) {
        throw new ConflictException('El DNI ya está registrado');
      }
    }

    const hashedPassword = await this.bcryptService.hash(password);

    const user = await this.prisma.user.create({
      data: {
        name,
        lastName,
        dni: dni || null,
        email,
        password: hashedPassword,
        role,
      },
    });

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const token = this.jwtService.sign(payload);

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        lastName: user.lastName,
        dni: user.dni,
        email: user.email,
        role: user.role,
      },
    };
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        lastName: true,
        dni: true,
        email: true,
        role: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    return user;
  }

  async findAll() {
    return this.prisma.user.findMany({
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
  }

  async findById(id: string, currentUser: { id: string; role: string }) {
    if (currentUser.role !== 'ADMIN' && currentUser.id !== id) {
      throw new UnauthorizedException('No tenés permiso para ver este usuario');
    }

    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        lastName: true,
        dni: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    return user;
  }

  async delete(id: string, currentUser: { id: string; role: string }) {
    if (currentUser.role !== 'ADMIN') {
      throw new UnauthorizedException(
        'No tenés permiso para eliminar usuarios',
      );
    }

    if (currentUser.id === id) {
      throw new BadRequestException('No podés eliminarte a vos mismo');
    }

    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    await this.prisma.user.delete({ where: { id } });
  }
}
