import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/database/prisma.service';
import { SolicitudPagoRepository } from '../../domain/solicitud-pago.repository';
import { SolicitudPago } from '../../domain/solicitud-pago.entity';
import { SolicitudPagoPrismaMapper } from '../mappers/solicitud-pago-prisma.mapper';
import { SolicitudPagoExportData } from '../../domain/solicitud-pago-export-data';
import { SolicitudPagoFilters } from '../../domain/solicitud-pago-filter';

@Injectable()
export class PrismaSolicitudPagoRepository implements SolicitudPagoRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(solicitudPago: SolicitudPago): Promise<void> {
    await this.prisma.solicitudPago.create({
      data: SolicitudPagoPrismaMapper.toPersistence(solicitudPago),
    });
  }

  async findAll(): Promise<SolicitudPago[]> {
    const solicitudesPago = await this.prisma.solicitudPago.findMany({
      include: {
        pesajes: {
          include: {
            recuperador: true,
            items: {
              include: {
                material: true,
              },
            },
          },
        },
      },
    });
    return solicitudesPago.map((item) =>
      SolicitudPagoPrismaMapper.toDomain(item),
    );
  }

  async findAllWithPesajes(
    filters: SolicitudPagoFilters,
  ): Promise<{ solicitudes: SolicitudPago[]; total: number }> {
    const where = {
      ...(filters.from && { from: { gte: filters.from } }),
      ...(filters.to && { to: { lte: filters.to } }),
    };

    const [solicitudesPago, total] = await Promise.all([
      this.prisma.solicitudPago.findMany({
        where,
        include: {
          pesajes: {
            include: {
              recuperador: true,
              items: {
                include: {
                  material: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (filters.page - 1) * filters.limit,
        take: filters.limit,
      }),
      this.prisma.solicitudPago.count({ where }),
    ]);

    return {
      solicitudes: solicitudesPago.map((item) =>
        SolicitudPagoPrismaMapper.toDomain(item),
      ),
      total,
    };
  }

  async findById(id: string): Promise<SolicitudPago | null> {
    const solicitudPago = await this.prisma.solicitudPago.findUnique({
      where: { id },
      include: {
        pesajes: {
          include: {
            recuperador: true,
            items: {
              include: {
                material: true,
              },
            },
          },
        },
      },
    });

    if (!solicitudPago) {
      return null;
    }

    return SolicitudPagoPrismaMapper.toDomain(solicitudPago);
  }

  async findForExport(id: string): Promise<SolicitudPagoExportData | null> {
    const solicitudPago = await this.prisma.solicitudPago.findUnique({
      where: { id },
      include: {
        pesajes: {
          include: {
            recuperador: true,
            items: {
              include: {
                material: true,
              },
            },
          },
        },
      },
    });

    if (!solicitudPago) {
      return null;
    }

    return {
      id: solicitudPago.id,
      pesajes: solicitudPago.pesajes.map((pesaje) => ({
        createdAt: pesaje.createdAt,
        recuperador: {
          name: pesaje.recuperador.name,
          lastName: pesaje.recuperador.lastName,
          dni: pesaje.recuperador.dni,
          cuil: pesaje.recuperador.cuil,
        },
        items: pesaje.items.map((item) => ({
          material: {
            name: item.material.name,
          },
          weight: item.weight.toNumber(),
        })),
      })),
    };
  }

  async update(solicitudPago: SolicitudPago): Promise<void> {
    await this.prisma.solicitudPago.update({
      where: {
        id: solicitudPago.id,
      },
      data: {
        status: solicitudPago.status,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.solicitudPago.delete({
      where: { id },
    });
  }
}
