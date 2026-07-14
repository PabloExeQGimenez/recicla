import { GetMaterialesUseCase } from './get-materiales.usecase';
import { MaterialRepository } from '../domain/material.repository';
import { Material } from '../domain/material.entity';

describe('GetMaterialesUseCase', () => {
  let useCase: GetMaterialesUseCase;
  let mockRepository: jest.Mocked<MaterialRepository>;

  beforeEach(() => {
    mockRepository = { findAll: jest.fn() } as any;
    useCase = new GetMaterialesUseCase(mockRepository);
  });

  it('debería retornar la lista de materiales', async () => {
    const materials = [
      new Material({
        id: 'm-1',
        name: 'Cartón',
        currentPrice: 2,
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
      new Material({
        id: 'm-2',
        name: 'Plástico',
        currentPrice: 3,
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    ];

    mockRepository.findAll.mockResolvedValue(materials);

    const result = await useCase.execute();

    expect(result).toHaveLength(2);
    expect(mockRepository.findAll).toHaveBeenCalledWith(undefined);
  });

  it('debería pasar el filtro active al repository', async () => {
    mockRepository.findAll.mockResolvedValue([]);

    await useCase.execute(true);

    expect(mockRepository.findAll).toHaveBeenCalledWith(true);
  });
});
