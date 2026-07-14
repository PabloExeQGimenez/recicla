import { PesajeStatus } from '../domain/pesaje-status.enum';

export type PesajeFilters = {
  recuperadorId?: string;
  materialId?: string;
  status?: PesajeStatus;
  from?: Date;
  to?: Date;
  page: number;
  limit: number;
};
