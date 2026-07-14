import { useState, useEffect, useRef, useCallback, KeyboardEvent, useMemo } from "react";
import { pesajesService } from "../services/pesaje.service";
import { useToast } from "../../../shared/UI/Toast/useToast";
import { pesajeFormSchema, PesajeLineValues } from "../validations/pesaje.schema";
import type { RecuperadorOption } from "../types/pesaje.types";
import { useRecuperadorSearch } from "./useRecuperadorSearch";
import { useMateriales } from "./useMateriales";

type CargaHeader = {
  recuperadorId: string;
  fecha: string;
};

export const usePesajeCreate = () => {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [items, setItems] = useState<PesajeLineValues[]>([]);
  const [lineMaterialId, setLineMaterialId] = useState<string>("");
  const [lineCantidad, setLineCantidad] = useState<number | "">("");
  const [header, setHeader] = useState<CargaHeader>({
    recuperadorId: "",
    fecha: new Date().toLocaleDateString("en-CA"),
  });

  const cantidadRef = useRef<HTMLInputElement | null>(null);
  const materialRef = useRef<HTMLSelectElement | null>(null);
  const recInputRef = useRef<HTMLInputElement | null>(null);
  const fechaRef = useRef<HTMLInputElement | null>(null);

  const toast = useToast();
  const { materiales, error: materialesError } = useMateriales();

  useEffect(() => {
    if (materialesError) setFormError(materialesError);
  }, [materialesError]);

  const [selectedRecuperador, setSelectedRecuperador] = useState<RecuperadorOption | null>(null);

  const chooseRecuperador = useCallback((opt: RecuperadorOption) => {
    setSelectedRecuperador(opt);
    setHeader((prev) => ({ ...prev, recuperadorId: opt.id }));
    requestAnimationFrame(() => {
      materialRef.current?.focus();
    });
  }, []);

  const {
    searchQuery: recQuery,
    setSearchQuery: setRecQuery,
    options: recOptions,
    open: recOpen,
    setOpen: setRecOpen,
    activeIndex: recActiveIndex,
    handleKeyDown: handleRecKeyDown,
  } = useRecuperadorSearch(chooseRecuperador);

  const today = useMemo(() => new Date().toLocaleDateString("en-CA"), []);

  const totalGeneral = useMemo(
    () => items.reduce((acc, it) => acc + it.subtotal, 0),
    [items],
  );

  const handleCantidadKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;
    e.preventDefault();
    const canAdd = !!header.recuperadorId && !!lineMaterialId && Number(lineCantidad) > 0;
    if (!canAdd) return;
    addLine();
    setLineCantidad("");
  };

  const removeLine = (tempId: string) => {
    setItems((prev) => prev.filter((it) => it.tempId !== tempId));
    setLineCantidad("");
    requestAnimationFrame(() => {
      materialRef.current?.focus();
    });
  };

  const addLine = () => {
    setFormError(null);
    setSuccessMsg(null);

    if (!lineMaterialId) {
      setFormError("Elegi un material");
      return;
    }
    if (Number(lineCantidad) <= 0) {
      setFormError("La cantidad debe ser mayor a 0");
      return;
    }

    const mat = materiales.find((m) => m.id === lineMaterialId);
    if (!mat) {
      setFormError("Material inválido");
      return;
    }

    const subtotal = mat.precio * Number(lineCantidad);

    const newLine: PesajeLineValues = {
      tempId: crypto.randomUUID(),
      materialId: mat.id,
      materialLabel: mat.label,
      precio: mat.precio,
      cantidad: Number(lineCantidad),
      subtotal,
    };
    setItems((prev) => [...prev, newLine]);
    setLineCantidad("");
    requestAnimationFrame(() => {
      materialRef.current?.focus();
    });
  };

  const handleSubmitCarga = useCallback(async () => {
    setFormError(null);
    setSuccessMsg(null);

    const result = pesajeFormSchema.safeParse({
      recuperadorId: header.recuperadorId,
      fecha: header.fecha,
      items,
    });

    if (!result.success) {
      const firstError = result.error.issues[0];
      setFormError(firstError.message);
      return;
    }

    try {
      setSubmitting(true);

      await pesajesService.create({
        recuperadorId: header.recuperadorId,
        date: header.fecha,
        items: items.map((item) => ({
          materialId: item.materialId,
          weight: item.cantidad,
        })),
      });

      toast.success(`Carga guardada: ${items.length} pesajes`);
      setItems([]);
      setLineMaterialId("");
      setLineCantidad("");
      setSelectedRecuperador(null);
      setRecQuery("");
      setHeader({
        recuperadorId: "",
        fecha: header.fecha,
      });
      requestAnimationFrame(() => {
        recInputRef.current?.focus();
      });
    } catch (err) {
      if (err instanceof Error) {
        setFormError(err.message);
      } else {
        setFormError("Error al guardar los pesajes");
      }
    } finally {
      setSubmitting(false);
    }
  }, [header, items, toast, setRecQuery]);

  useEffect(() => {
    if (!lineMaterialId) return;
    requestAnimationFrame(() => {
      cantidadRef.current?.focus();
      cantidadRef.current?.select();
    });
  }, [lineMaterialId]);

  const clearForm = () => {
    setItems([]);
    setLineCantidad("");
    setLineMaterialId("");
    setHeader((prev) => ({ ...prev, recuperadorId: "" }));
    setSelectedRecuperador(null);
    setRecQuery("");
    setFormError(null);
    setSuccessMsg(null);
  };

  const clearSelection = () => {
    setSelectedRecuperador(null);
    setHeader((prev) => ({ ...prev, recuperadorId: "" }));
    setRecQuery("");
    requestAnimationFrame(() => {
      recInputRef.current?.focus();
    });
  };

  return {
    submitting,
    formError,
    successMsg,
    materiales,
    recQuery,
    setRecQuery,
    recOptions,
    recOpen,
    setRecOpen,
    items,
    lineMaterialId,
    setLineMaterialId,
    lineCantidad,
    setLineCantidad,
    header,
    setHeader,
    recActiveIndex,
    cantidadRef,
    materialRef,
    recInputRef,
    fechaRef,
    today,
    totalGeneral,
    handleCantidadKeyDown,
    removeLine,
    addLine,
    handleSubmitCarga,
    chooseRecuperador,
    handleRecKeyDown,
    clearForm,
    selectedRecuperador,
    clearSelection,
  };
};
