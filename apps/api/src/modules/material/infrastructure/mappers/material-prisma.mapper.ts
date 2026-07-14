import { Material as PrismaMaterial, Prisma } from '@prisma/client';
import { Material } from '../../domain/material.entity';

export class MaterialPrismaMapper {
  static toDomain(material: PrismaMaterial): Material {
    return new Material({
      id: material.id,
      name: material.name,
      currentPrice: material.currentPrice.toNumber(),
      active: material.active,
      createdAt: material.createdAt,
      updatedAt: material.updatedAt,
    });
  }

  static toPersistence(material: Material) {
    return {
      id: material.id,
      name: material.name,
      currentPrice: new Prisma.Decimal(material.currentPrice),
      active: material.active,
      createdAt: material.createdAt,
      updatedAt: material.updatedAt,
    };
  }
}
