import { Injectable } from '@nestjs/common';
import ExcelJS from 'exceljs';
import { ExcelExporter } from '../../domain/excel-exporter';
import type { PesajeExcelRow } from '../../domain/pesaje-excel-row';

@Injectable()
export class ExcelJsExporter implements ExcelExporter {
  async generate(rows: PesajeExcelRow[]): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Pesajes');

    worksheet.columns = [
      { header: 'FECHA', key: 'fecha', width: 15 },
      { header: 'RECUPERADOR', key: 'recuperador', width: 30 },
      { header: 'DNI', key: 'dni', width: 15 },
      { header: 'MATERIAL', key: 'material', width: 20 },
      { header: 'KG', key: 'kg', width: 10 },
      { header: 'PRECIO UNITARIO', key: 'precioUnitario', width: 18 },
      { header: 'MONTO', key: 'monto', width: 15 },
      { header: 'PAGO', key: 'pago', width: 15 },
    ];

    rows.forEach((row) => {
      worksheet.addRow({
        fecha: `${row.fecha.toISOString().slice(8, 10)}/${row.fecha.toISOString().slice(5, 7)}/${row.fecha.toISOString().slice(0, 4)}`,
        recuperador: row.recuperador,
        dni: row.dni,
        material: row.material,
        kg: `${row.kg} Kg`,
        precioUnitario: `$${row.precioUnitario}`,
        monto: `$${row.monto}`,
        pago: row.pago,
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }
}
