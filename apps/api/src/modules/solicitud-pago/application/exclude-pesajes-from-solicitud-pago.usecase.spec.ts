import { ExcludePesajesFromSolicitudPagoUseCase } from './exclude-pesajes-from-solicitud-pago.usecase';
import { SolicitudPagoRepository } from '../domain/solicitud-pago.repository';
import { PesajeRepository } from 'src/modules/pesaje/domain/pesaje.repository';
import { SolicitudPago } from '../domain/solicitud-pago.entity';
import { SolicitudPagoStatus } from '../domain/solicitud-pago-status.enum';
import { Pesaje } from 'src/modules/pesaje/domain/pesaje.entity';
import { PesajeStatus } from 'src/modules/pesaje/domain/pesaje-status.enum';
import { PesajeItem } from 'src/modules/pesaje/domain/pesaje-item.vo';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('ExcludePesajesFromSolicitudPagoUseCase', () => {
  let useCase: ExcludePesajesFromSolicitudPagoUseCase;
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
    useCase = new ExcludePesajesFromSolicitudPagoUseCase(
      mockSolicitudRepo,
      mockPesajeRepo,
    );
  });

  it('debería lanzar NotFoundException si la solicitud no existe', async () => {
    mockSolicitudRepo.findById.mockResolvedValue(null);

    await expect(useCase.execute('sp-1', ['p-1'])).rejects.toThrow(
      NotFoundException,
    );
  });

  it('debería lanzar BadRequestException si el estado no es PAYMENT_REQUESTED', async () => {
    const solicitud = new SolicitudPago({
      id: 'sp-1',
      from: new Date('2026-01-01'),
      to: new Date('2026-01-31'),
      status: SolicitudPagoStatus.PAID,
      createdAt: new Date(),
      pesajes: [makePesaje('p-1')],
    });
    mockSolicitudRepo.findById.mockResolvedValue(solicitud);

    await expect(useCase.execute('sp-1', ['p-1'])).rejects.toThrow(
      BadRequestException,
    );
    await expect(useCase.execute('sp-1', ['p-1'])).rejects.toThrow(
      'Solo se pueden excluir pesajes de solicitudes con estado "solicitado"',
    );
  });

  it('debería lanzar BadRequestException si los pesajes no pertenecen a la solicitud', async () => {
    const solicitud = new SolicitudPago({
      id: 'sp-1',
      from: new Date('2026-01-01'),
      to: new Date('2026-01-31'),
      status: SolicitudPagoStatus.PAYMENT_REQUESTED,
      createdAt: new Date(),
      pesajes: [makePesaje('p-1')],
    });
    mockSolicitudRepo.findById.mockResolvedValue(solicitud);

    await expect(useCase.execute('sp-1', ['p-99'])).rejects.toThrow(
      BadRequestException,
    );
    await expect(useCase.execute('sp-1', ['p-99'])).rejects.toThrow(
      'Los pesajes p-99 no pertenecen a esta solicitud',
    );
  });

  it('debería eliminar la solicitud si se excluyen todos los pesajes', async () => {
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

    const result = await useCase.execute('sp-1', ['p-1', 'p-2']);

    expect(result).toBeNull();
    expect(mockPesajeRepo.removeFromPaymentRequest).toHaveBeenCalledWith([
      'p-1',
      'p-2',
    ]);
    expect(mockSolicitudRepo.delete).toHaveBeenCalledWith('sp-1');
  });

  it('debería retornar la solicitud actualizada si quedan pesajes', async () => {
    const solicitud = new SolicitudPago({
      id: 'sp-1',
      from: new Date('2026-01-01'),
      to: new Date('2026-01-31'),
      status: SolicitudPagoStatus.PAYMENT_REQUESTED,
      createdAt: new Date(),
      pesajes: [makePesaje('p-1'), makePesaje('p-2')],
    });

    const updatedSolicitud = new SolicitudPago({
      id: 'sp-1',
      from: new Date('2026-01-01'),
      to: new Date('2026-01-31'),
      status: SolicitudPagoStatus.PAYMENT_REQUESTED,
      createdAt: new Date(),
      pesajes: [makePesaje('p-2')],
    });

    mockSolicitudRepo.findById
      .mockResolvedValueOnce(solicitud)
      .mockResolvedValueOnce(updatedSolicitud);
    mockPesajeRepo.removeFromPaymentRequest.mockResolvedValue(undefined);

    const result = await useCase.execute('sp-1', ['p-1']);

    expect(result).not.toBeNull();
    expect(result!.pesajes).toHaveLength(1);
    expect(mockSolicitudRepo.delete).not.toHaveBeenCalled();
  });
});
