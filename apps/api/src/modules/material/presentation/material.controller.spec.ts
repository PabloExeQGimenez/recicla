import { Test, TestingModule } from '@nestjs/testing';
import { MaterialController } from './material.controller';
import { CreateMaterialUseCase } from '../application/create-material.usecase';
import { GetMaterialByIdUseCase } from '../application/get-material-by-id.usecase';
import { GetMaterialesUseCase } from '../application/get-materiales.usecase';
import { ChangeMaterialPriceUseCase } from '../application/change-material-price.usecase';
import { ActivateMaterialUseCase } from '../application/activate-material.usecase';
import { DeactivateMaterialUseCase } from '../application/deactivate-material.usecase';
import { Material } from '../domain/material.entity';

describe('MaterialController', () => {
  let controller: MaterialController;
  let mockCreate: jest.Mocked<CreateMaterialUseCase>;
  let mockGetById: jest.Mocked<GetMaterialByIdUseCase>;
  let mockGetAll: jest.Mocked<GetMaterialesUseCase>;
  let mockChangePrice: jest.Mocked<ChangeMaterialPriceUseCase>;
  let mockActivate: jest.Mocked<ActivateMaterialUseCase>;
  let mockDeactivate: jest.Mocked<DeactivateMaterialUseCase>;

  const material = new Material({
    id: 'm-1',
    name: 'Cartón',
    currentPrice: 2,
    active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  beforeEach(async () => {
    mockCreate = { execute: jest.fn() } as any;
    mockGetById = { execute: jest.fn() } as any;
    mockGetAll = { execute: jest.fn() } as any;
    mockChangePrice = { execute: jest.fn() } as any;
    mockActivate = { execute: jest.fn() } as any;
    mockDeactivate = { execute: jest.fn() } as any;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [MaterialController],
      providers: [
        { provide: CreateMaterialUseCase, useValue: mockCreate },
        { provide: GetMaterialByIdUseCase, useValue: mockGetById },
        { provide: GetMaterialesUseCase, useValue: mockGetAll },
        { provide: ChangeMaterialPriceUseCase, useValue: mockChangePrice },
        { provide: ActivateMaterialUseCase, useValue: mockActivate },
        { provide: DeactivateMaterialUseCase, useValue: mockDeactivate },
      ],
    }).compile();

    controller = module.get(MaterialController);
  });

  it('debería estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('debería crear un material y retornar el DTO', async () => {
      mockCreate.execute.mockResolvedValue(material);

      const result = await controller.create({
        name: 'Cartón',
        currentPrice: 2,
      });

      expect(result.id).toBe('m-1');
      expect(result.name).toBe('Cartón');
      expect(mockCreate.execute).toHaveBeenCalledWith({
        name: 'Cartón',
        currentPrice: 2,
      });
    });
  });

  describe('findById', () => {
    it('debería retornar el material por id', async () => {
      mockGetById.execute.mockResolvedValue(material);

      const result = await controller.findById({ id: 'm-1' });

      expect(result.id).toBe('m-1');
      expect(mockGetById.execute).toHaveBeenCalledWith('m-1');
    });
  });

  describe('findAll', () => {
    it('debería retornar la lista de materiales', async () => {
      mockGetAll.execute.mockResolvedValue([material]);

      const result = await controller.findAll({ active: undefined });

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Cartón');
    });
  });

  describe('changePrice', () => {
    it('debería cambiar el precio del material', async () => {
      const updated = new Material({
        id: 'm-1',
        name: 'Cartón',
        currentPrice: 5,
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      mockChangePrice.execute.mockResolvedValue(updated);

      const result = await controller.changePrice(
        { id: 'm-1' },
        { currentPrice: 5 },
      );

      expect(result.currentPrice).toBe(5);
    });
  });

  describe('activate', () => {
    it('debería activar el material', async () => {
      const activated = new Material({
        id: 'm-1',
        name: 'Cartón',
        currentPrice: 2,
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      mockActivate.execute.mockResolvedValue(activated);

      const result = await controller.activate({ id: 'm-1' });

      expect(result.active).toBe(true);
    });
  });

  describe('deactivate', () => {
    it('debería desactivar el material', async () => {
      const deactivated = new Material({
        id: 'm-1',
        name: 'Cartón',
        currentPrice: 2,
        active: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      mockDeactivate.execute.mockResolvedValue(deactivated);

      const result = await controller.deactivate({ id: 'm-1' });

      expect(result.active).toBe(false);
    });
  });
});
