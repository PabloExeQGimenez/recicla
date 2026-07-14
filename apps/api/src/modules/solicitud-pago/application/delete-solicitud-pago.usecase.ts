import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import {
  PESAJE_REPOSITORY,
  type PesajeRepository,
} from 'src/modules/pesaje/domain/pesaje.repository';
import { SolicitudPagoStatus } from 'src/modules/solicitud-pago/domain/solicitud-pago-status.enum';
import {
  SOLICITUD_PAGO_REPOSITORY,
  type SolicitudPagoRepository,
} from 'src/modules/solicitud-pago/domain/solicitud-pago.repository';

@Injectable()
export class DeleteSolicitudPagoUseCase {
  constructor(
    @Inject(SOLICITUD_PAGO_REPOSITORY)
    private readonly solicitudPagoRepository: SolicitudPagoRepository,
    @Inject(PESAJE_REPOSITORY)
    private readonly pesajeRepository: PesajeRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const solicitudPago = await this.solicitudPagoRepository.findById(id);
    if (!solicitudPago) {
      throw new NotFoundException('No existe la solicitud');
    }

    if (solicitudPago.status === SolicitudPagoStatus.PAID) {
      throw new BadRequestException(
        'No se puede eliminar una solicitud pagada',
      );
    }

    const pesajeIds = solicitudPago.pesajes.map((pesaje) => pesaje.id);

    await this.pesajeRepository.removeFromPaymentRequest(pesajeIds);
    await this.solicitudPagoRepository.delete(id);
  }
}
