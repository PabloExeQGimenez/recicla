import { Pesaje } from '../../pesaje/domain/pesaje.entity';
import { SolicitudPagoStatus } from './solicitud-pago-status.enum';

export type SolicitudPagoProps = {
  id: string;
  from: Date;
  to: Date;
  status: SolicitudPagoStatus;
  createdAt: Date;
  pesajes?: Pesaje[];
};

export class SolicitudPago {
  readonly id: string;
  readonly from: Date;
  readonly to: Date;
  status: SolicitudPagoStatus;
  readonly createdAt: Date;
  readonly pesajes: Pesaje[];

  constructor(props: SolicitudPagoProps) {
    if (props.from > props.to) {
      throw new Error('Rango de fechas inválido');
    }
    this.id = props.id;
    this.from = props.from;
    this.to = props.to;
    this.status = props.status;
    this.createdAt = props.createdAt;
    this.pesajes = props.pesajes ?? [];
  }

  markAsPaid(): void {
    if (this.status === SolicitudPagoStatus.PAID) {
      throw new Error('La solicitud ya fue pagada');
    }
    this.status = SolicitudPagoStatus.PAID;
  }
}
