import { Test, TestingModule } from '@nestjs/testing';
import { SolicitudPagoController } from './solicitud-pago.controller';
import { CreateSolicitudPagoUseCase } from '../application/create-solicitud-pago.usecase';
import { GetSolicitudPagoByIdUseCase } from '../application/get-solicitud-pago-by-id.usecase';
import { GetSolicitudesPagoUseCase } from '../application/get-solicitudes-pago.usecase';
import { ExportSolicitudPagoUseCase } from '../application/export-solicitud-pago.usecase';
import { MarkSolicitudPagoPaidUseCase } from '../application/mark-solicitud-pago-paid.usecase';
import { ExcludePesajesFromSolicitudPagoUseCase } from '../application/exclude-pesajes-from-solicitud-pago.usecase';
import { DeleteSolicitudPagoUseCase } from '../application/delete-solicitud-pago.usecase';
import { SolicitudPago } from '../domain/solicitud-pago.entity';
import { SolicitudPagoStatus } from '../domain/solicitud-pago-status.enum';

describe('SolicitudPagoController', () => {
  let controller: SolicitudPagoController;
  let mocks: {
    create: jest.Mocked<CreateSolicitudPagoUseCase>;
    getById: jest.Mocked<GetSolicitudPagoByIdUseCase>;
    getAll: jest.Mocked<GetSolicitudesPagoUseCase>;
    export: jest.Mocked<ExportSolicitudPagoUseCase>;
    markPaid: jest.Mocked<MarkSolicitudPagoPaidUseCase>;
    exclude: jest.Mocked<ExcludePesajesFromSolicitudPagoUseCase>;
    delete: jest.Mocked<DeleteSolicitudPagoUseCase>;
  };

  const solicitud = new SolicitudPago({
    id: 'sp-1',
    from: new Date('2026-01-01'),
    to: new Date('2026-01-31'),
    status: SolicitudPagoStatus.PAYMENT_REQUESTED,
    createdAt: new Date(),
  });

  beforeEach(async () => {
    mocks = {
      create: { execute: jest.fn() } as any,
      getById: { execute: jest.fn() } as any,
      getAll: { execute: jest.fn() } as any,
      export: { execute: jest.fn() } as any,
      markPaid: { execute: jest.fn() } as any,
      exclude: { execute: jest.fn() } as any,
      delete: { execute: jest.fn() } as any,
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [SolicitudPagoController],
      providers: [
        { provide: CreateSolicitudPagoUseCase, useValue: mocks.create },
        { provide: GetSolicitudPagoByIdUseCase, useValue: mocks.getById },
        { provide: GetSolicitudesPagoUseCase, useValue: mocks.getAll },
        { provide: ExportSolicitudPagoUseCase, useValue: mocks.export },
        { provide: MarkSolicitudPagoPaidUseCase, useValue: mocks.markPaid },
        {
          provide: ExcludePesajesFromSolicitudPagoUseCase,
          useValue: mocks.exclude,
        },
        { provide: DeleteSolicitudPagoUseCase, useValue: mocks.delete },
      ],
    }).compile();

    controller = module.get(SolicitudPagoController);
  });

  it('debería estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('debería crear una solicitud de pago', async () => {
      mocks.create.execute.mockResolvedValue(solicitud);

      const result = await controller.create({
        from: new Date('2026-01-01'),
        to: new Date('2026-01-31'),
      });

      expect(result.id).toBe('sp-1');
      expect(result.status).toBe('PAYMENT_REQUESTED');
    });
  });

  describe('findAll', () => {
    it('debería retornar solicitudes paginadas', async () => {
      mocks.getAll.execute.mockResolvedValue({
        data: [
          {
            id: 'sp-1',
            from: new Date(),
            to: new Date(),
            status: 'PAYMENT_REQUESTED',
            createdAt: new Date(),
            totalAmount: 100,
            itemsCount: 5,
          },
        ],
        page: 1,
        limit: 10,
        total: 1,
        totalPages: 1,
      });

      const result = await controller.findAll('1', '10');

      expect(result.data).toHaveLength(1);
    });
  });

  describe('findById', () => {
    it('debería retornar la solicitud por id', async () => {
      mocks.getById.execute.mockResolvedValue(solicitud);

      const result = await controller.findById({ id: 'sp-1' });

      expect(result.id).toBe('sp-1');
    });
  });

  describe('markAsPaid', () => {
    it('debería marcar la solicitud como pagada', async () => {
      const paid = new SolicitudPago({
        id: 'sp-1',
        from: new Date('2026-01-01'),
        to: new Date('2026-01-31'),
        status: SolicitudPagoStatus.PAID,
        createdAt: new Date(),
      });
      mocks.markPaid.execute.mockResolvedValue(paid);

      const result = await controller.markAsPaid({ id: 'sp-1' });

      expect(result.status).toBe('PAID');
    });
  });

  describe('excludePesajes', () => {
    it('debería excluir pesajes de la solicitud', async () => {
      mocks.exclude.execute.mockResolvedValue(solicitud);

      const result = await controller.excludePesajes(
        { id: 'sp-1' },
        { pesajeIds: ['p-1'] },
      );

      expect(result!.id).toBe('sp-1');
    });

    it('debería retornar null si la solicitud se elimina', async () => {
      mocks.exclude.execute.mockResolvedValue(null);

      const result = await controller.excludePesajes(
        { id: 'sp-1' },
        { pesajeIds: ['p-1', 'p-2'] },
      );

      expect(result).toBeNull();
    });
  });

  describe('export', () => {
    it('debería enviar el buffer con los headers correctos', async () => {
      const buffer = Buffer.from('test');
      mocks.export.execute.mockResolvedValue(buffer);

      const mockResponse = { set: jest.fn(), send: jest.fn() } as any;

      await controller.export({ id: 'sp-1' }, mockResponse);

      expect(mockResponse.set).toHaveBeenCalledWith({
        'Content-Type':
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition':
          'attachment; filename="solicitud-pago-sp-1.xlsx"',
      });
      expect(mockResponse.send).toHaveBeenCalledWith(buffer);
    });
  });

  describe('delete', () => {
    it('debería eliminar la solicitud', async () => {
      mocks.delete.execute.mockResolvedValue(undefined);

      await controller.delete({ id: 'sp-1' });

      expect(mocks.delete.execute).toHaveBeenCalledWith('sp-1');
    });
  });
});
