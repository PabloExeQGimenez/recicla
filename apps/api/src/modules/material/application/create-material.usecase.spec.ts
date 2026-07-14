import { CreateMaterialUseCase } from './create-material.usecase';
import { MaterialRepository } from '../domain/material.repository';
import { ConflictException } from '@nestjs/common';

describe('CreateMaterialUseCase', () => {
  let useCase: CreateMaterialUseCase;
  let mockRepository: jest.Mocked<MaterialRepository>;

  beforeEach(() => {
    mockRepository = { findByName: jest.fn(), save: jest.fn() } as any;
    useCase = new CreateMaterialUseCase(mockRepository);
  });

  it('debería lanzar ConflictException si ya existe un material con ese nombre', async () => {
    mockRepository.findByName.mockResolvedValue({
      id: 'm-1',
      name: 'Cartón',
    } as any);

    await expect(
      useCase.execute({ name: 'Cartón', currentPrice: 2 }),
    ).rejects.toThrow(ConflictException);
    await expect(
      useCase.execute({ name: 'Cartón', currentPrice: 2 }),
    ).rejects.toThrow('Ya existe un material con ese nombre');
  });

  it('debería crear y guardar el material correctamente', async () => {
    mockRepository.findByName.mockResolvedValue(null);
    mockRepository.save.mockResolvedValue(undefined);

    const result = await useCase.execute({ name: 'Cartón', currentPrice: 2 });

    expect(result.name).toBe('Cartón');
    expect(result.currentPrice).toBe(2);
    expect(result.active).toBe(true);
    expect(mockRepository.save).toHaveBeenCalled();
  });
});
