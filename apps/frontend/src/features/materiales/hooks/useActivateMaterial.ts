import materialesService from "../services/materialService";
import type { SetMateriales } from './types';

export const useActivateMaterial = (setMateriales: SetMateriales) => {
  const activate = async (id: string): Promise<void> => {
    await materialesService.activate(id);
    setMateriales((prev) =>
      prev.map((m) => (m.id === id ? { ...m, active: true } : m)),
    );
  };

  return { activate };
};
