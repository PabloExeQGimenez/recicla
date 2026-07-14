import { CreateSolicitudPagoUseCase } from './create-solicitud-pago.usecase';
import { SolicitudPagoRepository } from '../domain/solicitud-pago.repository';
import { PesajeRepository } from '../../pesaje/domain/pesaje.repository';
import { Pesaje } from '../../pesaje/domain/pesaje.entity';
import { PesajeStatus } from '../../pesaje/domain/pesaje-status.enum';
import { PesajeItem } from '../../pesaje/domain/pesaje-item.vo';
import { BadRequestException } from '@nestjs/common';

describe('CreateSolicitudPagoUseCase', () => {
  let useCase: CreateSolicitudPagoUseCase;
  let mockSolicitudRepo: jest.Mocked<SolicitudPagoRepository>;
  let mockPesajeRepo: jest.Mocked<PesajeRepository>;

  beforeEach(() => {
    mockSolicitudRepo = { save: jest.fn() } as any;
    mockPesajeRepo = {
      findPendingPesajesByDateRange: jest.fn(),
      assignToPaymentRequest: jest.fn(),
    } as any;
    useCase = new CreateSolicitudPagoUseCase(mockSolicitudRepo, mockPesajeRepo);
  });

  const makePesaje = (id: string): Pesaje =>
    new Pesaje({
      id,
      recuperadorId: 'rec-1',
      status: PesajeStatus.PENDING,
      items: [
        new PesajeItem({
          materialId: 'mat-1',
          weight: 10,
          pricePerKgAtMoment: 2,
        }),
      ],
      date: new Date('2026-01-15'),
      createdAt: new Date('2026-01-15'),
      updatedAt: new Date('2026-01-15'),
    });

  it('debería lanzar BadRequestException si no hay pesajes pendientes', async () => {
    mockPesajeRepo.findPendingPesajesByDateRange.mockResolvedValue([]);

    await expect(
      useCase.execute({
        from: new Date('2026-01-01'),
        to: new Date('2026-01-31'),
      }),
    ).rejects.toThrow(BadRequestException);
    await expect(
      useCase.execute({
        from: new Date('2026-01-01'),
        to: new Date('2026-01-31'),
      }),
    ).rejects.toThrow('No hay pesajes pendientes de pago');
  });

  it('debería lanzar BadRequestException si todos los pesajes están excluidos', async () => {
    const pesajes = [makePesaje('p-1'), makePesaje('p-2')];
    mockPesajeRepo.findPendingPesajesByDateRange.mockResolvedValue(pesajes);

    await expect(
      useCase.execute({
        from: new Date('2026-01-01'),
        to: new Date('2026-01-31'),
        excludedPesajeIds: ['p-1', 'p-2'],
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('debería crear la solicitud y asignar pesajes', async () => {
    const pesajes = [makePesaje('p-1'), makePesaje('p-2')];
    mockPesajeRepo.findPendingPesajesByDateRange.mockResolvedValue(pesajes);
    mockSolicitudRepo.save.mockResolvedValue(undefined);
    mockPesajeRepo.assignToPaymentRequest.mockResolvedValue(undefined);

    const result = await useCase.execute({
      from: new Date('2026-01-01'),
      to: new Date('2026-01-31'),
    });

    expect(result.status).toBe('PAYMENT_REQUESTED');
    expect(mockSolicitudRepo.save).toHaveBeenCalled();
    expect(mockPesajeRepo.assignToPaymentRequest).toHaveBeenCalledWith(
      ['p-1', 'p-2'],
      result.id,
    );
  });

  it('debería excluir pesajes indicados', async () => {
    const pesajes = [makePesaje('p-1'), makePesaje('p-2')];
    mockPesajeRepo.findPendingPesajesByDateRange.mockResolvedValue(pesajes);
    mockSolicitudRepo.save.mockResolvedValue(undefined);
    mockPesajeRepo.assignToPaymentRequest.mockResolvedValue(undefined);

    const result = await useCase.execute({
      from: new Date('2026-01-01'),
      to: new Date('2026-01-31'),
      excludedPesajeIds: ['p-1'],
    });

    expect(mockPesajeRepo.assignToPaymentRequest).toHaveBeenCalledWith(
      ['p-2'],
      result.id,
    );
  });
});
