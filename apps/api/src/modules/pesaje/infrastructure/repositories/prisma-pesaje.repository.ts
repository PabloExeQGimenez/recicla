import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PesajeRepository } from '../../domain/pesaje.repository';
import { PrismaService } from '../../../../shared/database/prisma.service';
import { Pesaje } from '../../domain/pesaje.entity';
import { PesajePrismaMapper } from '../mappers/pesaje-prisma-mapper';
import { PesajeFilters } from '../../domain/pesaje-filters';
import { Prisma } from '@prisma/client';
import { PesajeStatus } from '../../domain/pesaje-status.enum';

@Injectable()
export class PrismaPesajeRepository implements PesajeRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(pesaje: Pesaje): Promise<void> {
    await this.prisma.pesaje.create({
      data: {
        id: pesaje.id,
        recuperadorId: pesaje.recuperadorId,
        status: pesaje.status,
        date: pesaje.date,
        createdAt: pesaje.createdAt,
        updatedAt: pesaje.updatedAt,
        items: {
          create: pesaje.items.map((item) => ({
            materialId: item.materialId,
            weight: item.weight,
            pricePerKgAtMoment: item.pricePerKgAtMoment,
          })),
        },
      },
    });
  }

  async findById(id: string): Promise<Pesaje | null> {
    const pesaje = await this.prisma.pesaje.findUnique({
      where: { id },
      include: {
        recuperador: true,
        items: {
          include: {
            material: true,
          },
        },
      },
    });
    if (!pesaje) {
      return null;
    }
    return PesajePrismaMapper.toDomain(pesaje);
  }

  async findAll(filters: PesajeFilters): Promise<Pesaje[]> {
    const skip = (filters.page - 1) * filters.limit;

    if (filters.from || filters.to) {
      const fromStr = filters.from?.toISOString().split('T')[0];
      const toStr = filters.to?.toISOString().split('T')[0];

      const conditions: string[] = [];
      const params: unknown[] = [];

      if (fromStr) {
        conditions.push(`DATE(p."date") >= $${params.length + 1}::date`);
        params.push(fromStr);
      }
      if (toStr) {
        conditions.push(`DATE(p."date") <= $${params.length + 1}::date`);
        params.push(toStr);
      }
      if (filters.recuperadorId) {
        conditions.push(`p."recuperadorId" = $${params.length + 1}`);
        params.push(filters.recuperadorId);
      }
      if (filters.status) {
        conditions.push(`p."status" = $${params.length + 1}::"PesajeStatus"`);
        params.push(filters.status);
      }
      if (filters.materialId) {
        conditions.push(`pi."materialId" = $${params.length + 1}`);
        params.push(filters.materialId);
      }

      const whereSql =
        conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

      const itemRows = await this.prisma.$queryRawUnsafe<
        { id: string; pesajeId: string }[]
      >(
        `SELECT pi."id", pi."pesajeId" FROM "PesajeItem" pi
         JOIN "Pesaje" p ON pi."pesajeId" = p."id"
         ${whereSql}
         ORDER BY p."date" DESC, pi."id" ASC
         LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
        ...params,
        filters.limit,
        skip,
      );

      if (itemRows.length === 0) return [];

      const itemIds = itemRows.map((r) => r.id);
      const pesajeIds = [...new Set(itemRows.map((r) => r.pesajeId))];

      const pesajes = await this.prisma.pesaje.findMany({
        where: { id: { in: pesajeIds } },
        include: {
          recuperador: true,
          items: {
            include: { material: true },
          },
        },
        orderBy: { date: 'desc' },
      });

      const pesajeItemMap = new Map(pesajes.map((p) => [p.id, p]));
      const orderedPesajes = pesajeIds
        .map((id) => pesajeItemMap.get(id)!)
        .filter(Boolean);

      const filtered = orderedPesajes.map((pesaje) => ({
        ...pesaje,
        items: pesaje.items.filter((item) => itemIds.includes(item.id)),
      }));

      return filtered.map((item) => PesajePrismaMapper.toDomain(item));
    }

    const where: Prisma.PesajeWhereInput = {};

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.recuperadorId) {
      where.recuperadorId = filters.recuperadorId;
    }

    if (filters.materialId) {
      where.items = {
        some: {
          materialId: filters.materialId,
        },
      };
    }

    const itemWhere: Prisma.PesajeItemWhereInput = {
      pesaje: where,
    };

    if (filters.materialId) {
      itemWhere.materialId = filters.materialId;
    }

    const itemRows = await this.prisma.pesajeItem.findMany({
      where: itemWhere,
      select: { id: true, pesajeId: true },
      orderBy: { pesaje: { date: 'desc' } },
      skip,
      take: filters.limit,
    });

    if (itemRows.length === 0) return [];

    const itemIds = itemRows.map((r) => r.id);
    const pesajeIds = [...new Set(itemRows.map((r) => r.pesajeId))];

    const pesajes = await this.prisma.pesaje.findMany({
      where: { id: { in: pesajeIds } },
      include: {
        recuperador: true,
        items: {
          include: { material: true },
        },
      },
      orderBy: { date: 'desc' },
    });

    const pesajeMap = new Map(pesajes.map((p) => [p.id, p]));
    const orderedPesajes = pesajeIds
      .map((id) => pesajeMap.get(id)!)
      .filter(Boolean);

    const filtered = orderedPesajes.map((pesaje) => ({
      ...pesaje,
      items: pesaje.items.filter((item) => itemIds.includes(item.id)),
    }));

    return filtered.map((item) => PesajePrismaMapper.toDomain(item));
  }

  async count(filters: PesajeFilters): Promise<number> {
    const where: Prisma.PesajeWhereInput = {};

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.recuperadorId) {
      where.recuperadorId = filters.recuperadorId;
    }

    if (filters.materialId) {
      where.items = {
        some: {
          materialId: filters.materialId,
        },
      };
    }

    if (filters.from || filters.to) {
      const fromStr = filters.from?.toISOString().split('T')[0];
      const toStr = filters.to?.toISOString().split('T')[0];

      const conditions: string[] = [];
      const params: unknown[] = [];

      if (fromStr) {
        conditions.push(`DATE(p."date") >= $${params.length + 1}::date`);
        params.push(fromStr);
      }
      if (toStr) {
        conditions.push(`DATE(p."date") <= $${params.length + 1}::date`);
        params.push(toStr);
      }
      if (filters.recuperadorId) {
        conditions.push(`p."recuperadorId" = $${params.length + 1}`);
        params.push(filters.recuperadorId);
      }
      if (filters.status) {
        conditions.push(`p."status" = $${params.length + 1}::"PesajeStatus"`);
        params.push(filters.status);
      }
      if (filters.materialId) {
        conditions.push(
          `p."id" IN (SELECT "pesajeId" FROM "PesajeItem" WHERE "materialId" = $${params.length + 1})`,
        );
        params.push(filters.materialId);
      }

      const whereSql =
        conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

      const result = await this.prisma.$queryRawUnsafe<{ count: bigint }[]>(
        `SELECT COUNT(*) as count FROM "Pesaje" p ${whereSql}`,
        ...params,
      );

      return Number(result[0]?.count ?? 0);
    }

    return this.prisma.pesaje.count({
      where,
    });
  }

  async countItems(filters: PesajeFilters): Promise<number> {
    const where: Prisma.PesajeWhereInput = {};

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.recuperadorId) {
      where.recuperadorId = filters.recuperadorId;
    }

    if (filters.from || filters.to) {
      const fromStr = filters.from?.toISOString().split('T')[0];
      const toStr = filters.to?.toISOString().split('T')[0];

      const conditions: string[] = [];
      const params: unknown[] = [];

      if (fromStr) {
        conditions.push(`DATE(p."date") >= $${params.length + 1}::date`);
        params.push(fromStr);
      }
      if (toStr) {
        conditions.push(`DATE(p."date") <= $${params.length + 1}::date`);
        params.push(toStr);
      }
      if (filters.recuperadorId) {
        conditions.push(`p."recuperadorId" = $${params.length + 1}`);
        params.push(filters.recuperadorId);
      }
      if (filters.status) {
        conditions.push(`p."status" = $${params.length + 1}::"PesajeStatus"`);
        params.push(filters.status);
      }
      if (filters.materialId) {
        conditions.push(`pi."materialId" = $${params.length + 1}`);
        params.push(filters.materialId);
      }

      const whereSql =
        conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

      const result = await this.prisma.$queryRawUnsafe<{ count: bigint }[]>(
        `SELECT COUNT(*) as count FROM "PesajeItem" pi JOIN "Pesaje" p ON pi."pesajeId" = p."id" ${whereSql}`,
        ...params,
      );

      return Number(result[0]?.count ?? 0);
    }

    const itemWhere: Prisma.PesajeItemWhereInput = {
      pesaje: where,
    };

    if (filters.materialId) {
      itemWhere.materialId = filters.materialId;
    }

    return this.prisma.pesajeItem.count({
      where: itemWhere,
    });
  }

  async findPendingPesajesByDateRange(from: Date, to: Date): Promise<Pesaje[]> {
    const pesajes = await this.prisma.pesaje.findMany({
      where: {
        status: PesajeStatus.PENDING,
        solicitudPagoId: null,
        date: {
          gte: from,
          lte: to,
        },
      },
      include: {
        recuperador: true,
        items: {
          include: {
            material: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    return pesajes.map((item) => PesajePrismaMapper.toDomain(item));
  }

  async assignToPaymentRequest(
    pesajeIds: string[],
    solicitudPagoId: string,
  ): Promise<void> {
    await this.prisma.pesaje.updateMany({
      where: {
        id: {
          in: pesajeIds,
        },
      },
      data: {
        solicitudPagoId,
        status: PesajeStatus.PAYMENT_REQUESTED,
      },
    });
  }

  async markAsPaid(pesajeIds: string[]): Promise<void> {
    await this.prisma.pesaje.updateMany({
      where: {
        id: {
          in: pesajeIds,
        },
      },
      data: {
        status: PesajeStatus.PAID,
      },
    });
  }

  async removeFromPaymentRequest(pesajeIds: string[]): Promise<void> {
    await this.prisma.pesaje.updateMany({
      where: {
        id: {
          in: pesajeIds,
        },
      },
      data: {
        solicitudPagoId: null,
        status: 'PENDING',
      },
    });
  }

  async update(pesaje: Pesaje): Promise<void> {
    await this.prisma.pesaje.update({
      where: { id: pesaje.id },
      data: {
        status: pesaje.status,
        solicitudPagoId: pesaje.solicitudPagoId,
        updatedAt: pesaje.updatedAt,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.pesaje.delete({
      where: { id },
    });
  }

  async deleteItem(itemId: string): Promise<void> {
    const item = await this.prisma.pesajeItem.findUnique({
      where: { id: itemId },
      include: { pesaje: { include: { items: true } } },
    });

    if (!item) {
      throw new NotFoundException('El item no existe');
    }

    if (item.pesaje.status !== (PesajeStatus.PENDING as string)) {
      throw new BadRequestException(
        'El pesaje ya fue incorporado a una solicitud de pago o está pagado',
      );
    }

    await this.prisma.pesajeItem.delete({ where: { id: itemId } });

    if (item.pesaje.items.length <= 1) {
      await this.prisma.pesaje.delete({ where: { id: item.pesajeId } });
    }
  }
}
