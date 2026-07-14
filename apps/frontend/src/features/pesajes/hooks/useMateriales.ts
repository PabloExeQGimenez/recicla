import { useState, useEffect } from "react";
import { materialesService } from "../../materiales/";

export type MaterialOption = {
  id: string;
  label: string;
  precio: number;
};

export const useMateriales = () => {
  const [materiales, setMateriales] = useState<MaterialOption[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setError(null);
        const res = await materialesService.getAll();
        setMateriales(
          res.map((m) => ({
            id: m.id,
            label: m.name,
            precio: m.currentPrice,
          })),
        );
      } catch (err) {
        setError("Error cargando datos: " + String(err));
      }
    };
    load();
  }, []);

  return { materiales, error };
};
