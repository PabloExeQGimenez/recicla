import { useState } from "react";
import solicitudPagoService from "../services/solicitudPagoService";
import type {
  CreateSolicitudPagoDTO,
  SolicitudPago,
} from "../types/SolicitudPago";

export const useCreateSolicitudPago = () => {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<SolicitudPago | null>(null);
  const [downloading, setDownloading] = useState(false);

  const create = async (payload: CreateSolicitudPagoDTO): Promise<SolicitudPago> => {
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await solicitudPagoService.create(payload);
      setSuccess(result);
      return result;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Error al crear la solicitud de pago";
      setError(message);
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  const downloadExcel = async (id: string) => {
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
    } finally {
      setDownloading(false);
    }
  };

  const clearError = () => setError(null);
  const clearSuccess = () => setSuccess(null);

  return {
    submitting,
    error,
    success,
    downloading,
    create,
    downloadExcel,
    clearError,
    clearSuccess,
  };
};
