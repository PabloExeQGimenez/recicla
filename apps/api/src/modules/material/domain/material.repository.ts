import { Material } from './material.entity';

export const MATERIAL_REPOSITORY = Symbol('MATERIAL_REPOSITORY');

export interface MaterialRepository {
  findById(id: string): Promise<Material | null>;
  findAll(active?: boolean): Promise<Material[]>;
  save(material: Material): Promise<void>;
  update(material: Material): Promise<void>;
  findByName(name: string): Promise<Material | null>;
}
