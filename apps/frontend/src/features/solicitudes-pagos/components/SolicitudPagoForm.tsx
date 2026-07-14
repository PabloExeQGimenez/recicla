import { useState, useRef, type FormEvent } from "react";
import styled from "styled-components";
import Container from "../../../shared/UI/Container";
import Input from "../../../shared/UI/Input";
import Button from "../../../shared/UI/Button";
import Table from "../../../shared/UI/Table";
import { ConfirmDialog } from "../../../shared/UI/ConfirmDialog";
import { solicitudPagoFormSchema } from "../validations/solicitud-pago.schema";
import { useCreateSolicitudPago } from "../hooks/useCreateSolicitudPago";
import { usePreviewSolicitudPago } from "../hooks/usePreviewSolicitudPago";
import { BuscadorRecuperador, useRecuperadorSearch } from "../../pesajes";
import SolicitudPagoPreview from "./SolicitudPagoPreview";
import { formatDate, formatCurrency, formatNumber, capitalize } from "../../../shared/utils/formatters";
import type { RecuperadorOption } from "../../pesajes/types/pesaje.types";
import type { PesajePreviewItem } from "../types/SolicitudPago";

const FormRow = styled.div`
  display: flex;
  align-items: flex-end;
  gap: ${({ theme }) => theme.spacing(4)};
  margin-bottom: ${({ theme }) => theme.spacing(4)};
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const FieldLabel = styled.label`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const ErrorBanner = styled.div`
  background-color: ${({ theme }) => theme.colors.state.danger}15;
  color: ${({ theme }) => theme.colors.state.danger};
  border: 1px solid ${({ theme }) => theme.colors.state.danger}40;
  border-radius: ${({ theme }) => theme.radius.sm};
  padding: ${({ theme }) => theme.spacing(2)} ${({ theme }) => theme.spacing(3)};
  margin-bottom: ${({ theme }) => theme.spacing(3)};
`;

const PartialPaymentSection = styled.div`
  margin-top: ${({ theme }) => theme.spacing(4)};
  padding: ${({ theme }) => theme.spacing(4)};
  background: ${({ theme }) => theme.colors.surface.app};
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: ${({ theme }) => theme.radius.md};
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing(4)};
`;

const SectionTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const SearchWrapper = styled.div`
  max-width: 400px;
`;

const EmptyMessage = styled.p`
  margin-top: ${({ theme }) => theme.spacing(4)};
  color: ${({ theme }) => theme.colors.text.muted};
`;

const agruparPesajesPorRecuperador = (pesajes: PesajePreviewItem[]) => {
  const groups = new Map<string, PesajePreviewItem[]>();
  for (const pesaje of pesajes) {
    const recId = pesaje.recuperador.id;
    if (!groups.has(recId)) {
      groups.set(recId, []);
    }
    groups.get(recId)!.push(pesaje);
  }
  return groups;
};

interface SolicitudPagoFormProps {
  onCreated?: () => void;
}

const SolicitudPagoForm = ({ onCreated }: SolicitudPagoFormProps) => {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [excludedPesajeIds, setExcludedPesajeIds] = useState<Set<string>>(new Set());
  const [exclusionMode, setExclusionMode] = useState(false);
  const [selectedRecuperadorId, setSelectedRecuperadorId] = useState<string | null>(null);
  const [selectedPesajeIds, setSelectedPesajeIds] = useState<Set<string>>(new Set());
  const [excludeDialogOpen, setExcludeDialogOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    submitting,
    error,
    success,
    downloading,
    create,
    downloadExcel,
    clearError,
    clearSuccess,
  } = useCreateSolicitudPago();

  const {
    preview,
    loading: previewLoading,
    error: previewError,
    fetchPreview,
    clearPreview,
  } = usePreviewSolicitudPago();

  const handleChooseRecuperador = (opt: RecuperadorOption) => {
    const displayLabel = opt.dni ? `${opt.label} · ${opt.dni}` : opt.label;
    setSearchQuery(displayLabel);
    setOpen(false);
    setActiveIndex(-1);
    setSelectedRecuperadorId(opt.id);
    setSelectedPesajeIds(new Set());
  };

  const {
    searchQuery,
    setSearchQuery,
    options,
    open,
    setOpen,
    activeIndex,
    setActiveIndex,
    handleKeyDown,
  } = useRecuperadorSearch(handleChooseRecuperador);

  const resetForm = () => {
    setFrom("");
    setTo("");
    setErrors({});
    setExcludedPesajeIds(new Set());
    setExclusionMode(false);
    setSelectedRecuperadorId(null);
    setSelectedPesajeIds(new Set());
    setSearchQuery("");
    clearPreview();
  };

  const validateDates = (): boolean => {
    setErrors({});
    const result = solicitudPagoFormSchema.safeParse({ from, to });

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      return false;
    }
    return true;
  };

  const handlePreview = async () => {
    if (!validateDates()) return;
    setExcludedPesajeIds(new Set());
    setExclusionMode(false);
    setSelectedRecuperadorId(null);
    setSelectedPesajeIds(new Set());
    setSearchQuery("");
    try {
      await fetchPreview(from, to);
    } catch {
      // error ya está manejado por el hook
    }
  };

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    clearError();
    clearSuccess();
    setErrors({});

    if (!validateDates()) return;

    const excludedArray = Array.from(excludedPesajeIds);

    try {
      await create({
        from,
        to,
        ...(excludedArray.length > 0 && { excludedPesajeIds: excludedArray }),
      });
      resetForm();
      onCreated?.();
    } catch {
      // error ya está manejado por el hook
    }
  };

  const handleDownload = async () => {
    if (success) {
      await downloadExcel(success.id);
    }
  };

  const handleCloseSuccess = () => {
    clearSuccess();
  };

  const handleToggleExclusionMode = () => {
    setExclusionMode(true);
    setSelectedRecuperadorId(null);
    setSelectedPesajeIds(new Set());
    setSearchQuery("");
  };

  const handleCancelExclusion = () => {
    setExclusionMode(false);
    setSelectedRecuperadorId(null);
    setSelectedPesajeIds(new Set());
    setSearchQuery("");
  };

  const handleClearRecuperador = () => {
    setSearchQuery("");
    setSelectedRecuperadorId(null);
    setSelectedPesajeIds(new Set());
  };

  const handleTogglePesaje = (itemId: string) => {
    setSelectedPesajeIds((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        next.add(itemId);
      }
      return next;
    });
  };

  const handleSelectAll = () => {
    const itemIds = filteredPesajes.map((p) => p.itemId);
    const allSelected = itemIds.every((id) => selectedPesajeIds.has(id));
    if (allSelected) {
      setSelectedPesajeIds(new Set());
    } else {
      setSelectedPesajeIds(new Set(itemIds));
    }
  };

  const handleConfirmExclude = () => {
    const pesajeIdsToExclude = new Set<string>();
    for (const pesaje of filteredPesajes) {
      if (selectedPesajeIds.has(pesaje.itemId)) {
        pesajeIdsToExclude.add(pesaje.id);
      }
    }
    setExcludedPesajeIds((prev) => {
      const next = new Set(prev);
      for (const id of pesajeIdsToExclude) {
        next.add(id);
      }
      return next;
    });
    setExcludeDialogOpen(false);
    setSelectedPesajeIds(new Set());
  };

  const filteredPesajes = preview && selectedRecuperadorId
    ? preview.pesajes.filter((p) => p.recuperador.id === selectedRecuperadorId && !excludedPesajeIds.has(p.id))
    : [];

  const filteredPesajeIds = filteredPesajes.map((p) => p.itemId);
  const allFilteredSelected = filteredPesajeIds.length > 0 && filteredPesajeIds.every((id) => selectedPesajeIds.has(id));
  const someFilteredSelected = filteredPesajeIds.some((id) => selectedPesajeIds.has(id));

  const gruposFiltrados = agruparPesajesPorRecuperador(filteredPesajes);

  const visiblePesajes = preview
    ? preview.pesajes.filter((p) => !excludedPesajeIds.has(p.id))
    : [];

  const visibleResumen = {
    cantidadRecuperadores: new Set(visiblePesajes.map((p) => p.recuperador.id)).size,
    cantidadItems: visiblePesajes.length,
    totalAPagar: visiblePesajes.reduce((acc, p) => acc + p.monto, 0),
  };

  const selectedCount = visiblePesajes.length;

  return (
    <Container>
      {error && <ErrorBanner>{error}</ErrorBanner>}
      {previewError && <ErrorBanner>{previewError}</ErrorBanner>}

      <form onSubmit={handleCreate}>
        <FormRow>
          <FieldGroup>
            <FieldLabel htmlFor="from">Fecha desde</FieldLabel>
            <Input
              id="from"
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              required
            />
            {errors.from && <ErrorBanner>{errors.from}</ErrorBanner>}
          </FieldGroup>

          <FieldGroup>
            <FieldLabel htmlFor="to">Fecha hasta</FieldLabel>
            <Input
              id="to"
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              required
            />
            {errors.to && <ErrorBanner>{errors.to}</ErrorBanner>}
          </FieldGroup>

          <Button
            type="button"
            variant="secondary"
            onClick={handlePreview}
            disabled={previewLoading}
          >
            {previewLoading ? "Cargando..." : "Ver solicitud de pago"}
          </Button>

          <Button
            variant="primary"
            type="submit"
            disabled={submitting || !preview || selectedCount === 0}
          >
            {submitting
              ? "Creando..."
              : `Crear solicitud de pagos (${selectedCount} pesajes)`}
          </Button>

          {preview && !exclusionMode && (
            <Button
              variant="secondary"
              onClick={handleToggleExclusionMode}
            >
              Excluir pesajes
            </Button>
          )}
        </FormRow>
      </form>

      {preview && exclusionMode && (
        <PartialPaymentSection>
          <SectionHeader>
            <SectionTitle>Excluir pesajes</SectionTitle>
            <Button variant="secondary" onClick={handleCancelExclusion}>
              Cancelar
            </Button>
          </SectionHeader>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 16, marginBottom: 16 }}>
            <SearchWrapper>
              <BuscadorRecuperador
                recQuery={searchQuery}
                setRecQuery={setSearchQuery}
                recOptions={options}
                recOpen={open}
                setRecOpen={setOpen}
                recActiveIndex={activeIndex}
                onChoose={handleChooseRecuperador}
                onKeyDown={handleKeyDown}
                inputRef={inputRef}
                onClearSelection={handleClearRecuperador}
              />
            </SearchWrapper>
            {filteredPesajes.length > 0 && (
              <Button
                variant="danger"
                onClick={() => setExcludeDialogOpen(true)}
                disabled={selectedPesajeIds.size === 0}
              >
                Excluir pesajes seleccionados ({selectedPesajeIds.size})
              </Button>
            )}
          </div>

          {filteredPesajes.length > 0 && (
            <>
              <Table>
                <thead>
                  <tr>
                    <th style={{ width: 40 }}>
                      <input
                        type="checkbox"
                        checked={allFilteredSelected}
                        ref={(el) => {
                          if (el) el.indeterminate = someFilteredSelected && !allFilteredSelected;
                        }}
                        onChange={handleSelectAll}
                      />
                    </th>
                    <th>Recuperador</th>
                    <th>Fecha</th>
                    <th>Material</th>
                    <th>Cantidad</th>
                    <th>Precio Unitario</th>
                    <th>Monto</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from(gruposFiltrados.entries()).map(([, pesajes]) =>
                    pesajes.map((pesaje) => (
                      <tr key={`${pesaje.id}-${pesaje.itemId}`}>
                        <td>
                          <input
                            type="checkbox"
                            checked={selectedPesajeIds.has(pesaje.itemId)}
                            onChange={() => handleTogglePesaje(pesaje.itemId)}
                          />
                        </td>
                        <td style={{ fontWeight: 600 }}>
                          {pesaje.recuperador.nombre} {pesaje.recuperador.apellido}
                        </td>
                        <td>{formatDate(pesaje.fecha)}</td>
                        <td>{capitalize(pesaje.material.nombre)}</td>
                        <td>{formatNumber(pesaje.cantidad, "es-AR", 2)} Kg</td>
                        <td>{formatCurrency(pesaje.precio)}</td>
                        <td style={{ fontWeight: 700 }}>{formatCurrency(pesaje.monto)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </>
          )}

          {searchQuery && filteredPesajes.length === 0 && (
            <EmptyMessage>
              No se encontraron pesajes para el recuperador seleccionado
            </EmptyMessage>
          )}
        </PartialPaymentSection>
      )}

      {preview && <SolicitudPagoPreview preview={preview} resumen={visibleResumen} pesajes={visiblePesajes} />}

      <ConfirmDialog
        isOpen={!!success}
        title="Solicitud de pago creada"
        message={`Solicitud ${success?.id} creada correctamente. ¿Desea descargar la planilla?`}
        confirmLabel="Descargar planilla"
        cancelLabel="Cerrar"
        variant="info"
        onConfirm={handleDownload}
        onCancel={handleCloseSuccess}
        isLoading={downloading}
      />

      <ConfirmDialog
        isOpen={excludeDialogOpen}
        title="Excluir pesajes"
        message={`¿Estás seguro de excluir ${selectedPesajeIds.size} pesaje${selectedPesajeIds.size > 1 ? "s" : ""}? No se incluirán en la solicitud de pago.`}
        confirmLabel="Excluir"
        variant="danger"
        onConfirm={handleConfirmExclude}
        onCancel={() => setExcludeDialogOpen(false)}
        isLoading={false}
      />
    </Container>
  );
};

export default SolicitudPagoForm;
