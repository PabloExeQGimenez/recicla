import { SolicitudPago } from '../../domain/solicitud-pago.entity';
import type { SolicitudPagoDetail as SolicitudPagoResponseDTO } from '@recicla/shared';
import { PesajeResponseMapper } from 'src/modules/pesaje/presentation/mappers/pesaje-response.mapper';

export class SolicitudPagoResponseMapper {
  static toResponse(solicitudPago: SolicitudPago): SolicitudPagoResponseDTO {
    return {
      id: solicitudPago.id,
      from: solicitudPago.from.toISOString(),
      to: solicitudPago.to.toISOString(),
      status: solicitudPago.status,
      createdAt: solicitudPago.createdAt.toISOString(),
      pesajes: solicitudPago.pesajes.map((item) =>
        PesajeResponseMapper.toResponse(item),
      ),
    };
  }
}
