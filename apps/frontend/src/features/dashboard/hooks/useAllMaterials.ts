import { useEffect, useState } from "react";
import materialService from "../../materiales/services/materialService";
import type { Material } from "@recicla/shared";

export const useAllMaterials = () => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    const run = async () => {
      setLoading(true);
      try {
        const result = await materialService.getAll();
        if (alive) setMaterials(result);
      } catch {
        if (alive) setMaterials([]);
      } finally {
        if (alive) setLoading(false);
      }
    };

    run();
    return () => {
      alive = false;
    };
  }, []);

  return { materials, loading };
};
