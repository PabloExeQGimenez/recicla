import { PesajeStatus } from './pesaje-status.enum';
import { PesajeItem } from './pesaje-item.vo';

export type RecuperadorRef = {
  id: string;
  name: string;
  lastName: string;
  dni?: string;
};

export type PesajeProps = {
  id: string;
  recuperadorId: string;
  status: PesajeStatus;
  items: PesajeItem[];
  solicitudPagoId?: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
  recuperador?: RecuperadorRef;
};

export class Pesaje {
  readonly id: string;
  readonly recuperadorId: string;
  status: PesajeStatus;
  readonly items: PesajeItem[];
  solicitudPagoId?: string;
  readonly date: Date;
  readonly createdAt: Date;
  updatedAt: Date;
  readonly recuperador?: RecuperadorRef;

  constructor(props: PesajeProps) {
    if (!props.recuperadorId) {
      throw new Error('El recuperador es obligatorio');
    }

    if (props.items.length === 0) {
      throw new Error('El pesaje debe contener items');
    }

    this.id = props.id;
    this.recuperadorId = props.recuperadorId;
    this.status = props.status;
    this.items = props.items;
    this.solicitudPagoId = props.solicitudPagoId;
    this.date = props.date;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
    this.recuperador = props.recuperador;
  }

  get totalAmount(): number {
    return this.items.reduce((total, item) => total + item.subtotal, 0);
  }

  markAsPaymentRequested() {
    this.status = PesajeStatus.PAYMENT_REQUESTED;
    this.updatedAt = new Date();
  }

  assignToPaymentRequest(solicitudPagoId: string) {
    if (this.status !== PesajeStatus.PENDING) {
      throw new Error(
        'Solo un pesaje pendiente puede asociarse a una solicitud de pago',
      );
    }
    this.solicitudPagoId = solicitudPagoId;
    this.markAsPaymentRequested();
  }

  markAsPaid() {
    if (this.status !== PesajeStatus.PAYMENT_REQUESTED) {
      throw new Error('Solo un pesaje con pago requerido puede ser pagado');
    }
    this.status = PesajeStatus.PAID;
    this.updatedAt = new Date();
  }

  canBeDeleted() {
    return this.status === PesajeStatus.PENDING;
  }
}
