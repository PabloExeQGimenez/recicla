import { useState, useEffect, useCallback } from "react";
import { usuariosService } from "../services/usuarios.service";
import type { Usuario } from "../types/Usuario.types";

const useUsuarios = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const [reload, setReload] = useState(0);
  const limit = 10;

  const refetch = useCallback(() => {
    setReload((r) => r + 1);
  }, []);

  const remove = useCallback(
    async (id: string): Promise<void> => {
      await usuariosService.delete(id);
      refetch();
    },
    [refetch],
  );

  useEffect(() => {
    const loadUsuarios = async () => {
      setLoading(true);
      setError(null);
      try {
        const all = await usuariosService.getAll();
        setUsuarios(all);
      } catch (err) {
        if (err instanceof Error) {
          setError(`Error al obtener los usuarios: ${err.message}`);
        } else {
          setError("Error al obtener los usuarios");
        }
      } finally {
        setLoading(false);
      }
    };
    loadUsuarios();
  }, [reload]);

  const filtered = usuarios.filter((u) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      u.name.toLowerCase().includes(q) ||
      u.lastName.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      (u.dni && u.dni.toLowerCase().includes(q))
    );
  });

  const total = filtered.length;
  const totalPages = Math.ceil(total / limit);
  const paginated = filtered.slice((page - 1) * limit, page * limit);

  return {
    loading,
    error,
    usuarios: paginated,
    total,
    totalPages,
    page,
    setPage,
    search,
    setSearch,
    refetch,
    remove,
  };
};

export default useUsuarios;
