import { PesajePrismaMapper } from 'src/modules/pesaje/infrastructure/mappers/pesaje-prisma-mapper';
import { SolicitudPago } from '../../domain/solicitud-pago.entity';
import { Prisma } from '@prisma/client';
import { SolicitudPagoStatus } from '../../domain/solicitud-pago-status.enum';

type SolicitudPagoWithPesajes = Prisma.SolicitudPagoGetPayload<{
  include: {
    pesajes: {
      include: {
        recuperador: true;
        items: {
          include: {
            material: true;
          };
        };
      };
    };
  };
}>;

export class SolicitudPagoPrismaMapper {
  static toPersistence(solicitudPago: SolicitudPago) {
    return {
      id: solicitudPago.id,
      from: solicitudPago.from,
      to: solicitudPago.to,
      status: solicitudPago.status,
      createdAt: solicitudPago.createdAt,
    };
  }

  static toDomain(solicitudPago: SolicitudPagoWithPesajes): SolicitudPago {
    return new SolicitudPago({
      id: solicitudPago.id,
      from: solicitudPago.from,
      to: solicitudPago.to,
      status: solicitudPago.status as SolicitudPagoStatus,
      createdAt: solicitudPago.createdAt,
      pesajes:
        solicitudPago.pesajes?.map((item) =>
          PesajePrismaMapper.toDomain(item),
        ) ?? [],
    });
  }
}
