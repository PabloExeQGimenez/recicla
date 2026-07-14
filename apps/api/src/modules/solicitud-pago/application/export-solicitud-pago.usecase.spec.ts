import { ExportSolicitudPagoUseCase } from './export-solicitud-pago.usecase';
import { SolicitudPagoRepository } from '../domain/solicitud-pago.repository';
import { ExcelExporter } from '../domain/excel-exporter';
import { SolicitudPago } from '../domain/solicitud-pago.entity';
import { SolicitudPagoStatus } from '../domain/solicitud-pago-status.enum';
import { Pesaje } from '../../pesaje/domain/pesaje.entity';
import { PesajeStatus } from '../../pesaje/domain/pesaje-status.enum';
import { PesajeItem } from '../../pesaje/domain/pesaje-item.vo';
import { NotFoundException } from '@nestjs/common';

describe('ExportSolicitudPagoUseCase', () => {
  let useCase: ExportSolicitudPagoUseCase;
  let mockSolicitudRepo: jest.Mocked<SolicitudPagoRepository>;
  let mockExporter: jest.Mocked<ExcelExporter>;

  beforeEach(() => {
    mockSolicitudRepo = { findForExport: jest.fn() } as any;
    mockExporter = { generate: jest.fn() };
    useCase = new ExportSolicitudPagoUseCase(mockSolicitudRepo, mockExporter);
  });

  it('debería lanzar NotFoundException si la solicitud no existe', async () => {
    mockSolicitudRepo.findForExport.mockResolvedValue(null);

    await expect(useCase.execute('sp-1')).rejects.toThrow(NotFoundException);
  });

  it('debería mapear pesajes a filas y generar el excel', async () => {
    const pesaje = new Pesaje({
      id: 'p-1',
      recuperadorId: 'rec-1',
      status: PesajeStatus.PAYMENT_REQUESTED,
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

    const solicitud = new SolicitudPago({
      id: 'sp-1',
      from: new Date('2026-01-01'),
      to: new Date('2026-01-31'),
      status: SolicitudPagoStatus.PAYMENT_REQUESTED,
      createdAt: new Date(),
      pesajes: [pesaje],
    });

    mockSolicitudRepo.findForExport.mockResolvedValue(solicitud);
    mockExporter.generate.mockResolvedValue(Buffer.from('test'));

    const result = await useCase.execute('sp-1');

    expect(result).toBeInstanceOf(Buffer);
    expect(mockExporter.generate).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          compa: 'Juan Pérez',
          dni: '12345678',
          material: 'Cartón',
          kg: 10,
        }),
      ]),
    );
  });
});
