import { apiFetch, apiFetchBlob } from "../../../shared/lib/api";

import type {
  PesajeListResponseDTO,
  CreatePesajeDTO,
  PesajeDTO,
  PesajeQueryDTO,
  PesajeAPIResponse,
  PesajePago,
} from "../types/pesaje.types";

import { flattenPesaje } from "../mappers/pesaje.mapper";

interface PaginatedAPIResponse<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  totalItems?: number;
}

const PAGO_TO_STATUS: Record<PesajePago, string> = {
  pendiente: "PENDING",
  solicitado: "PAYMENT_REQUESTED",
  pagado: "PAID",
};

const buildFilterParams = (query: PesajeQueryDTO): URLSearchParams => {
  const params = new URLSearchParams();

  if (query.recuperadorId) params.set("recuperadorId", query.recuperadorId);
  if (query.materialId) params.set("materialId", query.materialId);
  if (query.pago) params.set("status", PAGO_TO_STATUS[query.pago]);
  if (query.fechaDesde) params.set("from", query.fechaDesde);
  if (query.fechaHasta) params.set("to", query.fechaHasta);

  return params;
};

export const pesajesService = {
  async list(query: PesajeQueryDTO): Promise<PesajeListResponseDTO> {
    const params = buildFilterParams(query);
    params.set("page", (query.pagina ?? 1).toString());
    params.set("limit", (query.limite ?? 10).toString());

    const response = await apiFetch<PaginatedAPIResponse<PesajeAPIResponse>>(`/pesajes?${params.toString()}`);

    const data = response.data.flatMap(flattenPesaje);

    return {
      data,
      meta: {
        pagina: response.page,
        limite: response.limit,
        total: response.total,
        totalItems: response.totalItems ?? data.length,
        paginasTotales: response.totalPages,
      },
    };
  },

  async create(payload: CreatePesajeDTO): Promise<PesajeDTO> {
    const response = await apiFetch<PesajeAPIResponse>("/pesajes", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    const items = flattenPesaje(response);
    return items[0];
  },

  async delete(id: string): Promise<void> {
    return apiFetch<void>(`/pesajes/${id}`, {
      method: "DELETE",
    });
  },

  async deleteItem(itemId: string): Promise<void> {
    return apiFetch<void>(`/pesajes/items/${itemId}`, {
      method: "DELETE",
    });
  },

  async exportCsv(query: PesajeQueryDTO): Promise<Blob> {
    const params = buildFilterParams(query);
    return apiFetchBlob(`/pesajes/export/csv?${params.toString()}`);
  },

  async exportExcel(query: PesajeQueryDTO): Promise<Blob> {
    const params = buildFilterParams(query);
    return apiFetchBlob(`/pesajes/export/excel?${params.toString()}`);
  },

  async exportPdf(query: PesajeQueryDTO): Promise<Blob> {
    const params = buildFilterParams(query);
    return apiFetchBlob(`/pesajes/export/pdf?${params.toString()}`);
  },
};
