import { ChangeMaterialPriceUseCase } from './change-material-price.usecase';
import { MaterialRepository } from '../domain/material.repository';
import { Material } from '../domain/material.entity';
import { NotFoundException } from '@nestjs/common';

describe('ChangeMaterialPriceUseCase', () => {
  let useCase: ChangeMaterialPriceUseCase;
  let mockRepository: jest.Mocked<MaterialRepository>;

  beforeEach(() => {
    mockRepository = { findById: jest.fn(), update: jest.fn() } as any;
    useCase = new ChangeMaterialPriceUseCase(mockRepository);
  });

  it('debería lanzar NotFoundException si el material no existe', async () => {
    mockRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute('m-1', { currentPrice: 5 })).rejects.toThrow(
      NotFoundException,
    );
  });

  it('debería actualizar el precio y guardar', async () => {
    const material = new Material({
      id: 'm-1',
      name: 'Cartón',
      currentPrice: 2,
      active: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    mockRepository.findById.mockResolvedValue(material);
    mockRepository.update.mockResolvedValue(undefined);

    const result = await useCase.execute('m-1', { currentPrice: 5 });

    expect(result.currentPrice).toBe(5);
    expect(mockRepository.update).toHaveBeenCalledWith(material);
  });
});
