import { DeleteSolicitudPagoUseCase } from './delete-solicitud-pago.usecase';
import { SolicitudPagoRepository } from '../domain/solicitud-pago.repository';
import { PesajeRepository } from '../../pesaje/domain/pesaje.repository';
import { SolicitudPago } from '../domain/solicitud-pago.entity';
import { SolicitudPagoStatus } from '../domain/solicitud-pago-status.enum';
import { Pesaje } from '../../pesaje/domain/pesaje.entity';
import { PesajeStatus } from '../../pesaje/domain/pesaje-status.enum';
import { PesajeItem } from '../../pesaje/domain/pesaje-item.vo';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('DeleteSolicitudPagoUseCase', () => {
  let useCase: DeleteSolicitudPagoUseCase;
  let mockSolicitudRepo: jest.Mocked<SolicitudPagoRepository>;
  let mockPesajeRepo: jest.Mocked<PesajeRepository>;

  const makePesaje = (id: string): Pesaje =>
    new Pesaje({
      id,
      recuperadorId: 'rec-1',
      status: PesajeStatus.PAYMENT_REQUESTED,
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
    mockSolicitudRepo = { findById: jest.fn(), delete: jest.fn() } as any;
    mockPesajeRepo = { removeFromPaymentRequest: jest.fn() } as any;
    useCase = new DeleteSolicitudPagoUseCase(mockSolicitudRepo, mockPesajeRepo);
  });

  it('debería lanzar NotFoundException si la solicitud no existe', async () => {
    mockSolicitudRepo.findById.mockResolvedValue(null);

    await expect(useCase.execute('sp-1')).rejects.toThrow(NotFoundException);
  });

  it('debería lanzar BadRequestException si la solicitud ya fue pagada', async () => {
    const solicitud = new SolicitudPago({
      id: 'sp-1',
      from: new Date('2026-01-01'),
      to: new Date('2026-01-31'),
      status: SolicitudPagoStatus.PAID,
      createdAt: new Date(),
      pesajes: [makePesaje('p-1')],
    });

    mockSolicitudRepo.findById.mockResolvedValue(solicitud);

    await expect(useCase.execute('sp-1')).rejects.toThrow(BadRequestException);
    await expect(useCase.execute('sp-1')).rejects.toThrow(
      'No se puede eliminar una solicitud pagada',
    );
  });

  it('debería desasociar pesajes y eliminar la solicitud', async () => {
    const solicitud = new SolicitudPago({
      id: 'sp-1',
      from: new Date('2026-01-01'),
      to: new Date('2026-01-31'),
      status: SolicitudPagoStatus.PAYMENT_REQUESTED,
      createdAt: new Date(),
      pesajes: [makePesaje('p-1'), makePesaje('p-2')],
    });

    mockSolicitudRepo.findById.mockResolvedValue(solicitud);
    mockPesajeRepo.removeFromPaymentRequest.mockResolvedValue(undefined);
    mockSolicitudRepo.delete.mockResolvedValue(undefined);

    await useCase.execute('sp-1');

    expect(mockPesajeRepo.removeFromPaymentRequest).toHaveBeenCalledWith([
      'p-1',
      'p-2',
    ]);
    expect(mockSolicitudRepo.delete).toHaveBeenCalledWith('sp-1');
  });
});
