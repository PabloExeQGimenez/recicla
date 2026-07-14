import { apiFetch, apiFetchBlob } from "../../../shared/lib/api";
import type {
  CreateSolicitudPagoDTO,
  SolicitudPago,
  SolicitudPagoDetail,
  SolicitudPagoPreview,
  PesajePreviewItem,
  SolicitudPagoListItem,
  PaginatedResponse,
} from "../types/SolicitudPago";

interface PesajeAPIResponse {
  id: string;
  recuperadorId: string;
  recuperador: { id: string; name: string; lastName: string; dni?: string };
  status: string;
  totalAmount: number;
  items: {
    id: string;
    materialId: string;
    material: { id: string; name: string };
    weight: number;
    pricePerKgAtMoment: number;
    subtotal: number;
  }[];
  date: string;
}

interface PaginatedAPIResponse<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const flattenToPreview = (api: PesajeAPIResponse): PesajePreviewItem[] => {
  return api.items.map((item) => ({
    id: api.id,
    itemId: item.id,
    recuperador: {
      id: api.recuperador.id,
      nombre: api.recuperador.name,
      apellido: api.recuperador.lastName,
      dni: api.recuperador.dni,
    },
    material: { id: item.material.id, nombre: item.material.name },
    cantidad: item.weight,
    precio: item.pricePerKgAtMoment,
    monto: item.subtotal,
    fecha: api.date,
  }));
};

const solicitudPagoService = {
  async create(payload: CreateSolicitudPagoDTO): Promise<SolicitudPago> {
    return apiFetch<SolicitudPago>("/solicitudes-pago", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async list(
    page: number = 1,
    limit: number = 10,
    from?: string,
    to?: string
  ): Promise<PaginatedResponse<SolicitudPagoListItem>> {
    const params = new URLSearchParams();
    params.set("page", page.toString());
    params.set("limit", limit.toString());
    if (from) params.set("from", from);
    if (to) params.set("to", to);

    return apiFetch<PaginatedResponse<SolicitudPagoListItem>>(
      `/solicitudes-pago?${params.toString()}`
    );
  },

  async preview(from: string, to: string): Promise<SolicitudPagoPreview> {
    const params = new URLSearchParams();
    params.set("from", from);
    params.set("to", to);
    params.set("status", "PENDING");
    params.set("limit", "100");

    const response = await apiFetch<PaginatedAPIResponse<PesajeAPIResponse>>(
      `/pesajes?${params.toString()}`
    );

    const pesajes = response.data.flatMap(flattenToPreview);

    const recuperadores = new Set(pesajes.map((p) => p.recuperador.id));
    const totalAPagar = pesajes.reduce((acc, p) => acc + p.monto, 0);

    return {
      pesajes,
      resumen: {
        cantidadRecuperadores: recuperadores.size,
        cantidadItems: pesajes.length,
        totalAPagar,
      },
    };
  },

  async getById(id: string): Promise<SolicitudPagoDetail> {
    return apiFetch<SolicitudPagoDetail>(`/solicitudes-pago/${id}`);
  },

  async markAsPaid(
    id: string,
    excludePesajeIds?: string[],
  ): Promise<SolicitudPagoDetail> {
    return apiFetch<SolicitudPagoDetail>(`/solicitudes-pago/${id}/pay`, {
      method: "PATCH",
      body: JSON.stringify({ excludePesajeIds }),
    });
  },

  async excludePesajes(
    id: string,
    pesajeIds: string[],
  ): Promise<SolicitudPagoDetail | null> {
    return apiFetch<SolicitudPagoDetail | null>(
      `/solicitudes-pago/${id}/exclude-pesajes`,
      {
        method: "PATCH",
        body: JSON.stringify({ pesajeIds }),
      }
    );
  },

  async delete(id: string): Promise<void> {
    return apiFetch<void>(`/solicitudes-pago/${id}`, {
      method: "DELETE",
    });
  },

  async exportExcel(id: string): Promise<Blob> {
    return apiFetchBlob(`/solicitudes-pago/${id}/export`);
  },
};

export default solicitudPagoService;
