import { Inject, Injectable } from '@nestjs/common';
import {
  SOLICITUD_PAGO_REPOSITORY,
  type SolicitudPagoRepository,
} from '../domain/solicitud-pago.repository';
import { SolicitudPagoFilters } from '../domain/solicitud-pago-filter';
import type { PaginatedResponse, SolicitudPagoListItem } from '@recicla/shared';

@Injectable()
export class GetSolicitudesPagoUseCase {
  constructor(
    @Inject(SOLICITUD_PAGO_REPOSITORY)
    private readonly solicitudPagoRepository: SolicitudPagoRepository,
  ) {}

  async execute(
    filters: SolicitudPagoFilters,
  ): Promise<PaginatedResponse<SolicitudPagoListItem>> {
    const { solicitudes, total } =
      await this.solicitudPagoRepository.findAllWithPesajes(filters);

    const items: SolicitudPagoListItem[] = solicitudes.map((solicitud) => {
      const totalAmount = solicitud.pesajes.reduce(
        (sum, pesaje) => sum + pesaje.totalAmount,
        0,
      );
      const itemsCount = solicitud.pesajes.reduce(
        (sum, pesaje) => sum + pesaje.items.length,
        0,
      );

      return {
        id: solicitud.id,
        from: solicitud.from.toISOString(),
        to: solicitud.to.toISOString(),
        status: solicitud.status,
        createdAt: solicitud.createdAt.toISOString(),
        totalAmount,
        itemsCount,
      };
    });

    const totalPages = Math.ceil(total / filters.limit);

    return {
      data: items,
      page: filters.page,
      limit: filters.limit,
      total,
      totalPages,
    };
  }
}
