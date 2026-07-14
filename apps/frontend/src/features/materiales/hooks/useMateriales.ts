import { useEffect, useState } from "react";
import type { Material } from "../types/Material";
import materialesServices from "../services/materialService";

export const useMateriales = () => {
  const [materiales, setMateriales] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMateriales = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await materialesServices.getAll();
        setMateriales(data);
      } catch {
        setError("No se cargaron los materiales");
      } finally {
        setLoading(false);
      }
    };
    fetchMateriales();
  }, []);

  return {
    materiales,
    loading,
    error,
    setMateriales,
  };
};
