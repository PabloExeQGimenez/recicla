import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import {
  SOLICITUD_PAGO_REPOSITORY,
  type SolicitudPagoRepository,
} from '../domain/solicitud-pago.repository';
import { SolicitudPago } from '../domain/solicitud-pago.entity';
import { SolicitudPagoStatus } from '../domain/solicitud-pago-status.enum';
import {
  PESAJE_REPOSITORY,
  type PesajeRepository,
} from 'src/modules/pesaje/domain/pesaje.repository';

@Injectable()
export class ExcludePesajesFromSolicitudPagoUseCase {
  constructor(
    @Inject(SOLICITUD_PAGO_REPOSITORY)
    private readonly solicitudPagoRepository: SolicitudPagoRepository,
    @Inject(PESAJE_REPOSITORY)
    private readonly pesajeRepository: PesajeRepository,
  ) {}

  async execute(
    id: string,
    pesajeIds: string[],
  ): Promise<SolicitudPago | null> {
    const solicitudPago = await this.solicitudPagoRepository.findById(id);

    if (!solicitudPago) {
      throw new NotFoundException('La solicitud de pago no existe');
    }

    if (solicitudPago.status !== SolicitudPagoStatus.PAYMENT_REQUESTED) {
      throw new BadRequestException(
        'Solo se pueden excluir pesajes de solicitudes con estado "solicitado"',
      );
    }

    const solicitudPesajeIds = new Set(solicitudPago.pesajes.map((p) => p.id));
    const invalidIds = pesajeIds.filter((id) => !solicitudPesajeIds.has(id));

    if (invalidIds.length > 0) {
      throw new BadRequestException(
        `Los pesajes ${invalidIds.join(', ')} no pertenecen a esta solicitud`,
      );
    }

    await this.pesajeRepository.removeFromPaymentRequest(pesajeIds);

    const remaining = solicitudPago.pesajes.length - pesajeIds.length;

    if (remaining === 0) {
      await this.solicitudPagoRepository.delete(id);
      return null;
    }

    const updatedSolicitud = await this.solicitudPagoRepository.findById(id);

    if (!updatedSolicitud) {
      throw new NotFoundException('Error al actualizar la solicitud');
    }

    return updatedSolicitud;
  }
}
