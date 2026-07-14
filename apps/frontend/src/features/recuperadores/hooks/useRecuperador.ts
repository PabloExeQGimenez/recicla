import { useState, useEffect, useCallback } from "react";
import { Recuperador } from "../types/Recuperador.types";
import { recuperadoresService } from "../services/recuperadores.service";

const useRecuperador = (id?: string) => {
  const [data, setData] = useState<Recuperador | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [reload, setReload] = useState(0);

  const refetch = useCallback(() => {
    setReload((r) => r + 1);
  }, []);

  useEffect(() => {
    const getRecuperador = async (): Promise<void> => {
      setLoading(true);
      setError(null);
      setData(null);
      try {
        if (!id) {
          setError("El id no existe");
          return;
        }
        const recuperador = await recuperadoresService.getById(id);
        setData(recuperador);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError(`Error al encontrar el recuperador: ${err}`);
        }
      } finally {
        setLoading(false);
      }
    };
    getRecuperador();
  }, [id, reload]);

  return {
    data,
    loading,
    error,
    id,
    refetch,
  };
};

export default useRecuperador;
