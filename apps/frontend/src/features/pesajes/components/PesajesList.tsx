import { Dispatch, SetStateAction, ChangeEvent, useRef, useState } from "react";
import type {
  PesajeQueryDTO,
  PesajeListResponseDTO,
  PesajePago,
} from "../types/pesaje.types";
import {
  Table,
  Container,
  Button,
  StatusBadge,
} from "../../../shared/UI";
import { ConfirmDialog } from "../../../shared/UI/ConfirmDialog";
import type { ExportType } from "../hooks/usePesajes";
import {
  formatDate,
  formatCurrency,
  formatNumber,
  formatPago,
  capitalize,
} from "../../../shared/utils/formatters";
import { FaTrash } from "react-icons/fa";
import { BuscadorRecuperador } from "./BuscadorRecuperador";
import { useRecuperadorSearch } from "../hooks/useRecuperadorSearch";
import { useMateriales } from "../hooks/useMateriales";
import {
  FilterSection,
  FilterGroup,
  ButtonsRow,
  FieldGroup,
  FieldLabel,
  DateInput,
  SearchWrap,
  FilterSelect,
  LoadingText,
  TableBar,
  TotalBadge,
  TablePager,
  DeleteIcon,
} from "./PesajesList.styles";

interface PesajeListProps {
  data: PesajeListResponseDTO | null;
  query: PesajeQueryDTO;
  loading: boolean;
  error: string | null;
  setQuery: Dispatch<SetStateAction<PesajeQueryDTO>>;
  setPage: (pagina: number) => void;
  deletingId: string | null;
  deletePesajeItem: (pesajeId: string, itemId: string) => void;
  downloadingExcel: boolean;
  downloadingPdf: boolean;
  exportDialog: ExportType | null;
  openExportDialog: (type: ExportType) => void;
  closeExportDialog: () => void;
  confirmExport: () => void;
}

export const PesajesList = ({
  data,
  query,
  loading,
  error,
  setPage,
  setQuery,
  deletingId,
  deletePesajeItem,
  downloadingExcel,
  downloadingPdf,
  exportDialog,
  openExportDialog,
  closeExportDialog,
  confirmExport,
}: PesajeListProps) => {
  const rows = data?.data;
  const meta = data?.meta;
  const pagina = meta?.pagina ?? 1;
  const paginasTotales = meta?.paginasTotales ?? 1;
  const totalRows = meta?.totalItems ?? rows?.length ?? 0;

  const recInputRef = useRef<HTMLInputElement | null>(null);
  const handleChooseRecuperador = (opt: { id: string; label: string }) => {
    selectOption(opt);
    setQuery((prev) => ({ ...prev, recuperadorId: opt.id, pagina: 1 }));
  };

  const handleRecInputChange = (value: string) => {
    if (!value.trim()) {
      setQuery((prev) => {
        if (!prev.recuperadorId) return prev;
        return { ...prev, recuperadorId: undefined, pagina: 1 };
      });
    }
  };

  const {
    searchQuery,
    setSearchQuery,
    options: recOptions,
    open: recOpen,
    setOpen: setRecOpen,
    activeIndex: recActiveIndex,
    handleKeyDown: handleRecKeyDown,
    selectOption,
  } = useRecuperadorSearch(handleChooseRecuperador);

  const { materiales } = useMateriales();

  const [deleteTarget, setDeleteTarget] = useState<{ pesajeId: string; itemId: string } | null>(null);

  const handleDelete = (pesajeId: string, itemId: string) => {
    setDeleteTarget({ pesajeId, itemId });
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    deletePesajeItem(deleteTarget.pesajeId, deleteTarget.itemId);
    setDeleteTarget(null);
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setQuery({
      pagina: 1,
      limite: 10,
    });
  };

  const handleFechaDesdeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setQuery((prev) => ({
      ...prev,
      fechaDesde: v || undefined,
      pagina: 1,
    }));
  };

  const handleFechaHastaChange = (e: ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setQuery((prev) => ({
      ...prev,
      fechaHasta: v || undefined,
      pagina: 1,
    }));
  };

  const handlePagoChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const v = e.target.value;
    setQuery((prev) => ({
      ...prev,
      pago: v === "all" ? undefined : (v as PesajePago),
      pagina: 1,
    }));
  };

  const handleMaterialChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const v = e.target.value;
    setQuery((prev) => ({
      ...prev,
      materialId: v === "all" ? undefined : v,
      pagina: 1,
    }));
  };

  if (error) return <p>{error}</p>;
  if (!data) return <p>Cargando datos...</p>;

  return (
    <Container>
      <FilterSection>
        <FilterGroup>
          <FieldGroup>
            <FieldLabel>Desde</FieldLabel>
            <DateInput
              type="date"
              value={query.fechaDesde ?? ""}
              onChange={handleFechaDesdeChange}
            />
          </FieldGroup>
          <FieldGroup>
            <FieldLabel>Hasta</FieldLabel>
            <DateInput
              type="date"
              value={query.fechaHasta ?? ""}
              onChange={handleFechaHastaChange}
            />
          </FieldGroup>
          <FieldGroup>
            <FieldLabel>Recuperador</FieldLabel>
            <SearchWrap>
              <BuscadorRecuperador
                recQuery={searchQuery}
                setRecQuery={setSearchQuery}
                recOptions={recOptions}
                recOpen={recOpen}
                setRecOpen={setRecOpen}
                recActiveIndex={recActiveIndex}
                onChoose={handleChooseRecuperador}
                onKeyDown={handleRecKeyDown}
                inputRef={recInputRef}
                onInputChange={handleRecInputChange}
              />
            </SearchWrap>
          </FieldGroup>
          <FieldGroup>
            <FieldLabel>Material</FieldLabel>
            <FilterSelect value={query.materialId ?? "all"} onChange={handleMaterialChange}>
              <option value="all">Todos los materiales</option>
              {materiales.map((m) => (
                <option key={m.id} value={m.id}>{capitalize(m.label)}</option>
              ))}
            </FilterSelect>
          </FieldGroup>
          <FieldGroup>
            <FieldLabel>Pago</FieldLabel>
            <FilterSelect value={query.pago ?? "all"} onChange={handlePagoChange}>
              <option value="all">Todos</option>
              <option value="pendiente">Pendiente</option>
              <option value="solicitado">Solicitado</option>
              <option value="pagado">Pagado</option>
            </FilterSelect>
          </FieldGroup>
        </FilterGroup>

        <ButtonsRow>
          <Button
            variant="ghost"
            size="sm"
            type="button"
            onClick={handleClearFilters}
          >
            Limpiar filtros
          </Button>
          <Button
            variant="primary"
            size="sm"
            type="button"
            disabled={downloadingExcel}
            onClick={() => openExportDialog("excel")}
          >
            {downloadingExcel ? "Descargando..." : "Descargar Excel"}
          </Button>
          <Button
            variant="primary"
            size="sm"
            type="button"
            disabled={downloadingPdf}
            onClick={() => openExportDialog("pdf")}
          >
            {downloadingPdf ? "Descargando..." : "Descargar PDF"}
          </Button>
        </ButtonsRow>
      </FilterSection>

      {loading && <LoadingText>Cargando...</LoadingText>}

      <div>
        <TableBar>
          {!loading && rows && rows.length > 0 && (
            <TotalBadge>
              <span>{totalRows}</span> pesajes
            </TotalBadge>
          )}

          <TablePager>
            <Button
              variant="secondary"
              size="sm"
              type="button"
              disabled={loading || pagina <= 1}
              onClick={() => setPage(pagina - 1)}
            >
              Anterior
            </Button>

            <span>{pagina} / {paginasTotales || 1}</span>

            <Button
              variant="secondary"
              size="sm"
              type="button"
              disabled={loading || pagina >= paginasTotales}
              onClick={() => setPage(pagina + 1)}
            >
              Siguiente
            </Button>
          </TablePager>
        </TableBar>

        <Table>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Recuperador</th>
              <th>Material</th>
              <th>Cantidad</th>
              <th>Precio Unitario</th>
              <th>Monto</th>
              <th>Pago</th>
              <th style={{ textAlign: "right" }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {rows && rows.length > 0 ? (
              rows.map((row) => (
                <tr key={`${row.id}-${row.material.id}`}>
                  <td>{formatDate(row.fecha)}</td>
                  <td style={{ fontWeight: 600 }}>
                    {row.recuperador.nombre} {row.recuperador.apellido}
                  </td>
                  <td>{capitalize(row.material.nombre)}</td>
                  <td style={{ whiteSpace: "nowrap" }}>
                    {formatNumber(row.cantidad, "es-AR", 2)} Kg
                  </td>
                  <td style={{ whiteSpace: "nowrap" }}>
                    {formatCurrency(row.precio)}
                  </td>
                  <td style={{ whiteSpace: "nowrap", fontWeight: 700 }}>
                    {formatCurrency(row.monto)}
                  </td>

                  <td>
                    <StatusBadge $variant={row.pago === "pendiente" ? "warning" : row.pago === "solicitado" ? "info" : "success"}>
                      {formatPago(row.pago)}
                    </StatusBadge>
                  </td>

                  <td style={{ textAlign: "right" }}>
                    {row.pago === "pendiente" && (
                      <DeleteIcon
                        type="button"
                        disabled={deletingId === row.itemId}
                        onClick={() => handleDelete(row.id, row.itemId)}
                      >
                        <FaTrash />
                      </DeleteIcon>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} style={{ padding: 26, textAlign: "center", opacity: 0.7 }}>
                  No hay pesajes
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Eliminar item"
        message="¿Eliminar este item para siempre? Esta acción no se puede deshacer."
        confirmLabel="Eliminar"
        variant="danger"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
        isLoading={!!deletingId}
      />

      <ConfirmDialog
        isOpen={!!exportDialog}
        title={exportDialog === "excel" ? "Descargar Excel" : "Descargar PDF"}
        message={`Se descargarán ${totalRows} items. ¿Confirma?`}
        confirmLabel="Descargar"
        variant="info"
        onConfirm={confirmExport}
        onCancel={closeExportDialog}
        isLoading={downloadingExcel || downloadingPdf}
      />
    </Container>
  );
};

export default PesajesList;
