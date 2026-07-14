import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import {
  SOLICITUD_PAGO_REPOSITORY,
  type SolicitudPagoRepository,
} from '../domain/solicitud-pago.repository';
import { SolicitudPago } from '../domain/solicitud-pago.entity';
import {
  PESAJE_REPOSITORY,
  type PesajeRepository,
} from 'src/modules/pesaje/domain/pesaje.repository';
import { CreateSolicitudPagoDTO } from './dtos/create-solicitud-pago.dto';
import { SolicitudPagoStatus } from '../domain/solicitud-pago-status.enum';

@Injectable()
export class CreateSolicitudPagoUseCase {
  constructor(
    @Inject(SOLICITUD_PAGO_REPOSITORY)
    private readonly solicitudPagoRepository: SolicitudPagoRepository,
    @Inject(PESAJE_REPOSITORY)
    private readonly pesajeRepository: PesajeRepository,
  ) {}

  async execute(data: CreateSolicitudPagoDTO): Promise<SolicitudPago> {
    const pesajes = await this.pesajeRepository.findPendingPesajesByDateRange(
      data.from,
      data.to,
    );

    const pesajesAIncluir = data.excludedPesajeIds?.length
      ? pesajes.filter((p) => !data.excludedPesajeIds!.includes(p.id))
      : pesajes;

    if (pesajesAIncluir.length === 0) {
      throw new BadRequestException('No hay pesajes pendientes de pago');
    }

    const solicitudPago = new SolicitudPago({
      id: crypto.randomUUID(),
      from: data.from,
      to: data.to,
      status: SolicitudPagoStatus.PAYMENT_REQUESTED,
      createdAt: new Date(),
    });
    await this.solicitudPagoRepository.save(solicitudPago);

    const pesajeIds = pesajesAIncluir.map((pesaje) => pesaje.id);

    await this.pesajeRepository.assignToPaymentRequest(
      pesajeIds,
      solicitudPago.id,
    );
    return solicitudPago;
  }
}
