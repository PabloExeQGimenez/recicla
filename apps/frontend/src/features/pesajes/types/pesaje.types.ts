import type {
  PesajeResponse,
  PesajeItemResponse,
  RecuperadorRef,
  MaterialRef,
  CreatePesaje,
  CreatePesajeItem,
} from "@recicla/shared";

export type PesajePago = "pendiente" | "solicitado" | "pagado";

export type RecuperadorOption = {
  id: string;
  label: string;
  dni?: string | null;
};

export type MaterialRefAPI = MaterialRef;
export type RecuperadorRefAPI = RecuperadorRef;
export type PesajeItemResponseDTO = PesajeItemResponse;
export type PesajeAPIResponse = PesajeResponse;

export interface MaterialRefDTO {
  id: string;
  nombre: string;
}

export interface RecuperadorRefDTO {
  id: string;
  nombre: string;
  apellido: string;
}

export interface PesajeDTO {
  id: string;
  itemId: string;
  recuperador: RecuperadorRefDTO;
  material: MaterialRefDTO;
  cantidad: number;
  precio: number;
  monto: number;
  fecha: string;
  pago: PesajePago;
}

export interface PesajeListMeta {
  pagina: number;
  total: number;
  totalItems: number;
  limite: number;
  paginasTotales: number;
}

export interface PesajeListResponseDTO {
  data: PesajeDTO[];
  meta: PesajeListMeta;
}

export interface PesajeQueryDTO {
  recuperadorId?: string;
  materialId?: string;
  pago?: PesajePago;
  fechaDesde?: string;
  fechaHasta?: string;
  pagina?: number;
  limite?: number;
}

export type CreatePesajeItemDTO = CreatePesajeItem;
export type CreatePesajeDTO = CreatePesaje;
