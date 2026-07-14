import { useState, useEffect, useCallback } from "react";
import { recuperadoresService } from "../services/recuperadores.service";
import {
  Recuperador,
  CreateRecuperadorPayload,
  UpdateRecuperadorPayload,
} from "../types/Recuperador.types";

const useRecuperadores = () => {
  const [data, setData] = useState<{ data: Recuperador[]; page: number; limit: number; total: number; totalPages: number } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(10);
  const [search, setSearch] = useState<string>("");
  const [active, setActive] = useState<boolean | undefined>(true);
  const [reload, setReload] = useState(0);
  const recuperadores = data?.data ?? [];
  const totalPages = data?.totalPages ?? 0;
  const total = data?.total ?? 0;

  const refetch = useCallback(() => {
    setReload((r) => r + 1);
  }, []);

  useEffect(() => {
    const loadRecuperadores = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await recuperadoresService.getAll({
          page,
          limit,
          search,
          active,
        });
        setData(response);
      } catch (err) {
        if (err instanceof Error) {
          setError(`Error al obtener los recuperadores: ${err.message}`);
        } else {
          setError("Error al obtener los Recuperadores");
        }
      } finally {
        setLoading(false);
      }
    };
    loadRecuperadores();
  }, [page, limit, search, active, reload]);

  const create = useCallback(
    async (payload: CreateRecuperadorPayload): Promise<Recuperador> => {
      const created = await recuperadoresService.create(payload);
      refetch();
      return created;
    },
    [refetch],
  );

  const update = useCallback(
    async (id: string, payload: UpdateRecuperadorPayload): Promise<Recuperador> => {
      const updated = await recuperadoresService.update(id, payload);
      refetch();
      return updated;
    },
    [refetch],
  );

  return {
    loading,
    error,
    recuperadores,
    totalPages,
    total,
    page,
    limit,
    search,
    setPage,
    setSearch,
    active,
    setActive,
    refetch,
    create,
    update,
  };
};

export default useRecuperadores;
