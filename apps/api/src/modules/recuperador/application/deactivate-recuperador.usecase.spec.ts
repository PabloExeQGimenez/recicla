import { DeactivateRecuperadorUseCase } from './deactivate-recuperador.usecase';
import { RecuperadorRepository } from '../domain/recuperador.repository';
import { Recuperador } from '../domain/recuperador.entity';
import { NotFoundException } from '@nestjs/common';

describe('DeactivateRecuperadorUseCase', () => {
  let useCase: DeactivateRecuperadorUseCase;
  let mockRepository: jest.Mocked<RecuperadorRepository>;

  beforeEach(() => {
    mockRepository = { findById: jest.fn(), update: jest.fn() } as any;
    useCase = new DeactivateRecuperadorUseCase(mockRepository);
  });

  it('debería lanzar NotFoundException si el recuperador no existe', async () => {
    mockRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute('rec-1')).rejects.toThrow(NotFoundException);
  });

  it('debería desactivar el recuperador y guardarlo', async () => {
    const recuperador = new Recuperador({
      id: 'rec-1',
      name: 'Juan',
      lastName: 'Pérez',
      active: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    mockRepository.findById.mockResolvedValue(recuperador);
    mockRepository.update.mockResolvedValue(undefined);

    const result = await useCase.execute('rec-1');

    expect(result.active).toBe(false);
    expect(mockRepository.update).toHaveBeenCalledWith(recuperador);
  });
});
