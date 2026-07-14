import { ActivateMaterialUseCase } from './activate-material.usecase';
import { MaterialRepository } from '../domain/material.repository';
import { Material } from '../domain/material.entity';
import { NotFoundException } from '@nestjs/common';

describe('ActivateMaterialUseCase', () => {
  let useCase: ActivateMaterialUseCase;
  let mockRepository: jest.Mocked<MaterialRepository>;

  beforeEach(() => {
    mockRepository = { findById: jest.fn(), update: jest.fn() } as any;
    useCase = new ActivateMaterialUseCase(mockRepository);
  });

  it('debería lanzar NotFoundException si el material no existe', async () => {
    mockRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute('m-1')).rejects.toThrow(NotFoundException);
  });

  it('debería activar el material y guardarlo', async () => {
    const material = new Material({
      id: 'm-1',
      name: 'Cartón',
      currentPrice: 2,
      active: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    mockRepository.findById.mockResolvedValue(material);
    mockRepository.update.mockResolvedValue(undefined);

    const result = await useCase.execute('m-1');

    expect(result.active).toBe(true);
    expect(mockRepository.update).toHaveBeenCalledWith(material);
  });
});
