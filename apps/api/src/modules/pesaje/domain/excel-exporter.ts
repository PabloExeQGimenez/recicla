import type { PesajeExcelRow } from './pesaje-excel-row';

export const EXCEL_EXPORTER = Symbol('EXCEL_EXPORTER');

export interface ExcelExporter {
  generate(rows: PesajeExcelRow[]): Promise<Buffer>;
}
