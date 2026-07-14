import { Injectable, Inject } from '@nestjs/common';
import {
  PESAJE_REPOSITORY,
  type PesajeRepository,
} from '../domain/pesaje.repository';

@Injectable()
export class DeletePesajeItemUseCase {
  constructor(
    @Inject(PESAJE_REPOSITORY)
    private readonly pesajeRepository: PesajeRepository,
  ) {}

  async execute(itemId: string): Promise<void> {
    await this.pesajeRepository.deleteItem(itemId);
  }
}
