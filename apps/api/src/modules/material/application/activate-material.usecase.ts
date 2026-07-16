import { Inject, Injectable, NotFoundException, Logger } from '@nestjs/common';
import {
  MATERIAL_REPOSITORY,
  type MaterialRepository,
} from '../domain/material.repository';
import { Material } from '../domain/material.entity';

@Injectable()
export class ActivateMaterialUseCase {
  private readonly logger = new Logger(ActivateMaterialUseCase.name);

  constructor(
    @Inject(MATERIAL_REPOSITORY)
    private readonly materialRepository: MaterialRepository,
  ) {}

  async execute(id: string): Promise<Material> {
    const material = await this.materialRepository.findById(id);
    if (!material) {
      throw new NotFoundException('El Material no existe');
    }
    material.activate();
    await this.materialRepository.update(material);

    this.logger.log(`Material activado: ${id}`);

    return material;
  }
}
