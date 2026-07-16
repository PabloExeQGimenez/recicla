import { Injectable, Inject, Logger } from '@nestjs/common';
import {
  PESAJE_REPOSITORY,
  type PesajeRepository,
} from '../domain/pesaje.repository';

@Injectable()
export class DeletePesajeItemUseCase {
  private readonly logger = new Logger(DeletePesajeItemUseCase.name);

  constructor(
    @Inject(PESAJE_REPOSITORY)
    private readonly pesajeRepository: PesajeRepository,
  ) {}

  async execute(itemId: string): Promise<void> {
    await this.pesajeRepository.deleteItem(itemId);

    this.logger.log(`Ítem de pesaje eliminado: ${itemId}`);
  }
}
