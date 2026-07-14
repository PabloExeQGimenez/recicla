import { Injectable } from '@nestjs/common';
import { Material } from '../../domain/material.entity';
import { MaterialRepository } from '../../domain/material.repository';
import { PrismaService } from 'src/shared/database/prisma.service';
import { MaterialPrismaMapper } from '../mappers/material-prisma.mapper';

@Injectable()
export class PrismaMaterialRepository implements MaterialRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(material: Material): Promise<void> {
    await this.prisma.material.create({
      data: MaterialPrismaMapper.toPersistence(material),
    });
  }

  async findById(id: string): Promise<Material | null> {
    const material = await this.prisma.material.findUnique({
      where: { id },
    });
    if (!material) {
      return null;
    }
    return MaterialPrismaMapper.toDomain(material);
  }

  async findAll(active?: boolean): Promise<Material[]> {
    const materiales = await this.prisma.material.findMany({
      where: active === undefined ? {} : { active },
    });
    return materiales.map((m) => MaterialPrismaMapper.toDomain(m));
  }

  async update(material: Material): Promise<void> {
    await this.prisma.material.update({
      where: { id: material.id },
      data: MaterialPrismaMapper.toPersistence(material),
    });
  }

  async findByName(name: string): Promise<Material | null> {
    const material = await this.prisma.material.findUnique({
      where: { name },
    });
    if (!material) return null;

    return MaterialPrismaMapper.toDomain(material);
  }
}
