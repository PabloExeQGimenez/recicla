import { useState } from "react";
import {
  Table,
  Container,
  StatusBadge,
} from "../../../shared/UI";
import { ConfirmDialog } from "../../../shared/UI/ConfirmDialog";
import { formatDate, formatCurrency, formatPago } from "../../../shared/utils/formatters";
import { useSolicitudesPagos } from "../hooks/useSolicitudesPagos";
import {
  DetailLink,
  ActionsCell,
  IconButton,
  LoadingText,
} from "./SolicitudesPagosList.styles";
import { FaArrowRight, FaDownload } from "react-icons/fa6";

export const SolicitudesPagosList = () => {
  const {
    data,
    loading,
    error,
    deleteSolicitud,
    downloadExcel,
  } = useSolicitudesPagos();

  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const rows = data?.data ?? [];

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteSolicitud(deleteTarget);
    } catch {
      // Error handled by hook
    }
    setDeleteTarget(null);
  };

  const handleDownload = async (id: string) => {
    try {
      await downloadExcel(id);
    } catch {
      // Error handled by hook
    }
  };

  if (error) return <p>{error}</p>;

  return (
    <Container>
      <Table>
        <thead>
          <tr>
            <th>Fecha creación</th>
            <th>Desde</th>
            <th>Hasta</th>
            <th>Items</th>
            <th>Total</th>
            <th>Estado</th>
            <th style={{ textAlign: "right" }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={7}>
                <LoadingText>Cargando...</LoadingText>
              </td>
            </tr>
          ) : rows.length > 0 ? (
            rows.map((row) => (
              <tr key={row.id}>
                <td>{formatDate(row.createdAt)}</td>
                <td>{formatDate(row.from)}</td>
                <td>{formatDate(row.to)}</td>
                <td>{row.itemsCount}</td>
                <td style={{ fontWeight: 700 }}>
                  {formatCurrency(row.totalAmount)}
                </td>
                <td>
                  <StatusBadge $variant={row.status === "PAYMENT_REQUESTED" ? "info" : "success"}>
                    {formatPago(row.status === "PAYMENT_REQUESTED" ? "solicitado" : "pagado")}
                  </StatusBadge>
                </td>
                <td>
                    <ActionsCell>
                      <DetailLink to={`/solicitudes-pagos/${row.id}`}>
                        Ver <FaArrowRight size={12} />
                      </DetailLink>
                      <IconButton
                        type="button"
                        onClick={() => handleDownload(row.id)}
                        title="Descargar"
                      >
                        <FaDownload />
                      </IconButton>
                    </ActionsCell>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} style={{ padding: 26, textAlign: "center", opacity: 0.7 }}>
                No hay solicitudes de pago
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Eliminar solicitud"
        message="¿Eliminar esta solicitud de pago? Esta acción no se puede deshacer."
        confirmLabel="Eliminar"
        variant="danger"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
        isLoading={false}
      />
    </Container>
  );
};

export default SolicitudesPagosList;
