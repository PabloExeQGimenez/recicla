import { Injectable } from '@nestjs/common';
import { PdfExporter } from '../../domain/pdf-exporter';
import type { PesajeExcelRow } from '../../domain/pesaje-excel-row';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class JsPdfExporter implements PdfExporter {
  async generate(rows: PesajeExcelRow[]): Promise<Buffer> {
    const doc = new jsPDF('l', 'mm', 'a4');

    const logoPath = path.resolve(__dirname, '../../../../../assets/logo.png');
    if (fs.existsSync(logoPath)) {
      const logoData = await fs.promises.readFile(logoPath);
      const logoBase64 = logoData.toString('base64');
      doc.addImage(
        `data:image/png;base64,${logoBase64}`,
        'PNG',
        10,
        10,
        20,
        20,
      );
    }

    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Recicladores del Paraná', 35, 18);

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Reporte de Pesajes', 35, 26);

    doc.setFontSize(9);
    doc.text(
      `Fecha de generación: ${new Date().toLocaleDateString('es-AR')}`,
      35,
      33,
    );

    const tableData = rows.map((row) => [
      `${row.fecha.toISOString().slice(8, 10)}/${row.fecha.toISOString().slice(5, 7)}/${row.fecha.toISOString().slice(0, 4)}`,
      row.recuperador,
      row.dni,
      row.material,
      `${row.kg} Kg`,
      `$${row.precioUnitario}`,
      `$${row.monto}`,
      row.pago,
    ]);

    autoTable(doc, {
      startY: 38,
      head: [
        [
          'FECHA',
          'RECUPERADOR',
          'DNI',
          'MATERIAL',
          'KG',
          'PRECIO UNITARIO',
          'MONTO',
          'PAGO',
        ],
      ],
      body: tableData,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [34, 139, 34] },
    });

    const buffer = Buffer.from(doc.output('arraybuffer'));
    return buffer;
  }
}
