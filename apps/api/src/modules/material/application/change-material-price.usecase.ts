import { Inject, Injectable, NotFoundException, Logger } from '@nestjs/common';
import { Material } from '../domain/material.entity';
import { ChangeMaterialPriceDTO } from '../presentation/schemas/change-material-price.schema';
import {
  MATERIAL_REPOSITORY,
  type MaterialRepository,
} from '../domain/material.repository';

@Injectable()
export class ChangeMaterialPriceUseCase {
  private readonly logger = new Logger(ChangeMaterialPriceUseCase.name);

  constructor(
    @Inject(MATERIAL_REPOSITORY)
    private readonly materialRepository: MaterialRepository,
  ) {}

  async execute(id: string, data: ChangeMaterialPriceDTO): Promise<Material> {
    const material = await this.materialRepository.findById(id);
    if (!material) {
      throw new NotFoundException('El material no existe');
    }

    material.changePrice(data.currentPrice);
    await this.materialRepository.update(material);

    this.logger.log(`Precio cambiado: material ${id} → ${data.currentPrice}`);

    return material;
  }
}
