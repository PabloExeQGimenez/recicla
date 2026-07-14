import { Recuperador } from '../../domain/recuperador.entity';
import { Recuperador as PrismaRecuperador } from '@prisma/client';

export class RecuperadorPrismaMapper {
  static toDomain(data: PrismaRecuperador): Recuperador {
    return new Recuperador({
      id: data.id,
      name: data.name,
      lastName: data.lastName,
      dni: data.dni ?? undefined,
      cuil: data.cuil ?? undefined,
      birthdate: data.birthdate ?? undefined,
      address: data.address ?? undefined,
      phone: data.phone ?? undefined,
      email: data.email ?? undefined,
      account: data.account ?? undefined,
      route: data.route ?? undefined,
      program: data.program ?? undefined,
      active: data.active,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  }

  static toCreatePersistence(data: Recuperador): PrismaRecuperador {
    return {
      id: data.id,
      name: data.name,
      lastName: data.lastName,
      dni: data.dni ?? null,
      cuil: data.cuil ?? null,
      birthdate: data.birthdate ?? null,
      address: data.address ?? null,
      phone: data.phone ?? null,
      email: data.email ?? null,
      account: data.account ?? null,
      route: data.route ?? null,
      program: data.program ?? null,
      active: data.active,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }

  static toUpdatePersistence(data: Recuperador) {
    return {
      name: data.name,
      lastName: data.lastName,
      dni: data.dni ?? null,
      cuil: data.cuil ?? null,
      birthdate: data.birthdate ?? null,
      address: data.address ?? null,
      phone: data.phone ?? null,
      email: data.email ?? null,
      account: data.account ?? null,
      route: data.route ?? null,
      program: data.program ?? null,
      active: data.active,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }
}
