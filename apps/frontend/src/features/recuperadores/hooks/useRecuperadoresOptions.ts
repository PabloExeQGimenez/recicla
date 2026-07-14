import { useEffect, useState } from "react";
import { recuperadoresService } from "../services/recuperadores.service";
import type { Recuperador } from "../types/Recuperador.types";

interface RecuperadorOption {
  id: string;
  label: string;
}

const useRecuperadoresOptions = () => {
  const [options, setOptions] = useState<RecuperadorOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        const resp = await recuperadoresService.getAll({
          page: 1,
          limit: 9999,
          search: "",
          active: true,
        });
        const opts = resp.data.map((r: Recuperador) => ({
          id: r.id,
          label: `${r.name} ${r.lastName}`.trim(),
        }));

        if (!cancelled) setOptions(opts);
      } catch (err) {
        const msg =
          err instanceof Error
            ? err.message
            : `Error al cargar recuperadores: ${String(err)}`;
        if (!cancelled) setError(msg);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  return {
    options,
    loading,
    error,
  };
};

export default useRecuperadoresOptions;
