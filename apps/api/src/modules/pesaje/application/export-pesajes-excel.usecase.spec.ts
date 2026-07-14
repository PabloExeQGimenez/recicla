import { ExportPesajesExcelUseCase } from './export-pesajes-excel.usecase';
import { PesajeRepository } from '../domain/pesaje.repository';
import { ExcelExporter } from '../domain/excel-exporter';
import { Pesaje } from '../domain/pesaje.entity';
import { PesajeStatus } from '../domain/pesaje-status.enum';
import { PesajeItem } from '../domain/pesaje-item.vo';

describe('ExportPesajesExcelUseCase', () => {
  let useCase: ExportPesajesExcelUseCase;
  let mockPesajeRepo: jest.Mocked<PesajeRepository>;
  let mockExporter: jest.Mocked<ExcelExporter>;

  beforeEach(() => {
    mockPesajeRepo = { findAll: jest.fn() } as any;
    mockExporter = { generate: jest.fn() };
    useCase = new ExportPesajesExcelUseCase(mockPesajeRepo, mockExporter);
  });

  it('debería buscar todos los pesajes y generar el excel', async () => {
    const pesaje = new Pesaje({
      id: 'p-1',
      recuperadorId: 'rec-1',
      status: PesajeStatus.PENDING,
      items: [
        new PesajeItem({
          materialId: 'mat-1',
          weight: 10,
          pricePerKgAtMoment: 2,
          material: { id: 'mat-1', name: 'Cartón' },
        }),
      ],
      date: new Date('2026-01-15'),
      createdAt: new Date('2026-01-15'),
      updatedAt: new Date('2026-01-15'),
      recuperador: {
        id: 'rec-1',
        name: 'Juan',
        lastName: 'Pérez',
        dni: '12345678',
      },
    });

    mockPesajeRepo.findAll.mockResolvedValue([pesaje]);
    mockExporter.generate.mockResolvedValue(Buffer.from('test'));

    const result = await useCase.execute({});

    expect(result).toBeInstanceOf(Buffer);
    expect(mockPesajeRepo.findAll).toHaveBeenCalledWith({
      page: 1,
      limit: 10000,
    });
    expect(mockExporter.generate).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          recuperador: 'Juan Pérez',
          dni: '12345678',
          material: 'Cartón',
          kg: 10,
          monto: 20,
        }),
      ]),
    );
  });

  it('debería manejar pesajes sin recuperador', async () => {
    const pesaje = new Pesaje({
      id: 'p-1',
      recuperadorId: 'rec-1',
      status: PesajeStatus.PENDING,
      items: [
        new PesajeItem({
          materialId: 'mat-1',
          weight: 5,
          pricePerKgAtMoment: 3,
        }),
      ],
      date: new Date('2026-01-15'),
      createdAt: new Date('2026-01-15'),
      updatedAt: new Date('2026-01-15'),
    });

    mockPesajeRepo.findAll.mockResolvedValue([pesaje]);
    mockExporter.generate.mockResolvedValue(Buffer.from('test'));

    await useCase.execute({});

    expect(mockExporter.generate).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          recuperador: '',
          dni: '',
        }),
      ]),
    );
  });
});
