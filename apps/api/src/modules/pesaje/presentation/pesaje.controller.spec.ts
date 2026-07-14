import { Test, TestingModule } from '@nestjs/testing';
import { PesajeController } from './pesaje.controller';
import { CreatePesajeUseCase } from '../application/create-pesaje.usecase';
import { GetPesajeByIdUseCase } from '../application/get-pesaje-by-id.usecase';
import { GetPesajesUseCase } from '../application/get-pesajes.usecase';
import { DeletePesajeUseCase } from '../application/delete-pesaje.usecase';
import { DeletePesajeItemUseCase } from '../application/delete-pesaje-item.usecase';
import { ExportPesajesExcelUseCase } from '../application/export-pesajes-excel.usecase';
import { ExportPesajesPdfUseCase } from '../application/export-pesajes-pdf.usecase';
import { Pesaje } from '../domain/pesaje.entity';
import { PesajeStatus } from '../domain/pesaje-status.enum';
import { PesajeItem } from '../domain/pesaje-item.vo';

describe('PesajeController', () => {
  let controller: PesajeController;
  let mocks: {
    create: jest.Mocked<CreatePesajeUseCase>;
    getById: jest.Mocked<GetPesajeByIdUseCase>;
    getAll: jest.Mocked<GetPesajesUseCase>;
    delete: jest.Mocked<DeletePesajeUseCase>;
    deleteItem: jest.Mocked<DeletePesajeItemUseCase>;
    exportExcel: jest.Mocked<ExportPesajesExcelUseCase>;
    exportPdf: jest.Mocked<ExportPesajesPdfUseCase>;
  };

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

  beforeEach(async () => {
    mocks = {
      create: { execute: jest.fn() } as any,
      getById: { execute: jest.fn() } as any,
      getAll: { execute: jest.fn() } as any,
      delete: { execute: jest.fn() } as any,
      deleteItem: { execute: jest.fn() } as any,
      exportExcel: { execute: jest.fn() } as any,
      exportPdf: { execute: jest.fn() } as any,
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PesajeController],
      providers: [
        { provide: CreatePesajeUseCase, useValue: mocks.create },
        { provide: GetPesajeByIdUseCase, useValue: mocks.getById },
        { provide: GetPesajesUseCase, useValue: mocks.getAll },
        { provide: DeletePesajeUseCase, useValue: mocks.delete },
        { provide: DeletePesajeItemUseCase, useValue: mocks.deleteItem },
        { provide: ExportPesajesExcelUseCase, useValue: mocks.exportExcel },
        { provide: ExportPesajesPdfUseCase, useValue: mocks.exportPdf },
      ],
    }).compile();

    controller = module.get(PesajeController);
  });

  it('debería estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('debería crear un pesaje', async () => {
      mocks.create.execute.mockResolvedValue(pesaje);

      const result = await controller.create({
        recuperadorId: 'rec-1',
        date: new Date(),
        items: [{ materialId: 'mat-1', weight: 10 }],
      });

      expect(result.id).toBe('p-1');
    });
  });

  describe('findById', () => {
    it('debería retornar el pesaje por id', async () => {
      mocks.getById.execute.mockResolvedValue(pesaje);

      const result = await controller.findById({ id: 'p-1' });

      expect(result.id).toBe('p-1');
    });
  });

  describe('findAll', () => {
    it('debería retornar pesajes paginados', async () => {
      mocks.getAll.execute.mockResolvedValue({
        data: [pesaje],
        page: 1,
        limit: 15,
        total: 1,
        totalPages: 1,
        totalItems: 3,
      });

      const result = await controller.findAll({ page: 1, limit: 15 });

      expect(result.data).toHaveLength(1);
    });
  });

  describe('delete', () => {
    it('debería eliminar el pesaje', async () => {
      mocks.delete.execute.mockResolvedValue(undefined);

      await controller.delete({ id: 'p-1' });

      expect(mocks.delete.execute).toHaveBeenCalledWith('p-1');
    });
  });

  describe('deleteItem', () => {
    it('debería eliminar el item del pesaje', async () => {
      mocks.deleteItem.execute.mockResolvedValue(undefined);

      await controller.deleteItem('item-1');

      expect(mocks.deleteItem.execute).toHaveBeenCalledWith('item-1');
    });
  });

  describe('exportExcel', () => {
    it('debería enviar el buffer con los headers correctos', async () => {
      const buffer = Buffer.from('test');
      mocks.exportExcel.execute.mockResolvedValue(buffer);

      const mockResponse = {
        set: jest.fn(),
        send: jest.fn(),
      } as any;

      await controller.exportExcel({}, mockResponse);

      expect(mockResponse.set).toHaveBeenCalledWith({
        'Content-Type':
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="pesajes.xlsx"',
      });
      expect(mockResponse.send).toHaveBeenCalledWith(buffer);
    });
  });

  describe('exportPdf', () => {
    it('debería enviar el buffer con los headers correctos', async () => {
      const buffer = Buffer.from('pdf test');
      mocks.exportPdf.execute.mockResolvedValue(buffer);

      const mockResponse = {
        set: jest.fn(),
        send: jest.fn(),
      } as any;

      await controller.exportPdf({}, mockResponse);

      expect(mockResponse.set).toHaveBeenCalledWith({
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="pesajes.pdf"',
      });
      expect(mockResponse.send).toHaveBeenCalledWith(buffer);
    });
  });
});
