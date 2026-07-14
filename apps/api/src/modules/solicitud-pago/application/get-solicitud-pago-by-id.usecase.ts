import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import {
  SOLICITUD_PAGO_REPOSITORY,
  type SolicitudPagoRepository,
} from '../domain/solicitud-pago.repository';
import { SolicitudPago } from '../domain/solicitud-pago.entity';

@Injectable()
export class GetSolicitudPagoByIdUseCase {
  constructor(
    @Inject(SOLICITUD_PAGO_REPOSITORY)
    private readonly solicitudPagoRepository: SolicitudPagoRepository,
  ) {}

  async execute(id: string): Promise<SolicitudPago> {
    const solicitudPago = await this.solicitudPagoRepository.findById(id);

    if (!solicitudPago) {
      throw new NotFoundException('No existe la solicitud de pesaje');
    }

    return solicitudPago;
  }
}
