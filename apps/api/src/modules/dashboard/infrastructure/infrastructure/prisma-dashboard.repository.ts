import { Injectable } from '@nestjs/common';
import { DashboardRepository } from '../../domain/dashboard.repository';
import { DashboardData } from '../../domain/dashboard-data';
import { PrismaService } from '../../../../shared/database/prisma.service';
import { SolicitudPagoStatus } from '../../../solicitud-pago/domain/solicitud-pago-status.enum';

@Injectable()
export class PrismaDashboardRepository implements DashboardRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getCurrentMonthData(from: Date, to: Date): Promise<DashboardData> {
    const recoverers = await this.prisma.pesaje.findMany({
      where: {
        createdAt: {
          gte: from,
          lte: to,
        },
      },
      select: {
        recuperadorId: true,
      },
      distinct: ['recuperadorId'],
    });
    const recoverersThisMonth = recoverers.length;

    const totalKg = await this.prisma.pesajeItem.aggregate({
      where: {
        pesaje: {
          createdAt: {
            gte: from,
            lte: to,
          },
        },
      },
      _sum: {
        weight: true,
      },
    });
    const totalKgThisMonth = totalKg._sum.weight?.toNumber() ?? 0;

    const pendingPesajeItems = await this.prisma.pesajeItem.findMany({
      where: {
        pesaje: {
          status: {
            not: 'PAID',
          },
          createdAt: {
            gte: from,
            lte: to,
          },
        },
      },
      select: {
        weight: true,
        pricePerKgAtMoment: true,
      },
    });

    const pendingAmount = pendingPesajeItems.reduce(
      (total, item) =>
        total + item.weight.toNumber() * item.pricePerKgAtMoment.toNumber(),
      0,
    );

    const pendingPaymentRequests = await this.prisma.solicitudPago.count({
      where: {
        status: SolicitudPagoStatus.PAYMENT_REQUESTED,
        createdAt: {
          gte: from,
          lte: to,
        },
      },
    });

    const paidSolicitudes = await this.prisma.solicitudPago.findMany({
      where: {
        status: SolicitudPagoStatus.PAID,
        createdAt: {
          gte: from,
          lte: to,
        },
      },
      include: {
        pesajes: {
          include: {
            items: true,
          },
        },
      },
    });

    const completedPaymentsAmount = paidSolicitudes.reduce((total, sol) => {
      const solTotal = sol.pesajes.reduce((pSum, pesaje) => {
        const pesajeTotal = pesaje.items.reduce(
          (iSum, item) =>
            iSum + item.weight.toNumber() * item.pricePerKgAtMoment.toNumber(),
          0,
        );
        return pSum + pesajeTotal;
      }, 0);
      return total + solTotal;
    }, 0);

    const materialsGrouped = await this.prisma.pesajeItem.groupBy({
      by: ['materialId'],
      where: {
        pesaje: {
          createdAt: {
            gte: from,
            lte: to,
          },
        },
      },
      _sum: {
        weight: true,
      },
    });

    const materialIds = materialsGrouped.map((material) => material.materialId);

    const materialsInfo = await this.prisma.material.findMany({
      where: {
        id: {
          in: materialIds,
        },
      },
      select: {
        id: true,
        name: true,
      },
    });

    const materials = materialsGrouped.map((group) => {
      const material = materialsInfo.find((m) => m.id === group.materialId);

      return {
        name: material?.name ?? 'Desconocido',
        totalKg: group._sum.weight?.toNumber() ?? 0,
      };
    });

    return {
      recoverersThisMonth,
      totalKgThisMonth,
      pendingAmount,
      pendingPaymentRequests,
      completedPaymentsAmount,
      materials,
    };
  }
}
