import { GetMaterialByIdUseCase } from './get-material-by-id.usecase';
import { MaterialRepository } from '../domain/material.repository';
import { Material } from '../domain/material.entity';
import { NotFoundException } from '@nestjs/common';

describe('GetMaterialByIdUseCase', () => {
  let useCase: GetMaterialByIdUseCase;
  let mockRepository: jest.Mocked<MaterialRepository>;

  beforeEach(() => {
    mockRepository = { findById: jest.fn() } as any;
    useCase = new GetMaterialByIdUseCase(mockRepository);
  });

  it('debería lanzar NotFoundException si el material no existe', async () => {
    mockRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute('m-1')).rejects.toThrow(NotFoundException);
    await expect(useCase.execute('m-1')).rejects.toThrow(
      'El material no existe',
    );
  });

  it('debería retornar el material si existe', async () => {
    const material = new Material({
      id: 'm-1',
      name: 'Cartón',
      currentPrice: 2,
      active: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    mockRepository.findById.mockResolvedValue(material);

    const result = await useCase.execute('m-1');

    expect(result.id).toBe('m-1');
    expect(result.name).toBe('Cartón');
  });
});
