import type {
  SolicitudPago as SolicitudPagoBase,
  SolicitudPagoListItem as SolicitudPagoListItemBase,
  SolicitudPagoDetail as SolicitudPagoDetailBase,
  CreateSolicitudPago,
  PesajeResponse,
  PesajeItemResponse,
  PaginatedResponse as PaginatedResponseBase,
} from "@recicla/shared";

export type { SolicitudPagoStatus } from "@recicla/shared";

export type CreateSolicitudPagoDTO = CreateSolicitudPago;

export type SolicitudPago = SolicitudPagoBase;

export type PesajePreviewItem = {
  id: string;
  itemId: string;
  recuperador: { id: string; nombre: string; apellido: string; dni?: string };
  material: { id: string; nombre: string };
  cantidad: number;
  precio: number;
  monto: number;
  fecha: string;
};

export type SolicitudPagoPreviewResumen = {
  cantidadRecuperadores: number;
  cantidadItems: number;
  totalAPagar: number;
};

export type SolicitudPagoPreview = {
  pesajes: PesajePreviewItem[];
  resumen: SolicitudPagoPreviewResumen;
};

export type SolicitudPagoListItem = SolicitudPagoListItemBase;

export type PaginatedResponse<T> = PaginatedResponseBase<T>;

export type PesajeItemDetail = PesajeItemResponse;

export type PesajeDetail = PesajeResponse;

export type SolicitudPagoDetail = SolicitudPagoDetailBase;
