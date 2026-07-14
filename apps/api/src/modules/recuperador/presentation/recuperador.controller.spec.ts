import { Test, TestingModule } from '@nestjs/testing';
import { RecuperadorController } from './recuperador.controller';
import { CreateRecuperadorUseCase } from '../application/create-recuperador.usecase';
import { GetRecuperadorByIdUseCase } from '../application/get-recuperador-by-id.usecase';
import { GetRecuperadoresUseCase } from '../application/get-recuperadores.usecases';
import { UpdateRecuperadorUseCase } from '../application/update-recuperador.usecase';
import { ActivateRecuperadorUseCase } from '../application/activate-recuperador.usecase';
import { DeactivateRecuperadorUseCase } from '../application/deactivate-recuperador.usecase';
import { Recuperador } from '../domain/recuperador.entity';

describe('RecuperadorController', () => {
  let controller: RecuperadorController;
  let mocks: {
    create: jest.Mocked<CreateRecuperadorUseCase>;
    getById: jest.Mocked<GetRecuperadorByIdUseCase>;
    getAll: jest.Mocked<GetRecuperadoresUseCase>;
    update: jest.Mocked<UpdateRecuperadorUseCase>;
    activate: jest.Mocked<ActivateRecuperadorUseCase>;
    deactivate: jest.Mocked<DeactivateRecuperadorUseCase>;
  };

  const recuperador = new Recuperador({
    id: 'rec-1',
    name: 'Juan',
    lastName: 'Pérez',
    active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  beforeEach(async () => {
    mocks = {
      create: { execute: jest.fn() } as any,
      getById: { execute: jest.fn() } as any,
      getAll: { execute: jest.fn() } as any,
      update: { execute: jest.fn() } as any,
      activate: { execute: jest.fn() } as any,
      deactivate: { execute: jest.fn() } as any,
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecuperadorController],
      providers: [
        { provide: CreateRecuperadorUseCase, useValue: mocks.create },
        { provide: GetRecuperadorByIdUseCase, useValue: mocks.getById },
        { provide: GetRecuperadoresUseCase, useValue: mocks.getAll },
        { provide: UpdateRecuperadorUseCase, useValue: mocks.update },
        { provide: ActivateRecuperadorUseCase, useValue: mocks.activate },
        { provide: DeactivateRecuperadorUseCase, useValue: mocks.deactivate },
      ],
    }).compile();

    controller = module.get(RecuperadorController);
  });

  it('debería estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('debería crear un recuperador', async () => {
      mocks.create.execute.mockResolvedValue(recuperador);

      const result = await controller.create({
        name: 'Juan',
        lastName: 'Pérez',
      });

      expect(result.id).toBe('rec-1');
      expect(result.name).toBe('Juan');
    });
  });

  describe('findById', () => {
    it('debería retornar el recuperador por id', async () => {
      mocks.getById.execute.mockResolvedValue(recuperador);

      const result = await controller.findById({ id: 'rec-1' });

      expect(result.id).toBe('rec-1');
    });
  });

  describe('findAll', () => {
    it('debería retornar recuperadores paginados', async () => {
      mocks.getAll.execute.mockResolvedValue({
        data: [recuperador],
        page: 1,
        limit: 10,
        total: 1,
        totalPages: 1,
      });

      const result = await controller.findAll({ page: 1, limit: 10 });

      expect(result.data).toHaveLength(1);
    });
  });

  describe('update', () => {
    it('debería actualizar el recuperador', async () => {
      const updated = new Recuperador({
        id: 'rec-1',
        name: 'María',
        lastName: 'Pérez',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      mocks.update.execute.mockResolvedValue(updated);

      const result = await controller.update(
        { id: 'rec-1' },
        { name: 'María' },
      );

      expect(result.name).toBe('María');
    });
  });

  describe('activate', () => {
    it('debería activar el recuperador', async () => {
      mocks.activate.execute.mockResolvedValue(recuperador);

      const result = await controller.activate({ id: 'rec-1' });

      expect(result.active).toBe(true);
    });
  });

  describe('deactivate', () => {
    it('debería desactivar el recuperador', async () => {
      const deactivated = new Recuperador({
        id: 'rec-1',
        name: 'Juan',
        lastName: 'Pérez',
        active: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      mocks.deactivate.execute.mockResolvedValue(deactivated);

      const result = await controller.deactivate({ id: 'rec-1' });

      expect(result.active).toBe(false);
    });
  });
});
