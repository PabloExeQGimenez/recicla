import { SolicitudPago } from './solicitud-pago.entity';
import { SolicitudPagoExportData } from './solicitud-pago-export-data';
import { SolicitudPagoFilters } from './solicitud-pago-filter';

export const SOLICITUD_PAGO_REPOSITORY = Symbol('SOLICITUD_PAGO_REPOSITORY');

export interface SolicitudPagoRepository {
  save(solicitudPago: SolicitudPago): Promise<void>;
  findById(id: string): Promise<SolicitudPago | null>;
  findAll(): Promise<SolicitudPago[]>;
  findAllWithPesajes(
    filters: SolicitudPagoFilters,
  ): Promise<{ solicitudes: SolicitudPago[]; total: number }>;
  findForExport(id: string): Promise<SolicitudPagoExportData | null>;
  update(solicitudPago: SolicitudPago): Promise<void>;
  delete(id: string): Promise<void>;
}
