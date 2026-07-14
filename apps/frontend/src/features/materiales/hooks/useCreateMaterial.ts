import type { CreateMaterialPayload, Material } from "../types/Material";
import materialesService from '../services/materialService';
import type { SetMateriales } from './types';

export const useCreateMaterial = (setMateriales: SetMateriales) => {
  
  const create = async (payload: CreateMaterialPayload): Promise<Material> => {
    const created = await materialesService.create(payload);
    setMateriales((prev) => [...prev, created]);
    return created;
  };

  return {create};
}

