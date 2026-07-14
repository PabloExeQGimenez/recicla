import type { PaginatedResponse } from '@recicla/shared';

export type PaginatedResponseDTO<T> = PaginatedResponse<T> & {
  totalItems?: number;
};
