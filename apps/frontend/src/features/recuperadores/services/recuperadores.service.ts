import { apiFetch } from "../../../shared/lib/api";
import {
  Recuperador,
  RecuperadoresQuery,
  CreateRecuperadorPayload,
  UpdateRecuperadorPayload,
} from "../types/Recuperador.types";

interface RecuperadoresPage {
  data: Recuperador[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export const recuperadoresService = {
  async getAll({
    page,
    limit,
    search,
    active,
  }: RecuperadoresQuery): Promise<RecuperadoresPage> {
    const params = new URLSearchParams();
    params.set("page", page.toString());
    params.set("limit", limit.toString());
    const qTrim = search?.trim();
    if (qTrim) params.set("search", qTrim);
    if (active !== undefined) params.set("active", String(active));
    const query = params.toString();
    return apiFetch<RecuperadoresPage>(`/recuperadores?${query}`);
  },

  async getById(id: string): Promise<Recuperador> {
    return apiFetch<Recuperador>(`/recuperadores/${id}`);
  },

  async create(payload: CreateRecuperadorPayload): Promise<Recuperador> {
    return apiFetch<Recuperador>(`/recuperadores`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async update(
    id: string,
    payload: UpdateRecuperadorPayload
  ): Promise<Recuperador> {
    return apiFetch<Recuperador>(`/recuperadores/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },

  async deactivate(id: string): Promise<void> {
    return apiFetch(`/recuperadores/${id}/deactivate`, {
      method: "PATCH",
    });
  },

  async activate(id: string): Promise<void> {
    return apiFetch(`/recuperadores/${id}/activate`, {
      method: "PATCH",
    });
  },
};
