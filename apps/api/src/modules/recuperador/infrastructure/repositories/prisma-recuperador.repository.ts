import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../shared/database/prisma.service';
import { Recuperador } from '../../domain/recuperador.entity';
import type { RecuperadorRepository } from '../../domain/recuperador.repository';
import { RecuperadorPrismaMapper } from '../mappers/recuperador-prisma.mapper';
import { RecuperadorFilters } from '../../domain/recuperador-filters';
import { Prisma } from '@prisma/client';

@Injectable()
export class PrismaRecuperadorRepository implements RecuperadorRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(recuperador: Recuperador): Promise<void> {
    await this.prisma.recuperador.create({
      data: RecuperadorPrismaMapper.toCreatePersistence(recuperador),
    });
  }

  async findById(id: string): Promise<Recuperador | null> {
    const recuperador = await this.prisma.recuperador.findUnique({
      where: { id },
    });

    if (!recuperador) {
      return null;
    }

    return RecuperadorPrismaMapper.toDomain(recuperador);
  }

  async findAll(filters: RecuperadorFilters): Promise<Recuperador[]> {
    const where: Prisma.RecuperadorWhereInput = {};

    if (filters.search) {
      where.OR = [
        {
          name: {
            contains: filters.search,
            mode: 'insensitive',
          },
        },
        {
          lastName: {
            contains: filters.search,
            mode: 'insensitive',
          },
        },
        {
          dni: {
            contains: filters.search,
          },
        },
      ];
    }

    if (filters.active !== undefined) {
      where.active = filters.active;
    }

    const skip = (filters.page - 1) * filters.limit;
    const recuperadores = await this.prisma.recuperador.findMany({
      where,
      skip,
      take: filters.limit,
      orderBy: {
        createdAt: 'desc',
      },
    });
    return recuperadores.map((item) => RecuperadorPrismaMapper.toDomain(item));
  }

  async count(filters: RecuperadorFilters): Promise<number> {
    const where: Prisma.RecuperadorWhereInput = {};

    if (filters.search) {
      where.OR = [
        {
          name: {
            contains: filters.search,
            mode: 'insensitive',
          },
        },
        {
          lastName: {
            contains: filters.search,
            mode: 'insensitive',
          },
        },
        {
          dni: {
            contains: filters.search,
            mode: 'insensitive',
          },
        },
      ];
    }
    if (filters.active !== undefined) {
      where.active = filters.active;
    }

    return this.prisma.recuperador.count({
      where,
    });
  }

  async findByDni(dni: string): Promise<Recuperador | null> {
    const recuperador = await this.prisma.recuperador.findUnique({
      where: { dni },
    });

    if (!recuperador) {
      return null;
    }
    return RecuperadorPrismaMapper.toDomain(recuperador);
  }

  async update(recuperador: Recuperador): Promise<void> {
    await this.prisma.recuperador.update({
      where: {
        id: recuperador.id,
      },
      data: RecuperadorPrismaMapper.toUpdatePersistence(recuperador),
    });
  }
}
