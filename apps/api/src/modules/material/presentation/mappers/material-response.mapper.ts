import { Material } from '../../domain/material.entity';
import type { Material as MaterialResponseDTO } from '@recicla/shared';

export class MaterialResponseMapper {
  static toResponse(material: Material): MaterialResponseDTO {
    return {
      id: material.id,
      name: material.name,
      currentPrice: material.currentPrice,
      active: material.active,
    };
  }
}
