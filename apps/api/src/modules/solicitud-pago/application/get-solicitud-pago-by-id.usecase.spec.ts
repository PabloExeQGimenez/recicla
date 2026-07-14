import { GetSolicitudPagoByIdUseCase } from './get-solicitud-pago-by-id.usecase';
import { SolicitudPagoRepository } from '../domain/solicitud-pago.repository';
import { SolicitudPago } from '../domain/solicitud-pago.entity';
import { SolicitudPagoStatus } from '../domain/solicitud-pago-status.enum';
import { NotFoundException } from '@nestjs/common';

describe('GetSolicitudPagoByIdUseCase', () => {
  let useCase: GetSolicitudPagoByIdUseCase;
  let mockRepository: jest.Mocked<SolicitudPagoRepository>;

  beforeEach(() => {
    mockRepository = { findById: jest.fn() } as any;
    useCase = new GetSolicitudPagoByIdUseCase(mockRepository);
  });

  it('debería lanzar NotFoundException si la solicitud no existe', async () => {
    mockRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute('sp-1')).rejects.toThrow(NotFoundException);
    await expect(useCase.execute('sp-1')).rejects.toThrow(
      'No existe la solicitud de pesaje',
    );
  });

  it('debería retornar la solicitud si existe', async () => {
    const solicitud = new SolicitudPago({
      id: 'sp-1',
      from: new Date('2026-01-01'),
      to: new Date('2026-01-31'),
      status: SolicitudPagoStatus.PAYMENT_REQUESTED,
      createdAt: new Date(),
    });

    mockRepository.findById.mockResolvedValue(solicitud);

    const result = await useCase.execute('sp-1');

    expect(result.id).toBe('sp-1');
  });
});
