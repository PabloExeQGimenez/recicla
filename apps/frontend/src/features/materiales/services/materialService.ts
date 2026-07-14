import { apiFetch } from "../../../shared/lib/api";
import {
  Material,
  CreateMaterialPayload,
  ChangeCurrentPricePayload,
} from "../types/Material";

const materialesService = {
  async getAll(): Promise<Material[]> {
    return apiFetch<Material[]>("/materiales");
  },

  async create(payload: CreateMaterialPayload): Promise<Material> {
    return apiFetch<Material>("/materiales", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async changePrice(
    id: string,
    payload: ChangeCurrentPricePayload,
  ): Promise<Material> {
    return apiFetch<Material>(`/materiales/${id}/price`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },

  async deactivate(id: string): Promise<void> {
    return apiFetch<void>(`/materiales/${id}/deactivate`, {
      method: "PATCH",
    });
  },

  async activate(id: string): Promise<void> {
    return apiFetch<void>(`/materiales/${id}/activate`, {
      method: "PATCH",
    });
  },
};
export default materialesService;
