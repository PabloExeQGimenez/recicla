import { useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Table, Button, StatusBadge } from "../../../shared/UI";
import { ConfirmDialog } from "../../../shared/UI/ConfirmDialog";
import { formatDate, formatCurrency, formatNumber, capitalize, formatPago } from "../../../shared/utils/formatters";
import { useSolicitudPagoDetail } from "../hooks/useSolicitudPagoDetail";
import { BuscadorRecuperador, useRecuperadorSearch } from "../../../features/pesajes";
import type { SolicitudPagoDetail as SolicitudPagoDetailType, PesajeDetail } from "../types/SolicitudPago";
import type { RecuperadorOption } from "../../../features/pesajes/types/pesaje.types";

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const HeaderActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing(2)};
`;

const SummaryRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing(6)};
`;

const SummaryCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: ${({ theme }) => theme.spacing(3)} ${({ theme }) => theme.spacing(4)};
  background: ${({ theme }) => theme.colors.surface.app};
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: ${({ theme }) => theme.radius.md};
  min-width: 160px;
`;

const SummaryLabel = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const SummaryValue = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(2)};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const LoadingText = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.text.muted};
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

const calcularResumen = (solicitud: SolicitudPagoDetailType) => {
  const recuperadores = new Set(
    solicitud.pesajes.map((p) => p.recuperadorId)
  );
  const cantidadItems = solicitud.pesajes.reduce(
    (sum, pesaje) => sum + pesaje.items.length,
    0
  );
  const totalAPagar = solicitud.pesajes.reduce(
    (sum, pesaje) => sum + pesaje.totalAmount,
    0
  );

  return {
    cantidadRecuperadores: recuperadores.size,
    cantidadItems,
    totalAPagar,
  };
};

const agruparPesajesPorRecuperador = (pesajes: PesajeDetail[]) => {
  const groups = new Map<string, PesajeDetail[]>();
  for (const pesaje of pesajes) {
    const recId = pesaje.recuperadorId;
    if (!groups.has(recId)) {
      groups.set(recId, []);
    }
    groups.get(recId)!.push(pesaje);
  }
  return groups;
};

const SolicitudesPagosDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    data,
    loading,
    error,
    markingPaid,
    excluding,
    downloading,
    markAsPaid,
    excludePesajes,
    downloadExcel,
  } = useSolicitudPagoDetail(id!);

  const [payDialogOpen, setPayDialogOpen] = useState(false);
  const [partialPaymentMode, setPartialPaymentMode] = useState(false);
  const [selectedPesajeIds, setSelectedPesajeIds] = useState<Set<string>>(new Set());
  const [excludeDialogOpen, setExcludeDialogOpen] = useState(false);
  const [selectedRecuperadorId, setSelectedRecuperadorId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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

  if (loading) return <LoadingText>Cargando...</LoadingText>;
  if (error) return <p>{error}</p>;
  if (!data) return null;

  const resumen = calcularResumen(data);

  const filteredPesajes = partialPaymentMode && selectedRecuperadorId
    ? data.pesajes.filter((p) => p.recuperadorId === selectedRecuperadorId)
    : [];

  const filteredPesajeIds = filteredPesajes.flatMap((p) => p.items.map((item) => item.id));
  const allFilteredSelected = filteredPesajeIds.length > 0 && filteredPesajeIds.every((id) => selectedPesajeIds.has(id));
  const someFilteredSelected = filteredPesajeIds.some((id) => selectedPesajeIds.has(id));

  const excludedPesajeCount = new Set(
    filteredPesajes
      .filter((p) => p.items.some((item) => selectedPesajeIds.has(item.id)))
      .map((p) => p.id)
  ).size;
  const remainingPesajeCount = data.pesajes.length - excludedPesajeCount;
  const wouldDeleteAll = remainingPesajeCount === 0 && excludedPesajeCount > 0;

  const handleSelectAll = () => {
    const allSelected = filteredPesajeIds.every((id) => selectedPesajeIds.has(id));
    if (allSelected) {
      setSelectedPesajeIds(new Set());
    } else {
      setSelectedPesajeIds(new Set(filteredPesajeIds));
    }
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

  const handleClearRecuperador = () => {
    setSearchQuery("");
    setSelectedRecuperadorId(null);
    setSelectedPesajeIds(new Set());
  };

  const handleOpenPartialPayment = () => {
    setPartialPaymentMode(true);
    setSelectedPesajeIds(new Set());
    setSearchQuery("");
  };

  const handleCancelPartialPayment = () => {
    setPartialPaymentMode(false);
    setSelectedPesajeIds(new Set());
    setSearchQuery("");
    setSelectedRecuperadorId(null);
  };

  const handleOpenExcludeDialog = () => {
    setExcludeDialogOpen(true);
  };

  const handleConfirmExclude = async () => {
    const pesajeIdsToExclude = new Set<string>();
    for (const pesaje of filteredPesajes) {
      if (pesaje.items.some((item) => selectedPesajeIds.has(item.id))) {
        pesajeIdsToExclude.add(pesaje.id);
      }
    }
    try {
      await excludePesajes(Array.from(pesajeIdsToExclude));
      setExcludeDialogOpen(false);
      setSelectedPesajeIds(new Set());
      setSearchQuery("");
      setSelectedRecuperadorId(null);
      if (wouldDeleteAll) {
        navigate("/solicitudes-pagos/lista");
      }
    } catch {
      // Error handled by hook
    }
  };

  const handleMarkAsPaid = async () => {
    try {
      await markAsPaid();
      setPayDialogOpen(false);
    } catch {
      // Error handled by hook
    }
  };

  const gruposFiltrados = agruparPesajesPorRecuperador(filteredPesajes);

  return (
    <>
      <Header>
        <Title>Detalle de solicitud de pago</Title>
        <HeaderActions>
          <Button
            variant="secondary"
            onClick={() => navigate("/solicitudes-pagos/lista")}
          >
            Volver
          </Button>
          <Button
            variant="primary"
            onClick={downloadExcel}
            disabled={downloading}
          >
            {downloading ? "Descargando..." : "Descargar Excel"}
          </Button>
          {data.status !== "PAID" && (
            <>
              <Button
                variant="primary"
                onClick={() => setPayDialogOpen(true)}
                disabled={markingPaid}
              >
                Marcar como pagado
              </Button>
              {!partialPaymentMode && (
                <Button
                  variant="secondary"
                  onClick={handleOpenPartialPayment}
                >
                  Pago parcial
                </Button>
              )}
            </>
          )}
        </HeaderActions>
      </Header>

      <InfoRow>
        <span>Estado:</span>
        <StatusBadge $variant={data.status === "PAYMENT_REQUESTED" ? "info" : "success"}>
          {formatPago(data.status === "PAYMENT_REQUESTED" ? "solicitado" : "pagado")}
        </StatusBadge>
      </InfoRow>
      <InfoRow>
        <span>Desde:</span> {formatDate(data.from)}
        <span style={{ marginLeft: 16 }}>Hasta:</span> {formatDate(data.to)}
      </InfoRow>

      <SummaryRow>
        <SummaryCard>
          <SummaryLabel>Recuperadores</SummaryLabel>
          <SummaryValue>{resumen.cantidadRecuperadores}</SummaryValue>
        </SummaryCard>
        <SummaryCard>
          <SummaryLabel>Items</SummaryLabel>
          <SummaryValue>{resumen.cantidadItems}</SummaryValue>
        </SummaryCard>
        <SummaryCard>
          <SummaryLabel>Total a pagar</SummaryLabel>
          <SummaryValue>{formatCurrency(resumen.totalAPagar)}</SummaryValue>
        </SummaryCard>
      </SummaryRow>

      {partialPaymentMode && (
        <PartialPaymentSection>
          <SectionHeader>
            <SectionTitle>Pago parcial - Excluir pesajes</SectionTitle>
            <Button variant="secondary" onClick={handleCancelPartialPayment}>
              Cerrar
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
                onClick={handleOpenExcludeDialog}
                disabled={selectedPesajeIds.size === 0 || excluding}
              >
                {excluding
                  ? "Excluyendo..."
                  : `Marcar como no pagados (${selectedPesajeIds.size})`}
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
                    pesajes.map((pesaje) =>
                      pesaje.items.map((item) => (
                        <tr key={`${pesaje.id}-${item.id}`}>
                          <td>
                            <input
                              type="checkbox"
                              checked={selectedPesajeIds.has(item.id)}
                              onChange={() => handleTogglePesaje(item.id)}
                            />
                          </td>
                          <td style={{ fontWeight: 600 }}>
                            {capitalize(pesaje.recuperador.name)}{" "}
                            {capitalize(pesaje.recuperador.lastName)}
                          </td>
                          <td>{formatDate(pesaje.date)}</td>
                          <td>{capitalize(item.material.name)}</td>
                          <td style={{ whiteSpace: "nowrap" }}>
                            {formatNumber(item.weight, "es-AR", 2)} Kg
                          </td>
                          <td style={{ whiteSpace: "nowrap" }}>
                            {formatCurrency(item.pricePerKgAtMoment)}
                          </td>
                          <td style={{ whiteSpace: "nowrap", fontWeight: 700 }}>
                            {formatCurrency(item.subtotal)}
                          </td>
                        </tr>
                      ))
                    )
                  )}
                </tbody>
              </Table>
            </>
          )}

          {searchQuery && filteredPesajes.length === 0 && (
            <p style={{ marginTop: 16, color: "#6b7280" }}>
              No se encontraron pesajes para el recuperador seleccionado
            </p>
          )}
        </PartialPaymentSection>
      )}

      <Table>
        <thead>
          <tr>
            <th>Recuperador</th>
            <th>Fecha</th>
            <th>Material</th>
            <th>Cantidad</th>
            <th>Precio Unitario</th>
            <th>Monto</th>
          </tr>
        </thead>
        <tbody>
          {data.pesajes.map((pesaje) =>
            pesaje.items.map((item) => (
              <tr key={`${pesaje.id}-${item.id}`}>
                <td style={{ fontWeight: 600 }}>
                  {capitalize(pesaje.recuperador.name)}{" "}
                  {capitalize(pesaje.recuperador.lastName)}
                </td>
                <td>{formatDate(pesaje.date)}</td>
                <td>{capitalize(item.material.name)}</td>
                <td style={{ whiteSpace: "nowrap" }}>
                  {formatNumber(item.weight, "es-AR", 2)} Kg
                </td>
                <td style={{ whiteSpace: "nowrap" }}>
                  {formatCurrency(item.pricePerKgAtMoment)}
                </td>
                <td style={{ whiteSpace: "nowrap", fontWeight: 700 }}>
                  {formatCurrency(item.subtotal)}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>

      <ConfirmDialog
        isOpen={payDialogOpen}
        title="Marcar como pagado"
        message="¿Estás seguro de marcar esta solicitud como pagada? Esta acción no se puede deshacer."
        confirmLabel="Marcar como pagado"
        cancelLabel="Cerrar"
        variant="warning"
        onConfirm={handleMarkAsPaid}
        onCancel={() => setPayDialogOpen(false)}
        isLoading={markingPaid}
      />

      <ConfirmDialog
        isOpen={excludeDialogOpen}
        title={wouldDeleteAll ? "Eliminar solicitud" : "Excluir pesajes"}
        message={
          wouldDeleteAll
            ? `Se eliminará la solicitud de pago porque no quedarán pesajes. ¿Continuar?`
            : `¿Estás seguro de excluir ${excludedPesajeCount} pesaje${excludedPesajeCount > 1 ? "s" : ""}? Volverán a estado pendiente de pago.`
        }
        confirmLabel={wouldDeleteAll ? "Eliminar solicitud" : "Excluir pesajes"}
        cancelLabel="Cerrar"
        variant={wouldDeleteAll ? "danger" : "danger"}
        onConfirm={handleConfirmExclude}
        onCancel={() => setExcludeDialogOpen(false)}
        isLoading={excluding}
      />
    </>
  );
};

export default SolicitudesPagosDetail;
