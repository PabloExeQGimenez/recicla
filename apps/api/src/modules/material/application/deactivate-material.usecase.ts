import { Inject, Injectable, NotFoundException, Logger } from '@nestjs/common';
import {
  MATERIAL_REPOSITORY,
  type MaterialRepository,
} from '../domain/material.repository';
import { Material } from '../domain/material.entity';

@Injectable()
export class DeactivateMaterialUseCase {
  private readonly logger = new Logger(DeactivateMaterialUseCase.name);

  constructor(
    @Inject(MATERIAL_REPOSITORY)
    private readonly materialRepository: MaterialRepository,
  ) {}

  async execute(id: string): Promise<Material> {
    const material = await this.materialRepository.findById(id);
    if (!material) {
      throw new NotFoundException('El material no existe');
    }

    material.deactivate();
    await this.materialRepository.update(material);

    this.logger.log(`Material desactivado: ${id}`);

    return material;
  }
}
