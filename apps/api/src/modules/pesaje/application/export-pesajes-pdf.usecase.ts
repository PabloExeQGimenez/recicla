import { Injectable, Inject } from '@nestjs/common';
import {
  PESAJE_REPOSITORY,
  type PesajeRepository,
} from '../domain/pesaje.repository';
import { PDF_EXPORTER, type PdfExporter } from '../domain/pdf-exporter';
import type { PesajeExcelRow } from '../domain/pesaje-excel-row';
import type { PesajeFilters } from '../domain/pesaje-filters';

@Injectable()
export class ExportPesajesPdfUseCase {
  constructor(
    @Inject(PESAJE_REPOSITORY)
    private readonly pesajeRepository: PesajeRepository,
    @Inject(PDF_EXPORTER)
    private readonly pdfExporter: PdfExporter,
  ) {}

  async execute(
    filters: Omit<PesajeFilters, 'page' | 'limit'>,
  ): Promise<Buffer> {
    const pesajes = await this.pesajeRepository.findAll({
      ...filters,
      page: 1,
      limit: 10000,
    });

    const rows: PesajeExcelRow[] = pesajes.flatMap((pesaje) =>
      pesaje.items.map((item) => ({
        fecha: pesaje.date,
        recuperador: pesaje.recuperador
          ? `${pesaje.recuperador.name} ${pesaje.recuperador.lastName}`
          : '',
        dni: pesaje.recuperador?.dni ?? '',
        material: item.material?.name ?? '',
        kg: item.weight,
        precioUnitario: item.pricePerKgAtMoment,
        monto: item.subtotal,
        pago: pesaje.status,
      })),
    );

    return this.pdfExporter.generate(rows);
  }
}
