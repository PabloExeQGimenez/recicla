import { useState } from "react";
import { recuperadoresService } from "../services/recuperadores.service";

interface UseToggleActiveRecuperadorResult {
  handleToggle: (id: string, isActive: boolean) => Promise<void>;
  loading: boolean;
  error: string | null;
}

export const useToggleActiveRecuperador = (): UseToggleActiveRecuperadorResult => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleToggle = async (id: string, isActive: boolean): Promise<void> => {
    setError(null);
    setLoading(true);

    try {
      if (isActive) {
        await recuperadoresService.deactivate(id);
      } else {
        await recuperadoresService.activate(id);
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "No se pudo actualizar el estado del recuperador";
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  return { handleToggle, loading, error };
};
