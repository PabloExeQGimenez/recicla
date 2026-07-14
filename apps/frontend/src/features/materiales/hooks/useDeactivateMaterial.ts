import materialesService from '../services/materialService';
import type { SetMateriales } from './types';

export const useDeactivateMaterial = (setMateriales: SetMateriales) => {
  const deactivate = async (id: string): Promise<void> => {
    await materialesService.deactivate(id);
    setMateriales((prev) => 
      prev.map((m) => (m.id === id ? {...m, active: false} : m))
    )
  }
  return {deactivate};
}
