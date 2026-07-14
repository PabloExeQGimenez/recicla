import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  RECUPERADOR_REPOSITORY,
  type RecuperadorRepository,
} from '../domain/recuperador.repository';
import { Recuperador } from '../domain/recuperador.entity';

@Injectable()
export class GetRecuperadorByIdUseCase {
  constructor(
    @Inject(RECUPERADOR_REPOSITORY)
    private readonly recuperadorRepository: RecuperadorRepository,
  ) {}

  async execute(id: string): Promise<Recuperador> {
    const recuperador = await this.recuperadorRepository.findById(id);
    if (!recuperador) {
      throw new NotFoundException('Recuperador no encontrado');
    }
    return recuperador;
  }
}
