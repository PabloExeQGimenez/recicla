import type { Material, ChangeCurrentPricePayload } from "../types/Material";
import materialesService from "../services/materialService";
import type { SetMateriales } from './types';

export const useChangePriceMaterial = (setMateriales: SetMateriales) => {
  const changePrice = async (
    id: string,
    payload: ChangeCurrentPricePayload,
  ): Promise<Material> => {
    const updated = await materialesService.changePrice(id, payload);
    setMateriales((prev) =>
      prev.map((m) => (m.id === updated.id ? updated : m)),
    );
    return updated;
  };
  return { changePrice };
};
