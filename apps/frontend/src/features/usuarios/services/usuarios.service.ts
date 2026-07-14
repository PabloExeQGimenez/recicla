import { apiFetch } from "../../../shared/lib/api";
import type { UserFormValues } from "../validations/user.schema";
import type { Usuario } from "../types/Usuario.types";

interface CreateUserResponse {
  token: string;
  user: {
    id: string;
    name: string;
    lastName: string;
    dni: string | null;
    email: string;
    role: string;
  };
}

export const usuariosService = {
  async getAll(): Promise<Usuario[]> {
    return apiFetch<Usuario[]>("/auth/users");
  },

  async getById(id: string): Promise<Usuario> {
    return apiFetch<Usuario>(`/auth/users/${id}`);
  },

  async create(data: UserFormValues): Promise<CreateUserResponse> {
    return apiFetch<CreateUserResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async delete(id: string): Promise<void> {
    return apiFetch<void>(`/auth/users/${id}`, { method: "DELETE" });
  },
};
