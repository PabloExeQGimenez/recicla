import { SolicitudPago } from './solicitud-pago.entity';
import { SolicitudPagoStatus } from './solicitud-pago-status.enum';

describe('SolicitudPago', () => {
  const defaultProps = {
    id: 'sp-1',
    from: new Date('2026-01-01'),
    to: new Date('2026-01-31'),
    status: SolicitudPagoStatus.PAYMENT_REQUESTED,
    createdAt: new Date('2026-01-01'),
  };

  it('debería crear una solicitud válida', () => {
    const solicitud = new SolicitudPago(defaultProps);

    expect(solicitud.id).toBe('sp-1');
    expect(solicitud.status).toBe(SolicitudPagoStatus.PAYMENT_REQUESTED);
  });

  it('debería crear solicitud sin pesajes', () => {
    const solicitud = new SolicitudPago(defaultProps);

    expect(solicitud.pesajes).toEqual([]);
  });

  describe('validaciones del constructor', () => {
    it('debería lanzar error si from > to', () => {
      expect(() => {
        new SolicitudPago({
          ...defaultProps,
          from: new Date('2026-02-01'),
          to: new Date('2026-01-01'),
        });
      }).toThrow('Rango de fechas inválido');
    });
  });

  describe('markAsPaid', () => {
    it('debería marcar como pagada', () => {
      const solicitud = new SolicitudPago(defaultProps);
      solicitud.markAsPaid();

      expect(solicitud.status).toBe(SolicitudPagoStatus.PAID);
    });

    it('debería lanzar error si ya está pagada', () => {
      const solicitud = new SolicitudPago({
        ...defaultProps,
        status: SolicitudPagoStatus.PAID,
      });

      expect(() => {
        solicitud.markAsPaid();
      }).toThrow('La solicitud ya fue pagada');
    });
  });
});
