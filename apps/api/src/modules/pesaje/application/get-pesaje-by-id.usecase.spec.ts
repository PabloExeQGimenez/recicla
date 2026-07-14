import { GetPesajeByIdUseCase } from './get-pesaje-by-id.usecase';
import { PesajeRepository } from '../domain/pesaje.repository';
import { Pesaje } from '../domain/pesaje.entity';
import { PesajeStatus } from '../domain/pesaje-status.enum';
import { PesajeItem } from '../domain/pesaje-item.vo';
import { NotFoundException } from '@nestjs/common';

describe('GetPesajeByIdUseCase', () => {
  let useCase: GetPesajeByIdUseCase;
  let mockRepository: jest.Mocked<PesajeRepository>;

  beforeEach(() => {
    mockRepository = { findById: jest.fn() } as any;
    useCase = new GetPesajeByIdUseCase(mockRepository);
  });

  it('debería lanzar NotFoundException si el pesaje no existe', async () => {
    mockRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute('p-1')).rejects.toThrow(NotFoundException);
    await expect(useCase.execute('p-1')).rejects.toThrow('El pesaje no existe');
  });

  it('debería retornar el pesaje si existe', async () => {
    const pesaje = new Pesaje({
      id: 'p-1',
      recuperadorId: 'rec-1',
      status: PesajeStatus.PENDING,
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

    mockRepository.findById.mockResolvedValue(pesaje);

    const result = await useCase.execute('p-1');

    expect(result.id).toBe('p-1');
  });
});
