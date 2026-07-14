import { useState, useEffect, useCallback } from "react";
import solicitudPagoService from "../services/solicitudPagoService";
import type { SolicitudPagoDetail } from "../types/SolicitudPago";

export const useSolicitudPagoDetail = (id: string) => {
  const [data, setData] = useState<SolicitudPagoDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [markingPaid, setMarkingPaid] = useState(false);
  const [excluding, setExcluding] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const fetchDetail = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await solicitudPagoService.getById(id);
      setData(response);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Error al cargar la solicitud";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  const markAsPaid = async (excludePesajeIds?: string[]) => {
    setMarkingPaid(true);
    try {
      const updated = await solicitudPagoService.markAsPaid(id, excludePesajeIds);
      setData(updated);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Error al marcar como pagado";
      setError(message);
      throw err;
    } finally {
      setMarkingPaid(false);
    }
  };

  const excludePesajes = async (pesajeIds: string[]): Promise<SolicitudPagoDetail | null> => {
    setExcluding(true);
    try {
      const updated = await solicitudPagoService.excludePesajes(id, pesajeIds);
      if (updated) {
        setData(updated);
      }
      return updated ?? null;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Error al excluir pesajes";
      setError(message);
      throw err;
    } finally {
      setExcluding(false);
    }
  };

  const downloadExcel = async () => {
    setDownloading(true);
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
    } finally {
      setDownloading(false);
    }
  };

  return {
    data,
    loading,
    error,
    markingPaid,
    excluding,
    downloading,
    markAsPaid,
    excludePesajes,
    downloadExcel,
    refetch: fetchDetail,
  };
};
