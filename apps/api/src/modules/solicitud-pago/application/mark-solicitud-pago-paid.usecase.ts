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
import {
  PESAJE_REPOSITORY,
  type PesajeRepository,
} from 'src/modules/pesaje/domain/pesaje.repository';

@Injectable()
export class MarkSolicitudPagoPaidUseCase {
  constructor(
    @Inject(SOLICITUD_PAGO_REPOSITORY)
    private readonly solicitudPagoRepository: SolicitudPagoRepository,
    @Inject(PESAJE_REPOSITORY)
    private readonly pesajeRepository: PesajeRepository,
  ) {}

  async execute(
    id: string,
    excludePesajeIds?: string[],
  ): Promise<SolicitudPago> {
    const solicitudPago = await this.solicitudPagoRepository.findById(id);

    if (!solicitudPago) {
      throw new NotFoundException('La solicitud de pago no existe');
    }

    const excludeSet = new Set(excludePesajeIds ?? []);
    const pesajesAPagar = solicitudPago.pesajes.filter(
      (p) => !excludeSet.has(p.id),
    );

    if (pesajesAPagar.length === 0) {
      throw new BadRequestException(
        'No se puede marcar como pagada: todos los pesajes fueron excluidos',
      );
    }

    if (excludeSet.size > 0) {
      await this.pesajeRepository.removeFromPaymentRequest(
        Array.from(excludeSet),
      );
    }

    solicitudPago.markAsPaid();

    for (const pesaje of pesajesAPagar) {
      pesaje.markAsPaid();
    }
    const pesajeIds = pesajesAPagar.map((pesaje) => pesaje.id);
    await this.pesajeRepository.markAsPaid(pesajeIds);
    await this.solicitudPagoRepository.update(solicitudPago);
    return solicitudPago;
  }
}
