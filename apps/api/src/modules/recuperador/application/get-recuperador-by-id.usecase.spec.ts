import { GetRecuperadorByIdUseCase } from './get-recuperador-by-id.usecase';
import { RecuperadorRepository } from '../domain/recuperador.repository';
import { Recuperador } from '../domain/recuperador.entity';
import { NotFoundException } from '@nestjs/common';

describe('GetRecuperadorByIdUseCase', () => {
  let useCase: GetRecuperadorByIdUseCase;
  let mockRepository: jest.Mocked<RecuperadorRepository>;

  beforeEach(() => {
    mockRepository = { findById: jest.fn() } as any;
    useCase = new GetRecuperadorByIdUseCase(mockRepository);
  });

  it('debería lanzar NotFoundException si el recuperador no existe', async () => {
    mockRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute('rec-1')).rejects.toThrow(NotFoundException);
    await expect(useCase.execute('rec-1')).rejects.toThrow(
      'Recuperador no encontrado',
    );
  });

  it('debería retornar el recuperador si existe', async () => {
    const recuperador = new Recuperador({
      id: 'rec-1',
      name: 'Juan',
      lastName: 'Pérez',
      active: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    mockRepository.findById.mockResolvedValue(recuperador);

    const result = await useCase.execute('rec-1');

    expect(result.id).toBe('rec-1');
    expect(result.name).toBe('Juan');
  });
});
