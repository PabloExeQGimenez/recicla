import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Pesaje } from '../domain/pesaje.entity';
import {
  PESAJE_REPOSITORY,
  type PesajeRepository,
} from '../domain/pesaje.repository';

@Injectable()
export class GetPesajeByIdUseCase {
  constructor(
    @Inject(PESAJE_REPOSITORY)
    private readonly pesajeRepository: PesajeRepository,
  ) {}

  async execute(id: string): Promise<Pesaje> {
    const pesaje = await this.pesajeRepository.findById(id);

    if (!pesaje) {
      throw new NotFoundException('El pesaje no existe');
    }

    return pesaje;
  }
}
