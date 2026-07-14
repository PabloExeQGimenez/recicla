import { MarkSolicitudPagoPaidUseCase } from './mark-solicitud-pago-paid.usecase';
import { SolicitudPagoRepository } from '../domain/solicitud-pago.repository';
import { PesajeRepository } from 'src/modules/pesaje/domain/pesaje.repository';
import { SolicitudPago } from '../domain/solicitud-pago.entity';
import { SolicitudPagoStatus } from '../domain/solicitud-pago-status.enum';
import { Pesaje } from 'src/modules/pesaje/domain/pesaje.entity';
import { PesajeStatus } from 'src/modules/pesaje/domain/pesaje-status.enum';
import { PesajeItem } from 'src/modules/pesaje/domain/pesaje-item.vo';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('MarkSolicitudPagoPaidUseCase', () => {
  let useCase: MarkSolicitudPagoPaidUseCase;
  let mockSolicitudRepo: jest.Mocked<SolicitudPagoRepository>;
  let mockPesajeRepo: jest.Mocked<PesajeRepository>;

  const makePesaje = (
    id: string,
    status: PesajeStatus = PesajeStatus.PAYMENT_REQUESTED,
  ): Pesaje =>
    new Pesaje({
      id,
      recuperadorId: 'rec-1',
      status,
      items: [
        new PesajeItem({
          materialId: 'mat-1',
          weight: 10,
          pricePerKgAtMoment: 2,
        }),
      ],
      date: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

  beforeEach(() => {
    mockSolicitudRepo = { findById: jest.fn(), update: jest.fn() } as any;
    mockPesajeRepo = {
      removeFromPaymentRequest: jest.fn(),
      markAsPaid: jest.fn(),
    } as any;
    useCase = new MarkSolicitudPagoPaidUseCase(
      mockSolicitudRepo,
      mockPesajeRepo,
    );
  });

  it('debería lanzar NotFoundException si la solicitud no existe', async () => {
    mockSolicitudRepo.findById.mockResolvedValue(null);

    await expect(useCase.execute('sp-1')).rejects.toThrow(NotFoundException);
  });

  it('debería lanzar BadRequestException si todos los pesajes son excluidos', async () => {
    const solicitud = new SolicitudPago({
      id: 'sp-1',
      from: new Date('2026-01-01'),
      to: new Date('2026-01-31'),
      status: SolicitudPagoStatus.PAYMENT_REQUESTED,
      createdAt: new Date(),
      pesajes: [makePesaje('p-1'), makePesaje('p-2')],
    });
    mockSolicitudRepo.findById.mockResolvedValue(solicitud);

    await expect(useCase.execute('sp-1', ['p-1', 'p-2'])).rejects.toThrow(
      BadRequestException,
    );
    await expect(useCase.execute('sp-1', ['p-1', 'p-2'])).rejects.toThrow(
      'todos los pesajes fueron excluidos',
    );
  });

  it('debería marcar como pagada sin exclusiones', async () => {
    const solicitud = new SolicitudPago({
      id: 'sp-1',
      from: new Date('2026-01-01'),
      to: new Date('2026-01-31'),
      status: SolicitudPagoStatus.PAYMENT_REQUESTED,
      createdAt: new Date(),
      pesajes: [makePesaje('p-1'), makePesaje('p-2')],
    });
    mockSolicitudRepo.findById.mockResolvedValue(solicitud);
    mockPesajeRepo.markAsPaid.mockResolvedValue(undefined);
    mockSolicitudRepo.update.mockResolvedValue(undefined);

    const result = await useCase.execute('sp-1');

    expect(result.status).toBe(SolicitudPagoStatus.PAID);
    expect(mockPesajeRepo.markAsPaid).toHaveBeenCalledWith(['p-1', 'p-2']);
    expect(mockPesajeRepo.removeFromPaymentRequest).not.toHaveBeenCalled();
    expect(mockSolicitudRepo.update).toHaveBeenCalled();
  });

  it('debería excluir pesajes y marcar el resto como pagados', async () => {
    const solicitud = new SolicitudPago({
      id: 'sp-1',
      from: new Date('2026-01-01'),
      to: new Date('2026-01-31'),
      status: SolicitudPagoStatus.PAYMENT_REQUESTED,
      createdAt: new Date(),
      pesajes: [makePesaje('p-1'), makePesaje('p-2'), makePesaje('p-3')],
    });
    mockSolicitudRepo.findById.mockResolvedValue(solicitud);
    mockPesajeRepo.removeFromPaymentRequest.mockResolvedValue(undefined);
    mockPesajeRepo.markAsPaid.mockResolvedValue(undefined);
    mockSolicitudRepo.update.mockResolvedValue(undefined);

    const result = await useCase.execute('sp-1', ['p-2']);

    expect(result.status).toBe(SolicitudPagoStatus.PAID);
    expect(mockPesajeRepo.removeFromPaymentRequest).toHaveBeenCalledWith([
      'p-2',
    ]);
    expect(mockPesajeRepo.markAsPaid).toHaveBeenCalledWith(['p-1', 'p-3']);
  });
});
