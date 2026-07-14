import { useState } from "react";
import solicitudPagoService from "../services/solicitudPagoService";
import type { SolicitudPagoPreview } from "../types/SolicitudPago";

export const usePreviewSolicitudPago = () => {
  const [preview, setPreview] = useState<SolicitudPagoPreview | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPreview = async (from: string, to: string) => {
    setLoading(true);
    setError(null);
    setPreview(null);

    try {
      const result = await solicitudPagoService.preview(from, to);
      setPreview(result);
      return result;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Error al obtener la previsualización";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearPreview = () => {
    setPreview(null);
    setError(null);
  };

  return { preview, loading, error, fetchPreview, clearPreview };
};
