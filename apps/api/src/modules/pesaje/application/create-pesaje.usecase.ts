import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  PESAJE_REPOSITORY,
  type PesajeRepository,
} from '../domain/pesaje.repository';
import { Pesaje } from '../domain/pesaje.entity';
import {
  RECUPERADOR_REPOSITORY,
  type RecuperadorRepository,
} from 'src/modules/recuperador/domain/recuperador.repository';
import {
  MATERIAL_REPOSITORY,
  type MaterialRepository,
} from 'src/modules/material/domain/material.repository';
import { CreatePesajeDTO } from '../presentation/schemas/create-pesaje.schema';
import { PesajeItem } from '../domain/pesaje-item.vo';
import { PesajeStatus } from '../domain/pesaje-status.enum';

@Injectable()
export class CreatePesajeUseCase {
  constructor(
    @Inject(PESAJE_REPOSITORY)
    private readonly pesajeRepository: PesajeRepository,
    @Inject(RECUPERADOR_REPOSITORY)
    private readonly recuperadorRepository: RecuperadorRepository,
    @Inject(MATERIAL_REPOSITORY)
    private readonly materialRepository: MaterialRepository,
  ) {}

  async execute(data: CreatePesajeDTO): Promise<Pesaje> {
    const recuperador = await this.recuperadorRepository.findById(
      data.recuperadorId,
    );
    if (!recuperador) {
      throw new NotFoundException('El recuperador no existe');
    }

    if (!recuperador.active) {
      throw new BadRequestException('El recuperador está inactivo');
    }

    const pesajeItems: PesajeItem[] = [];
    for (const item of data.items) {
      const material = await this.materialRepository.findById(item.materialId);
      if (!material) {
        throw new NotFoundException(`El material ${item.materialId} no existe`);
      }
      pesajeItems.push(
        new PesajeItem({
          materialId: material.id,
          weight: item.weight,
          pricePerKgAtMoment: material.currentPrice,
        }),
      );
    }
    const pesaje = new Pesaje({
      id: crypto.randomUUID(),
      recuperadorId: data.recuperadorId,
      items: pesajeItems,
      status: PesajeStatus.PENDING,
      date: data.date,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    await this.pesajeRepository.save(pesaje);

    return pesaje;
  }
}
