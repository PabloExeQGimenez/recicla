import { useState, useEffect, useCallback } from "react";
import solicitudPagoService from "../services/solicitudPagoService";
import type {
  SolicitudPagoListItem,
  PaginatedResponse,
} from "../types/SolicitudPago";

export const useSolicitudesPagos = () => {
  const [data, setData] = useState<PaginatedResponse<SolicitudPagoListItem> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSolicitudes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await solicitudPagoService.list(1, 200);
      setData(response);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Error al cargar las solicitudes";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSolicitudes();
  }, [fetchSolicitudes]);

  const deleteSolicitud = async (id: string) => {
    try {
      await solicitudPagoService.delete(id);
      await fetchSolicitudes();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Error al eliminar la solicitud";
      setError(message);
      throw err;
    }
  };

  const downloadExcel = async (id: string) => {
    try {
      const blob = await solicitudPagoService.exportExcel(id);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `solicitud-pago-${new Date().toLocaleDateString("en-CA")}.xlsx`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Error al descargar el archivo";
      setError(message);
      throw err;
    }
  };

  return {
    data,
    loading,
    error,
    deleteSolicitud,
    downloadExcel,
    refetch: fetchSolicitudes,
  };
};
