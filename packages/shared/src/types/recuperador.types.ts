export interface Recuperador {
  id: string;
  name: string;
  lastName: string;
  dni?: string;
  cuil?: string;
  birthdate?: string;
  address?: string;
  phone?: string;
  email?: string;
  account?: string;
  route?: string;
  program?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RecuperadorFilters {
  search?: string;
  active?: boolean;
  page: number;
  limit: number;
}

export interface CreateRecuperador {
  name: string;
  lastName: string;
  dni?: string;
  cuil?: string;
  birthdate?: string;
  address?: string;
  phone?: string;
  email?: string;
  account?: string;
  route?: string;
  program?: string;
}

export type UpdateRecuperador = Partial<CreateRecuperador>;
