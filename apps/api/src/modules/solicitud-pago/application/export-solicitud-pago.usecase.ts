import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import {
  SOLICITUD_PAGO_REPOSITORY,
  type SolicitudPagoRepository,
} from '../domain/solicitud-pago.repository';
import { EXCEL_EXPORTER, type ExcelExporter } from '../domain/excel-exporter';

@Injectable()
export class ExportSolicitudPagoUseCase {
  constructor(
    @Inject(SOLICITUD_PAGO_REPOSITORY)
    private readonly solicitudPagoRepository: SolicitudPagoRepository,
    @Inject(EXCEL_EXPORTER)
    private readonly excelExporter: ExcelExporter,
  ) {}

  async execute(id: string): Promise<Buffer> {
    const solicitudPago = await this.solicitudPagoRepository.findForExport(id);
    if (!solicitudPago) {
      throw new NotFoundException('No existe la solicitud de pago');
    }

    const rows = solicitudPago.pesajes.flatMap((pesaje) =>
      pesaje.items.map((item) => ({
        fecha: pesaje.createdAt,
        ruta: '',
        bolson: '',
        compa: `${pesaje.recuperador.name} ${pesaje.recuperador.lastName}`,
        dni: pesaje.recuperador.dni ?? '',
        cuil: pesaje.recuperador.cuil ?? '',
        material: item.material.name,
        kg: item.weight,
        observaciones: '',
        cuenta: '',
      })),
    );

    return this.excelExporter.generate(rows);
  }
}
