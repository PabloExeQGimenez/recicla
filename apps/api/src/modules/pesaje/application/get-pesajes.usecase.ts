import { Inject, Injectable } from '@nestjs/common';
import {
  PESAJE_REPOSITORY,
  type PesajeRepository,
} from '../domain/pesaje.repository';
import { Pesaje } from '../domain/pesaje.entity';
import { PesajeFilters } from '../domain/pesaje-filters';
import { PaginatedResponseDTO } from 'src/shared/dtos/paginated-response.dto';

@Injectable()
export class GetPesajesUseCase {
  constructor(
    @Inject(PESAJE_REPOSITORY)
    private readonly pesajeRepository: PesajeRepository,
  ) {}

  async execute(filters: PesajeFilters): Promise<PaginatedResponseDTO<Pesaje>> {
    const [pesajes, total, totalItems] = await Promise.all([
      this.pesajeRepository.findAll(filters),
      this.pesajeRepository.count(filters),
      this.pesajeRepository.countItems(filters),
    ]);

    return {
      data: pesajes,
      page: filters.page,
      limit: filters.limit,
      total,
      totalPages: Math.ceil(totalItems / filters.limit),
      totalItems,
    };
  }
}
