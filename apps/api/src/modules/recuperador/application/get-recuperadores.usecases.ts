import { Inject, Injectable } from '@nestjs/common';
import {
  RECUPERADOR_REPOSITORY,
  type RecuperadorRepository,
} from '../domain/recuperador.repository';
import { Recuperador } from '../domain/recuperador.entity';
import { PaginatedResponseDTO } from 'src/shared/dtos/paginated-response.dto';
import { RecuperadorFilters } from '../domain/recuperador-filters';

@Injectable()
export class GetRecuperadoresUseCase {
  constructor(
    @Inject(RECUPERADOR_REPOSITORY)
    private readonly recuperadorRepository: RecuperadorRepository,
  ) {}

  async execute(
    filters: RecuperadorFilters,
  ): Promise<PaginatedResponseDTO<Recuperador>> {
    const [recuperadores, total] = await Promise.all([
      this.recuperadorRepository.findAll(filters),
      this.recuperadorRepository.count(filters),
    ]);
    return {
      data: recuperadores,
      page: filters.page,
      limit: filters.limit,
      total,
      totalPages: Math.ceil(total / filters.limit),
    };
  }
}
