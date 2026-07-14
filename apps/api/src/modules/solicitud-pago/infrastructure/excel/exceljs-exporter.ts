import { Injectable } from '@nestjs/common';
import ExcelJS from 'exceljs';
import { ExcelExporter } from '../../domain/excel-exporter';
import type { SolicitudPagoExcelRow } from '../../domain/solicitud-pago-excel-row';

@Injectable()
export class ExcelJsExporter implements ExcelExporter {
  async generate(rows: SolicitudPagoExcelRow[]): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();

    const worksheet = workbook.addWorksheet('SolicitudPago');

    worksheet.columns = [
      { header: 'FECHA', key: 'fecha', width: 15 },
      { header: 'RUTA', key: 'ruta', width: 15 },
      { header: 'BOLSON', key: 'bolson', width: 15 },
      { header: 'COMPA', key: 'compa', width: 30 },
      { header: 'DNI', key: 'dni', width: 15 },
      { header: 'CUIL', key: 'cuil', width: 20 },
      { header: 'MATERIAL', key: 'material', width: 20 },
      { header: 'KG', key: 'kg', width: 10 },
      { header: 'OBSERVACIONES', key: 'observaciones', width: 30 },
      { header: 'CUENTA', key: 'cuenta', width: 20 },
    ];

    worksheet.addRows(rows);

    const buffer = await workbook.xlsx.writeBuffer();

    return Buffer.from(buffer);
  }
}
