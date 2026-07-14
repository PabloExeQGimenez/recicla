import { useState, useEffect, useCallback } from "react";
import { usuariosService } from "../services/usuarios.service";
import type { Usuario } from "../types/Usuario.types";

const useUsuario = (id?: string) => {
  const [data, setData] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [reload, setReload] = useState(0);

  const refetch = useCallback(() => {
    setReload((r) => r + 1);
  }, []);

  useEffect(() => {
    if (!id) return;

    const loadUsuario = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await usuariosService.getById(id);
        setData(result);
      } catch (err) {
        if (err instanceof Error) {
          setError(`Error al obtener el usuario: ${err.message}`);
        } else {
          setError("Error al obtener el usuario");
        }
      } finally {
        setLoading(false);
      }
    };
    loadUsuario();
  }, [id, reload]);

  return { data, loading, error, id, refetch };
};

export default useUsuario;
