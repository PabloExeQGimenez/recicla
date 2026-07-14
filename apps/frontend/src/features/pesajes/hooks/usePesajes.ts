import { useState, useEffect } from "react";
import {
  PesajeQueryDTO,
  PesajeListResponseDTO,
} from "../types/pesaje.types";
import { pesajesService } from "../services/pesaje.service";
import { useToast } from "../../../shared/UI/Toast/useToast";

export type ExportType = "excel" | "pdf";

export const usePesajes = (initial?: Partial<PesajeQueryDTO>) => {
  const [data, setData] = useState<PesajeListResponseDTO | null>(null);
  const [query, setQuery] = useState<PesajeQueryDTO>({
    pagina: 1,
    limite: 10,
    ...initial,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [downloadingCsv, setDownloadingCsv] = useState(false);
  const [downloadingExcel, setDownloadingExcel] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [exportDialog, setExportDialog] = useState<ExportType | null>(null);

  const toast = useToast();

  const deletePesajeItem = async (pesajeId: string, itemId: string) => {
    setDeletingId(itemId);

    const prev = data;

    setData((current) => {
      if (!current) return current;

      const nextRows =
        current.data?.filter((r) => r.itemId !== itemId) ?? [];

      return {
        ...current,
        data: nextRows,
        meta: current.meta
          ? {
              ...current.meta,
              total: Math.max(0, (current.meta.total ?? 0) - 1),
            }
          : current.meta,
      };
    });

    try {
      await pesajesService.deleteItem(itemId);
      toast.success("Item eliminado");
    } catch (err) {
      setData(prev ?? null);

      if (err instanceof Error) {
        setError(err.message);
        toast.error(err.message);
      } else {
        const msg = "Error al eliminar el item";
        setError(msg);
        toast.error(msg);
      }
    } finally {
      setDeletingId(null);
    }
  };

  const downloadCsv = async () => {
    setDownloadingCsv(true);
    try {
      const blob = await pesajesService.exportCsv(query)

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `pesaje-${new Date().toLocaleDateString("en-CA")}.csv`;
      a.click();
      URL.revokeObjectURL(url);

      toast.success("Descarga iniciada");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error al descargar CSV";
      toast.error(msg);
    } finally {
      setDownloadingCsv(false);
    }
  };

  const downloadExcel = async () => {
    setDownloadingExcel(true);
    try {
      const blob = await pesajesService.exportExcel(query);

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `pesajes-${new Date().toLocaleDateString("en-CA")}.xlsx`;
      a.click();
      URL.revokeObjectURL(url);

      toast.success("Descarga iniciada");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error al descargar Excel";
      toast.error(msg);
    } finally {
      setDownloadingExcel(false);
    }
  };

  const downloadPdf = async () => {
    setDownloadingPdf(true);
    try {
      const blob = await pesajesService.exportPdf(query);

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `pesajes-${new Date().toLocaleDateString("en-CA")}.pdf`;
      a.click();
      URL.revokeObjectURL(url);

      toast.success("Descarga iniciada");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error al descargar PDF";
      toast.error(msg);
    } finally {
      setDownloadingPdf(false);
    }
  };

  const confirmExport = async () => {
    if (exportDialog === "excel") {
      await downloadExcel();
    } else if (exportDialog === "pdf") {
      await downloadPdf();
    }
    setExportDialog(null);
  };

  const openExportDialog = (type: ExportType) => {
    setExportDialog(type);
  };

  const closeExportDialog = () => {
    setExportDialog(null);
  };
  
  useEffect(() => {
    let active = true;
    const loadPesajes = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await pesajesService.list(query);
        if(active) setData(response);
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : String(err));
        }
      } finally {
        if(active) setLoading(false);
      }
    };
    loadPesajes();
    return () => {
      active = false;
    }
  }, [query, refreshKey]);
 
  const setPage = (pagina: number) => {
    setQuery((prev) => ({ ...prev, pagina }));
  };

  const setLimit = (limite: number) => {
    setQuery((prev) => ({ ...prev, limite, pagina: 1 }));
  };

  const refresh = () => setRefreshKey((k) => k + 1);

  return {
    data,
    query,
    loading,
    error,
    setQuery,
    setPage,
    setLimit,
    refresh,
    deletingId,
    deletePesajeItem,
    downloadCsv,
    downloadingCsv,
    downloadingExcel,
    downloadingPdf,
    exportDialog,
    openExportDialog,
    closeExportDialog,
    confirmExport,
  };
};

