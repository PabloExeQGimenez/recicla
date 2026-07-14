import { SolicitudPagoExcelRow } from './solicitud-pago-excel-row';

export const EXCEL_EXPORTER = Symbol('EXCEL_EXPORTER');

export interface ExcelExporter {
  generate(rows: SolicitudPagoExcelRow[]): Promise<Buffer>;
}
