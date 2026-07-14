import { Pesaje } from './pesaje.entity';
import { PesajeStatus } from './pesaje-status.enum';
import { PesajeItem } from './pesaje-item.vo';

describe('Pesaje', () => {
  const item1 = new PesajeItem({
    materialId: 'mat-1',
    weight: 10,
    pricePerKgAtMoment: 2,
  });

  const item2 = new PesajeItem({
    materialId: 'mat-2',
    weight: 5,
    pricePerKgAtMoment: 3,
  });

  const defaultProps = {
    id: 'p-1',
    recuperadorId: 'rec-1',
    status: PesajeStatus.PENDING,
    items: [item1],
    date: new Date('2026-01-15'),
    createdAt: new Date('2026-01-15'),
    updatedAt: new Date('2026-01-15'),
  };

  describe('constructor', () => {
    it('debería crear un pesaje válido', () => {
      const pesaje = new Pesaje(defaultProps);

      expect(pesaje.id).toBe('p-1');
      expect(pesaje.recuperadorId).toBe('rec-1');
      expect(pesaje.status).toBe(PesajeStatus.PENDING);
      expect(pesaje.items).toHaveLength(1);
    });

    it('debería lanzar error si no hay recuperador', () => {
      expect(() => {
        new Pesaje({ ...defaultProps, recuperadorId: '' });
      }).toThrow('El recuperador es obligatorio');
    });

    it('debería lanzar error si no hay items', () => {
      expect(() => {
        new Pesaje({ ...defaultProps, items: [] });
      }).toThrow('El pesaje debe contener items');
    });
  });

  describe('totalAmount', () => {
    it('debería sumar los subtotales de todos los items', () => {
      const pesaje = new Pesaje({ ...defaultProps, items: [item1, item2] });

      // item1: 10 * 2 = 20, item2: 5 * 3 = 15
      expect(pesaje.totalAmount).toBe(35);
    });

    it('debería funcionar con un solo item', () => {
      const pesaje = new Pesaje(defaultProps);

      expect(pesaje.totalAmount).toBe(20);
    });
  });

  describe('markAsPaymentRequested', () => {
    it('debería cambiar status a PAYMENT_REQUESTED', () => {
      const pesaje = new Pesaje(defaultProps);
      pesaje.markAsPaymentRequested();

      expect(pesaje.status).toBe(PesajeStatus.PAYMENT_REQUESTED);
    });
  });

  describe('assignToPaymentRequest', () => {
    it('debería asociar solicitud y marcar como PAYMENT_REQUESTED', () => {
      const pesaje = new Pesaje(defaultProps);
      pesaje.assignToPaymentRequest('sp-1');

      expect(pesaje.solicitudPagoId).toBe('sp-1');
      expect(pesaje.status).toBe(PesajeStatus.PAYMENT_REQUESTED);
    });

    it('debería lanzar error si el pesaje no está pendiente', () => {
      const pesaje = new Pesaje({
        ...defaultProps,
        status: PesajeStatus.PAYMENT_REQUESTED,
      });

      expect(() => {
        pesaje.assignToPaymentRequest('sp-1');
      }).toThrow(
        'Solo un pesaje pendiente puede asociarse a una solicitud de pago',
      );
    });
  });

  describe('markAsPaid', () => {
    it('debería cambiar status a PAID', () => {
      const pesaje = new Pesaje({
        ...defaultProps,
        status: PesajeStatus.PAYMENT_REQUESTED,
      });
      pesaje.markAsPaid();

      expect(pesaje.status).toBe(PesajeStatus.PAID);
    });

    it('debería lanzar error si no está en PAYMENT_REQUESTED', () => {
      const pesaje = new Pesaje(defaultProps);

      expect(() => {
        pesaje.markAsPaid();
      }).toThrow('Solo un pesaje con pago requerido puede ser pagado');
    });
  });

  describe('canBeDeleted', () => {
    it('debería retornar true si está pendiente', () => {
      const pesaje = new Pesaje(defaultProps);

      expect(pesaje.canBeDeleted()).toBe(true);
    });

    it('debería retornar false si no está pendiente', () => {
      const pesaje = new Pesaje({
        ...defaultProps,
        status: PesajeStatus.PAYMENT_REQUESTED,
      });

      expect(pesaje.canBeDeleted()).toBe(false);
    });
  });
});
