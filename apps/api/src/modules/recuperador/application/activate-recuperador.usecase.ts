import { Injectable, Inject, NotFoundException, Logger } from '@nestjs/common';
import { Recuperador } from '../domain/recuperador.entity';
import {
  RECUPERADOR_REPOSITORY,
  type RecuperadorRepository,
} from '../domain/recuperador.repository';

@Injectable()
export class ActivateRecuperadorUseCase {
  private readonly logger = new Logger(ActivateRecuperadorUseCase.name);

  constructor(
    @Inject(RECUPERADOR_REPOSITORY)
    private readonly recuperadorRepository: RecuperadorRepository,
  ) {}

  async execute(id: string): Promise<Recuperador> {
    const recuperador = await this.recuperadorRepository.findById(id);
    if (!recuperador) {
      throw new NotFoundException('Recuperador no encontrado');
    }

    recuperador.activate();
    await this.recuperadorRepository.update(recuperador);

    this.logger.log(`Recuperador activado: ${id}`);

    return recuperador;
  }
}
