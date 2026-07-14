import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import {
  type PesajeRepository,
  PESAJE_REPOSITORY,
} from '../domain/pesaje.repository';

@Injectable()
export class DeletePesajeUseCase {
  constructor(
    @Inject(PESAJE_REPOSITORY)
    private readonly pesajeRepository: PesajeRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const pesaje = await this.pesajeRepository.findById(id);
    if (!pesaje) {
      throw new NotFoundException('El pesaje no existe');
    }
    if (!pesaje.canBeDeleted()) {
      throw new BadRequestException(
        'El pesaje ya fue incorporado a una solicitud de pago o está pagado',
      );
    }
    await this.pesajeRepository.delete(id);
  }
}
