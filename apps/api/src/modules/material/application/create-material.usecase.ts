import { Injectable, Inject, ConflictException } from '@nestjs/common';
import { Material } from '../domain/material.entity';
import {
  MATERIAL_REPOSITORY,
  type MaterialRepository,
} from '../domain/material.repository';
import { CreateMaterialDTO } from '../presentation/schemas/create-material.schema';

@Injectable()
export class CreateMaterialUseCase {
  constructor(
    @Inject(MATERIAL_REPOSITORY)
    private readonly materialRepository: MaterialRepository,
  ) {}

  async execute(data: CreateMaterialDTO): Promise<Material> {
    const existing = await this.materialRepository.findByName(data.name);
    if (existing) {
      throw new ConflictException('Ya existe un material con ese nombre');
    }

    const material = new Material({
      id: crypto.randomUUID(),
      name: data.name,
      currentPrice: data.currentPrice,
      active: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await this.materialRepository.save(material);

    return material;
  }
}
