import { Inject, Injectable } from '@nestjs/common';
import {
  MATERIAL_REPOSITORY,
  type MaterialRepository,
} from '../domain/material.repository';
import { Material } from '../domain/material.entity';

@Injectable()
export class GetMaterialesUseCase {
  constructor(
    @Inject(MATERIAL_REPOSITORY)
    private readonly materialRepository: MaterialRepository,
  ) {}

  async execute(active?: boolean): Promise<Material[]> {
    return this.materialRepository.findAll(active);
  }
}
