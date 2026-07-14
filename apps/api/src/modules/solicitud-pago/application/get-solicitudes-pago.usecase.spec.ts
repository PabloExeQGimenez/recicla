import { GetSolicitudesPagoUseCase } from './get-solicitudes-pago.usecase';
import { SolicitudPagoRepository } from '../domain/solicitud-pago.repository';
import { SolicitudPago } from '../domain/solicitud-pago.entity';
import { SolicitudPagoStatus } from '../domain/solicitud-pago-status.enum';
import { Pesaje } from '../../pesaje/domain/pesaje.entity';
import { PesajeStatus } from '../../pesaje/domain/pesaje-status.enum';
import { PesajeItem } from '../../pesaje/domain/pesaje-item.vo';

describe('GetSolicitudesPagoUseCase', () => {
  let useCase: GetSolicitudesPagoUseCase;
  let mockRepository: jest.Mocked<SolicitudPagoRepository>;

  beforeEach(() => {
    mockRepository = { findAllWithPesajes: jest.fn() } as any;
    useCase = new GetSolicitudesPagoUseCase(mockRepository);
  });

  it('debería retornar solicitudes con totalAmount e itemsCount calculados', async () => {
    const pesaje = new Pesaje({
      id: 'p-1',
      recuperadorId: 'rec-1',
      status: PesajeStatus.PAYMENT_REQUESTED,
      items: [
        new PesajeItem({
          materialId: 'mat-1',
          weight: 10,
          pricePerKgAtMoment: 2,
        }),
        new PesajeItem({
          materialId: 'mat-2',
          weight: 5,
          pricePerKgAtMoment: 3,
        }),
      ],
      date: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const solicitud = new SolicitudPago({
      id: 'sp-1',
      from: new Date('2026-01-01'),
      to: new Date('2026-01-31'),
      status: SolicitudPagoStatus.PAYMENT_REQUESTED,
      createdAt: new Date(),
      pesajes: [pesaje],
    });

    mockRepository.findAllWithPesajes.mockResolvedValue({
      solicitudes: [solicitud],
      total: 1,
    });

    const result = await useCase.execute({ page: 1, limit: 10 });

    expect(result.data).toHaveLength(1);
    expect(result.data[0].totalAmount).toBe(35);
    expect(result.data[0].itemsCount).toBe(2);
    expect(result.totalPages).toBe(1);
  });
});
