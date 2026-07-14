import type { PesajeExcelRow } from './pesaje-excel-row';

export const PDF_EXPORTER = Symbol('PDF_EXPORTER');

export interface PdfExporter {
  generate(rows: PesajeExcelRow[]): Promise<Buffer>;
}
