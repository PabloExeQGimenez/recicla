import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  Recuperador,
  type UpdateRecuperadorProps,
} from '../domain/recuperador.entity';
import {
  RECUPERADOR_REPOSITORY,
  type RecuperadorRepository,
} from '../domain/recuperador.repository';

@Injectable()
export class UpdateRecuperadorUseCase {
  constructor(
    @Inject(RECUPERADOR_REPOSITORY)
    private readonly recuperadorRepository: RecuperadorRepository,
  ) {}

  async execute(
    id: string,
    data: UpdateRecuperadorProps,
  ): Promise<Recuperador> {
    const recuperador = await this.recuperadorRepository.findById(id);
    if (!recuperador) {
      throw new NotFoundException('Recuperador no encontrado');
    }

    if (data.dni) {
      const existing = await this.recuperadorRepository.findByDni(data.dni);
      if (existing && existing.id !== recuperador.id) {
        throw new ConflictException('Ya existe un recuperador con ese dni');
      }
    }

    recuperador.update(data);
    await this.recuperadorRepository.update(recuperador);

    return recuperador;
  }
}
